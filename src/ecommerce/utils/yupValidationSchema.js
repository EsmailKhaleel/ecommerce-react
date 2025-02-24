import * as Yup from "yup";

// sign-up Form Validation Schema
export const LoginSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});
// sign-up Form Validation Schema
export const RegisterSchema = Yup.object({
    username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot be longer than 20 characters")
        .required("Username is required"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
});

export const AddProductSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than zero")
      .required("Price is required"),
    old_price: Yup.number()
      .nullable()
      .typeError("Old price must be a number")
      .positive("Old price must be greater than zero"),
    discount: Yup.number()
      .nullable()
      .typeError("Discount must be a number")
      .min(0, "Discount cannot be negative")
      .max(100, "Discount cannot exceed 100%"),
    description: Yup.string()
      .required("Description is required"),
    image: Yup.mixed().required("Product image is required"),
  });