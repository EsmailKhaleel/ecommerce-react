import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../services/productsService";

export default function useProduct(productId) {
    return useQuery({
        queryKey: ["product", productId],
        queryFn: () => getProduct( productId),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: !!productId
    });
}