import { useTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from "react-router-dom";

function MobileBackButton() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    return (
        <div className="lg:hidden sticky top-0 z-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                    <BiArrowBack className="text-lg" />
                    <span className="text-sm">{t('common.back')}</span>
                </button>
            </div>
        </div>
    )
}

export default MobileBackButton