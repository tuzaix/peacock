import React, { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Languages, Check, ChevronDown, Palette, Zap } from 'lucide-react';
import SearchBar from './components/SearchBar';
import SpeedDial from './components/SpeedDial';
import ExploreSection from './components/ExploreSection';
import FeedSection from './components/FeedSection';
import SidebarAds from './components/SidebarAds';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLanguage } from './hooks/useLanguage';
import { useTheme } from './hooks/useTheme';
import { languages, isRTL } from './i18n';
import { themes } from './themes';

/**
 * 主应用组件，支持暗黑模式、多语言（16种）及 RTL 布局
 */
function App() {
  const [isDark, setIsDark] = useLocalStorage('dailyhub_dark_mode', false);
  const { lang, t, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const langRef = useRef(null);
  const themeRef = useRef(null);

  // 从 Vite 环境变量中获取 source 参数
  const fromSource = import.meta.env.VITE_FROM_SOURCE || '';

  /**
   * 格式化外链，自动添加 from_source 参数
   */
  const formatUrl = (url) => {
    if (!url || !fromSource) return url;
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('from_source', fromSource);
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  };

  useEffect(() => {
    // 暗黑模式切换
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // RTL 布局支持
    if (isRTL(lang)) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = lang;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    // 点击外部关闭语言和主题菜单
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  const currentLanguageName = languages.find(l => l.code === lang)?.name || 'English';

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      {/* Header / Theme & Lang Toggle */}
      <header className="w-full max-w-6xl mx-auto px-4 py-6 flex justify-between items-center relative z-50">
        <div className="flex items-center space-x-2 rtl:space-x-reverse group cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <Zap className="text-white h-6 w-6 fill-white" />
          </div>
          <h1 className="text-2xl font-black text-text tracking-tight group-hover:text-primary transition-colors">
            {t('title')}
          </h1>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Theme Dropdown */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="p-2 px-3 rounded-xl bg-card shadow-md border-2 border-border text-text hover:text-primary hover:border-primary hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 rtl:space-x-reverse group"
            >
              <Palette className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline">{t('theme')}: {t(`theme_${theme}`)}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
            </button>

            {isThemeOpen && (
              <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-40 bg-card border border-border rounded-2xl shadow-2xl py-2 z-[60]">
                {themes.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setTheme(th.id);
                      setIsThemeOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      theme === th.id ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: isDark ? th.darkColors.primary : th.colors.primary }}
                      />
                      <span>{t(`theme_${th.id}`)}</span>
                    </div>
                    {theme === th.id && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 px-3 rounded-xl bg-card shadow-md border-2 border-border text-text hover:text-primary hover:border-primary hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 rtl:space-x-reverse group"
            >
              <Languages className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline">{currentLanguageName}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl py-2 max-h-80 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      lang === l.code ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{l.name}</span>
                    {lang === l.code && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-card shadow-md border-2 border-border text-text hover:text-primary hover:border-primary hover:scale-110 active:scale-90 transition-all group"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-5 w-5 group-hover:rotate-90 transition-transform" /> : <Moon className="h-5 w-5 group-hover:-rotate-12 transition-transform" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto">
        {/* Hero / Search Section */}
        <section className="pt-8 pb-4">
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-black text-text mb-2 tracking-tight">
              {getGreeting()}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              {t('greetingSub')}
            </p>
          </div>
          <SearchBar t={t} />
        </section>

        {/* Shortcuts Section */}
        <SpeedDial t={t} formatUrl={formatUrl} />

        {/* Explore / Navigation Section */}
        <ExploreSection t={t} formatUrl={formatUrl} />

        {/* Content Feeds Section */}
        <FeedSection t={t} formatUrl={formatUrl} />
      </main>

      <footer className="py-12 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} {t('title')}. {t('copyright')}
          </p>
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-slate-400 text-sm">
            <span>{t('contact_us')}:</span>
            <a 
              href="mailto:contact@example.com" 
              className="text-primary hover:underline transition-all"
            >
              contact@example.com
            </a>
          </div>
        </div>
      </footer>

      {/* 侧边广告占位符 */}
      <SidebarAds />
    </div>
  );
}

export default App;
