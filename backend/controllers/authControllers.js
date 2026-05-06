import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ===========================
   CHECK JWT SECRET
=========================== */
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

/* ===========================
   SIGNUP CONTROLLER
=========================== */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ secure role handling
    const role = req.body.role === "provider" ? "provider" : "user";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, result) => {

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "User already exists"
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

        db.query(
          sql,
          [name, email, hashedPassword, role],
          (err) => {

            if (err) {
              return res.status(500).json({ message: "Signup failed" });
            }

            res.status(201).json({
              message: "User registered successfully"
            });

          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ===========================
   LOGIN CONTROLLER
=========================== */
export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {

        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
          await new Promise(r => setTimeout(r, 500)); // 🔐 anti brute-force
          return res.status(400).json({
            message: "Invalid credentials"
          });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          await new Promise(r => setTimeout(r, 500)); // 🔐 anti brute-force
          return res.status(400).json({
            message: "Invalid credentials"
          });
        }

        const token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite:
            process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({
          message: "Login successful",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });

      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ===========================
   LOGOUT CONTROLLER
=========================== */
export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax"
    })
    .json({ message: "Logged out successfully" });
};


/* ===========================
   GET CURRENT USER
=========================== */
export const getMe = (req, res) => {
  res.json({
    user: req.user
  });
};