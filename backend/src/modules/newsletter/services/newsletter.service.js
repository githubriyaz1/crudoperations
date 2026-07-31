import { NewsletterSubscriber } from "../../../models/NewsletterSubscriber.model.js";
import { ApiError } from "../../../utils/apiError.js";

export const NewsletterService = {
  async subscribe(email) {
    if (!email) throw new ApiError(400, "Email address is required.");
    const normalized = email.trim().toLowerCase();

    let subscriber = await NewsletterSubscriber.findOne({ email: normalized });
    if (subscriber) {
      if (!subscriber.isActive) {
        subscriber.isActive = true;
        await subscriber.save();
      }
      return subscriber;
    }

    subscriber = await NewsletterSubscriber.create({ email: normalized, isActive: true });
    return subscriber;
  },

  async getSubscribers() {
    const list = await NewsletterSubscriber.find({ isActive: true }).sort({ createdAt: -1 });
    return list;
  },
};
