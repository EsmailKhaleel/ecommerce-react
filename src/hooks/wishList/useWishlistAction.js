import { toast } from "react-toastify";
import { useAuth } from "../../Context/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toggleWishlistItemAsync } from "../../StateManagement/Slices/WishlistSlice";

export default function useWishlistActions(id) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistLoadingItems = useSelector(
    (state) => state.wishlist.loadingItems
  );
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const isWishlistLoading = wishlistLoadingItems[id];

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error(t("auth.loginRequired"));
      navigate("/auth");
      return;
    }

    if (isWishlistLoading) return;

    try {
      await dispatch(toggleWishlistItemAsync(id)).unwrap();
      toast.success(
        wishlistItems.some((item) => item.id === id)
          ? t("common.removedFromWishlist")
          : t("common.addedToWishlist")
      );
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error(t("common.failedToUpdateWishlist"));
    }
  };

  return {
    handleToggleWishlist,
    isWishlistLoading,
  };
}
