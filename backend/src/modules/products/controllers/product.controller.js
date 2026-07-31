import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendCreated, sendPaginated, sendSuccess } from "../../../utils/response.js";
import { ProductService } from "../services/product.service.js";

export const ProductController = {
  getProducts: asyncHandler(async (req, res) => {
    const result = await ProductService.getProducts(req.query);
    return sendPaginated(res, {
      message: "Products fetched successfully.",
      data: result.items,
      meta: result.meta,
    });
  }),

  getProductByIdOrSlug: asyncHandler(async (req, res) => {
    const product = await ProductService.getProductByIdOrSlug(req.params.idOrSlug);
    return sendSuccess(res, { message: "Product fetched successfully.", data: { product } });
  }),

  createProduct: asyncHandler(async (req, res) => {
    const product = await ProductService.createProduct(req.body);
    return sendCreated(res, { message: "Product created successfully.", data: { product } });
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    return sendSuccess(res, { message: "Product updated successfully.", data: { product } });
  }),

  toggleProductVisibility: asyncHandler(async (req, res) => {
    const product = await ProductService.toggleProductVisibility(req.params.id);
    return sendSuccess(res, { message: "Product visibility toggled.", data: { product } });
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    await ProductService.deleteProduct(req.params.id);
    return sendSuccess(res, { message: "Product deleted successfully.", data: null });
  }),
};
