import React, { useState } from 'react';
import { menu, dropDownLinks } from './NavBar';
import { FaCaretDown, FaBars } from 'react-icons/fa6';
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
            <div className="sm:flex hidden justify-center p-2">
                <ul className="sm:flex hidden items-center gap-4">
                    {menu.map(data => (
                        <li key={data.id} className="flex items-center">
                            <NavLink to={data.link} className={({ isActive }) => mainNavItemsStyle(isActive)}>
                                {data.name}
                            </NavLink>
                        </li>
                    ))}
                    {/* Dropdown List */}
                    {/* <li className="group relative cursor-pointer">
                        <a className="flex items-center gap-1">
                            Trending Products
                            <span>
                                <FaCaretDown className="group-hover:rotate-180 duration-200 transition-all" />
                            </span>
                        </a>
                        <div className="absolute hidden group-hover:block w-[180px] p-2 bg-white z-[999] rounded-md shadow-md">
                            <ul className="inline-block">
                                {dropDownLinks.map(data => (
                                    <li key={data.id}>
                                        <NavLink to={data.link} className="inline-block w-full rounded-md p-2 hover:bg-primary/50 dark:text-black">
                                            {data.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li> */}
                </ul>
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden flex justify-between items-center p-4 bg-white shadow-md">
                <button onClick={toggleMobileMenu} className="text-2xl">
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-0 left-0 w-[280px] h-full bg-gradient-to-b from-gray-900 to-gray-700 text-white shadow-xl z-[1000] transform transition-transform duration-300 ease-in-out p-6 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Close Button */}
                <button onClick={toggleMobileMenu} className="absolute top-4 right-4 text-2xl text-white">
                    <FaTimes />
                </button>

                {/* Menu Items */}
                <ul className="mt-12 space-y-6">
                    {menu.map(data => (
                        <li key={data.id}>
                            <NavLink to={data.link} className="block text-lg font-medium py-2 px-4 hover:bg-gray-800 rounded-lg transition" onClick={toggleMobileMenu}>
                                {data.name}
                            </NavLink>
                        </li>
                    ))}
                    {/* Dropdown in Mobile */}
                    {/* <li className="w-full">
                        <details className="w-full">
                            <summary className="flex items-center justify-between text-lg font-medium py-2 px-4 hover:bg-gray-800 rounded-lg cursor-pointer transition">
                                Trending Products <FaCaretDown />
                            </summary>
                            <ul className=" mt-2 pl-4 space-y-2 shadow-md rounded-2xl bg-gray-500">
                                {dropDownLinks.map(data => (
                                    <li key={data.id}>
                                        <NavLink to={data.link} className="block py-1 text-sm hover:text-gray-300" onClick={toggleMobileMenu}>
                                            {data.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </li> */}
                </ul>
            </div>

            {/* Background Overlay when menu is open */}
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-[999]" onClick={toggleMobileMenu}></div>}
        </>
    );
}

export default LowerNavBar;
