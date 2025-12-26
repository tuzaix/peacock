import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

/**
 * 抓取 Hacker News 热点新闻
 * @returns {Promise<Array>} HN 新闻列表
 */
async function fetchHackerNews() {
  try {
    const topStoriesResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topIds = topStoriesResponse.data.slice(0, 15);
    
    const stories = await Promise.all(
      topIds.map(async (id) => {
        try {
          const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const story = storyResponse.data;
          return {
            id: story.id.toString(),
            title: story.title,
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            source: 'HN',
            points: story.score
          };
        } catch (error) {
          console.error(`Error fetching HN story ${id}:`, error.message);
          return null;
        }
      })
    );
    
    return stories.filter(Boolean);
  } catch (error) {
    console.error('Error fetching Hacker News:', error.message);
    return [];
  }
}

/**
 * 抓取 Reddit Technology 板块热帖
 * @returns {Promise<Array>} Reddit 帖子列表
 */
async function fetchRedditTech() {
  try {
    const response = await axios.get('https://www.reddit.com/r/technology/top.json?limit=10&t=day', {
      headers: { 'User-Agent': 'DailyHubBot/1.0.0' }
    });
    
    return response.data.data.children.map(child => {
      const post = child.data;
      return {
        id: post.id,
        title: post.title,
        url: `https://www.reddit.com${post.permalink}`,
        source: 'Reddit',
        points: post.ups
      };
    });
  } catch (error) {
    console.error('Error fetching Reddit Tech:', error.message);
    return [];
  }
}

/**
 * 生成 Design 类模拟数据
 * @returns {Array} 模拟的 Design 数据
 */
function getMockDesignData() {
  return [
    { id: 'd1', title: 'Figma to Code: Best Practices for 2024', url: 'https://example.com/figma-to-code', source: 'Design', points: 120 },
    { id: 'd2', title: 'The Evolution of Minimalist Web Design', url: 'https://example.com/minimalist-design', source: 'Design', points: 85 },
    { id: 'd3', title: 'Why Typography Matters More Than You Think', url: 'https://example.com/typography', source: 'Design', points: 210 },
    { id: 'd4', title: 'Color Theory in Modern UI Design', url: 'https://example.com/color-theory', source: 'Design', points: 156 },
    { id: 'd5', title: 'Mastering Auto Layout in Figma', url: 'https://example.com/figma-auto-layout', source: 'Design', points: 94 }
  ];
}

/**
 * 主运行函数：抓取数据并保存为 JSON
 */
async function main() {
  console.log('Starting feed fetch...');
  
  const [hnStories, redditPosts] = await Promise.all([
    fetchHackerNews(),
    fetchRedditTech()
  ]);
  
  const data = {
    updated_at: new Date().toISOString(),
    tech: hnStories,
    design: getMockDesignData(),
    news: redditPosts
  };
  
  const outputPath = path.resolve('public', 'feeds-data.json');
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
  
  console.log(`Successfully updated feeds at ${data.updated_at}`);
  console.log(`Saved to ${outputPath}`);
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
