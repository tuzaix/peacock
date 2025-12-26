import { useState, useEffect } from 'react';

/**
 * 自定义 Hook：管理主题风格状态
 * @returns {object} { theme, setTheme }
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('dailyhub_theme');
    return saved || 'default';
  });

  useEffect(() => {
    localStorage.setItem('dailyhub_theme', theme);
    
    // 移除旧的主题类名
    const html = document.documentElement;
    const themeClasses = Array.from(html.classList).filter(c => c.startsWith('theme-'));
    themeClasses.forEach(c => html.classList.remove(c));
    
    // 添加新的主题类名
    if (theme !== 'default') {
      html.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return { theme, setTheme };
}
