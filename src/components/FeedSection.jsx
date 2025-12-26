import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Clock, Cpu, Palette, Newspaper, Hash } from 'lucide-react';

/**
 * 信息流组件：展示从 JSON 读取的新闻聚合，支持多语言
 */
const FeedSection = ({ t, formatUrl }) => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('tech');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/feeds-data.json');
      if (!response.ok) throw new Error('Failed to fetch feeds');
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error('Error fetching feeds:', err);
      setError(t('fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tabs = [
    { id: 'tech', label: t('tech'), icon: <Cpu className="h-4 w-4" /> },
    { id: 'design', label: t('design'), icon: <Palette className="h-4 w-4" /> },
    { id: 'news', label: t('news'), icon: <Newspaper className="h-4 w-4" /> },
  ];

  const currentItems = data ? data[activeTab] || [] : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex bg-card p-1.5 rounded-2xl border-2 border-border shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 rtl:space-x-reverse ${
                activeTab === tab.id
                  ? 'bg-primary text-white dark:text-slate-950 shadow-lg scale-105'
                  : 'text-slate-500 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={fetchData}
          className="flex items-center space-x-2 text-text font-bold hover:text-primary hover:scale-110 transition-all group"
          disabled={loading}
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform`} />
          <span className="text-sm">{t('refresh')}</span>
        </button>
      </div>

      {error && (
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!error && (
        <div className="space-y-3">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-card animate-pulse rounded-2xl border border-border" />
            ))
          ) : (
            currentItems.map((item) => (
              <a
                key={item.id}
                href={formatUrl(item.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-5 bg-card hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl shadow-md hover:shadow-xl border-2 border-border hover:border-primary transition-all hover:-translate-x-1 rtl:hover:translate-x-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4 rtl:pr-0 rtl:pl-4">
                    <h4 className="text-lg font-bold text-text leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mt-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-widest shadow-sm">
                        <Hash className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1 text-primary" />
                        {item.source}
                      </span>
                      {item.points && (
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {item.points} points
                        </span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:scale-125 transition-all mt-1 flex-shrink-0" />
                </div>
              </a>
            ))
          )}
          {!loading && currentItems.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              {t('noContent')}
            </div>
          )}
        </div>
      )}

      {data?.updated_at && (
        <div className="mt-8 flex items-center justify-center space-x-2 text-slate-400 text-xs">
          <Clock className="h-3 w-3" />
          <span>{t('lastUpdated')}: {new Date(data.updated_at).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default FeedSection;
