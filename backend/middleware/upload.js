import multer from "multer";
import cloudinary from "../config/cloudinary.js";

// Use memory storage so file buffers can be directly uploaded to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|avif|gif/;
  const okExt = allowed.test(file.originalname.toLowerCase());
  const okMime = /image\//.test(file.mimetype);
  if (okExt && okMime) return cb(null, true);
  cb(new Error("Only image files are allowed (jpeg, jpg, png, webp, avif, gif)"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/**
 * Upload a memory buffer or file stream to Cloudinary
 * @param {Buffer} buffer - File buffer from multer
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<String>} - Returns secure_url from Cloudinary
 */
export const uploadToCloudinary = (buffer, folder = "godrive/vehicles") => {
  return new Promise((resolve, reject) => {
    if (!buffer) return resolve(null);
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

export default upload;
