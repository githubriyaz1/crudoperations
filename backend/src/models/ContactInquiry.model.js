import mongoose from "mongoose";

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "General Inquiry",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Read", "Resolved"],
      default: "New",
      index: true,
    },
  },
  { timestamps: true }
);

export const ContactInquiry = mongoose.model("ContactInquiry", contactInquirySchema);
