import { useState } from 'react';
import { FaBars } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { FaTimes } from "react-icons/fa";
import Logo from '../../assets/logo.png'

const menu = [
    {
        id: 1,
        name: "Explore",
        link: "/",
    }, {
        id: 2,
        name: "Products",
        link: "/products",
    }, {
        id: 3,
        name: "Add Product",
        link: "/addProduct",
    }, {
        id: 4,
        name: "My Wishlist",
        link: "/wishlist",
    }];
function LowerNavBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const mainNavItemsStyle = (isActive, isMobile = false) => {
        if (isActive) {
            return isMobile
                ? 'bg-primary text-white rounded-lg'
                : 'bg-primary rounded-2xl text-white py-[5px] px-[15px] hover:bg-secondary';
        }
        return isMobile
            ? 'text-gray-700 dark:text-gray-200'
            : 'inline-block px-4 hover:text-primary duration-200 before:content-[""] before:absolute before:w-0 before:bottom-[-2px] before:h-[2px] before:bg-primary before:transition-all before:duration-300 hover:before:w-full relative text-gray-700 dark:text-gray-200';
    };

    return (
        <>
            {/* Desktop Navigation */}
            <div className="sm:flex hidden justify-center p-2 dark:bg-gray-900 bg-background-light">
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
            <div className="sm:hidden flex justify-between items-center p-2 md:p-2 shadow-md dark:bg-gray-900" >
                <button onClick={toggleMobileMenu} className="text-2xl cursor-pointer">
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-0 left-0 w-[280px] h-full bg-white shadow-xl z-[1000] transform transition-transform duration-300 ease-in-out p-6 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} bg-white dark:bg-gray-900`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />
                        <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Menu
                        </span>
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary transition-all duration-300"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Menu Items */}
                <ul className="mt-12 space-y-6">
                    {menu.map(data => (
                        <li key={data.id}>
                            <NavLink
                                to={data.link}
                                className={({ isActive }) => `block text-lg font-medium py-2 px-4 rounded-lg transition-all duration-200 ${mainNavItemsStyle(isActive, true)} hover:bg-primary hover:text-white`}
                                onClick={toggleMobileMenu}
                            >
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
