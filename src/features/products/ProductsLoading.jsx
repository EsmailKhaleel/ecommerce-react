import ProductCardSkeleton from '../../Components/ProductCardSkeleton';

function ProductsLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}

export default ProductsLoading;
