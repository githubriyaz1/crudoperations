import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendCreated, sendSuccess } from "../../../utils/response.js";
import { CategoryService } from "../services/category.service.js";

export const CategoryController = {
  getCategories: asyncHandler(async (req, res) => {
    const includeInactive = req.query.includeInactive === "true";
    const categories = await CategoryService.getCategories({ includeInactive });
    return sendSuccess(res, { message: "Categories fetched successfully.", data: { categories } });
  }),

  getCategoryBySlug: asyncHandler(async (req, res) => {
    const category = await CategoryService.getCategoryBySlug(req.params.slug);
    return sendSuccess(res, { message: "Category fetched successfully.", data: { category } });
  }),

  createCategory: asyncHandler(async (req, res) => {
    const category = await CategoryService.createCategory(req.body);
    return sendCreated(res, { message: "Category created successfully.", data: { category } });
  }),

  updateCategory: asyncHandler(async (req, res) => {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    return sendSuccess(res, { message: "Category updated successfully.", data: { category } });
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    await CategoryService.deleteCategory(req.params.id);
    return sendSuccess(res, { message: "Category deleted successfully.", data: null });
  }),
};
