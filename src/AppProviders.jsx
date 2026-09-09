import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { AuthProvider } from "./Context/AuthProvider";
import LanguageProvider from "./Context/LanguageProvider";
import { store } from "./StateManagement/store";
import "react-toastify/dist/ReactToastify.css";
import ToastWrapper from "./Components/ToastWrapper";

// Created once at module scope: building it inside the component would discard
// the entire query cache on every re-render.
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const AppProviders = ({ children }) => {
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
