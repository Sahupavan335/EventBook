import db from "../config/db.js";

/* ===========================
   GET ALL CATEGORIES
=========================== */
export const getCategories = (req, res) => {

  db.query("SELECT * FROM categories ORDER BY name ASC", (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch categories" });

    res.json(result);
  });

};


/* ===========================
   CREATE CATEGORY (ADMIN)
=========================== */
export const createCategory = (req, res) => {

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Category name required"
    });
  }

  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    (err) => {

      if (err) {
        return res.status(500).json({
          message: "Category already exists or failed"
        });
      }

      res.status(201).json({
        message: "Category created"
      });

    }
  );

};