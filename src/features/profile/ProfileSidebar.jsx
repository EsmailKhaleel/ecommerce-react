import { motion } from "framer-motion";
import { useAuth } from "../../Context/useAuth";
import { useNavigate } from "react-router-dom";
import { FaBox, FaHeart, FaSignOutAlt } from "react-icons/fa";
import ProfileAvatarUploader from "./ProfileAvatarUploader";


function ProfileSidebar({ activeTab, setActiveTab }) {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const tabs = [
        { id: 'orders', label: 'Orders', icon: <FaBox className={`${activeTab === 'orders' ? 'text-white' : 'text-primary'}`} /> },
        { id: 'wishlist', label: 'Wishlist', icon: <FaHeart className={`${activeTab === 'wishlist' ? 'text-white' : 'text-primary'}`} /> },
    ];
    return (
        <motion.aside
            key="profile-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 flex-shrink-0"
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">                
                <ProfileAvatarUploader />

                {/* Navigation Tabs */}
                <nav className="space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-accent-dark to-accent text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-medium"
                    >
                        <span className="text-lg"><FaSignOutAlt /></span>
                        <span>Sign Out</span>
                    </button>
                </nav>
            </div>
        </motion.aside>
    )
}

export default ProfileSidebar