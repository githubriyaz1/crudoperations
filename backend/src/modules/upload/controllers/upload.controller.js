import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendCreated } from "../../../utils/response.js";
import { UploadService } from "../services/upload.service.js";

export const UploadController = {
  uploadImage: asyncHandler(async (req, res) => {
    const result = await UploadService.uploadImage(req.file);
    return sendCreated(res, {
      message: "Image uploaded successfully.",
      data: result,
    });
  }),
};
