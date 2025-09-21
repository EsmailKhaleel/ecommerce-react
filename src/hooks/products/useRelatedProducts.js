import { useQuery } from "@tanstack/react-query";
import { getRelatedProducts } from "../../services/productsService";
export default function useRelatedProducts(product) {
  return useQuery({
    queryKey: ["relatedProducts", product?.category],
    queryFn: () => getRelatedProducts(product),
    enabled: !!product?.category,
  });
}
