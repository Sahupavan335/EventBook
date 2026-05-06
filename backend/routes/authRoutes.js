import express from "express";
import { signup, login, logout, getMe } from "../controllers/authControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   PUBLIC ROUTES
=========================== */

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);


/* ===========================
   PROTECTED ROUTES
=========================== */

// Logout
router.post("/logout", verifyToken, logout);

// Get current user
router.get("/me", verifyToken, getMe);


/* ===========================
   OPTIONAL (PRODUCTION HELPERS)
=========================== */

// Check auth (lightweight)
router.get("/check", verifyToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

export default router;