/* eslint-disable no-console */
//Frontend-> form data with image file->Multer-> Form data-> req(body+file)

import { v2 as cloudinary } from "cloudinary";
import { envVar } from "./env.config";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
  cloud_name: envVar.CLOUDINARY_CLOUD_NAME,
  api_key: envVar.CLOUDINARY_API_KEY,
  api_secret: envVar.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string
) => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `BondhuCholPDF/${fileName}-${Date.now()}`;
      cloudinary.uploader
        .upload_stream(
          { folder: "BondhuCholPDF", public_id: public_id },
          (error, result) => {
            if (error) {
              console.log("Cloudinary Upload Error:", error);
              reject(new AppError("Cloudinary image upload failed", 500));
            } else {
              resolve(result?.secure_url);
            }
          }
        )
        .end(buffer);
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError("cloudinary image upload failed", 401);
  }
};

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
