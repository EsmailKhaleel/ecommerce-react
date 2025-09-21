import { useQuery } from "@tanstack/react-query"
import { getProductReviews } from "../../services/reviewsService"

export const useReviews = (productId) => {
    return useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => getProductReviews(productId),
        staleTime: 30000,
        cacheTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}