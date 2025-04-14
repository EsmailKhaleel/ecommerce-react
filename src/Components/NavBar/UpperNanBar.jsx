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
            <div className="flex justify-between items-center bg-primary/40 py-2 px-4">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="logo" className="w-14 sm:w-10" />
                    <a className="hidden lg:block font-bold text-xl sm:text-2xl">Esmail Khaleel</a>
                </div>
                <div className="hidden sm:flex gap-6 items-center">
                    {user && <button onClick={signOut}>
                        <FaSignOutAlt className="dark:text-white text-2xl cursor-pointer text-black" />
                    </button>}
                    <NavLink to="/account">
                        <div className='flex items-center'>
                            <MdAccountCircle className="dark:text-white text-3xl cursor-pointer text-black" />
                            <div>Account</div>
                        </div>
                    </NavLink>
                    <NavLink to="/cart">
                        <button className="relative bg-gradient-to-r from-primary to-secondary text-white py-2 px-3 sm:px-4 rounded-md group flex items-center gap-2 cursor-pointer">
                            <span className="hidden sm:block group-hover:block transition-all duration-200">Go To Cart</span>
                            <FaCartShopping className="text-2xl drop-shadow-xl" />
                            {cart?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </NavLink>
                    <DarkMode />
                    <button onClick={handleChangeLanguage} className="text-sm cursor-pointer text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 rounded-lg px-4 py-2.5 font-medium">
                        {language === 'ltr' ? 'En' : 'Ar'}
                    </button>
                    { !user && <NavLink to="/auth" className="hidden sm:block">
                        <button type="button" className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 rounded-lg text-sm px-4 py-2.5 font-medium">
                            <span>Login</span>
                        </button>
                    </NavLink>}
                </div>
                {/* Mobile Menu Button */}
                <button className="sm:hidden text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Drawer Menu */}
            {menuOpen && (
                <div className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg z-[1000] transform transition-transform duration-300 ease-in-out flex flex-col p-5 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    {/* Close Button */}
                    <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-2xl text-gray-600 dark:text-gray-300 hover:text-red-500 transition cursor-pointer">
                        <FaTimes />
                    </button>
                    {/* Navigation Links */}
                    <nav className="mt-12 flex flex-col gap-6 items-start w-full">
                        {user && <button onClick={signOut} className="flex items-center gap-3 text-lg font-medium py-2 px-4 hover:bg-primary hover:text-white rounded-lg transition cursor-pointer w-full">
                            <FaSignOutAlt className="text-xl" /> Logout
                        </button>}
                        <NavLink to="/account" className="w-full flex items-center gap-3 text-lg font-medium py-2 px-4 hover:bg-primary hover:text-white rounded-lg transition">
                            <MdAccountCircle className="text-xl" /> My Account
                        </NavLink>
                        <NavLink to="/cart" className="w-full flex items-center gap-3 text-lg font-medium py-2 px-4 hover:bg-primary hover:text-white rounded-lg transition">
                            <FaCartShopping className="text-xl" /> Cart ({cart?.length || 0})
                        </NavLink>
                        { !user && <NavLink to="/auth" className="block text-lg font-medium py-2 px-4 hover:bg-primary hover:text-white rounded-lg transition w-full cusror-pointer">
                            Login
                        </NavLink>}
                        {/* Language Toggle */}
                        <button onClick={handleChangeLanguage} className="block text-lg font-medium py-2 px-4 hover:bg-primary hover:text-white rounded-lg transition w-full cusror-pointer text-start">
                            {language === 'ltr' ? 'English' : 'Arabic'}
                        </button>
                        {/* Dark Mode Toggle */}
                        <DarkMode />
                    </nav>
                </div>
            )}
            {/* Overlay when menu is open */}
            {menuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)}></div>}
        </>
    );
}

export default UpperNanBar