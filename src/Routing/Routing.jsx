import Layout from '../Layout/Layout';
import Explore from '../Pages/Explore/Explore';
import About from '../Pages/About/About';
import NotFound from '../Pages/NotFound/NotFound';
import Products from '../Pages/Products/Products';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Cart from '../Pages/Cart/Cart';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import Account from '../Pages/Account/Account';
import ProtectedRoute from './ProtectedRoute';
import AddProduct from '../Pages/AddProduct/AddProduct';
import Wishlist from '../Pages/Wishlist/Wishlist';
import Checkout from '../Pages/Checkout/Checkout';
import Success from '../Pages/Checkout/Success';
import LandingPage from '../Pages/LandingPage/LandingPage';
import AuthSuccess from '../Pages/AuthSuccess/AuthSuccess';
import AuthError from '../Pages/AuthError/AuthError';
import ProductDetails from '../features/products/ProductDetails';

const routing = createBrowserRouter([
    {
        path: "", element: <Layout />,
        errorElement: <NotFound />,
        children: [
            { path: "landing", element: <LandingPage /> },
            { index: true, element: <Explore /> },
            { path: "products", element: <Products /> },
            { path: "cart", element: <Cart /> },
            { path: "about", element: <About /> },
            { path: "wishlist", element: <Wishlist /> },
            { path: "products/:id", element: <ProductDetails /> },
            { path: "auth", element: <Login /> },
            { path: "login", element: <Navigate to="/auth" replace /> },
            { path: "register", element: <Register /> },
            { path: "addProduct", element: <AddProduct /> },
            { path: "checkout", element: <Checkout /> },
            { path: "checkout/success", element: <Success /> },
            { path: "auth/success", element: <AuthSuccess /> },
            { path: "auth/error", element: <AuthError /> },
            {
                path: "account",
                element: <ProtectedRoute>
                    <Account />
                </ProtectedRoute>,
            },
            { path: "*", element: <NotFound /> }
        ]
    }
]);

export default routing;