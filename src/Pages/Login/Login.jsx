import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginSchema } from '../../utils/yupValidationSchema';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import MyCustomField from '../../Components/MyCustomField';
import GoogleSignInButton from '../../Components/GoogleSignInButton';
import { useAuth } from '../../Context/useAuth';
import { toast } from 'react-toastify';

function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialValues = {
        email: '',
        password: ''
    };
    const [isSuccess, setIsSuccess] = useState(false);

    // Handle OAuth errors
    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            toast.error(decodeURIComponent(error));
            // Clean up URL
            navigate('/auth', { replace: true });
        }
    }, [searchParams, navigate]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const user = await signIn(values.email, values.password);
            if (user) {
                setIsSuccess(true);
                navigate('/products');
                window.scrollTo({
                    top: 0,
                    behavior:"instant"
                });
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

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 dark:bg-gray-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

                {/* Test Credentials Section */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2 text-blue-700">
                        <FaInfoCircle className="text-lg" />
                        <h3 className="font-medium">Test Credentials or simply Register</h3>
                    </div>
                    <div className="space-y-1 text-sm text-blue-600">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Email:</span>
                            <code className="bg-blue-100 dark:bg-blue-200 px-2 py-0.5 rounded">esmail@test.com</code>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Password:</span>
                            <code className="bg-blue-100 dark:bg-blue-200 px-2 py-0.5 rounded">111111</code>
                        </div>
                    </div>
                </div>

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
                <GoogleSignInButton mode="signin" />

                {/* Signup Redirect */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?
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