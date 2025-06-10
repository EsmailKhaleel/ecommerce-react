import React, { useContext, useState } from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import Logo from '../../assets/logo.png'
import DarkMode from './DarkMode'
import { LanguageContext } from '../../Context/LanguageProvider'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { MdAccountCircle } from "react-icons/md";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useAuth } from '../../Context/AuthProvider'

function UpperNanBar() {
    const { language, handleChangeLanguage } = useContext(LanguageContext);
    const cart = useSelector((state) => state.cart.cartProducts);
    const { signOut, user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {/* Desktop Navigation */}
            <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <img src={Logo} alt="logo" className="w-12 h-12 object-contain transition-transform hover:scale-105" />
                            <a className="hidden lg:block font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Esmail Khaleel</a>
                        </div>
                        <div className="hidden sm:flex gap-6 items-center">
                            {user && (
                                <button
                                    onClick={signOut}
                                    className="group flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    <FaSignOutAlt className="text-xl" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            )}
                            <NavLink to="/account" className="group flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
                                <MdAccountCircle className="text-2xl" />
                                <span className="text-sm font-medium">Account</span>
                            </NavLink>
                            <NavLink to="/cart">
                                <button className="relative group flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                                    <span className="text-sm font-medium">Cart</span>
                                    <FaCartShopping className="text-xl" />
                                    {cart?.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                                            {cart.length}
                                        </span>
                                    )}
                                </button>
                            </NavLink>
                            <DarkMode />
                            <button
                                onClick={handleChangeLanguage}
                                className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                {language === 'ltr' ? 'En' : 'Ar'}
                            </button>
                            {!user && (
                                <NavLink to="/auth" className="hidden sm:block">
                                    <button className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:shadow-lg">
                                        Login
                                    </button>
                                </NavLink>
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
                className={`fixed top-0 left-0 w-72 h-full bg-white dark:bg-gray-900 shadow-xl z-[1000] transform transition-all duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6">
                    {/* Close Button */}
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="absolute top-4 right-4 text-2xl text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                        <FaTimes />
                    </button>

                    {/* Navigation Links */}
                    <nav className="mt-12 flex flex-col gap-4">
                        {user && (
                            <button
                                onClick={signOut}
                                className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                <FaSignOutAlt className="text-xl" /> Logout
                            </button>
                        )}
                        <NavLink
                            to="/account"
                            className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            <MdAccountCircle className="text-xl" /> My Account
                        </NavLink>
                        <NavLink
                            to="/cart"
                            className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            <FaCartShopping className="text-xl" /> Cart ({cart?.length || 0})
                        </NavLink>
                        {!user && (
                            <NavLink
                                to="/auth"
                                className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                Login
                            </NavLink>
                        )}
                        <button
                            onClick={handleChangeLanguage}
                            className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            {language === 'ltr' ? 'English' : 'Arabic'}
                        </button>
                        <div className="w-full">
                            <DarkMode />
                        </div>
                    </nav>
                </div>
            </div>

            {/* Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}

export default UpperNanBar