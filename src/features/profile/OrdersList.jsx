import { motion } from "framer-motion"
import OrderCard from "./OrderCard"
import { useSelector } from "react-redux";
import Spinner from "../../Components/Spinner";
import { FaBox } from "react-icons/fa";

function OrdersList() {
    const { items: orders, status: ordersStatus } = useSelector(state => state.orders);
    return (
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
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
            )}
        </motion.div>
    )
}

export default OrdersList