import { cloudinary } from "../../../config/cloudinary.js";
import { env } from "../../../config/env.js";
import { ApiError } from "../../../utils/apiError.js";

export const UploadService = {
  async uploadImage(file) {
    if (!file) {
      throw new ApiError(400, "Image file is required.");
    }

    if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "love2bazzar/products" },
          (error, result) => {
            if (error) {
              return reject(new ApiError(500, "Cloudinary upload failed", [error]));
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        );
        stream.end(file.buffer);
      });
    }

    // Fallback if Cloudinary environment keys are not configured yet
    const base64 = file.buffer.toString("base64");
    const dataUrl = `data:${file.mimetype};base64,${base64}`;
    return {
      url: dataUrl,
      publicId: `local-${Date.now()}`,
    };
  },
};
