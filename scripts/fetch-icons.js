import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { HttpsProxyAgent } from 'https-proxy-agent';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FAVICONS_DIR = path.join(__dirname, '../public/favicons');
const PROXY = 'http://127.0.0.1:7897';
const agent = new HttpsProxyAgent(PROXY);

// 确保目录存在
if (!fs.existsSync(FAVICONS_DIR)) {
  fs.mkdirSync(FAVICONS_DIR, { recursive: true });
}

/**
 * 从 URL 获取域名
 */
const getDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
};

/**
 * 下载图标并保存到本地
 */
const downloadIcon = async (domain, customUrl = null) => {
  const filePath = path.join(FAVICONS_DIR, `${domain}.png`);
  
  // 如果文件已存在，跳过
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${domain}, already exists.`);
    return;
  }

  const iconUrl = customUrl || `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
  
  try {
    console.log(`Downloading icon for ${domain}...`);
    const response = await axios({
      url: iconUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 15000,
      httpsAgent: agent,
      proxy: false, // 禁用 axios 默认代理逻辑，使用 agent
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download icon for ${domain}:`, error.message);
  }
};

/**
 * 获取所有需要缓存图标的站点列表
 */
const getAllSites = () => {
  const sites = new Set();
  
  // 1. ExploreSection 中的静态站点
  const exploreSites = [
    'https://facebook.com', 'https://twitter.com', 'https://instagram.com', 'https://reddit.com', 'https://linkedin.com', 'https://tiktok.com',
    'https://youtube.com', 'https://netflix.com', 'https://spotify.com', 'https://twitch.tv', 'https://disneyplus.com', 'https://steampowered.com',
    'https://amazon.com', 'https://ebay.com', 'https://aliexpress.com', 'https://walmart.com', 'https://etsy.com', 'https://target.com',
    'https://mail.google.com', 'https://maps.google.com', 'https://chat.openai.com', 'https://github.com', 'https://canva.com', 'https://notion.so',
    'https://wikipedia.org', 'https://bbc.com/news', 'https://medium.com', 'https://quora.com', 'https://cnn.com', 'https://stackoverflow.com',
    'https://coursera.org', 'https://khanacademy.org', 'https://duolingo.com', 'https://udemy.com', 'https://ted.com'
  ];
  exploreSites.forEach(url => sites.add(url));

  // 2. 从 shortcuts-config.json 读取
  const configPath = path.join(__dirname, '../public/shortcuts-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config.hotShortcuts) {
        config.hotShortcuts.forEach(s => sites.add(s.url));
      }
    } catch (e) {
      console.error('Error reading shortcuts-config.json:', e.message);
    }
  }

  // 3. 从 proxy-tools.json 读取
  const proxyPath = path.join(__dirname, '../public/proxy-tools.json');
  if (fs.existsSync(proxyPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(proxyPath, 'utf-8'));
      if (config.proxyTools) {
        config.proxyTools.forEach(s => sites.add(s.url));
      }
    } catch (e) {
      console.error('Error reading proxy-tools.json:', e.message);
    }
  }

  return Array.from(sites);
};

const main = async () => {
  const sites = getAllSites();
  console.log(`Found ${sites.length} sites to fetch icons for.`);

  for (const url of sites) {
    const domain = getDomain(url);
    if (!domain) continue;

    await downloadIcon(domain);
    
    // 稍微延迟一下，避免请求太快被封
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('Icon fetching completed!');
};

main();
