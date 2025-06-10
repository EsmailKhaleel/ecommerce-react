import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { AuthProvider } from "./Context/AuthProvider";
import LanguageProvider from "./Context/LanguageProvider";
import { store } from "./StateManagement/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppProviders = ({ children }) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <LanguageProvider>
                    <AuthProvider>                        {children}
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />
                    </AuthProvider>
                </LanguageProvider>
            </Provider>
        </QueryClientProvider>
    );
};

export default AppProviders;
