import { CLOUD_NAME 
, UPLOAD_PRESET } from '../utils/constantes.js';

export const subirImagenCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData
  });

  if (!response.ok) throw new Error("Error subiendo imagen a Cloudinary");

  const data = await response.json();
  return data.secure_url;
};