import { useQuery } from "@tanstack/react-query";
import { getGroupedProducts } from "../../services/productsService";

export default function useProductsByCategory()  {
  return useQuery({
    queryKey: ['products', 'grouped'],
    queryFn: getGroupedProducts,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};