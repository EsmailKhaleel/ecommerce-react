import { FaArrowAltCircleLeft, FaSignOutAlt } from "react-icons/fa"
import { FaCartShopping } from "react-icons/fa6"
import { MdAccountCircle } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../Context/useAuth";
import { useTranslation } from "react-i18next";
import { setIsProfileDrawerOpen } from "../../StateManagement/Slices/DrawerSlice";
import { useNavHandler } from "./useNavHandler";

function ProfileDrawer() {
    const { signOut, user } = useAuth();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const { handleNavigation } = useNavHandler();


    return (
        <>
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => dispatch(setIsProfileDrawerOpen(false))}
                    className="p-2 rounded-full hover:bg-gray-100 text-primary transition-all duration-300"
                    aria-label={t('common.close')}
                >
                    <FaArrowAltCircleLeft className="text-xl" />
                </button>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t('common.profile')}
                </span>
            </div>
            {user ? (
                <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                            {user.image ? (
                                <img src={user.image} alt={t('auth.welcome', { name: user.displayName })} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <MdAccountCircle className="text-2xl" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                                {user.displayName || user.email.split('@')[0]}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                        <FaSignOutAlt className="text-lg" />
                        <span>{t('auth.signOut')}</span>
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => handleNavigation('/auth')}
                    className="mb-8 flex items-center justify-center gap-2 py-3 px-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 w-full"
                >
                    <MdAccountCircle className="text-xl" />
                    <span>{t('auth.signIn')} / {t('auth.signUp')}</span>
                </button>
            )}

            {/* Navigation Links */}
            <nav className="space-y-2">
                <button
                    onClick={() => handleNavigation('/account')}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-primary w-full text-left"
                >
                    <MdAccountCircle className="text-xl" />
                    <span>{t('navigation.account')}</span>
                </button>
                <button
                    onClick={() => handleNavigation('/cart')}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-primary w-full text-left"
                >
                    <div className="relative">
                        <FaCartShopping className="text-xl" />
                        {cart?.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </div>
                    <span>{t('navigation.cart')}</span>
                </button>
            </nav>
        </>
    )
}

export default ProfileDrawer