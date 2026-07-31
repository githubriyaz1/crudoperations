import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendPaginated, sendSuccess } from "../../../utils/response.js";
import { UserService } from "../services/user.service.js";

export const UserController = {
  getUsers: asyncHandler(async (req, res) => {
    const result = await UserService.getUsers(req.query);
    return sendPaginated(res, {
      message: "Users fetched successfully.",
      data: result.items,
      meta: result.meta,
    });
  }),

  getUserById: asyncHandler(async (req, res) => {
    const user = await UserService.getUserById(req.params.id);
    return sendSuccess(res, { message: "User fetched successfully.", data: { user } });
  }),

  updateUserStatus: asyncHandler(async (req, res) => {
    const user = await UserService.updateUserStatus(req.params.id, req.body.status);
    return sendSuccess(res, { message: "User status updated successfully.", data: { user } });
  }),

  deleteUser: asyncHandler(async (req, res) => {
    await UserService.deleteUser(req.params.id);
    return sendSuccess(res, { message: "User deleted successfully.", data: null });
  }),

  getUserAddresses: asyncHandler(async (req, res) => {
    const addresses = await UserService.getUserAddresses(req.user.id);
    return sendSuccess(res, { message: "Addresses fetched successfully.", data: { addresses } });
  }),

  addAddress: asyncHandler(async (req, res) => {
    const addresses = await UserService.addAddress(req.user.id, req.body);
    return sendSuccess(res, { message: "Address added successfully.", data: { addresses } });
  }),

  updateAddress: asyncHandler(async (req, res) => {
    const addresses = await UserService.updateAddress(req.user.id, req.params.addressId, req.body);
    return sendSuccess(res, { message: "Address updated successfully.", data: { addresses } });
  }),

  deleteAddress: asyncHandler(async (req, res) => {
    const addresses = await UserService.deleteAddress(req.user.id, req.params.addressId);
    return sendSuccess(res, { message: "Address deleted successfully.", data: { addresses } });
  }),
};
