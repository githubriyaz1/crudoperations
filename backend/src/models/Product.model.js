import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    legacyId: {
      type: Number,
      index: true,
      sparse: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    categorySlug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      default: "all",
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    oldPrice: {
      type: Number,
      min: [0, "Old price cannot be negative"],
      default: 0,
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    stock: {
      type: Number,
      min: [0, "Stock cannot be negative"],
      default: 50,
    },
    badge: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: [true, "Primary product image is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    hidden: {
      type: Boolean,
      default: false,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model("Product", productSchema);
