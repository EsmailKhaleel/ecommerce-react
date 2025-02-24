import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import LanguageProvider from "./ecommerce/Context/LanguageProvider";
import { AuthProvider } from "./ecommerce/Context/AuthProvider";
import { store } from "./ecommerce/StateManagement/store";

const AppProviders = ({ children }) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <LanguageProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </LanguageProvider>
            </Provider>
        </QueryClientProvider>
    );
};

export default AppProviders;
