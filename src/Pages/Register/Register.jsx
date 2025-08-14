import { useState } from "react";
import { Formik, Form } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { RegisterSchema } from "../../utils/yupValidationSchema";
import MyCustomField from "../../Components/MyCustomField";
import GoogleSignInButton from "../../Components/GoogleSignInButton";
import { useAuth } from "../../Context/useAuth";
import SubmitButton from "../../Components/SubmitButton";

function Register() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const user = await signUp(values.username, values.email, values.password);
            if (user) {
                setIsSuccess(true);
                resetForm();
                navigate('/auth');
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
                            <MyCustomField type="text" name="username" placeholder="Username" />
                            <MyCustomField type="email" name="email" placeholder="Email" />
                            <MyCustomField type="password" name="password" placeholder="Password" />
                            <MyCustomField type="password" name="confirmPassword" placeholder="Confirm Password" />
                            <SubmitButton
                                label="Sign Up"
                                loadingLabel="Signing Up..."
                                successLabel="Signed Up Successfully"
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
