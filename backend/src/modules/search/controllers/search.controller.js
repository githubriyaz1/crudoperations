import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendPaginated, sendSuccess } from "../../../utils/response.js";
import { SearchService } from "../services/search.service.js";

export const SearchController = {
  search: asyncHandler(async (req, res) => {
    const result = await SearchService.search(req.query);
    return sendPaginated(res, {
      message: "Search completed successfully.",
      data: result.items,
      meta: result.meta,
    });
  }),

  getSuggestions: asyncHandler(async (req, res) => {
    const suggestions = await SearchService.getSuggestions(req.query.q || req.query.query || "");
    return sendSuccess(res, { message: "Suggestions fetched.", data: suggestions });
  }),
};
