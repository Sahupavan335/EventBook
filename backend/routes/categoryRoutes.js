import express from "express";
import {
  getCategories,
  createCategory
} from "../controllers/categoryController.js";

import {
  verifyToken
} from "../middleware/authMiddleware.js";

import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ===========================
   PUBLIC
=========================== */

// Get categories
router.get("/", getCategories);


/* ===========================
   ADMIN
=========================== */

// Create category
router.post("/", verifyToken, requireAdmin, createCategory);

export default router;