import { USER_ROLES, USER_STATUSES } from "../constants/roles.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/token.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.get("Authorization") || "";
  const [, token] = header.split(" ");

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(payload.sub);
  if (!user || user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError(401, "User account is not available");
  }

  req.user = user;
  next();
});

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }

    return next();
  };
}

export const requireAdmin = authorize(USER_ROLES.ADMIN);
