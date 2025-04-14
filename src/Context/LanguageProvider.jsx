import React, { createContext, useState } from "react";

export const LanguageContext = createContext({
    language: '',
    handleChangeLanguage: () => { }
});

function LanguageProvider({ children }) {

    const [language, setLanguage] = useState('ltr');

    function handleChangeLanguage() {
        setLanguage(prevLanguage => (prevLanguage === 'ltr' ? 'rtl' : 'ltr'));
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
