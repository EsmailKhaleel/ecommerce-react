import {  useState } from "react";
import { LanguageContext } from "./LanguageContext";


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
