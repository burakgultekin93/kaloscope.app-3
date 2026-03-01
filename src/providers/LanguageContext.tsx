import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const getInitialLang = (): Language => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('kaloscope_lang') as Language;
            if (savedLang === 'tr' || savedLang === 'en') return savedLang;

            const browserLang = navigator.language.split('-')[0];
            return browserLang === 'en' ? 'en' : 'tr';
        }
        return 'tr';
    };

    const [lang, setLangState] = useState<Language>(getInitialLang);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('kaloscope_lang', newLang);
        document.documentElement.lang = newLang;
    };

    useEffect(() => {
        document.documentElement.lang = lang;
    }, []);

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
