import React, { useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import MyCustomField from "../../Components/MyCustomField";
import { AddProductSchema } from "../../utils/yupValidationSchema";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";

const AddProduct = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState("");
    const [additionalImages, setAdditionalImages] = useState([]);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

    const initialValues = {
        name: "",
        price: "",
        old_price: "",
        discount: "",
        description: "",
        category: "",
        image: null,
        additionalImages: [],
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await axiosInstance.post("/products", {
                ...values,
                image: image,
                images: additionalImages,
            });
            alert("Product added successfully");
            console.log("Product added successfully:", response.data);
            resetForm();
            setImagePreview(null);
            setImage("");
            setAdditionalImages([]);
            setAdditionalImagePreviews([]);
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
            console.log("Upload image success : ", response.data);
            setImage(response.data.secure_url);
        } catch (error) {
            console.log("Upload Error:", error);
        }
    };

    const handleAdditionalImagesChange = async (event, setFieldValue, values) => {
        const files = Array.from(event.currentTarget.files);
        const currentAdditionalImages = values.additionalImages || [];
        setFieldValue("additionalImages", [...currentAdditionalImages, ...files]);
        
        // Create previews for all selected files
        const newPreviews = [];
        for (const file of files) {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === files.length) {
                    setAdditionalImagePreviews([...additionalImagePreviews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        }
        
        // Upload each file to Cloudinary
        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "ml_default");
            try {
                const response = await axios.post("https://api.cloudinary.com/v1_1/dxxkqw3bf/image/upload", formData);
                console.log("Additional image upload success:", response.data);
                setAdditionalImages(prev => [...prev, response.data.secure_url]);
            } catch (error) {
                console.log("Additional image upload error:", error);
            }
        }
    };

    const removeAdditionalImage = (indexToRemove, setFieldValue, values) => {
        // Remove from state
        const newAdditionalImages = additionalImages.filter((_, index) => index !== indexToRemove);
        const newPreviews = additionalImagePreviews.filter((_, index) => index !== indexToRemove);
        
        setAdditionalImages(newAdditionalImages);
        setAdditionalImagePreviews(newPreviews);
        
        // Remove from Formik values
        const updatedAdditionalImages = values.additionalImages.filter((_, index) => index !== indexToRemove);
        setFieldValue("additionalImages", updatedAdditionalImages);
    };

    return (
        <div className="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-md dark:bg-gray-300">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Product</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={AddProductSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, isSubmitting, values }) => (
                    <Form className="space-y-4">
                        <MyCustomField type="text" name="name" placeholder="product name" />
                        <MyCustomField type="number" name="price" placeholder="product price" />
                        <MyCustomField type="number" name="old_price" placeholder="product old price" />
                        <MyCustomField type="number" name="discount" placeholder="product discount" />
                        <MyCustomField type="text" name="description" placeholder="product description" />
                        {/* Category Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Category
                            </label>
                            <Field
                                as="select"
                                name="category"
                                className="w-full px-4 py-2 rounded-lg bg-stone-100 outline-none transition-all"
                            >
                                <option value="">Select a category</option>
                                <option value="digital">Digital</option>
                                <option value="clothes">Clothes</option>
                                <option value="other">Other</option>
                            </Field>
                            <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        
                        {/* Main Image Upload Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Main Image
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

                        {/* Main Image Preview */}
                        {imagePreview && (
                            <div className="relative">
                                <img src={imagePreview} alt="Main Preview" className="mt-4 w-full h-40 object-cover rounded-md" />
                                <p className="text-sm text-gray-500 mt-1">Main Product Image</p>
                            </div>
                        )}

                        {/* Additional Images Upload Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Additional Images
                            </label>
                            <input
                                type="file"
                                name="additionalImages"
                                accept="image/*"
                                multiple
                                onChange={(event) => handleAdditionalImagesChange(event, setFieldValue, values)}
                                className="w-full px-4 py-2 rounded-lg bg-stone-100 outline-none transition-all"
                            />
                            <ErrorMessage name="additionalImages" component="div" className="text-red-500 text-sm mt-1" />
                            <p className="text-xs text-gray-500 mt-1">You can select multiple images at once</p>
                        </div>

                        {/* Additional Images Preview */}
                        {additionalImagePreviews.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Additional Images:</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {additionalImagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img 
                                                src={preview} 
                                                alt={`Additional Preview ${index + 1}`} 
                                                className="w-full h-24 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAdditionalImage(index, setFieldValue, values)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
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