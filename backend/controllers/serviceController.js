import db from "../config/db.js";

/* ===========================
   CREATE SERVICE
=========================== */
export const createService = (req, res) => {

  const {
    title,
    description,
    price,
    category,
    image
  } = req.body;

  const userId = req.user.id;

  // ✅ REQUIRED VALIDATION
  if (!title || !category || !price) {
    return res.status(400).json({
      message: "Title, category and price are required"
    });
  }

  // ✅ PRICE VALIDATION
  if (Number(price) < 0) {
    return res.status(400).json({
      message: "Invalid price"
    });
  }

  // ✅ CATEGORY NAME → CATEGORY ID
  const getCategorySql = `
    SELECT id
    FROM categories
    WHERE LOWER(name) = LOWER(?)
    LIMIT 1
  `;

  db.query(getCategorySql, [category], (catErr, catResult) => {

    if (catErr) {
      return res.status(500).json({
        message: "Failed to fetch category"
      });
    }

    if (catResult.length === 0) {
      return res.status(400).json({
        message: "Invalid category"
      });
    }

    const category_id = catResult[0].id;

    // ✅ INSERT SERVICE
    const sql = `
      INSERT INTO services (
        title,
        description,
        price,
        category_id,
        user_id
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        title,
        description,
        Number(price),
        category_id,
        userId
      ],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Failed to create service"
          });
        }

        const serviceId = result.insertId;

        // ✅ INSERT IMAGE
        if (image) {

          db.query(
            `
              INSERT INTO service_images (
                service_id,
                image_url
              )
              VALUES (?, ?)
            `,
            [serviceId, image]
          );

        }

        res.status(201).json({
          message: "Service created",
          id: serviceId
        });

      }
    );

  });

};


/* ===========================
   GET ALL SERVICES
=========================== */
export const getServices = (req, res) => {

  try {

    const {
      category,
      search,
      page = 1,
      limit = 8,
      minPrice,
      maxPrice,
      rating
    } = req.query;

    let sql = `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.price,

        u.name AS provider,
        c.name AS category,

        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating,
        COUNT(DISTINCT r.id) AS reviewCount,

        MIN(si.image_url) AS image

      FROM services s

      JOIN users u ON s.user_id = u.id
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN reviews r ON r.service_id = s.id
      LEFT JOIN service_images si ON si.service_id = s.id

      WHERE 1=1
    `;

    const values = [];

    if (category && category !== "all") {
      sql += " AND LOWER(c.name) LIKE ?";
      values.push(`%${category.toLowerCase()}%`);
    }

    if (search) {
      sql += `
        AND (
          LOWER(s.title) LIKE ? OR 
          LOWER(u.name) LIKE ?
        )
      `;

      values.push(
        `%${search.toLowerCase()}%`,
        `%${search.toLowerCase()}%`
      );
    }

    if (minPrice) {
      sql += " AND s.price >= ?";
      values.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += " AND s.price <= ?";
      values.push(Number(maxPrice));
    }

    sql += " GROUP BY s.id";

    if (rating) {
      sql += " HAVING rating >= ?";
      values.push(Number(rating));
    }

    const offset = (page - 1) * limit;

    sql += " ORDER BY s.id DESC LIMIT ? OFFSET ?";

    values.push(Number(limit), Number(offset));

    db.query(sql, values, (err, result) => {

      if (err) {
        return res.status(500).json({
          message: "Failed to fetch services"
        });
      }

      res.json(result);

    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


/* ===========================
   GET SINGLE SERVICE
=========================== */
export const getServiceById = (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT 
      s.id,
      s.title,
      s.description,
      s.price,

      u.name AS provider,
      c.name AS category,

      COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating,
      COUNT(DISTINCT r.id) AS reviewCount,

      MIN(si.image_url) AS image

    FROM services s

    JOIN users u ON s.user_id = u.id
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN reviews r ON r.service_id = s.id
    LEFT JOIN service_images si ON si.service_id = s.id

    WHERE s.id = ?
    GROUP BY s.id
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.json(result[0]);

  });

};


/* ===========================
   UPDATE SERVICE
=========================== */
export const updateService = (req, res) => {

  const { id } = req.params;

  const {
    title,
    description,
    price,
    category,
    image
  } = req.body;

  const userId = req.user.id;

  // ✅ GET CATEGORY ID
  const getCategorySql = `
    SELECT id
    FROM categories
    WHERE LOWER(name) = LOWER(?)
    LIMIT 1
  `;

  db.query(getCategorySql, [category], (catErr, catResult) => {

    if (catErr) {
      return res.status(500).json({
        message: "Failed to fetch category"
      });
    }

    if (catResult.length === 0) {
      return res.status(400).json({
        message: "Invalid category"
      });
    }

    const category_id = catResult[0].id;

    // ✅ UPDATE SERVICE
    const sql = `
      UPDATE services
      SET
        title=?,
        description=?,
        price=?,
        category_id=?
      WHERE id=? AND user_id=?
    `;

    db.query(
      sql,
      [
        title,
        description,
        Number(price),
        category_id,
        id,
        userId
      ],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Update failed"
          });
        }

        if (result.affectedRows === 0) {
          return res.status(403).json({
            message: "Unauthorized or service not found"
          });
        }

        // ✅ UPDATE IMAGE
        if (image) {

          db.query(
            `
              UPDATE service_images
              SET image_url = ?
              WHERE service_id = ?
            `,
            [image, id]
          );

        }

        res.json({
          message: "Service updated"
        });

      }
    );

  });

};


/* ===========================
   DELETE SERVICE
=========================== */
export const deleteService = (req, res) => {

  const { id } = req.params;
  const userId = req.user.id;

  db.query(
    "DELETE FROM services WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          message: "Delete failed"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({
          message: "Unauthorized or service not found"
        });
      }

      res.json({
        message: "Service deleted"
      });

    }
  );

};