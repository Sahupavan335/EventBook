import db from "../config/db.js";

/* ===========================
   CREATE BOOKING
=========================== */
export const createBooking = (req, res) => {

  const userId = req.user.id;
  const { service_id, booking_date } = req.body;

  if (!service_id || !booking_date) {
    return res.status(400).json({
      message: "Service and date are required"
    });
  }

  // ✅ restrict to user only
  if (req.user.role !== "user") {
    return res.status(403).json({
      message: "Only users can book services"
    });
  }

  // prevent past booking
  const selectedDate = new Date(booking_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return res.status(400).json({
      message: "Cannot book past dates"
    });
  }

  // ✅ check service exists
  db.query(
    "SELECT id FROM services WHERE id = ?",
    [service_id],
    (err, service) => {

      if (err) return res.status(500).json({ message: "Database error" });

      if (service.length === 0) {
        return res.status(404).json({
          message: "Service not found"
        });
      }

      // ✅ prevent duplicate booking
      db.query(
        "SELECT id FROM bookings WHERE user_id=? AND service_id=? AND booking_date=?",
        [userId, service_id, booking_date],
        (err, existing) => {

          if (err) return res.status(500).json({ message: "Database error" });

          if (existing.length > 0) {
            return res.status(400).json({
              message: "You already booked this service on this date"
            });
          }

          const sql = `
            INSERT INTO bookings (user_id, service_id, booking_date)
            VALUES (?, ?, ?)
          `;

          db.query(sql, [userId, service_id, booking_date], (err, result) => {
            if (err) return res.status(500).json({ message: "Booking failed" });

            res.status(201).json({
              message: "Booking created",
              id: result.insertId
            });
          });

        }
      );

    }
  );

};


/* ===========================
   GET USER BOOKINGS
=========================== */
export const getUserBookings = (req, res) => {

  const userId = req.user.id;

  const sql = `
    SELECT 
      b.id,
      b.booking_date,
      b.status,

      s.title,
      s.price,

      si.image_url AS image,

      u.name AS provider,
      c.name AS category

    FROM bookings b
    JOIN services s ON b.service_id = s.id
    JOIN users u ON s.user_id = u.id
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN service_images si ON si.service_id = s.id

    WHERE b.user_id = ?
    ORDER BY b.id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch bookings" });

    res.json(result);
  });

};


/* ===========================
   GET PROVIDER BOOKINGS
=========================== */
export const getProviderBookings = (req, res) => {

  const providerId = req.user.id;

  const sql = `
    SELECT 
      b.id,
      b.booking_date,
      b.status,

      s.title,
      s.price,

      u.name AS customer

    FROM bookings b
    JOIN services s ON b.service_id = s.id
    JOIN users u ON b.user_id = u.id

    WHERE s.user_id = ?
    ORDER BY b.id DESC
  `;

  db.query(sql, [providerId], (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Failed to fetch bookings"
      });
    }

    res.json(result);

  });

};


/* ===========================
   UPDATE BOOKING STATUS
=========================== */
export const updateBookingStatus = (req, res) => {

  const providerId = req.user.id;
  const { id } = req.params;
  let { status } = req.body;

  const allowedStatus = ["pending", "confirmed", "cancelled", "completed"];

  // normalize
  status = status?.toLowerCase();

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  const sql = `
    UPDATE bookings b
    JOIN services s ON b.service_id = s.id
    SET b.status = ?
    WHERE b.id = ? AND s.user_id = ?
  `;

  db.query(sql, [status, id, providerId], (err, result) => {

    if (err) return res.status(500).json({ message: "Update failed" });

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Unauthorized or booking not found"
      });
    }

    res.json({ message: "Booking updated" });

  });

};


/* ===========================
   DELETE BOOKING
=========================== */
export const deleteBooking = (req, res) => {

  const userId = req.user.id;
  const { id } = req.params;

  db.query(
    "DELETE FROM bookings WHERE id=? AND user_id=?",
    [id, userId],
    (err, result) => {

      if (err) return res.status(500).json({ message: "Delete failed" });

      if (result.affectedRows === 0) {
        return res.status(403).json({
          message: "Unauthorized or booking not found"
        });
      }

      res.json({ message: "Booking deleted" });

    }
  );

};