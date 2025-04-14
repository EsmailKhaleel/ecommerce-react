import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink } from "react-router-dom";
import { RegisterSchema } from "../../utils/yupValidationSchema";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../Context/AuthProvider";
import MyCustomField from "../../Components/MyCustomField";

function Register() {
  const { signUp } = useAuth();
  // Initial Form Values
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Form Submitted:", values);
      const user = await signUp(values.email, values.password, values.username);
      if (user) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.log("Error Registration:", error);
      setIsSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 dark:bg-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>
        <Formik initialValues={initialValues} validationSchema={RegisterSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, handleSubmit }) => (
            <Form className="space-y-4">
              {/* Username Field */}
              <MyCustomField type="text" name="username" placeholder="user name"/>

              {/* Email Field */}
              <MyCustomField type="email" name="email" placeholder="email"/>

              {/* Password Field */}
              <MyCustomField type="password" name="password" placeholder="password"/>

              {/* Confirm Password Field */}
              <MyCustomField type="password" name="confirmPassword" placeholder="confirm password"/>

              {/* Submit Button */}
              <SubmitButton isSubmitting={isSubmitting} isSuccess={isSuccess} handleSubmit={handleSubmit}/>
            </Form>
          )}
        </Formik>

        {/* Login Redirect */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <NavLink to={"/auth"} className="text-primary hover:text-secondary font-medium"> Log in</NavLink>
        </div>
      </div>
    </div>
  );
}

export default Register;
const SubmitButton = ({ handleSubmit, isSubmitting, isSuccess}) => {
  return (<button
    type="submit"
    onClick={handleSubmit}
    disabled={isSubmitting || isSuccess}
    className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-secondary"}`}
  >
    {isSuccess ? (
      <>
        <FaCheckCircle className="text-white" /> Registered
      </>
    ) : isSubmitting ? (
      "Signing up..."
    ) : (
      "Sign Up"
    )}
  </button>);
}