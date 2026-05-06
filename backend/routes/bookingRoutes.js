import express from "express";
import {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  deleteBooking
} from "../controllers/bookingController.js";

import {
  verifyToken,
  requireUser,
  requireProvider
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   USER ROUTES
=========================== */

// Create booking → only USER
router.post("/", verifyToken, requireUser, createBooking);

// Get user bookings
router.get("/my", verifyToken, requireUser, getUserBookings);

// Delete booking → only USER
router.delete("/:id", verifyToken, requireUser, deleteBooking);


/* ===========================
   PROVIDER ROUTES
=========================== */

// Provider sees bookings of their services
router.get("/provider", verifyToken, requireProvider, getProviderBookings);

// Provider updates booking status
router.put("/:id/status", verifyToken, requireProvider, updateBookingStatus);

export default router;