import React from 'react';
import { 
  Users, 
  Video, 
  ShoppingBag, 
  Wrench, 
  BookOpen, 
  Gamepad2, 
  Globe, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

/**
 * 探索板块：展示类似 AllMyFaves 的热门网站分类导航
 */
const ExploreSection = ({ t, formatUrl }) => {
  const getFavicon = (url) => {
    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname;
      
      // 优先返回本地缓存的图标
      return `/favicons/${domain}.png`;
    } catch (e) {
      return null;
    }
  };

  const categories = [
    {
      id: 'social',
      name: t('explore_social'),
      icon: <Users className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-500/10',
      sites: [
        { name: 'Facebook', url: 'https://facebook.com' },
        { name: 'Twitter', url: 'https://twitter.com' },
        { name: 'Instagram', url: 'https://instagram.com' },
        { name: 'Reddit', url: 'https://reddit.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com' },
        { name: 'TikTok', url: 'https://tiktok.com' },
      ]
    },
    {
      id: 'entertainment',
      name: t('explore_entertainment'),
      icon: <Video className="h-5 w-5 text-red-500" />,
      color: 'bg-red-500/10',
      sites: [
        { name: 'YouTube', url: 'https://youtube.com' },
        { name: 'Netflix', url: 'https://netflix.com' },
        { name: 'Spotify', url: 'https://spotify.com' },
        { name: 'Twitch', url: 'https://twitch.tv' },
        { name: 'Disney+', url: 'https://disneyplus.com' },
        { name: 'Steam', url: 'https://steampowered.com' },
      ]
    },
    {
      id: 'shopping',
      name: t('explore_shopping'),
      icon: <ShoppingBag className="h-5 w-5 text-emerald-500" />,
      color: 'bg-emerald-500/10',
      sites: [
        { name: 'Amazon', url: 'https://amazon.com' },
        { name: 'eBay', url: 'https://ebay.com' },
        { name: 'AliExpress', url: 'https://aliexpress.com' },
        { name: 'Walmart', url: 'https://walmart.com' },
        { name: 'Etsy', url: 'https://etsy.com' },
        { name: 'Target', url: 'https://target.com' },
      ]
    },
    {
      id: 'tools',
      name: t('explore_tools'),
      icon: <Wrench className="h-5 w-5 text-amber-500" />,
      color: 'bg-amber-500/10',
      sites: [
        { name: 'Gmail', url: 'https://mail.google.com' },
        { name: 'Google Maps', url: 'https://maps.google.com' },
        { name: 'ChatGPT', url: 'https://chat.openai.com' },
        { name: 'GitHub', url: 'https://github.com' },
        { name: 'Canva', url: 'https://canva.com' },
        { name: 'Notion', url: 'https://notion.so' },
      ]
    },
    {
      id: 'knowledge',
      name: t('explore_knowledge'),
      icon: <BookOpen className="h-5 w-5 text-indigo-500" />,
      color: 'bg-indigo-500/10',
      sites: [
        { name: 'Wikipedia', url: 'https://wikipedia.org' },
        { name: 'BBC News', url: 'https://bbc.com/news' },
        { name: 'Medium', url: 'https://medium.com' },
        { name: 'Quora', url: 'https://quora.com' },
        { name: 'CNN', url: 'https://cnn.com' },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
      ]
    },
    {
      id: 'education',
      name: t('explore_education'),
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      color: 'bg-purple-500/10',
      sites: [
        { name: 'Coursera', url: 'https://coursera.org' },
        { name: 'Khan Academy', url: 'https://khanacademy.org' },
        { name: 'Duolingo', url: 'https://duolingo.com' },
        { name: 'Udemy', url: 'https://udemy.com' },
        { name: 'TED', url: 'https://ted.com' },
        { name: 'LinkedIn Learning', url: 'https://linkedin.com/learning' },
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-8">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <h3 className="text-2xl font-black text-text tracking-tight uppercase italic">
          {t('explore_title')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="group bg-card rounded-3xl border-2 border-border p-6 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
              <div className={`p-2.5 rounded-2xl ${category.color} group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <h4 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                {category.name}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {category.sites.map((site) => (
                <a
                  key={site.name}
                  href={formatUrl(site.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all group/item"
                >
                  <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform overflow-hidden">
                    <img 
                      src={getFavicon(site.url)} 
                      alt="" 
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        const domain = new URL(site.url).hostname;
                        e.target.onerror = null;
                        e.target.src = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover/item:text-primary truncate">
                    {site.name}
                  </span>
                  <ExternalLink className="h-3 w-3 text-slate-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreSection;
