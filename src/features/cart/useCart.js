import { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { getCartAsync } from "../../StateManagement/Slices/CartSlice";
import { toast } from "react-toastify";

export function useCart() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { items, error, status } = useSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      dispatch(getCartAsync())
        .unwrap()
        .catch(() => toast.error("Error loading cart"))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user, dispatch]);

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity,
    0
  );

  const cartItemsNumber = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return { items, isLoading, error: status.getCart === 'failed' ? error : null, totalPrice, cartItemsNumber };
}
