import db from "../config/db.js";

/* ===========================
   ADD REVIEW
=========================== */
export const addReview = (req, res) => {

  const userId = req.user.id;
  const { service_id, rating, comment } = req.body;

  // ✅ ROLE CHECK (IMPORTANT)
  if (req.user.role !== "user") {
    return res.status(403).json({
      message: "Only users can review services"
    });
  }

  if (!service_id || !rating) {
    return res.status(400).json({
      message: "Service and rating are required"
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5"
    });
  }

  // prevent duplicate review
  db.query(
    "SELECT id FROM reviews WHERE user_id=? AND service_id=?",
    [userId, service_id],
    (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: "You already reviewed this service"
        });
      }

      const sql = `
        INSERT INTO reviews (user_id, service_id, rating, comment)
        VALUES (?, ?, ?, ?)
      `;

      db.query(sql, [userId, service_id, rating, comment], (err) => {

        if (err) {
          return res.status(500).json({ message: "Failed to add review" });
        }

        res.status(201).json({ message: "Review added" });

      });

    }
  );

};


/* ===========================
   GET SERVICE REVIEWS
=========================== */
export const getServiceReviews = (req, res) => {

  const { serviceId } = req.params;

  const sql = `
    SELECT 
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.service_id = ?
    ORDER BY r.id DESC
  `;

  db.query(sql, [serviceId], (err, result) => {

    if (err) {
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }

    res.json(result);

  });

};


/* ===========================
   DELETE REVIEW
=========================== */
export const deleteReview = (req, res) => {

  const userId = req.user.id;
  const { id } = req.params;

  db.query(
    "DELETE FROM reviews WHERE id=? AND user_id=?",
    [id, userId],
    (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Delete failed" });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({
          message: "Unauthorized or review not found"
        });
      }

      res.json({ message: "Review deleted" });

    }
  );

};