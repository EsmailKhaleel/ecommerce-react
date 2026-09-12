import { motion } from "framer-motion"
import OrderCard from "./OrderCard"
import { useDispatch, useSelector } from "react-redux";
import { getUserOrdersAsync } from '../../StateManagement/Slices/OrdersSlice';
import Spinner from "../../Components/Spinner";
import { FaBox } from "react-icons/fa";
import { useState } from "react";

function OrdersList() {
    const { items: orders, status: ordersStatus, error, page, totalPages } = useSelector(state => state.orders);
    const dispatch = useDispatch();
    const [openOrderId, setOpenOrderId] = useState(null);
    return (
        <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8"
        >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h2>
            {ordersStatus === 'failed' ? <div role="alert"><p>{error}</p><button onClick={() => dispatch(getUserOrdersAsync({ page }))}>Retry</button></div> : ordersStatus === 'loading' ? (
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
                <div className="space-y-8">
                    {orders.map((order) => (
                        <OrderCard 
                            key={order._id} 
                            order={order}
                            isOpen={openOrderId === order._id}
                            onToggle={() => setOpenOrderId(openOrderId === order._id ? null : order._id)}
                        />
                    ))}
                </div>
            )}
            {totalPages > 1 && <nav aria-label="Order pages" className="flex justify-between mt-6">
                <button disabled={page <= 1 || ordersStatus === 'loading'} onClick={() => dispatch(getUserOrdersAsync({ page: page - 1 }))}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages || ordersStatus === 'loading'} onClick={() => dispatch(getUserOrdersAsync({ page: page + 1 }))}>Next</button>
            </nav>}
        </motion.div>
    )
}

export default OrdersList