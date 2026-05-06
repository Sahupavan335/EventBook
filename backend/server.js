import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

// load env variables
dotenv.config();

const app = express();

/* ===========================
   MIDDLEWARES
=========================== */

// ✅ CORS (production-ready)
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// ✅ JSON parser
app.use(express.json());

// ✅ Cookie parser
app.use(cookieParser());


/* ===========================
   ROUTES
=========================== */

// health check
app.get("/", (req, res) => {
  res.send("EventBook API is running 🚀");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);  
app.use("/api/categories", categoryRoutes);


/* ===========================
   404 HANDLER
=========================== */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});


/* ===========================
   GLOBAL ERROR HANDLER
=========================== */
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong"
  });
});


/* ===========================
   START SERVER
=========================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});