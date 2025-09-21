import { useContext } from "react";
import { LanguageContext } from "../Context/LanguageContext";
import { ToastContainer } from "react-toastify";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";

import "react-toastify/dist/ReactToastify.css";

export default function ToastWrapper({ children }) {
  const { language } = useContext(LanguageContext);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={language === "rtl"}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        icon={({ type }) => {
          switch (type) {
            case "success":
              return <FiCheckCircle className="text-green-600 dark:text-green-400" size={20} />;
            case "error":
              return <FiXCircle className="text-red-600 dark:text-red-400" size={20} />;
            case "warning":
              return <FiAlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />;
            default:
              return <FiInfo className="text-blue-600 dark:text-blue-400" size={20} />;
          }
        }}
      />
      {children}
    </>
  );
}
