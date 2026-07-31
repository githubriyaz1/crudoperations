import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { USER_ROLES, USER_STATUSES } from "../constants/roles.js";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "Home" },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true, required: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUSES),
      default: USER_STATUSES.ACTIVE,
      index: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ createdAt: -1 });

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
};

export const User = mongoose.model("User", userSchema);
