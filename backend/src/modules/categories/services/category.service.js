import { Category } from "../../../models/Category.model.js";
import { ApiError } from "../../../utils/apiError.js";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCategory(cat) {
  return {
    id: cat._id.toString(),
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
    image: cat.image || "",
    icon: cat.icon || "",
    isActive: cat.isActive,
    sortOrder: cat.sortOrder,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
  };
}

export const CategoryService = {
  async getCategories({ includeInactive = false } = {}) {
    const filter = includeInactive ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });
    return categories.map(formatCategory);
  },

  async getCategoryBySlug(slug) {
    const category = await Category.findOne({ slug: slug.toLowerCase() });
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }
    return formatCategory(category);
  },

  async createCategory(payload) {
    const name = payload.name.trim();
    const slug = payload.slug ? slugify(payload.slug) : slugify(name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      throw new ApiError(409, "A category with this name/slug already exists.");
    }

    const category = await Category.create({
      name,
      slug,
      description: payload.description?.trim() || "",
      image: payload.image?.trim() || "",
      icon: payload.icon?.trim() || "",
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
      sortOrder: payload.sortOrder !== undefined ? Number(payload.sortOrder) : 0,
    });

    return formatCategory(category);
  },

  async updateCategory(id, payload) {
    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }

    if (payload.name !== undefined) {
      category.name = payload.name.trim();
      if (!payload.slug) {
        category.slug = slugify(payload.name);
      }
    }

    if (payload.slug !== undefined && payload.slug !== category.slug) {
      const slug = slugify(payload.slug);
      const existing = await Category.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        throw new ApiError(409, "A category with this slug already exists.");
      }
      category.slug = slug;
    }

    if (payload.description !== undefined) category.description = payload.description.trim();
    if (payload.image !== undefined) category.image = payload.image.trim();
    if (payload.icon !== undefined) category.icon = payload.icon.trim();
    if (payload.isActive !== undefined) category.isActive = Boolean(payload.isActive);
    if (payload.sortOrder !== undefined) category.sortOrder = Number(payload.sortOrder);

    await category.save();
    return formatCategory(category);
  },

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }
    return true;
  },
};
