import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlistAsync, clearWishlistAsync } from "../../StateManagement/Slices/WishlistSlice";
import { useAuth } from "../../Context/useAuth"

export default function useWishlist() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: wishlist, status } = useSelector((state) => state.wishlist);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (user) dispatch(getWishlistAsync());
  }, [dispatch, user]);

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
    handleClearWishlist,
  };
}
