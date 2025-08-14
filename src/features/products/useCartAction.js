import { toast } from "react-toastify";
import { useAuth } from "../../Context/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { addToCartAsync } from "../../StateManagement/Slices/CartSlice";

export default function useCartAction(id) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartLoadingItems = useSelector((state) => state.cart.loadingItems);
  const isCartLoading = cartLoadingItems[id];

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
      toast.success(t("common.addedToCart"));
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error(t("common.failedToAddToCart"));
    }
  };
    

  return {
    handleAddToCart,
    isCartLoading
  };
}
