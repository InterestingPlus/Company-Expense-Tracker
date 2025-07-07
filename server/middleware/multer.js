import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "expenses-receipts",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

export const upload = multer({ storage });
