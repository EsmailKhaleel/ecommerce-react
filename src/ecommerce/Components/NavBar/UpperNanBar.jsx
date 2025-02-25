import React, { useContext, useState } from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import Logo from '../../../assets/logo.png'
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
    const { signOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            {/* Upper Navbar */}
            <div className="flex justify-between items-center bg-primary/40 py-2 px-4">
                {/* Logo & Branding */}
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="logo" className="w-14 sm:w-10" />
                    <a className="hidden lg:block font-bold text-xl sm:text-2xl">Esmail Khaleel</a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex gap-6 items-center">
                    {/* Logout */}
                    <button onClick={signOut}>
                        <FaSignOutAlt className="dark:text-white text-2xl cursor-pointer text-black" />
                    </button>

                    {/* Account Link */}
                    <NavLink to="/account">
                        <MdAccountCircle className="dark:text-white text-3xl cursor-pointer text-black" />
                    </NavLink>

                    {/* Cart Button */}
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

                    {/* Dark Mode Toggle */}
                    <DarkMode />

                    {/* Language Toggle */}
                    <button onClick={handleChangeLanguage} className="text-sm">
                        {language === 'ltr' ? 'En' : 'Ar'}
                    </button>
                    {/* Login Button (Hidden on Mobile) */}
                    <NavLink to="/auth" className="hidden sm:block">
                        <button type="button" className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 rounded-lg text-sm px-4 py-2.5 font-medium">
                            <span>Login</span>
                        </button>
                    </NavLink>
                </div>
                {/* Mobile Menu Button */}
                <button className="sm:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Drawer Menu */}
            {menuOpen && (
                <div className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg z-50 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out flex flex-col p-5`}>

                    {/* Close Button */}
                    <button onClick={() => setMenuOpen(false)} className="text-2xl absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition">
                        <FaTimes />
                    </button>

                    {/* Navigation Links */}
                    <nav className="mt-12 flex flex-col gap-6 items-start">
                        <button onClick={signOut} className="flex items-center gap-3 text-lg text-gray-700 dark:text-white hover:text-red-500 transition">
                            <FaSignOutAlt className="text-xl" /> Logout
                        </button>

                        <NavLink to="/account" className="flex items-center gap-3 text-lg text-gray-700 dark:text-white hover:text-primary transition">
                            <MdAccountCircle className="text-xl" /> My Account
                        </NavLink>


                        <NavLink to="/cart" className="flex items-center gap-3 text-lg text-gray-700 dark:text-white hover:text-green-500 transition">
                            <FaCartShopping className="text-xl" /> Cart ({cart?.length || 0})
                        </NavLink>

                        <NavLink to="/auth" className="text-lg text-gray-700 dark:text-white hover:text-primary transition">
                            Login
                        </NavLink>

                        {/* Language Toggle */}
                        <button onClick={handleChangeLanguage} className="text-lg text-gray-700 dark:text-white hover:text-blue-500 transition">
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