import React, { useState } from 'react';
import { menu } from './NavBar';
import { FaBars } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { FaTimes } from "react-icons/fa";
function LowerNavBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const mainNavItemsStyle = (isActive) => (
        isActive 
            ? 'bg-secondary/80 rounded-2xl text-white py-[5px] px-[15px] hover:bg-secondary' 
            : 'inline-block px-4 hover:text-primary duration-200'
    );

    return (
        <>
            {/* Desktop Navigation */}
            <div className="sm:flex hidden justify-center p-2 dark:bg-gray-900 bg-white shadow-md">
                <ul className="sm:flex hidden items-center gap-4">
                    {menu.map(data => (
                        <li key={data.id} className="flex items-center">
                            <NavLink to={data.link} className={({ isActive }) => mainNavItemsStyle(isActive)}>
                                {data.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Mobile Navigation */}
            <div className="sm:hidden flex justify-between items-center p-4 shadow-md dark:bg-gray-900" >
                <button onClick={toggleMobileMenu} className="text-2xl cursor-pointer">
                    {isMobileMenuOpen ? <FaTimes/> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-0 left-0 w-[280px] h-full bg-white shadow-xl z-[1000] transform transition-transform duration-300 ease-in-out p-6 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} bg-white dark:bg-gray-900`}>
                {/* Close Button */}
                <button onClick={toggleMobileMenu} className="absolute top-4 right-4 text-2xl text-gray-600 dark:text-gray-300 hover:text-red-500 transition cursor-pointer">
                    <FaTimes />
                </button>

                {/* Menu Items */}
                <ul className="mt-12 space-y-6">
                    {menu.map(data => (
                        <li key={data.id}>
                            <NavLink to={data.link} className="block text-lg font-medium py-2 px-4 hover:bg-primary hover:text-white rounded-lg transition" onClick={toggleMobileMenu}>
                                {data.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-[999]" onClick={toggleMobileMenu}></div>}
        </>
    );
}

export default LowerNavBar;
