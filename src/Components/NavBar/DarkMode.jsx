import { useState, useEffect, useContext } from 'react'
import { FiSun, FiMoon } from "react-icons/fi";
import { LanguageContext } from '../../Context/LanguageContext';

function DarkMode() {
    const { language } = useContext(LanguageContext);
    const [theme, setTheme] = useState(() => {
        // Check if theme is stored in localStorage
        const savedTheme = localStorage.getItem('theme');
        // Check if user prefers dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme || (prefersDark ? 'dark' : 'light');
    });

    useEffect(() => {
        const element = document.documentElement;
        if (theme === 'dark') {
            element.classList.add('dark');
        } else {
            element.classList.remove('dark');
        }
        // Save theme preference to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    function handleToggle() {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }
    
    return (
        <button
            onClick={handleToggle}
            className="relative cursor-pointer inline-flex h-8 w-16 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            style={{
                background: theme === 'dark' 
                    ? 'linear-gradient(to right, #1F2937, #374151)'
                    : 'linear-gradient(to right, #E5E7EB, #D1D5DB)'
            }}
        >
            {/* Background Stars (visible in dark mode) */}
            <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
                theme === 'dark' ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full opacity-50"></div>
                <div className="absolute top-3 right-3 w-1 h-1 bg-white rounded-full opacity-70"></div>
                <div className="absolute bottom-2 left-4 w-1 h-1 bg-white rounded-full opacity-60"></div>
            </div>

            {/* Toggle Circle */}
            <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-500 ${
                    theme === 'dark' 
                        ? language === 'rtl' ? '-translate-x-9 rotate-180' : 'translate-x-9 rotate-180'
                        : language === 'rtl' ? '-translate-x-1' : 'translate-x-1'
                }`}
            >
                {theme === 'dark' ? (
                    <FiMoon className="h-full w-full p-1.5 text-gray-800 transition-transform duration-500" />
                ) : (
                    <FiSun className="h-full w-full p-1.5 text-yellow-500 transition-transform duration-500" />
                )}
            </span>

            {/* Sun Rays (visible in light mode) */}
            <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
                theme === 'light' ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-yellow-500 transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 right-0 w-2 h-0.5 bg-yellow-500 transform -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-yellow-500 transform -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-0 w-2 h-0.5 bg-yellow-500 transform -translate-y-1/2"></div>
            </div>
        </button>
    )
}

export default DarkMode