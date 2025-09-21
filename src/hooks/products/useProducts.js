import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../StateManagement/Slices/ProductsSlice';

export function useProducts() {
    const dispatch = useDispatch();
    const { products, status, error, page, totalPages } = useSelector((state) => state.products);
    const {
        searchTerm,
        selectedCategory,
        sortOrder,
        selectedPriceRange,
        selectedRating,
    } = useSelector((state) => state.filters);

    const [noResults, setNoResults] = useState(false);

    // Ensuring we have valid pagination values
    const currentPage = Math.max(1, page || 1);
    const totalPagesCount = Math.max(0, totalPages || 0);

    const fetchProductsWithFilters = useCallback((page = 1) => {
        dispatch(fetchProducts({
            page,
            limit: 8,
            category: selectedCategory !== "All" ? selectedCategory : undefined,
            q: searchTerm || undefined,
            _sort: "price",
            _order: sortOrder,
            minPrice: selectedPriceRange?.min,
            maxPrice: selectedPriceRange?.max,
            rating: selectedRating ? Number(selectedRating) : undefined
        }));
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, [dispatch, selectedCategory, searchTerm, sortOrder, selectedPriceRange, selectedRating]);

    const handlePageChange = ({ selected }) => {
        fetchProductsWithFilters(selected + 1);
    };

    // Fetch products when filters change
    useEffect(() => {
        fetchProductsWithFilters(1);
    }, [fetchProductsWithFilters]);

    useEffect(() => {
        setNoResults(products.length === 0 && status !== "loading");
    }, [products, status]);

    return {
        products,
        status,
        error,
        noResults,
        currentPage,
        totalPagesCount,
        handlePageChange
    };
}
