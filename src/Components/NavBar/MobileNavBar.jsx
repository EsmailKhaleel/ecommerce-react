import ProfileDrawer from './ProfileDrawer'
import MenuList from './MenuList'
import DrawerHeading from './DrawerHeading';
import DarkMode from './DarkMode'
import { motion } from 'framer-motion';
import { LanguageContext } from '../../Context/LanguageContext';
import { useContext } from 'react';
import { useSelector } from 'react-redux';

function MobileNavBar() {
    const { language, handleChangeLanguage } = useContext(LanguageContext);
    const { isProfileDrawerOpen } = useSelector((state) => state.drawer);

    return (
        <div className="relative h-full p-6 sm:w-80 w-[280px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg overflow-hidden">
            <DrawerHeading />
            {/* Main Menu List in Drawer */}
            {!isProfileDrawerOpen && (
                <motion.div
                    initial={{ opacity: 0, x: -200 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    transition={{ duration: 0.3 }}
                >
                    <MenuList inDrawer={true} />
                </motion.div>
            )}
            {isProfileDrawerOpen && (
                <motion.div
                    initial={{ opacity: 0, x: -200 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    transition={{ duration: 0.3 }}
                >
                    <ProfileDrawer />
                </motion.div>
            )}
            {/* Settings Section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={handleChangeLanguage}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        {language === 'ltr' ? 'English' : 'العربية'}
                    </button>
                    <DarkMode />
                </div>
            </div>
        </div>
    );
}

export default MobileNavBar