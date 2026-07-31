import { Category } from "../../../models/Category.model.js";
import { Product } from "../../../models/Product.model.js";
import { ProductService } from "../../products/services/product.service.js";

export const SearchService = {
  async search({ q = "", category = "", maxPrice, sort = "featured", page = 1, limit = 50 }) {
    const result = await ProductService.getProducts({
      search: q,
      category,
      sort,
      page,
      limit,
    });

    let items = result.items;

    if (maxPrice !== undefined && maxPrice !== "" && !isNaN(Number(maxPrice))) {
      const cap = Number(maxPrice);
      items = items.filter((item) => item.price <= cap);
    }

    return {
      items,
      meta: {
        ...result.meta,
        total: items.length,
      },
    };
  },

  async getSuggestions(query = "") {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      return { products: [], categories: [] };
    }

    const regex = new RegExp(trimmed, "i");

    const [products, categories] = await Promise.all([
      Product.find({ name: regex, hidden: false }).select("name slug image price").limit(5),
      Category.find({ name: regex, isActive: true }).select("name slug").limit(5),
    ]);

    return {
      products: products.map((p) => ({ id: p.slug || p._id, name: p.name, price: p.price, image: p.image })),
      categories: categories.map((c) => ({ slug: c.slug, name: c.name })),
    };
  },
};
