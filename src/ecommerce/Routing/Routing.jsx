import React from 'react'
import Layout from '../Layout/Layout';
import Explore from '../Pages/Explore/Explore';
import About from '../Pages/About/About';
import Contacts from '../Pages/Contacts/Contacts';
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

const routing = createBrowserRouter([
    {
        path: "", element: <Layout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Explore /> },
            { path: "products", element: <Products /> },
            { path: "cart", element: <Cart /> },
            { path: "about", element: <About /> },
            { path: "contacts", element: <Contacts /> },
            { path: "products/:id", element: <Product /> },
            { path: "auth", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "addProduct", element: <AddProduct /> },
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