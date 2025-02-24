import React, { useContext } from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import Logo from '../../../assets/logo.png'
import { IoMdSearch } from 'react-icons/io'
import DarkMode from './DarkMode'
import { LanguageContext } from '../../Context/LanguageProvider'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { MdAccountCircle } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from '../../Context/AuthProvider'
function UpperNanBar() {
    const { language, handleChangeLanguage } = useContext(LanguageContext);
    const cart = useSelector((state) => state.cart.cartProducts);
    const { signOut } = useAuth();

    return (
        // upper navbar 
        <div>
            <div className='flex justify-between items-center bg-primary/40 py-1 px-4'>
                <div>
                    <a className='font-bold text-2xl sm:text-3xl flex gap-1 items-center flex-wrap'><img src={Logo} alt="logo" className='w-15' />Esmail Khaleel</a>
                </div>
                <div className='flex gap-6'>
                    <div className='flex items-center'>
                        <button onClick={signOut}>
                            <FaSignOutAlt className='dark:text-white text-2xl  cursor-pointer text-black' />
                        </button>
                    </div>
                    <NavLink to={"/account"}><MdAccountCircle className='dark:text-white text-3xl cursor-pointer text-black' /></NavLink>
                    <NavLink to={"/auth"}>
                        <button type="button" className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 rounded-lg text-sm px-4 py-1.5 font-medium text-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30">
                            <span>Login</span>
                        </button>
                    </NavLink>

                    {/* order button */}
                    <NavLink to="/cart">
                        <button className='relative bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-md group flex  items-center gap-3 cursor-pointer'>
                            <span className='group-hover:block hidden transition-all duration-200 '>Go To Cart</span>
                            <FaCartShopping className='text-2xl py-1 drop-shadow-xl ' />
                            {cart?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </NavLink >
                    <DarkMode />
                    <button onClick={handleChangeLanguage}>{language === 'ltr' ? 'En' : 'Ar'}</button>
                    {/* search bar */}
                    <div className='group relative'>
                        <input
                            type="text"
                            placeholder='Search'
                            className='w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-10 py-1 bg-white focus:outline-none focus:border-primary dark:bg-gray-800 dark:border-gray-400'
                        />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-primary text-2xl'>
                            <IoMdSearch />
                        </span>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default UpperNanBar