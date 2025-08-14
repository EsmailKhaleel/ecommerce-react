import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Wishlist from "../Wishlist/Wishlist";
import SpinnerBig from "../../Components/SpinnerBig";
import { useAuth } from "../../Context/useAuth";
import { useDispatch } from "react-redux";
import { getUserOrdersAsync } from "../../StateManagement/Slices/OrdersSlice";
import ProfileSidebar from "../../features/profile/ProfileSidebar";
import OrdersList from "../../features/profile/OrdersList";

function Account() {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        if (user?._id && activeTab === 'orders') {
            dispatch(getUserOrdersAsync(user._id));
        }
    }, [dispatch, user?._id, activeTab]);

    if (!user) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <SpinnerBig />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1"
                    >
                        {activeTab === 'orders' && (<OrdersList />)}

                        {activeTab === 'wishlist' && (<Wishlist />)}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Account;