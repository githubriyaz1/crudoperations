import { env } from "../../../config/env.js";
import { USER_ROLES, USER_STATUSES } from "../../../constants/roles.js";
import { RefreshToken } from "../../../models/RefreshToken.model.js";
import { User } from "../../../models/User.model.js";
import { ApiError } from "../../../utils/apiError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../../utils/token.js";

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    joinedAt: user.joinedAt,
    addresses: user.addresses || [],
  };
}

function getRefreshExpiry() {
  const now = Date.now();
  const days = env.JWT_REFRESH_EXPIRES_IN.endsWith("d")
    ? Number(env.JWT_REFRESH_EXPIRES_IN.replace("d", ""))
    : 30;
  return new Date(now + days * 24 * 60 * 60 * 1000);
}

async function persistRefreshToken({ user, token, familyId, req, replacedTokenHash }) {
  const tokenHash = RefreshToken.hash(token);
  await RefreshToken.create({
    userId: user.id,
    tokenHash,
    familyId,
    expiresAt: getRefreshExpiry(),
    createdByIp: req.ip,
    userAgent: req.get("User-Agent") || "",
  });

  if (replacedTokenHash) {
    await RefreshToken.updateOne(
      { tokenHash: replacedTokenHash },
      { revokedAt: new Date(), revokedByIp: req.ip, replacedByTokenHash: tokenHash }
    );
  }

  return tokenHash;
}

function issueTokens(user, familyId) {
  const accessToken = signAccessToken(user);
  const refresh = signRefreshToken(user, familyId);
  return {
    accessToken,
    refreshToken: refresh.token,
    familyId: refresh.familyId,
  };
}

export const AuthService = {
  async register(payload, req) {
    const email = payload.email.trim().toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const passwordHash = await User.hashPassword(payload.password);
    const user = await User.create({
      name: payload.name.trim(),
      email,
      phone: payload.phone?.trim() || "",
      passwordHash,
      role: USER_ROLES.USER,
      status: USER_STATUSES.ACTIVE,
      joinedAt: new Date(),
      addresses: [],
    });

    const tokens = issueTokens(user);
    await persistRefreshToken({ user, token: tokens.refreshToken, familyId: tokens.familyId, req });

    return {
      user: publicUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  async login(payload, req) {
    const email = payload.email.trim().toLowerCase();
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }
    if (user.status !== USER_STATUSES.ACTIVE) {
      throw new ApiError(403, "This account is not active.");
    }

    const ok = await user.comparePassword(payload.password);
    if (!ok) {
      throw new ApiError(401, "Invalid email or password.");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const tokens = issueTokens(user);
    await persistRefreshToken({ user, token: tokens.refreshToken, familyId: tokens.familyId, req });

    return {
      user: publicUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  async refresh(refreshToken, req) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required.");
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, "Invalid refresh token.");
    }

    const tokenHash = RefreshToken.hash(refreshToken);
    const stored = await RefreshToken.findOne({ tokenHash });
    if (!stored || !stored.isActive()) {
      throw new ApiError(401, "Refresh token has expired or was revoked.");
    }

    const user = await User.findById(payload.sub);
    if (!user || user.status !== USER_STATUSES.ACTIVE) {
      throw new ApiError(401, "User account is not available.");
    }

    const tokens = issueTokens(user, payload.familyId);
    await persistRefreshToken({
      user,
      token: tokens.refreshToken,
      familyId: tokens.familyId,
      req,
      replacedTokenHash: tokenHash,
    });

    return {
      user: publicUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  async logout(refreshToken, req) {
    if (!refreshToken) return;
    const tokenHash = RefreshToken.hash(refreshToken);
    await RefreshToken.updateOne(
      { tokenHash, revokedAt: { $exists: false } },
      { revokedAt: new Date(), revokedByIp: req.ip }
    );
  },

  async me(user) {
    return publicUser(user);
  },

  async updateMe(user, payload) {
    if (payload.name !== undefined) user.name = payload.name.trim();
    if (payload.phone !== undefined) user.phone = payload.phone.trim();
    if (payload.addresses !== undefined) {
      user.addresses = payload.addresses.map((address, index) => ({
        label: address.label || "Home",
        name: address.name || user.name,
        phone: address.phone || user.phone,
        address: address.address,
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        isDefault: index === 0,
      }));
    }
    await user.save();
    return publicUser(user);
  },
};
