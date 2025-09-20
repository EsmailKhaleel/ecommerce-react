import { useContext } from "react";
import { LanguageContext } from "../../Context/LanguageContext";

function LanguageButton() {
    const { language, handleChangeLanguage } = useContext(LanguageContext);

    return (
        <button
            onClick={handleChangeLanguage}
            className="text-sm cursor-pointer font-medium px-4 py-2 rounded-lg bg-white border border-primary dark:bg-gray-800 text-primary dark:text-gray-200 hover:bg-primary hover:text-white transition-all duration-300"
        >
            {language === 'ltr' ? 'العربية' : 'English'}
        </button>
    )
}

export default LanguageButton