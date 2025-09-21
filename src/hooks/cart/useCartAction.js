import { toast } from "react-toastify";
import { useAuth } from "../../Context/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { addToCartAsync, getCartAsync, removeFromCartAsync } from "../../StateManagement/Slices/CartSlice";
import { useState } from "react";

export default function useCartAction(id) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartLoadingItems = useSelector((state) => state.cart.loadingItems);
  const isCartLoading = cartLoadingItems[id];
  const [isRemoving, setIsRemoving] = useState(false);

  const handleAddToCart = async (newQuantity) => {
    if (!user) {
      toast.error(t("auth.loginToAddToCart"));
      navigate("/auth");
      return;
    }

    if (isCartLoading) return;

    try {
      await dispatch(
        addToCartAsync({
          productId: id,
          quantity: newQuantity,
        })
      ).unwrap();
      await dispatch(getCartAsync()).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleRemoveCartItem = async () => {
    if (!user) {
      toast.error("Please login to manage your cart");
      navigate("/auth");
      return;
    }

    if (isRemoving) return;
    setIsRemoving(true);

    try {
      await dispatch(removeFromCartAsync(id)).unwrap();
      await dispatch(getCartAsync()).unwrap();
    } catch (error) {
      toast.error(error.message || "Failed to remove item");
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    handleAddToCart,
    isCartLoading,
    handleRemoveCartItem,
    isRemoving
  };
}
