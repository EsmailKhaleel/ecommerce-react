import { useState } from "react";
import { Formik, Form } from "formik";
import { NavLink } from "react-router-dom";
import { RegisterSchema } from "../../utils/yupValidationSchema";
import { FaCheckCircle } from "react-icons/fa";
import MyCustomField from "../../Components/MyCustomField";
import GoogleSignInButton from "../../Components/GoogleSignInButton";
import { useAuth } from "../../Context/useAuth";

function Register() {
    const { signUp } = useAuth();
    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const user = await signUp(values.username, values.email, values.password);
            if (user) {
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
            }
        } catch (error) {
            console.error("Error Registration:", error);
            setIsSuccess(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 dark:bg-gray-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>
                <Formik 
                    initialValues={initialValues} 
                    validationSchema={RegisterSchema} 
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, handleSubmit }) => (
                        <Form className="space-y-4">
                            <MyCustomField type="text" name="username" placeholder="Username"/>
                            <MyCustomField type="email" name="email" placeholder="Email"/>
                            <MyCustomField type="password" name="password" placeholder="Password"/>
                            <MyCustomField type="password" name="confirmPassword" placeholder="Confirm Password"/>
                            <SubmitButton 
                                isSubmitting={isSubmitting} 
                                isSuccess={isSuccess} 
                                handleSubmit={handleSubmit}
                            />
                        </Form>
                    )}
                </Formik>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-300 text-gray-500">Or continue with</span>
                    </div>
                </div>

                {/* Google Sign-In Button */}
                <GoogleSignInButton mode="signup" />

                {/* Login Redirect */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?
                    <NavLink to="/auth" className="text-primary hover:text-secondary font-medium"> Log in</NavLink>
                </div>
            </div>
        </div>
    );
}

export default Register;

const SubmitButton = ({ isSubmitting, isSuccess, handleSubmit }) => (
    <button
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting || isSuccess}
        className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-secondary"}`}
    >
        {isSuccess ? (
            <><FaCheckCircle className="text-white" /> Registered</>
        ) : isSubmitting ? (
            "Signing up..."
        ) : (
            "Sign Up"
        )}
    </button>
);