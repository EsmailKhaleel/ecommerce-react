import { format } from "../../utils/helpers"
import { motion, AnimatePresence } from "framer-motion"
import { FaChevronDown, FaBox, FaClock, FaMoneyBillWave } from "react-icons/fa"

function OrderCard({ order, isOpen, onToggle }) {
    return (
        <motion.div
            key={order._id}
            className={`rounded-xl p-6 transition-all duration-300 bg-gray-100 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 ${
                isOpen 
                    ? 'ring-1 ring-gray-200 dark:ring-gray-700' 
                    : 'hover:border-gray-200 dark:hover:border-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            layout
        >
            <div 
                className="flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer group"
                onClick={onToggle}
            >
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <FaBox className="text-primary group-hover:text-primary-dark dark:group-hover:text-primary-light" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Order #{order._id.slice(-8)}
                        </h3>
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="inline-block text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                        >
                            <FaChevronDown />
                        </motion.div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <FaClock className="text-gray-400" />
                            <span>{format(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaMoneyBillWave className="text-gray-400" />
                            <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                        order.status === 'processing' 
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-600/20' 
                            : order.status === 'completed' 
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 ring-1 ring-green-600/20' 
                                : 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 ring-1 ring-gray-600/20'
                    }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="mt-6 space-y-4"
                        >
                            {order.products.map((item) => (
                                <motion.div
                                    key={item._id}
                                    className="group/item flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                    layout
                                >
                                    <div className="relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover/item:shadow-md transition-shadow duration-200"
                                        />
                                        <div className="absolute -top-2 -right-2 bg-gray-700 dark:bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Unit Price: ${item.price}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Total for item
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="mt-6 pt-6 border-t dark:border-gray-700 pb-1"
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Payment Status
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                                        order.paymentStatus === 'paid' 
                                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 ring-1 ring-green-600/20' 
                                            : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 ring-1 ring-yellow-600/20'
                                    }`}>
                                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Order Total:
                                    </span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        ${order.totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default OrderCard