import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReview } from "../../services/reviewsService";

export const useReviewMutation = (productId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", productId]);
      queryClient.invalidateQueries(["productRating", productId]);
    },
  });
};
