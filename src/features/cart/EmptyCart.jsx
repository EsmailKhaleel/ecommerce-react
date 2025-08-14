import Cart from '../../assets/emptyCart.png';

function EmptyCart({ onAction, actionLabel, message }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <img src={Cart} alt="Empty Cart" className="w-64 h-64 mb-8" />
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">{message}</h2>
            <button
                onClick={onAction}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
            >
                {actionLabel}
            </button>
        </div>
    )
}

export default EmptyCart