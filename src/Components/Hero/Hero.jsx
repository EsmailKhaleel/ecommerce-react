import { useState, useEffect } from 'react';
import Img1 from '../../assets/sale.png'
import Img2 from '../../assets/shopping.png'
import Img3 from '../../assets/women.png'

const ImageList = [
    {
        id:1,
        img:Img1,
        title:"50% off on all products sale",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero quisquam tempore repellat eligendi natus? Pariatur quam cupiditate assumenda. Corporis nam culpa accusamus ad quod, fugiat sit pariatur quisquam doloremque fuga!"
    },
    {
        id:2,
        img:Img2,
        title:"70% off on all products sale",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero quisquam tempore repellat eligendi natus? Pariatur quam cupiditate assumenda. Corporis nam culpa accusamus ad quod, fugiat sit pariatur quisquam doloremque fuga!"
    },
    {
        id:3,
        img:Img3,
        title:"30% off on all women wear",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero quisquam tempore repellat eligendi natus? Pariatur quam cupiditate assumenda. Corporis nam culpa accusamus ad quod, fugiat sit pariatur quisquam doloremque fuga!"
    },
];

function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % ImageList.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-[100vw] min-h-[400px] sm:min-h-[650px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
            {/* Background decorative elements */}
            <div className="h-[500px] w-[500px] bg-primary/30 dark:bg-primary/20 absolute rotate-45 -top-52 -right-52 rounded-3xl z-0 blur-2xl"></div>
            <div className="h-[300px] w-[300px] bg-secondary/20 dark:bg-secondary/10 absolute -rotate-12 -bottom-20 -left-20 rounded-full z-0 blur-xl"></div>

            {/* Carousel content */}
            <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 py-12 px-4">
                {/* Text content */}
                <div className="flex-1 text-center md:text-left space-y-6">
                    <span className="inline-block px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary rounded-full text-sm font-medium mb-2 animate-pulse">
                        Special Offer
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 dark:text-white leading-tight">
                        {ImageList[currentSlide].title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                        {ImageList[currentSlide].description}
                    </p>
                </div>

                {/* Image with enhanced styling */}
                <div className="flex-1 transform hover:scale-105 transition-transform duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent dark:from-primary/10 rounded-lg"></div>
                        <img 
                            src={ImageList[currentSlide].img} 
                            alt={ImageList[currentSlide].title}
                            className="w-full max-w-[500px] h-auto object-cover rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* Enhanced dots navigation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                {ImageList.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentSlide === index 
                            ? 'bg-primary w-6' 
                            : 'bg-gray-400 hover:bg-primary/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
  

export default Hero