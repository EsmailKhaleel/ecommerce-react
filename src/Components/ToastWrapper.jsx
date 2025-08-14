import { useContext } from "react";
import { LanguageContext } from "../Context/LanguageContext";
import { ToastContainer } from "react-toastify";

export default function ToastWrapper ({ children }) {
    const { language } = useContext(LanguageContext);
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={language === 'rtl'}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {children}
        </>
    );
};
