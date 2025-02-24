import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { NavLink } from 'react-router-dom';
import { LoginSchema } from '../../utils/yupValidationSchema';
import { FaCheckCircle } from 'react-icons/fa';
import MyCustomField from '../../Components/MyCustomField';
import { useAuth } from '../../Context/AuthProvider';
function Login() {
    const { signIn } = useAuth();
    const initialValues = {
        email: '',
        password: ''
    };
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            console.log('Form Submitted:', values);
            const user = await signIn(values.email, values.password);
            if (user) {
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
            }
        } catch (error) {
            console.log("Error Signing in");
            setIsSuccess(false);
        } finally {
            setSubmitting !== undefined && setSubmitting(false);
        }
    };
    return (
        <div className=" min-h-screen bg-gray-100 flex items-center justify-center p-4 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 dark:bg-gray-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
                <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, handleSubmit }) => (
                        <Form className="space-y-4">
                            <MyCustomField type="email" label="email"/>
                            <MyCustomField type="password" label="password"/>
                            
                            {/* Submit Button */}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || isSuccess}
                                className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-secondary"}`}
                            >
                                {isSuccess ? (
                                    <>
                                        <FaCheckCircle className="text-white" /> Successfully Signed In
                                    </>
                                ) : isSubmitting ? (
                                    "Signing in ..."
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </Form>
                    )}
                </Formik>
                {/* Signup Redirect */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?
                    <NavLink to={"/register"} className="text-primary hover:text-secondary font-medium"> Sign up</NavLink>
                </div>
            </div>
        </div>
    );
}

export default Login;
