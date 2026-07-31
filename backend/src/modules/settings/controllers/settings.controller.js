import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";
import { SettingsService } from "../services/settings.service.js";

export const SettingsController = {
  getSettings: asyncHandler(async (_req, res) => {
    const settings = await SettingsService.getSettings();
    return sendSuccess(res, { message: "Store settings fetched.", data: { settings } });
  }),

  updateSettings: asyncHandler(async (req, res) => {
    const settings = await SettingsService.updateSettings(req.body);
    return sendSuccess(res, { message: "Store settings updated.", data: { settings } });
  }),
};
