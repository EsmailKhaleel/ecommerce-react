import { useDispatch, useSelector } from 'react-redux';
import { toggleSection } from '../../StateManagement/Slices/FilterSlice';
import { setSelectedRating } from '../../StateManagement/Slices/FilterSlice';
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { Rating } from '../../Components/Rating';

function RatingFilter({ setShowFilters }) {
    const dispatch = useDispatch();
    const { selectedRating, expandedSections } = useSelector((state) => state.filters);
    return (<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <button
            onClick={() => dispatch(toggleSection('rating'))}
            className="w-full flex items-center justify-between text-base font-semibold text-gray-900 dark:text-white mb-2 py-1"
        >
            Rating
            {expandedSections.rating ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
        </button>
        <AnimatePresence>
            {expandedSections.rating && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 overflow-hidden"
                >
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => {
                                const newRating = selectedRating === rating ? null : rating;
                                dispatch(setSelectedRating(newRating));
                                if (window.innerWidth < 1024) {
                                    setShowFilters(false);
                                }
                            }}
                            className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors duration-200 ${selectedRating === rating ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <Rating rating={rating} />
                            <span className="text-sm">Up to {rating} stars</span>
                        </button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
    )
}

export default RatingFilter