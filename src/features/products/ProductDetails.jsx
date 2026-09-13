import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BiError } from 'react-icons/bi';
import Reviews from '../../Components/Reviews';
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductGallery from "./ProductGallery";
import ProductDetailsSkeleton from "../../Components/ProductDetailsSkeleton";
import ProductInfo from "./ProductInfo";
import RelatedProductsCarousel from "./RelatedProductsCarousel";
import Expander from "../../Components/Expander";
import ProductActions from './ProductActions';
import MobileBackButton from '../../Components/MobileBackButton';
import useProduct from '../../hooks/products/useProduct';
import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

function ProductDetails() {
    const { id } = useParams();
    const { t } = useTranslation();

    // Query product details
    const { data: product = {}, error, isLoading } = useProduct(id);
    const [selectedVariantId, setSelectedVariantId] = useState('');
    useEffect(() => {
        setSelectedVariantId(product.variants?.[0]?._id || '');
    }, [product.variants]);
    useEffect(() => {
        if (id && localStorage.getItem('token')) axiosInstance.post(`/activities/track/product/${id}`).catch(() => {});
    }, [id]);
    const selectedVariant = product.variants?.find(variant => variant._id === selectedVariantId);

    if (isLoading) return (
        <div className="customer-page min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-4">
                <ProductDetailsSkeleton />
            </div>
        </div>
    );

    if (error) return (
        <div className="customer-page min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
        <div className="customer-page product-detail-page min-h-screen bg-gray-50 dark:bg-gray-900">
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
                            <ProductInfo product={product} selectedVariant={selectedVariant} />
                            <ProductActions product={product} selectedVariant={selectedVariant} selectedVariantId={selectedVariantId} onVariantChange={setSelectedVariantId} />
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
