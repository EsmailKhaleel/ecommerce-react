import axios from 'axios';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxxkqw3bf';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export async function uploadProductImages(files) {
  return Promise.all(files.map(async file => {
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', uploadPreset);
    const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, body);
    if (!data?.secure_url) throw new Error(`Upload failed for ${file.name}`);
    return data.secure_url;
  }));
}
