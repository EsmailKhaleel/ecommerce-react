import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { clearCartAsync } from "../../StateManagement/Slices/CartSlice";
import { useAuth } from "../../Context/useAuth";
import { createCheckoutSession } from "../../services/api";

export default function useCheckout() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const cartItems = useSelector((state) => state.cart.items);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Stripe redirect outcomes
  useEffect(() => {
    const handleSuccess = async () => {
      if (
        location.pathname === "/checkout/success" ||
        window.location.href.includes("/checkout/success")
      ) {
        toast.success("Payment successful! Your order has been placed.");
        try {
          await dispatch(clearCartAsync()).unwrap();
        } catch (error) {
          console.error('Failed to clear cart:', error);
          toast.error('Failed to clear cart');
        }
        navigate("/", { replace: true });
      }
    };
    
    handleSuccess();

    if (
      (location.pathname === "/cart" &&
        searchParams.get("canceled") === "true") ||
      window.location.href.includes("/cart?canceled=true")
    ) {
      toast.info(
        "Order canceled -- continue shopping and checkout when ready."
      );
      navigate("/cart", { replace: true });
    }
  }, [dispatch, navigate, location, searchParams]);

  const handleCheckout = async () => {
    if (!user || isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await createCheckoutSession(cartItems, user);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error.response?.data?.error || "Error creating checkout session"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleCheckout, isProcessing };
}
