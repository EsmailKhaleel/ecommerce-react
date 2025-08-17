import Logo from '../../assets/logo.png'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { closeAllDrawers } from '../../StateManagement/Slices/DrawerSlice';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

function DrawerHeading() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    
    return (
        <div className="flex items-center justify-between mb-8 mt-16">
            <div className="flex items-center gap-3">
                <img src={Logo} alt={t('brand.name')} className="w-10 h-10 object-contain" />
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t('common.menu')}
                </span>
            </div>
            <button
                onClick={() => dispatch(closeAllDrawers())}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary transition-all duration-300"
                aria-label={t('common.close')}
            >
                <MdOutlineKeyboardArrowLeft className="text-xl text-primary" />
            </button>
        </div>
    )
}

export default DrawerHeading