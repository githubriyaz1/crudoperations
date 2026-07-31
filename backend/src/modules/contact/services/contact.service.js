import { ContactInquiry } from "../../../models/ContactInquiry.model.js";
import { ApiError } from "../../../utils/apiError.js";

export const ContactService = {
  async submitInquiry(payload) {
    const inquiry = await ContactInquiry.create({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      subject: payload.subject?.trim() || "General Inquiry",
      message: payload.message.trim(),
    });
    return inquiry;
  },

  async getInquiries({ page = 1, limit = 50 }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [inquiries, total] = await Promise.all([
      ContactInquiry.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      ContactInquiry.countDocuments(),
    ]);

    return {
      items: inquiries,
      meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    };
  },

  async updateStatus(id, status) {
    const inquiry = await ContactInquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!inquiry) throw new ApiError(404, "Inquiry not found.");
    return inquiry;
  },
};
