import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import MyCustomField from "../../Components/MyCustomField";
import { AddProductSchema } from "../../utils/yupValidationSchema";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";
const AddProduct = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState("");

    const initialValues = {
        name: "",
        price: "",
        old_price: "",
        discount: "",
        description: "",
        image: null,
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await axiosInstance.post("/products", {
                ...values,
                image: image,
            });
            alert("Product added successfully");
            console.log("Product added successfully:", response.data);
            resetForm();
            setImagePreview(null);
            setImage("");
        } catch (error) {
            console.log("Error submitting form:", error);
            alert("Failed to submit product. Please try again.");
        }
        setSubmitting(false);
    };

    const handleImageChange = async (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        setFieldValue("image", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");
        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/dxxkqw3bf/image/upload", formData);
            console.log("Upload image success : ", response.data)
            setImage(response.data.secure_url);
        } catch (error) {
            console.log("Upload Error:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-md dark:bg-gray-300">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Product</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={AddProductSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form className="space-y-4">
                        <MyCustomField type="text" label="name" />
                        <MyCustomField type="number" label="price" />
                        <MyCustomField type="number" label="old_price" />
                        <MyCustomField type="number" label="discount" />
                        <MyCustomField type="text" label="description" />

                        {/* Image Upload Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={(event) => handleImageChange(event, setFieldValue)}
                                className="w-full px-4 py-2 rounded-lg bg-stone-100 outline-none transition-all"
                            />
                            <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mt-4 w-full h-40 object-cover rounded-md" />
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Add Product"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddProduct;