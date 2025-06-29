import { useContext, useState } from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import Logo from '../../assets/logo.png'
import DarkMode from './DarkMode'
import { LanguageContext } from '../../Context/LanguageProvider'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdAccountCircle } from "react-icons/md";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useAuth } from '../../Context/useAuth'

function UpperNanBar() {
    const { language, handleChangeLanguage } = useContext(LanguageContext);
    const cart = useSelector((state) => state.cart.items);
    const { signOut, user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMenuOpen(false);
    };

    return (
        <>
            {/* Desktop Navigation */}
            <div className="sticky top-0 z-50 backdrop-blur-md bg-background-light dark:bg-gray-900/80">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-12 md:h-16">
                        <div className="flex items-center gap-3">
                            <img src={Logo} alt="logo" className="w-12 h-12 object-contain transition-transform hover:scale-105" />
                            <a className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ShopSphere</a>
                        </div>
                        <div className="hidden sm:flex gap-6 items-center">
                            <button
                            onClick={() => handleNavigation('/account')}
                            className="group flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors before:content-[''] before:absolute before:w-0 before:bottom-[-5px] before:h-[2px] before:bg-primary before:transition-all before:duration-300 hover:before:w-full relative">
                                {user?.image ?
                                    <div className="relative">
                                        <img
                                            src={user.image}
                                            alt={`${user.name}'s profile`}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-primary dark:group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-md"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                            }}
                                        />
                                    </div>
                                : <MdAccountCircle className="text-2xl" />}
                                <span className="text-sm font-medium">My Account</span>
                            </button>                            
                            <button
                                onClick={() => handleNavigation('/cart')}
                                className="relative group flex items-center gap-0 hover:gap-2 bg-gradient-to-r from-primary to-secondary text-white py-2 px-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:px-4">
                                <span className="w-0 text-sm font-medium group-hover:w-auto overflow-hidden transition-all duration-300 whitespace-nowrap">Cart</span>
                                <FaCartShopping className="text-xl" />
                                {cart?.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                                        {cart.length}
                                    </span>
                                )}
                            </button>
                            <DarkMode />
                            <button
                                onClick={handleChangeLanguage}
                                className="text-sm font-medium px-4 py-2 rounded-lg bg-white border border-primary dark:bg-gray-800 text-primary dark:text-gray-200 hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                {language === 'ltr' ? 'En' : 'Ar'}
                            </button>
                            {!user && (
                                <button
                                    onClick={() => handleNavigation('/auth')}
                                    className="hidden sm:block text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:shadow-lg">
                                    Create Account
                                </button>
                            )}
                        </div>
                        {/* Mobile Menu Button */}
                        <button
                            className="sm:hidden text-2xl text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>            
            {/* Mobile Drawer Menu */}
            <div
                className={`fixed top-0 left-0 sm:w-80 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-[1000] transform transition-all duration-500 ease-out ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="relative h-full p-6">
                    {/* Header with Logo */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />
                            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Menu
                            </span>
                        </div>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary transition-all duration-300"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {/* User Section */}
                    {user ? (
                        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                                    {user.image ? (
                                        <img src={user.image} alt="profile" className="w-full h-full rounded-full object-cover" />
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
                                <span>Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleNavigation('/auth')}
                            className="mb-8 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 w-full"
                        >
                            <MdAccountCircle className="text-xl" />
                            <span>Sign In / Create Account</span>
                        </button>
                    )}

                    {/* Navigation Links */}
                    <nav className="space-y-2">
                        <button
                            onClick={() => handleNavigation('/account')}
                            className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                        >
                            <MdAccountCircle className="text-xl" />
                            <span>My Account</span>
                        </button>
                        <button
                            onClick={() => handleNavigation('/cart')}
                            className="flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                        >
                            <div className="relative">
                                <FaCartShopping className="text-xl" />
                                {cart?.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </div>
                            <span>Cart</span>
                        </button>
                    </nav>

                    {/* Settings Section */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={handleChangeLanguage}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                {language === 'ltr' ? 'English' : 'العربية'}
                            </button>
                            <DarkMode />
                        </div>
                    </div>
                </div>
            </div>            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-all duration-500 ${
                    menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setMenuOpen(false)}
            />
        </>
    );
}

export default UpperNanBar