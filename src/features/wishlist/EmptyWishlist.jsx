import { BiHeart } from "react-icons/bi";
import { Link } from "react-router-dom";

function EmptyWishlist({ actionLabel, actionLink, message }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <BiHeart className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {message}
            </h2>
            <Link
                to={actionLink}
                className="text-primary hover:text-primary/80 transition-colors duration-200"
            >
                {actionLabel}
            </Link>
        </div>
    );
}

export default EmptyWishlist