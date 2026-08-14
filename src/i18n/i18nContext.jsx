import { createContext, useContext, useState, useEffect } from 'react';
import { en } from './locales/en';
import { ar } from './locales/ar';

const locales = { en, ar };

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState('en');

  const setLang = (val) => {
    const newLang = typeof val === 'function' ? val(lang) : val;
    setLangState(newLang);
  };

  // Update document direction and lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    // Cairo font loads via Google Fonts, just set the dir
    if (lang === 'ar') {
      document.documentElement.style.setProperty('--font-display', "'Cairo', serif");
      document.documentElement.style.setProperty('--font-body', "'Cairo', sans-serif");
    } else {
      document.documentElement.style.removeProperty('--font-display');
      document.documentElement.style.removeProperty('--font-body');
    }
  }, [lang]);

  const t = (key) => {
    const keys = key.split('.');
    let val = locales[lang];
    for (const k of keys) {
      val = val?.[k];
      if (val === undefined) break;
    }
    return val || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
