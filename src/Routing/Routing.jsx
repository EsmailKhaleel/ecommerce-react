import Layout from '../Layout/Layout';
import Explore from '../Pages/Explore/Explore';
import About from '../Pages/About/About';
import NotFound from '../Pages/NotFound/NotFound';
import Products from '../Pages/Products/Products';
import { createBrowserRouter } from 'react-router-dom';
import Product from '../Components/ProductDetails';
import Cart from '../Pages/Cart/Cart';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import Account from '../Pages/Account/Account';
import ProtectedRoute from './ProtectedRoute';
import AddProduct from '../Pages/AddProduct/AddProduct';
import Wishlist from '../Pages/Wishlist/Wishlist';
import Checkout from '../Pages/Checkout/Checkout';
import Success from '../Pages/Checkout/Success';
// import LandingPage from '../Pages/LandingPage/LandingPage';

const routing = createBrowserRouter([
    {
        path: "", element: <Layout />,
        errorElement: <NotFound />,
        children: [
            // { index: true, element: <LandingPage /> },
            { index: true, element: <Explore /> },
            { path: "products", element: <Products /> },
            { path: "cart", element: <Cart /> },
            { path: "about", element: <About /> },
            { path: "wishlist", element: <Wishlist /> },
            { path: "products/:id", element: <Product /> },
            { path: "auth", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "addProduct", element: <AddProduct /> },
            { path: "checkout", element: <Checkout /> },
            { path: "checkout/success", element: <Success /> },
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