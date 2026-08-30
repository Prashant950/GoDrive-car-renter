/**
 * Allow only admins past this point. Must run AFTER protect.
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};
