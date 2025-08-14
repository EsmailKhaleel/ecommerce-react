import { motion } from "framer-motion"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ProductBreadcrumbs({ category, name }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="hidden lg:block mb-4"
        >
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                    <button
                        onClick={() => navigate('/')}
                        className="hover:text-primary transition-colors"
                    >
                        {t('navigation.home')}
                    </button>
                </li>
                <li>/</li>
                <li>
                    <button
                        onClick={() => navigate('/products')}
                        className="hover:text-primary transition-colors"
                    >
                        {t('navigation.products')}
                    </button>
                </li>
                <li>/</li>
                <li>
                    <button
                        onClick={() => navigate(`/products?category=${category}`)}
                        className="hover:text-primary transition-colors capitalize"
                    >
                        {t(`products.categories.${category.toLowerCase()}`, category)}
                    </button>
                </li>
                <li>/</li>
                <li className="text-gray-800 dark:text-white font-medium truncate max-w-[200px]">
                    {name}
                </li>
            </ol>
        </motion.nav>
    )
}

export default ProductBreadcrumbs