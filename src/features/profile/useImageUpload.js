import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../Context/useAuth";

export default function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setIsUploading(false);
      return;
    }
    try {
      if (
        !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file.type
        )
      ) {
        toast.error("Only JPG, PNG and WebP images are allowed");
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post(
        "/auth/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.status === true) {
        // Update user image in the context
        user.image = response.data.image;
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    handleImageUpload,
  };
}
