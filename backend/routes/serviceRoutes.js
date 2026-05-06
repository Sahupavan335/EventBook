import express from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} from "../controllers/serviceController.js";

import { verifyToken, requireProvider } from "../middleware/authMiddleware.js";
import db from "../config/db.js"; // ✅ better than req.app.get("db")

const router = express.Router();

/* ===========================
   PUBLIC ROUTES
=========================== */

// Get all services
router.get("/", getServices);


/* ===========================
   PROTECTED ROUTES (PROVIDER)
=========================== */

// ✅ MUST COME BEFORE /:id
router.get("/my/services", verifyToken, requireProvider, (req, res) => {

  const sql = `
    SELECT 
      s.id,
      s.title,
      s.description,
      s.price,

      c.name AS category,

      MIN(si.image_url) AS image

    FROM services s
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN service_images si ON si.service_id = s.id

    WHERE s.user_id = ?

    GROUP BY s.id
    ORDER BY s.id DESC
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch services" });
    }
    res.json(result);
  });

});


// Create service
router.post("/", verifyToken, requireProvider, createService);

// Update service
router.put("/:id", verifyToken, requireProvider, updateService);

// Delete service
router.delete("/:id", verifyToken, requireProvider, deleteService);


/* ===========================
   PUBLIC (LAST)
=========================== */

// ⚠️ KEEP THIS LAST
router.get("/:id", getServiceById);

export default router;