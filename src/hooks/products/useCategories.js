import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/productsService";

export default function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 10 * 60 * 1000,
    });
}