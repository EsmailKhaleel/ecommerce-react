import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { AuthProvider } from "./Context/AuthProvider";
import LanguageProvider from "./Context/LanguageProvider";
import { store } from "./StateManagement/store";
import "react-toastify/dist/ReactToastify.css";
import ToastWrapper from "./Components/ToastWrapper";

const AppProviders = ({ children }) => {
    const queryClient = new QueryClient();
    
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <LanguageProvider>
                    <AuthProvider>
                        <ToastWrapper>
                            {children}
                        </ToastWrapper>
                    </AuthProvider>
                </LanguageProvider>
            </Provider>
        </QueryClientProvider>
    );
};

export default AppProviders;
