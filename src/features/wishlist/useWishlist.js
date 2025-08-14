import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getWishlistAsync, toggleWishlistItemAsync, clearWishlistAsync } from "../../StateManagement/Slices/WishlistSlice";
import { useAuth } from "../../Context/useAuth";

export default function useWishlist() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: wishlist, status } = useSelector((state) => state.wishlist);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (user) dispatch(getWishlistAsync());
  }, [dispatch, user]);

  const handleToggleWishlist = useCallback(async (productId) => {
    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }
    if (status.toggleItem === "loading") return;
    try {
      await dispatch(toggleWishlistItemAsync(productId)).unwrap();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  }, [dispatch, status.toggleItem, user]);

  const handleClearWishlist = useCallback(async () => {
    if (status.clearWishlist === "loading") return;
    try {
      await dispatch(clearWishlistAsync()).unwrap();
      setShowConfirmClear(false);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  }, [dispatch, status.clearWishlist]);

  return {
    user,
    wishlist,
    status,
    showConfirmClear,
    setShowConfirmClear,
    handleToggleWishlist,
    handleClearWishlist,
  };
}
