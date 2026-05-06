import express from "express";
import {
  addReview,
  getServiceReviews,
  deleteReview
} from "../controllers/reviewController.js";

import { verifyToken, requireUser } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   USER ROUTES
=========================== */

// Add review → only user
router.post("/", verifyToken, requireUser, addReview);

// Get reviews for service
router.get("/:serviceId", getServiceReviews);

// Delete review
router.delete("/:id", verifyToken, requireUser, deleteReview);

export default router;