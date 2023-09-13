const jwt = require("jsonwebtoken");

const secretKey = "x&zH9p2BQ7LWc@Kd3E$RgFt5yUvXwZ1q";

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Token missing." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Authentication failed: Invalid token." });
    }

    req.user = decoded;
    next();
  });
};

const checkUserRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions." });
    }

    next();
  };
};

module.exports = { authenticateUser, checkUserRole };
