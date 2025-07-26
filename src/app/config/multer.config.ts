/* eslint-disable no-useless-escape */
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const originalName = file.originalname.toLowerCase();

      const sanitizedBase = originalName
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/\.[^/.]+$/, "") // Remove original extension
        .replace(/[^a-z0-9\-]/g, ""); // Remove unwanted characters

      const uniqueFileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}-${sanitizedBase}`;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage: storage });
