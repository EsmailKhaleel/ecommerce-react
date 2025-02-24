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
        <div className='flex items-center'>
            <button onClick={handleToggle}>
                <CgDarkMode className='dark:text-white text-2xl  cursor-pointer text-black' />
            </button>
        </div>
    )
}

export default DarkMode