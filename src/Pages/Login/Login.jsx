import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { NavLink } from 'react-router-dom';
import { LoginSchema } from '../../utils/yupValidationSchema';
import { FaCheckCircle, FaGoogle } from 'react-icons/fa';
import MyCustomField from '../../Components/MyCustomField';
import { useAuth } from '../../Context/AuthProvider';

function Login() {
    const { signIn, signInWithGoogle } = useAuth();
    const initialValues = {
        email: '',
        password: ''
    };
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const user = await signIn(values.email, values.password);
            if (user) {
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
            }
        } catch (error) {
            console.error("Error Signing in:", error);
            setIsSuccess(false);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const user = await signInWithGoogle();
            if (user) {
                setIsSuccess(true);
            }
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 dark:bg-gray-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
                <Formik 
                    initialValues={initialValues} 
                    validationSchema={LoginSchema} 
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, handleSubmit }) => (
                        <Form className="space-y-4">
                            <MyCustomField type="email" name="email" placeholder='Email' />
                            <MyCustomField type="password" name="password" placeholder='Password' />
                            <SubmitButton 
                                isSubmitting={isSubmitting} 
                                isSuccess={isSuccess} 
                                handleSubmit={handleSubmit} 
                            />
                        </Form>
                    )}
                </Formik>

                {/* Google Sign In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full mt-4 bg-white text-gray-700 border border-gray-300 font-medium py-2.5 rounded-lg transition-colors hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                    <FaGoogle className="text-red-500" />
                    Sign in with Google
                </button>

                {/* Signup Redirect */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?
                    <NavLink to="/register" className="text-primary hover:text-secondary font-medium"> Sign up</NavLink>
                </div>
            </div>
        </div>
    );
}

export default Login;

const SubmitButton = ({ isSubmitting, isSuccess, handleSubmit }) => (
    <button
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting || isSuccess}
        className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-secondary"}`}
    >
        {isSuccess ? (
            <><FaCheckCircle className="text-white" /> Successfully Signed In</>
        ) : isSubmitting ? (
            "Signing in..."
        ) : (
            "Login"
        )}
    </button>
);