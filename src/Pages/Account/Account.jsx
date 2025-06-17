import { useState, useEffect } from "react";
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
    FaBox,
} from "react-icons/fa";

import Spinner from "../../Components/Spinner";
import { useAuth } from "../../Context/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrdersAsync } from "../../StateManagement/Slices/OrdersSlice";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import PlaceHolder from "../../assets/placeholder.jpg";

function Account() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('profile');
    const [isUploading, setIsUploading] = useState(false);
    const { items: orders, status: ordersStatus } = useSelector(state => state.orders);

    useEffect(() => {
        if (user?._id && activeTab === 'orders') {
            dispatch(getUserOrdersAsync(user._id));
        }
    }, [dispatch, user?._id, activeTab]);

    if (!user || user === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <Spinner />
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

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
                toast.error('Only JPG, PNG and WebP images are allowed');
                return;
            }

            setIsUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            const response = await axiosInstance.post('/auth/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.data?.status === true) {
                // Update user image in the context
                user.image = response.data.image;
                toast.success('Profile picture updated successfully!');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FaUserCircle className={`${activeTab === 'profile' ? 'text-white' : 'text-primary'}`} /> },
        { id: 'orders', label: 'Orders', icon: <FaBox className={`${activeTab === 'orders' ? 'text-white' : 'text-primary'}`} /> },
        { id: 'wishlist', label: 'Wishlist', icon: <FaHeart className={`${activeTab === 'wishlist' ? 'text-white' : 'text-primary'}`} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-80 flex-shrink-0"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                            {/* Profile Summary */}
                            <div className="flex flex-col items-center space-y-2">
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        id="imageUpload"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />

                                    {/* Main Avatar Container */}
                                    <label
                                        htmlFor="imageUpload"
                                        className="relative block w-32 h-32 rounded-full cursor-pointer transform transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                                    >
                                        {/* Gradient Border */}
                                        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary via-secondary to-background p-0.5">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center space-y-2">
                                                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Uploading...</span>
                                                    </div>
                                                ) : user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={`${user.name}'s profile`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = PlaceHolder;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                                        <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hover Overlay with Camera Icon */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-full flex items-center justify-center transition-all duration-300">
                                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </label>

                                </div>

                                {/* User Info */}
                                <div className="text-center space-y-1">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        {user.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium">{user.email}</p>
                                </div>

                                {/* Upload Hint */}
                                <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Click avatar to update photo
                                    </p>
                                </div>
                            </div>

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
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8"
                                >
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile Information</h2>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <UserInfo
                                                label="Name"
                                                value={user.name}
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
                                                value={format(user.createdAt)}
                                                icon={<FaCalendarAlt />}
                                            />
                                            <UserInfo
                                                label="Role"
                                                value={user.role}
                                                icon={<FaCheckCircle />}
                                                isVerified={true}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8"
                                >
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h2>
                                    {ordersStatus === 'loading' ? (
                                        <div className="flex justify-center py-12">
                                            <div className="w-12 h-12">
                                                <Spinner />
                                            </div>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                                <FaBox className="text-3xl text-gray-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                When you place an order, it will appear here.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {orders.map((order) => (
                                                <div
                                                    key={order._id}
                                                    className="border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
                                                >
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                Order #{order._id.slice(-8)}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                {format(order.createdAt)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                                order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                            <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                                                                ${order.totalAmount.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {order.products.map((item) => (
                                                            <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-16 h-16 object-cover rounded-lg"
                                                                />
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                        {item.name}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        Qty: {item.quantity} × ${item.price}
                                                                    </p>
                                                                </div>
                                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                                    ${(item.quantity * item.price).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="mt-6 pt-4 border-t dark:border-gray-700">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Payment Status:
                                                                <span className={`ml-2 font-medium ${order.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                                                                    }`}>
                                                                    {order.paymentStatus}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'wishlist' && (
                                <motion.div
                                    key="wishlist"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8"
                                >
                                    <Wishlist inAccount={true} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

const UserInfo = ({ label, value, icon, isVerified }) => (
    <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
        <div className="text-primary dark:text-primary text-2xl">{icon}</div>
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
            <div className={`text-lg font-semibold ${isVerified ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                {value}
            </div>
        </div>
    </div>
);

const format = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

export default Account;