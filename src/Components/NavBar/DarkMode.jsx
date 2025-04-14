import React, { useState } from 'react'
import { CgDarkMode } from "react-icons/cg";

function DarkMode() {

    const [theme, setTheme] = useState('light');
    const element = document.documentElement;//html element

    function handleToggle() {
        if (theme === 'light') {
            setTheme('dark')
            element.classList.add('dark');
        } else {
            setTheme('light');
            element.classList.remove('dark');
        }
    }
    
    return (
        <div className='flex items-center gap-1 text-lg font-medium py-2 px-4 hover:bg-secondary hover:text-white rounded-lg transition '>
            <button onClick={handleToggle} className='flex items-center gap-1'>
                <CgDarkMode className='dark:text-white text-2xl cursor-pointer text-black' />
                <p className='cursor-pointer'>Dark Mode</p>
            </button>
        </div>
    )
}

export default DarkMode