import placeholder from '../../assets/placeholder.jpg';
import Logo from '../../assets/logo.png';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FaCartShopping } from 'react-icons/fa6';
import { MdAccountCircle } from 'react-icons/md';
import DarkMode from './DarkMode';
import { useAuth } from '../../Context/useAuth';
import MenuList from './MenuList';
import LanguageButton from './LanguageButton';
import { useNavHandler } from './useNavHandler';
import BurgerButton from './BurgerButton';

function DesktopNavBar() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const cart = useSelector((state) => state.cart.items);
    const { handleNavigation } = useNavHandler();

    return (
        <div className="sticky overflow-hidden top-0 z-50 flex items-center gap-4 justify-between px-4 py-2 shadow-md backdrop-blur-2xl bg-[#FFDCCF] dark:bg-primary/10">
            <BurgerButton />

            <div className="flex items-center gap-3">
                <img src={Logo} alt={t('brand.name')} className="w-12 h-12 object-contain transition-transform hover:scale-105" />
                <a className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t('brand.name')}
                </a>
            </div>

            <MenuList inDrawer={false} />

            <div className="hidden sm:flex gap-6 items-center">
                <button
                    onClick={() => handleNavigation('/account')}
                    className="group cursor-pointer flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors before:content-[''] before:absolute before:w-0 before:bottom-[-5px] before:h-[2px] before:bg-primary before:transition-all before:duration-300 hover:before:w-full relative">
                    {user?.image ?
                        <div className="relative">
                            <img
                                src={user.image}
                                alt={t('auth.welcome', { name: user.name })}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-primary dark:group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-md"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.currentTarget.src = placeholder;
                                }}
                            />
                        </div>
                        : <MdAccountCircle className="text-2xl" />}
                    <span className="text-sm font-medium">{t('navigation.account')}</span>
                </button>
                <button
                    onClick={() => handleNavigation('/cart')}
                    className="relative group flex items-center gap-0 hover:gap-2 bg-gradient-to-r from-primary to-secondary text-white py-2 px-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:px-4 cursor-pointer">
                    <span className="max-w-0 text-sm font-medium group-hover:max-w-[100px] overflow-hidden transition-all duration-300 whitespace-nowrap">
                        {t('navigation.cart')}
                    </span>
                    <FaCartShopping className="text-xl" />
                    {cart?.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                            {cart.length}
                        </span>
                    )}
                </button>
                <DarkMode />
                <LanguageButton />
                {!user && (
                    <button
                        onClick={() => handleNavigation('/auth')}
                        className="hidden sm:block text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:shadow-lg">
                        {t('auth.signUp')}
                    </button>
                )}
            </div>

            <div className='justify-self-end sm:hidden flex items-center gap-2'>
                <LanguageButton />
            </div>
        </div>
    )
}

export default DesktopNavBar;