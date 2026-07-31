import mongoose from "mongoose";
import { Category } from "../../../models/Category.model.js";
import { Product } from "../../../models/Product.model.js";
import { ApiError } from "../../../utils/apiError.js";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatProduct(product) {
  const obj = product.toObject ? product.toObject() : product;
  const image = obj.image || obj.images?.[0] || "";
  const images = obj.images?.length ? obj.images : image ? [image] : [];
  const specifications =
    obj.specifications instanceof Map
      ? Object.fromEntries(obj.specifications)
      : obj.specifications || {};

  return {
    id: obj.slug || obj._id.toString(),
    _id: obj._id.toString(),
    legacyId: obj.legacyId,
    name: obj.name,
    slug: obj.slug,
    category: obj.categorySlug || "all",
    categorySlug: obj.categorySlug || "all",
    categoryId: obj.category?._id?.toString() || obj.category?.toString() || null,
    price: obj.price,
    oldPrice: obj.oldPrice || obj.price,
    discount: obj.discount || 0,
    stock: obj.stock ?? 50,
    badge: obj.badge || "",
    image,
    images,
    description: obj.description || "",
    specifications,
    featured: Boolean(obj.featured),
    hidden: Boolean(obj.hidden),
    rating: obj.rating || 4.8,
    reviewsCount: obj.reviewsCount || 0,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

export const ProductService = {
  async getProducts({
    page = 1,
    limit = 50,
    search = "",
    category = "",
    featured,
    sort = "featured",
    includeHidden = false,
  } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(200, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (!includeHidden) {
      filter.hidden = false;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true" || featured === true;
    }

    if (category && category !== "all") {
      filter.categorySlug = category.toLowerCase().trim();
    }

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: regex }, { description: regex }, { badge: regex }];
    }

    const sortOptions = {};
    if (sort === "price-low") sortOptions.price = 1;
    else if (sort === "price-high") sortOptions.price = -1;
    else if (sort === "rating") sortOptions.rating = -1;
    else if (sort === "newest") sortOptions.createdAt = -1;
    else sortOptions.featured = -1;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return {
      items: products.map(formatProduct),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  },

  async getProductByIdOrSlug(identifier) {
    let product = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier);
    }

    if (!product && !isNaN(Number(identifier))) {
      product = await Product.findOne({ legacyId: Number(identifier) });
    }

    if (!product) {
      product = await Product.findOne({ slug: identifier.toLowerCase() });
    }

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    return formatProduct(product);
  },

  async createProduct(payload) {
    const name = payload.name.trim();
    let slug = payload.slug ? slugify(payload.slug) : slugify(name);

    let existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let categoryId = null;
    let categorySlug = (payload.category || payload.categorySlug || "all").toLowerCase().trim();

    if (payload.category && mongoose.Types.ObjectId.isValid(payload.category)) {
      categoryId = payload.category;
      const catObj = await Category.findById(payload.category);
      if (catObj) categorySlug = catObj.slug;
    } else if (categorySlug) {
      const catObj = await Category.findOne({ slug: categorySlug });
      if (catObj) categoryId = catObj._id;
    }

    const primaryImage = payload.image || payload.images?.[0] || "";
    const imagesList = payload.images?.length ? payload.images : primaryImage ? [primaryImage] : [];

    const product = await Product.create({
      name,
      slug,
      legacyId: payload.legacyId || Date.now(),
      category: categoryId,
      categorySlug,
      price: Number(payload.price),
      oldPrice: Number(payload.oldPrice || payload.price),
      discount: Number(payload.discount || 0),
      stock: Number(payload.stock ?? 50),
      badge: payload.badge?.trim() || "",
      image: primaryImage,
      images: imagesList,
      description: payload.description?.trim() || "",
      specifications: payload.specifications || {},
      featured: Boolean(payload.featured),
      hidden: Boolean(payload.hidden),
      rating: Number(payload.rating || 4.8),
    });

    return formatProduct(product);
  },

  async updateProduct(id, payload) {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    if (payload.name !== undefined) {
      product.name = payload.name.trim();
    }

    if (payload.slug !== undefined && payload.slug !== product.slug) {
      const newSlug = slugify(payload.slug);
      const existing = await Product.findOne({ slug: newSlug, _id: { $ne: product._id } });
      if (existing) {
        throw new ApiError(409, "A product with this slug already exists.");
      }
      product.slug = newSlug;
    }

    if (payload.price !== undefined) product.price = Number(payload.price);
    if (payload.oldPrice !== undefined) product.oldPrice = Number(payload.oldPrice);
    if (payload.discount !== undefined) product.discount = Number(payload.discount);
    if (payload.stock !== undefined) product.stock = Number(payload.stock);
    if (payload.badge !== undefined) product.badge = payload.badge.trim();
    if (payload.description !== undefined) product.description = payload.description.trim();
    if (payload.featured !== undefined) product.featured = Boolean(payload.featured);
    if (payload.hidden !== undefined) product.hidden = Boolean(payload.hidden);
    if (payload.specifications !== undefined) product.specifications = payload.specifications;

    if (payload.category !== undefined || payload.categorySlug !== undefined) {
      const catInput = payload.category || payload.categorySlug;
      if (mongoose.Types.ObjectId.isValid(catInput)) {
        product.category = catInput;
        const catObj = await Category.findById(catInput);
        if (catObj) product.categorySlug = catObj.slug;
      } else if (typeof catInput === "string") {
        product.categorySlug = catInput.toLowerCase().trim();
        const catObj = await Category.findOne({ slug: product.categorySlug });
        if (catObj) product.category = catObj._id;
      }
    }

    if (payload.image || payload.images) {
      product.image = payload.image || payload.images?.[0] || product.image;
      product.images = payload.images?.length ? payload.images : [product.image];
    }

    await product.save();
    return formatProduct(product);
  },

  async toggleProductVisibility(id) {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    product.hidden = !product.hidden;
    await product.save();
    return formatProduct(product);
  },

  async deleteProduct(id) {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndDelete(id);
    } else {
      product = await Product.findOneAndDelete({ slug: id.toLowerCase() });
    }

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }
    return true;
  },
};
