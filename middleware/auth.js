function checkUserRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ error: "Access denied: Insufficient permissions" });
    }
  };
}

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res
      .status(401)
      .json({ error: "Unauthorized: Please log in to access this resource" });
  }
};

module.exports = {
  checkUserRole,
  isAuthenticated,
};
