import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    // Get language from localStorage, or browser default, or 'en'
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('isardlab_lang');
        if (saved) return saved;
        const brow = navigator.language.split('-')[0];
        return (brow === 'es') ? 'es' : 'en';
    });

    useEffect(() => {
        localStorage.setItem('isardlab_lang', lang);
    }, [lang]);

    const toggleLanguage = () => {
        setLang(prev => (prev === 'en' ? 'es' : 'en'));
    };

    const t = (key, params = {}) => {
        let str = translations[lang]?.[key] || translations['en']?.[key] || key;

        // Simple interpolation {completed} -> params.completed
        Object.keys(params).forEach(p => {
            str = str.replace(`{${p}}`, params[p]);
        });

        return str;
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
