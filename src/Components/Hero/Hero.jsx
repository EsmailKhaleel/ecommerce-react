import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { heroVariants, fadeIn, zoomIn } from '../../utils/motion';
import Img1 from '../../assets/banner1.png'
import Img2 from '../../assets/banner2.png'
import Img3 from '../../assets/banner3.png'
import Img4 from '../../assets/banner4.png'

const ImageList = [
    {
        id: 3,
        img: Img3,
        title: "30% Off Fresh Groceries - Farm to Table",
        description: "Stock up on fresh, organic produce, pantry essentials, and gourmet ingredients delivered straight to your door. Local sourcing, eco-friendly packaging, and premium quality at everyday low prices. Make every meal special with our curated selection."
    },
    {
        id: 1,
        img: Img1,
        title: "50% Off Digital Essentials - Limited Time!",
        description: "Transform your digital lifestyle with our premium collection of software, apps, and digital tools. From productivity suites to creative software, gaming accessories to smart home devices - everything you need to stay ahead in the digital world at unbeatable prices."
    },
    {
        id: 2,
        img: Img2,
        title: "70% Off Fashion Forward - Style Revolution",
        description: "Discover the latest trends in men's and women's fashion. From casual streetwear to elegant formal wear, sustainable basics to statement pieces. Premium quality fabrics, contemporary designs, and sizes for everyone. Elevate your wardrobe without breaking the bank."
    },
    {
        id: 4,
        img: Img4,
        title: "40% Off Home & Furniture - Design Your Space",
        description: "Create your dream home with our extensive collection of modern furniture, home decor, and lifestyle accessories. From minimalist essentials to luxury statement pieces. Quality craftsmanship, contemporary designs, and fast delivery to transform any space."
    }
];

function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % ImageList.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div 
            style={{ opacity, scale }}
            variants={heroVariants}
            initial="hidden"
            animate="show"
            className="relative w-full max-w-[100vw] min-h-[200px] sm:min-h-[250px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden"
        >
            {/* Background decorative elements */}
            <motion.div 
                variants={fadeIn("right", "spring", 0.2, 1.5)}
                className="h-[300px] w-[300px] bg-primary/20 dark:bg-primary/10 absolute rotate-45 -top-32 -right-32 rounded-3xl z-0"
            />
            <motion.div 
                variants={fadeIn("left", "spring", 0.4, 1.5)}
                className="h-[200px] w-[200px] bg-secondary/20 dark:bg-secondary/10 absolute -rotate-12 -bottom-12 -left-12 rounded-full z-0"
            />

            {/* Carousel content */}
            <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-center gap-8 py-8 px-4">
                {/* Text content */}
                <motion.div 
                    variants={fadeIn("left", "spring", 0.6, 1.5)}
                    className="flex-1 text-center md:text-left space-y-4"
                >
                    <motion.span 
                        variants={zoomIn(0.8, 1)}
                        className="inline-block px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary rounded-full text-sm font-medium mb-2 animate-pulse"
                    >
                        Special Offer
                    </motion.span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white leading-tight">
                        {ImageList[currentSlide].title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-base max-w-2xl">
                        {ImageList[currentSlide].description}
                    </p>
                </motion.div>

                {/* Image with enhanced styling */}
                <motion.div 
                    variants={fadeIn("right", "spring", 1, 1.5)}
                    className="flex-1 transform hover:scale-105 transition-transform duration-500"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent dark:from-primary/10 rounded-lg"></div>
                        <img 
                            src={ImageList[currentSlide].img} 
                            alt={ImageList[currentSlide].title}
                            className="w-full max-w-[400px] h-auto object-cover rounded-lg shadow-2xl"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Enhanced dots navigation */}
            <motion.div 
                variants={fadeIn("up", "spring", 1.2, 1.5)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3"
            >
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
            </motion.div>
        </motion.div>
    );
}

export default Hero