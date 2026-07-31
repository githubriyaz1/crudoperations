import crypto from "node:crypto";
import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    familyId: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    revokedAt: Date,
    replacedByTokenHash: String,
    createdByIp: String,
    revokedByIp: String,
    userAgent: String,
  },
  { timestamps: true }
);

refreshTokenSchema.statics.hash = function hash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

refreshTokenSchema.methods.isActive = function isActive() {
  return !this.revokedAt && this.expiresAt.getTime() > Date.now();
};

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
