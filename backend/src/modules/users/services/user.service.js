import { User } from "../../../models/User.model.js";
import { ApiError } from "../../../utils/apiError.js";

function publicUser(user) {
  return {
    id: user._id.toString(),
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    status: user.status,
    joinedAt: user.joinedAt || user.createdAt,
    createdAt: user.createdAt,
    addresses: user.addresses || [],
  };
}

export const UserService = {
  async getUsers({ page = 1, limit = 20, search = "", role, status }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter),
    ]);

    return {
      items: users.map(publicUser),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  },

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    return publicUser(user);
  },

  async updateUserStatus(id, status) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    user.status = status;
    await user.save();
    return publicUser(user);
  },

  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    return true;
  },

  async getUserAddresses(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    return user.addresses || [];
  },

  async addAddress(userId, payload) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const isDefault = payload.isDefault || user.addresses.length === 0;

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label: payload.label || "Home",
      name: payload.name || user.name,
      phone: payload.phone || user.phone,
      address: payload.address,
      city: payload.city || "",
      state: payload.state || "",
      pincode: payload.pincode || "",
      isDefault,
    });

    await user.save();
    return user.addresses;
  },

  async updateAddress(userId, addressId, payload) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const addr = user.addresses.id(addressId);
    if (!addr) {
      throw new ApiError(404, "Address not found.");
    }

    if (payload.isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    if (payload.label !== undefined) addr.label = payload.label;
    if (payload.name !== undefined) addr.name = payload.name;
    if (payload.phone !== undefined) addr.phone = payload.phone;
    if (payload.address !== undefined) addr.address = payload.address;
    if (payload.city !== undefined) addr.city = payload.city;
    if (payload.state !== undefined) addr.state = payload.state;
    if (payload.pincode !== undefined) addr.pincode = payload.pincode;
    if (payload.isDefault !== undefined) addr.isDefault = payload.isDefault;

    await user.save();
    return user.addresses;
  },

  async deleteAddress(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    user.addresses.pull({ _id: addressId });
    await user.save();
    return user.addresses;
  },
};
