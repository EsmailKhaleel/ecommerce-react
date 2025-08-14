import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BiError } from 'react-icons/bi';
import Reviews from '../../Components/Reviews';
import useProduct from "./useProduct";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductGallery from "./ProductGallery";
import ProductDetailsSkeleton from "../../Components/ProductDetailsSkeleton";
import ProductInfo from "./ProductInfo";
import RelatedProductsCarousel from "./RelatedProductsCarousel";
import Expander from "../../Components/Expander";
import ProductActions from './ProductActions';
import MobileBackButton from '../../Components/MobileBackButton';

function ProductDetails() {
    const { id } = useParams();
    const { t } = useTranslation();

    // Query product details
    const { data: product = {}, error, isLoading } = useProduct(id);

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-4">
                <ProductDetailsSkeleton />
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <BiError className="mx-auto text-red-500 text-4xl mb-2" />
                <p className="text-red-500">{t('common.errorLoadingProduct')}</p>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <MobileBackButton />
            <div className="container mx-auto px-4 py-4">
                <ProductBreadcrumbs {...product} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ProductGallery product={product} />
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="order-2 lg:order-2 lg:sticky lg:top-8 lg:self-start"
                    >
                        <div className="rounded-lg p-4 lg:p-6">
                            <ProductInfo product={product} />
                            <ProductActions product={product} />
                        </div>
                    </motion.div>
                </div>
                <Expander title="Product Details" details={product.description} />
                <RelatedProductsCarousel product={product} />
                <Reviews productId={product.id} />
            </div>
        </div>
    );
}

export default ProductDetails;
