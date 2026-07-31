import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const NewsletterSubscriber = mongoose.model(
  "NewsletterSubscriber",
  newsletterSubscriberSchema
);
