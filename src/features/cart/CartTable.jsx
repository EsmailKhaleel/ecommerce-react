import CartItem from "../../Components/CartItem";

function CartTable({ cartItems }) {
    return (
        <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Shopping Cart</h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="py-3 px-2 text-left">Product</th>
                            <th className="py-3 px-2 text-center">Price</th>
                            <th className="py-3 px-2 text-center">Total</th>
                            <th className="py-3 px-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {cartItems.map(item => (
                            <CartItem key={item._id} cartItem={item} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>)
}

export default CartTable