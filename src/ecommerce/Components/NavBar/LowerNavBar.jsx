import React from 'react';
import { menu, dropDownLinks } from './NavBar';
import { FaCaretDown } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
function LowerNavBar() {
    const mainNavItemsStyle = function (isActive) {
        return isActive ? 'bg-secondary/80 rounded-2xl text-white py-[5px] px-[15px] hover:bg-secondary' : 'inline-block px-4 hover:text-primary duration-200';
    }
    return (
        //lower navbar 
        <div className='flex justify-center p-2'>
            <ul className='sm:flex hidden items-center gap-4'>
                {
                    menu.map(data => (
                        <li key={data.id} className='flex items-center'>
                            <NavLink to={data.link} className={({ isActive }) => mainNavItemsStyle(isActive)}>{data.name}</NavLink>
                        </li>
                    ))
                }
                {/* dropdown list */}
                <li className='group relative cursor-pointer '>
                    <a className='flex items-center gap-1'>
                        Trending Products<span>
                            <FaCaretDown className='group-hover:rotate-180 duration-200 transition-all' />
                        </span>
                    </a>
                    <div className='absolute  hidden group-hover:block w-[150px] p-1 bg-white z-[999] rounded-md shadow-md'>
                        <ul className='inline-block'>
                            {dropDownLinks.map(data => (
                                <li key={data.id} >
                                    <a to={data.link} className='inline-block w-full rounded-md p-2 hover:bg-primary/50 dark:text-black'>{data.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default LowerNavBar;