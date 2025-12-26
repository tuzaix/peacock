import React, { useState, useEffect } from 'react';
import { Plus, X, ExternalLink, Flame } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * 快捷拨号组件：管理和显示快捷图标，支持多语言
 * 支持从 shortcuts-config.json 加载热门导航
 */
const SpeedDial = ({ t, formatUrl }) => {
  const [systemShortcuts, setSystemShortcuts] = useState([]);
  const [proxyTools, setProxyTools] = useState([]);
  const [myShortcuts, setMyShortcuts] = useLocalStorage('dailyhub_shortcuts', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    // 加载后台配置的热门导航
    fetch('/shortcuts-config.json')
      .then(res => res.json())
      .then(data => {
        if (data.hotShortcuts) {
          setSystemShortcuts(data.hotShortcuts);
        }
      })
      .catch(err => console.error('Failed to load shortcuts config:', err));

    // 加载代理工具配置
    fetch('/proxy-tools.json')
      .then(res => res.json())
      .then(data => {
        if (data.proxyTools && Array.isArray(data.proxyTools)) {
          setProxyTools(data.proxyTools);
        }
      })
      .catch(err => {
        console.warn('Proxy tools config not found or invalid');
        setProxyTools([]); // 确保出错时也为空
      });
  }, []);

  const addShortcut = (e) => {
    e.preventDefault();
    if (!newName || !newUrl) return;

    let url = newUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    const newShortcut = {
      id: Date.now().toString(),
      name: newName,
      url: url,
    };

    setMyShortcuts([...myShortcuts, newShortcut]);
    setNewName('');
    setNewUrl('');
    setIsAdding(false);
  };

  const removeShortcut = (id) => {
    setMyShortcuts(myShortcuts.filter((s) => s.id !== id));
  };

  const getFavicon = (url) => {
    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname;
      
      // 优先使用本地缓存的图标
      return `/favicons/${domain}.png`;
    } catch (e) {
      return null;
    }
  };

  const allShortcuts = [...systemShortcuts, ...myShortcuts];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-12 space-y-6">
      {/* 快捷拨号 - 单行滚动布局 */}
      <div className="relative group/scroll">
        <div className="flex items-center space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {allShortcuts.map((shortcut, index) => {
            const isSystem = index < systemShortcuts.length;
            return (
              <div
                key={shortcut.id}
                className="group relative flex-shrink-0 w-24 flex flex-col items-center p-2 bg-card rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-border hover:border-primary/50 snap-start"
              >
                {!isSystem && (
                  <button
                    onClick={() => removeShortcut(shortcut.id)}
                    className="absolute -top-2 -right-2 rtl:-right-auto rtl:-left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-sm z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                {isSystem && (
                  <div className="absolute -top-2 -left-2 rtl:-left-auto rtl:-right-2 p-1 bg-amber-500 text-white rounded-full shadow-sm z-10 scale-75 opacity-80">
                    <Flame className="h-3 w-3 fill-white" />
                  </div>
                )}
                <a
                  href={formatUrl(shortcut.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-2 w-full"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200 group-hover:bg-primary group-hover:scale-105 transition-all duration-300 shadow-sm overflow-hidden border border-border/50">
                    {getFavicon(shortcut.url) ? (
                      <img 
                        src={getFavicon(shortcut.url)} 
                        alt={shortcut.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          const domain = new URL(shortcut.url).hostname;
                          const fallbackUrl = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
                          if (e.target.src !== fallbackUrl) {
                            e.target.src = fallbackUrl;
                          } else {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }
                        }}
                      />
                    ) : null}
                    <ExternalLink className="h-4 w-4 hidden" />
                  </div>
                  <span className="text-[10px] font-bold text-text truncate w-full text-center group-hover:text-primary transition-colors px-1">
                    {shortcut.name}
                  </span>
                </a>
              </div>
            );
          })}

          <button
            onClick={() => setIsAdding(true)}
            className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-slate-50/50 dark:bg-slate-800/50 border border-dashed border-border rounded-xl text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all group snap-start"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            <span className="text-[10px] font-bold mt-1">{t('addBtn')}</span>
          </button>
        </div>
      </div>

      {/* 热门代理工具栏 - 仅在有数据时展示 */}
      {proxyTools && proxyTools.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3 px-1">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h4 className="text-xs font-black text-text uppercase tracking-wider opacity-70">
              {t('proxy_tools')}
            </h4>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-x-auto pb-2 scrollbar-hide">
            {proxyTools.map((tool) => (
              <a
                key={tool.name}
                href={formatUrl(tool.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all whitespace-nowrap group/tool"
              >
                <div className="w-4 h-4 rounded overflow-hidden opacity-70 group-hover/tool:opacity-100 transition-opacity">
                  <img src={getFavicon(tool.url)} alt="" className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover/tool:text-primary transition-colors">
                  {tool.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card p-6 rounded-2xl shadow-2xl w-full max-w-md border border-border">
            <h3 className="text-lg font-bold text-text mb-4">{t('addShortcut')}</h3>
            <form onSubmit={addShortcut} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('shortcutName')}</label>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-text outline-none"
                  placeholder="e.g. GitHub"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('shortcutUrl')}</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-text outline-none"
                  placeholder="e.g. github.com"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-colors font-medium"
                >
                  {t('add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedDial;
