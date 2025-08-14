import { useState, useEffect } from "react";
import { LanguageContext } from "./LanguageContext";
import { useTranslation } from 'react-i18next';
import '../i18n';

function LanguageProvider({ children }) {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language === 'ar' ? 'rtl' : 'ltr');

    useEffect(() => {
        document.documentElement.dir = language;
        document.documentElement.lang = language === 'rtl' ? 'ar' : 'en';
    }, [language]);

    function handleChangeLanguage() {
        const newLanguage = language === 'ltr' ? 'rtl' : 'ltr';
        const newLang = newLanguage === 'rtl' ? 'ar' : 'en';
        setLanguage(newLanguage);
        i18n.changeLanguage(newLang);
    }

    const LanguageCtx = {
        language,
        handleChangeLanguage
    };

    return (
        <LanguageContext.Provider value={LanguageCtx}>
            {children}
        </LanguageContext.Provider>
    )
}

export default LanguageProvider;
