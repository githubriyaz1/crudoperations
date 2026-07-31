import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendCreated, sendPaginated, sendSuccess } from "../../../utils/response.js";
import { ContactService } from "../services/contact.service.js";

export const ContactController = {
  submitInquiry: asyncHandler(async (req, res) => {
    const inquiry = await ContactService.submitInquiry(req.body);
    return sendCreated(res, {
      message: "Thank you for contacting Love2Bazzar. We will respond shortly.",
      data: { inquiry },
    });
  }),

  getInquiries: asyncHandler(async (req, res) => {
    const result = await ContactService.getInquiries(req.query);
    return sendPaginated(res, {
      message: "Inquiries fetched.",
      data: result.items,
      meta: result.meta,
    });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const inquiry = await ContactService.updateStatus(req.params.id, req.body.status);
    return sendSuccess(res, { message: "Inquiry status updated.", data: { inquiry } });
  }),
};
