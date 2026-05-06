/* ===========================
   ROLE-BASED ACCESS CONTROL
=========================== */

export const requireRole = (role) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        message: `Access denied: ${role} only`
      });
    }

    next();
  };
};


// specific roles
export const requireAdmin = requireRole("admin");
export const requireProvider = requireRole("provider");
export const requireUser = requireRole("user");