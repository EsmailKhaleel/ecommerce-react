import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Wishlist from "../Wishlist/Wishlist";
import { 
    FaUserCircle, 
    FaEnvelope, 
    FaCalendarAlt, 
    FaCheckCircle, 
    FaHeart, 
    FaSignOutAlt,
} from "react-icons/fa";
import Spinner from "../../Components/Spinner";
import { useAuth } from "../../Context/useAuth";

function Account() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    if (!user || user === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <Spinner/>
            </div>
        );
    }

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FaUserCircle /> },
        { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-64 flex-shrink-0"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col space-y-4">
                            {/* Profile Summary */}
                            <div className="flex flex-col items-center space-y-4 mb-6">
                                <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-semibold overflow-hidden">
                                    {user.photoURL ? (
                                        <img 
                                            src={user.photoURL} 
                                            alt="profile" 
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'src/assets/personal.png';
                                            }}
                                        />
                                    ) : (
                                        <FaUserCircle className="text-4xl" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {user.displayName || user.email.split('@')[0]}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                                            activeTab === tab.id
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                >
                                    <span className="text-lg"><FaSignOutAlt /></span>
                                    <span>Sign Out</span>
                                </button>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1"
                    >
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <UserInfo 
                                                label="Display Name" 
                                                value={user.displayName || user.email.split('@')[0]}
                                                icon={<FaUserCircle />} 
                                            />
                                            <UserInfo 
                                                label="Email" 
                                                value={user.email} 
                                                icon={<FaEnvelope />} 
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <UserInfo 
                                                label="Account Created" 
                                                value={formatDate(user.metadata.creationTime)} 
                                                icon={<FaCalendarAlt />} 
                                            />
                                            <UserInfo 
                                                label="Last Sign In" 
                                                value={formatDate(user.metadata.lastSignInTime)} 
                                                icon={<FaCalendarAlt />} 
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <UserInfo 
                                                label="Email Verification" 
                                                value={user.emailVerified ? "Verified" : "Not Verified"} 
                                                icon={<FaCheckCircle />} 
                                                isVerified={user.emailVerified}
                                            />
                                            <UserInfo 
                                                label="Account Status" 
                                                value="Active" 
                                                icon={<FaCheckCircle />} 
                                                isVerified={true}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'wishlist' && 
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">

                                <Wishlist inAccount={true}/>
                            </div>
                            }

                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

const UserInfo = ({ label, value, icon, isVerified }) => (
    <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="text-primary dark:text-secondary text-lg">{icon}</div>
        <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <div className={`text-md font-semibold ${isVerified ? "text-green-600" : "text-gray-900 dark:text-white"}`}>
                {value}
            </div>
        </div>
    </div>
);

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export default Account;
