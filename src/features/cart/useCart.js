import { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { getCartAsync } from "../../StateManagement/Slices/CartSlice";
import { toast } from "react-toastify";

export function useCart() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dispatch(getCartAsync())
        .unwrap()
        .catch(() => toast.error("Error loading cart"))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user, dispatch]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartItemsNumber = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return { items, isLoading, totalPrice, cartItemsNumber };
}
