import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";
import { AdminService } from "../services/admin.service.js";

export const AdminController = {
  getDashboardSummary: asyncHandler(async (_req, res) => {
    const summary = await AdminService.getDashboardSummary();
    return sendSuccess(res, { message: "Dashboard summary fetched.", data: summary });
  }),

  getAnalytics: asyncHandler(async (_req, res) => {
    const analytics = await AdminService.getAnalytics();
    return sendSuccess(res, { message: "Analytics summary fetched.", data: analytics });
  }),
};
