import { FaCheckCircle } from "react-icons/fa";

const SubmitButton = ({
    isSubmitting,
    isSuccess,
    handleSubmit,
    label = "Submit",
    loadingLabel = "Loading...",
    successLabel = "Success",
}) => (
    <button
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting || isSuccess}
        className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-secondary"}`}
    >
        {isSuccess ? (
            <>
                <FaCheckCircle className="text-white" />
                {successLabel}
            </>
        ) : isSubmitting ? (
            loadingLabel
        ) : (
            label
        )}

    </button>
);
export default SubmitButton