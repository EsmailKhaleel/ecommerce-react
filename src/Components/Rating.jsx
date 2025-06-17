import { BiStar, BiSolidStar } from 'react-icons/bi';

export const Rating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <span key={index} className="text-xl">
                    {index < Math.round(rating) ? (
                        <BiSolidStar className="text-primary" />
                    ) : (
                        <BiStar className="text-primary" />
                    )}
                </span>
            ))}
        </div>

    )
}
