import { useState, useEffect } from 'react';
import { translations, getSystemLanguage } from '../i18n';

/**
 * 自定义 Hook：管理语言状态
 * @returns {object} { lang, t, setLang }
 */
export function useLanguage() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('dailyhub_lang');
    return saved || getSystemLanguage();
  });

  useEffect(() => {
    localStorage.setItem('dailyhub_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return { lang, t, setLang };
}
