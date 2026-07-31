import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendCreated, sendSuccess } from "../../../utils/response.js";
import { NewsletterService } from "../services/newsletter.service.js";

export const NewsletterController = {
  subscribe: asyncHandler(async (req, res) => {
    const subscriber = await NewsletterService.subscribe(req.body.email);
    return sendCreated(res, {
      message: "Thank you for subscribing to Love2Bazzar newsletter!",
      data: { subscriber },
    });
  }),

  getSubscribers: asyncHandler(async (_req, res) => {
    const subscribers = await NewsletterService.getSubscribers();
    return sendSuccess(res, { message: "Newsletter subscribers fetched.", data: { subscribers } });
  }),
};
