import React, { useState } from 'react';
import { Search, Youtube, Github, MessageSquare } from 'lucide-react';

/**
 * 搜索栏组件，支持 "Bang" 命令和多语言
 */
const SearchBar = ({ t }) => {
  const [query, setQuery] = useState('');

  const getSearchIcon = () => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.startsWith('yt ')) return <Youtube className="h-6 w-6 text-[#FF0000] scale-110 transition-all" />;
    if (trimmed.startsWith('gh ')) return <Github className="h-6 w-6 text-text scale-110 transition-all" />;
    if (trimmed.startsWith('r/')) return <MessageSquare className="h-6 w-6 text-[#FF4500] scale-110 transition-all" />;
    return <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary group-focus-within:scale-110 transition-all" />;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    let url = '';
    const trimmedQuery = query.trim();

    if (trimmedQuery.startsWith('yt ')) {
      url = `https://www.youtube.com/results?search_query=${encodeURIComponent(trimmedQuery.slice(3))}`;
    } else if (trimmedQuery.startsWith('gh ')) {
      url = `https://github.com/search?q=${encodeURIComponent(trimmedQuery.slice(3))}`;
    } else if (trimmedQuery.startsWith('r/')) {
      url = `https://www.reddit.com/r/${encodeURIComponent(trimmedQuery.slice(2))}`;
    } else {
      url = `https://www.google.com/search?q=${encodeURIComponent(trimmedQuery)}`;
    }

    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {getSearchIcon()}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="block w-full pl-14 pr-4 py-3.5 bg-card border-2 border-border rounded-2xl shadow-lg focus:ring-4 focus:ring-primary/20 focus:border-primary text-text placeholder-slate-400 text-base transition-all outline-none"
        />
      </form>
    </div>
  );
};

export default SearchBar;
