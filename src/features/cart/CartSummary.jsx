import { PiExclamationMarkFill } from "react-icons/pi";
import useCheckout from "./useCheckout";
import Payment from '../../assets/payment.png';

function CartSummary({ totalPrice, cartItemsNumber }) {
    const { handleCheckout, isProcessing } = useCheckout();

    return (
        <div className="w-full lg:w-1/3 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md h-fit">
            <h3 className="text-2xl font-bold mb-4">Checkout Summary</h3>
            <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                    <span>Items ({cartItemsNumber}):</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex gap-2 items-center mb-2 mx-auto text-sm dark:text-white">
                <PiExclamationMarkFill />
                Tax Included.
            </div>
            <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-black text-white py-3 rounded-md mb-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                {isProcessing ? (
                    <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        <span>Processing...</span>
                    </>
                ) : (
                    'Proceed to Checkout'
                )}
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure checkout powered by Stripe
                </p>
                <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    SSL encrypted payment
                </p>
                <img src={Payment} alt="Payment" className="w-full" />
            </div>
        </div>
    )
}

export default CartSummary