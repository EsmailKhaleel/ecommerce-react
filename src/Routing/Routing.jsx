import { lazy, Suspense } from 'react';
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
import Success from '../Pages/Checkout/Success';
import AuthSuccess from '../Pages/AuthSuccess/AuthSuccess';
import AuthError from '../Pages/AuthError/AuthError';
import ProductDetails from '../features/products/ProductDetails';
import SpinnerBig from '../Components/SpinnerBig';
import ForgotPassword from '../Pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../Pages/ResetPassword/ResetPassword';
import AdminRoleRoute from '../features/admin/AdminRoleRoute';

// The admin area pulls in MUI, DataGrid and charts, so it is code-split away
// from the customer bundle and only downloaded by admins who visit /admin.
const AdminLayout = lazy(() => import('../features/admin/AdminLayout'));
const AdminHome = lazy(() => import('../features/admin/AdminHome'));
const AdminProducts = lazy(() => import('../Pages/Admin/AdminProducts'));
const AdminOrders = lazy(() => import('../Pages/Admin/AdminOrders'));
const AdminCustomers = lazy(() => import('../Pages/Admin/AdminCustomers'));
const AdminInventory = lazy(() => import('../Pages/Admin/AdminInventory'));
const AdminCoupons = lazy(() => import('../Pages/Admin/AdminCoupons'));
const AdminReviews = lazy(() => import('../Pages/Admin/AdminReviews'));
const AdminAnalytics = lazy(() => import('../Pages/Admin/AdminAnalytics'));
const AdminInvoices = lazy(() => import('../Pages/Admin/AdminInvoices'));
const AdminOperations = lazy(() => import('../Pages/Admin/AdminOperations'));
const AdminProcurement = lazy(() => import('../Pages/Admin/AdminProcurement'));
const AdminGrowth = lazy(() => import('../Pages/Admin/AdminGrowth'));
const AdminMerchandising = lazy(() => import('../Pages/Admin/AdminMerchandising'));

const adminFallback = (
    <div className="flex items-center justify-center min-h-screen">
        <SpinnerBig />
    </div>
);

const routing = createBrowserRouter([
    {
        path: "admin",
        element: (
            <ProtectedRoute requireAdmin>
                <Suspense fallback={adminFallback}>
                    <AdminLayout />
                </Suspense>
            </ProtectedRoute>
        ),
        errorElement: <NotFound />,
        children: [
            { index: true, element: <AdminHome /> },
            { path: "products", element: <AdminRoleRoute roles={['owner', 'admin']}><AdminProducts /></AdminRoleRoute> },
            { path: "orders", element: <AdminRoleRoute roles={['owner', 'admin', 'support', 'fulfillment', 'finance']}><AdminOrders /></AdminRoleRoute> },
            { path: "customers", element: <AdminRoleRoute roles={['owner', 'admin']}><AdminCustomers /></AdminRoleRoute> },
            { path: "inventory", element: <AdminRoleRoute roles={['owner', 'admin', 'inventory']}><AdminInventory /></AdminRoleRoute> },
            { path: "coupons", element: <AdminRoleRoute roles={['owner', 'admin']}><AdminCoupons /></AdminRoleRoute> },
            { path: "reviews", element: <AdminRoleRoute roles={['owner', 'admin']}><AdminReviews /></AdminRoleRoute> },
            { path: "analytics", element: <AdminRoleRoute roles={['owner', 'admin', 'finance']}><AdminAnalytics /></AdminRoleRoute> },
            { path: "invoices", element: <AdminRoleRoute roles={['owner', 'admin', 'finance', 'support']}><AdminInvoices /></AdminRoleRoute> },
            { path: "operations", element: <AdminRoleRoute roles={['owner', 'admin', 'support', 'fulfillment', 'inventory', 'finance']}><AdminOperations /></AdminRoleRoute> },
            { path: "procurement", element: <AdminRoleRoute roles={['owner', 'admin', 'inventory']}><AdminProcurement /></AdminRoleRoute> },
            { path: "growth", element: <AdminRoleRoute roles={['owner', 'admin']}><AdminGrowth /></AdminRoleRoute> },
            { path: "merchandising", element: <AdminRoleRoute roles={['owner', 'admin']}><AdminMerchandising /></AdminRoleRoute> },
        ]
    },
    {
        path: "", element: <Layout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Explore /> },
            { path: "products", element: <Products /> },
            { path: "cart", element: <Cart /> },
            { path: "about", element: <About /> },
            { path: "wishlist", element: <Wishlist /> },
            { path: "products/:id", element: <ProductDetails /> },
            { path: "auth", element: <Login /> },
            { path: "login", element: <Navigate to="/auth" replace /> },
            { path: "register", element: <Register /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <ResetPassword /> },
            {
                path: "addProduct",
                element: <ProtectedRoute requireAdmin><AddProduct /></ProtectedRoute>
            },
            { path: "checkout/success", element: <ProtectedRoute><Success /></ProtectedRoute> },
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
