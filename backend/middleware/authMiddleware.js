import jwt from "jsonwebtoken";

/* ===========================
   VERIFY TOKEN (JWT + COOKIE)
=========================== */
export const verifyToken = (req, res, next) => {

  try {

    // ✅ support both cookie + header (important for production)
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach user
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token"
    });

  }

};


/* ===========================
   REQUIRE PROVIDER ROLE
=========================== */
export const requireProvider = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  if (req.user.role !== "provider") {
    return res.status(403).json({
      message: "Access denied: Provider only"
    });
  }

  next();

};


/* ===========================
   REQUIRE USER ROLE (optional)
=========================== */
export const requireUser = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  if (req.user.role !== "user") {
    return res.status(403).json({
      message: "Access denied: Users only"
    });
  }

  next();

};


/* ===========================
   REQUIRE ADMIN (future ready)
=========================== */
export const requireAdmin = (req, res, next) => {

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Admin only"
    });
  }

  next();

};