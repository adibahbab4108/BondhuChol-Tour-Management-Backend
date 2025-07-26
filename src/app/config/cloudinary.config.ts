//Frontend-> form data with image file->Multer-> Form data-> req(body+file)

import { v2 as cloudinary } from "cloudinary";
import { envVar } from "./env.config";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
  cloud_name: envVar.CLOUDINARY_CLOUD_NAME,
  api_key: envVar.CLOUDINARY_API_KEY,
  api_secret: envVar.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary`);
    }
  } catch (error: any) {
    console.log(error);
    throw new AppError("cloudinary image deletion failed", 401);
  }
};
export const cloudinaryUpload = cloudinary;
