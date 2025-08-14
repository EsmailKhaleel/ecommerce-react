import { format } from "../../utils/helpers"

function OrderCard({ order }) {
    return (
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
    );
}

export default OrderCard