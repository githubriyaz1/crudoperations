import { env } from "../../../config/env.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess, sendCreated } from "../../../utils/response.js";
import { refreshCookieOptions } from "../../../utils/token.js";
import { AuthService } from "../services/auth.service.js";

function setRefreshCookie(res, token) {
  res.cookie(env.REFRESH_COOKIE_NAME, token, refreshCookieOptions());
}

function clearRefreshCookie(res) {
  res.clearCookie(env.REFRESH_COOKIE_NAME, refreshCookieOptions());
}

export const AuthController = {
  register: asyncHandler(async (req, res) => {
    const result = await AuthService.register(req.body, req);
    setRefreshCookie(res, result.refreshToken);
    return sendCreated(res, {
      message: "Account created successfully.",
      data: { user: result.user, accessToken: result.accessToken },
    });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await AuthService.login(req.body, req);
    setRefreshCookie(res, result.refreshToken);
    return sendSuccess(res, {
      message: "Logged in successfully.",
      data: { user: result.user, accessToken: result.accessToken },
    });
  }),

  refresh: asyncHandler(async (req, res) => {
    const token = req.cookies?.[env.REFRESH_COOKIE_NAME] || req.body?.refreshToken;
    const result = await AuthService.refresh(token, req);
    setRefreshCookie(res, result.refreshToken);
    return sendSuccess(res, {
      message: "Token refreshed successfully.",
      data: { user: result.user, accessToken: result.accessToken },
    });
  }),

  logout: asyncHandler(async (req, res) => {
    const token = req.cookies?.[env.REFRESH_COOKIE_NAME] || req.body?.refreshToken;
    await AuthService.logout(token, req);
    clearRefreshCookie(res);
    return sendSuccess(res, { message: "Logged out successfully.", data: null });
  }),

  me: asyncHandler(async (req, res) => {
    const user = await AuthService.me(req.user);
    return sendSuccess(res, { message: "Current user fetched.", data: { user } });
  }),

  updateMe: asyncHandler(async (req, res) => {
    const user = await AuthService.updateMe(req.user, req.body);
    return sendSuccess(res, { message: "Profile updated successfully.", data: { user } });
  }),
};
