import { Router } from "express";
import { SearchController } from "../controllers/search.controller.js";

const router = Router();

router.get("/", SearchController.search);
router.get("/suggestions", SearchController.getSuggestions);

export default router;
