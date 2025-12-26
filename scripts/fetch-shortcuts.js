import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 模拟后台抓取脚本：更新热门导航配置文件
 * 在实际生产中，你可以通过抓取 Alexa 排名、Google Trends 或自定义后台接口来生成此数据
 */

const HOT_SITES = [
  { name: 'DeepSeek', url: 'https://www.deepseek.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Bilibili', url: 'https://www.bilibili.com' },
  { name: 'ChatGPT', url: 'https://chat.openai.com' },
  { name: 'Gmail', url: 'https://mail.google.com' },
  { name: 'YouTube', url: 'https://www.youtube.com' },
  { name: 'V2EX', url: 'https://www.v2ex.com' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com' },
  { name: 'Weibo', url: 'https://weibo.com' },
  { name: 'Reddit', url: 'https://www.reddit.com' }
];

async function updateShortcuts() {
  console.log('🚀 Starting to update hot shortcuts...');
  
  try {
    // 模拟从接口或抓取获取的数据
    const hotShortcuts = HOT_SITES.map((site, index) => ({
      id: `system-${index + 1}`,
      name: site.name,
      url: site.url
    }));

    const config = {
      hotShortcuts,
      updatedAt: new Date().toISOString()
    };

    const configPath = path.join(__dirname, '../public/shortcuts-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log(`✅ Successfully updated shortcuts-config.json with ${hotShortcuts.length} items.`);
  } catch (error) {
    console.error('❌ Failed to update shortcuts:', error);
  }
}

updateShortcuts();
