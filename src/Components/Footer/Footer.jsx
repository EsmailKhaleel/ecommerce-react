import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Logo from "../../assets/logo.png";
import { motion } from "framer-motion";
import { staggerContainer } from "../../utils/motion";

function Footer() {
  const containerVariants = staggerContainer(0.2, 0.3);

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 mt-10 transition-all duration-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="container mx-auto px-5 lg:px-20"
      >
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {/* Logo & About */}
          <motion.div variants={itemVariants}>
            <img src={Logo} alt="logo" className="w-32 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              High-quality products at the best prices. Stay connected with us for the latest updates!
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-3 text-primary dark:text-secondary">Quick Links</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link to="/" className="hover:text-primary dark:hover:text-secondary">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary dark:hover:text-secondary">Products</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary dark:hover:text-secondary">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-primary dark:hover:text-secondary">Cart</Link></li>
              <li><Link to="/auth" className="hover:text-primary dark:hover:text-secondary">Login</Link></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-3 text-primary dark:text-secondary">Contact Us</h3>
            <p className="text-gray-600 dark:text-gray-400">📍 123 Street, Cairo, Egypt</p>
            <p className="text-gray-600 dark:text-gray-400">📞 +20 102 454 8567</p>
            <p className="text-gray-600 dark:text-gray-400 flex items-center">
              ✉ <a href="mailto:esmailkhaleel27@gmail.com" className="ml-2 hover:text-primary dark:hover:text-secondary">esmailkhaleel27@gmail.com</a>
            </p>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-3 text-primary dark:text-secondary">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Subscribe to get the latest updates and offers.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="px-4 py-2 w-full rounded-l-md text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none" />
              <button className="bg-primary dark:bg-secondary text-white px-4 rounded-r-md hover:bg-secondary dark:hover:bg-primary transition">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        {/* Social Media */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-6 space-x-5"
        >
          <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary text-2xl"><FaFacebookF /></a>
          <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary text-2xl"><FaTwitter /></a>
          <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary text-2xl"><FaInstagram /></a>
          <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary text-2xl"><FaLinkedin /></a>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6"
        >
          &copy; {new Date().getFullYear()} Esmail Khaleel. All rights reserved.
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default Footer;
