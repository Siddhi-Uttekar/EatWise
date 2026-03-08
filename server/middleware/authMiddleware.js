import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // Check for authorization header
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      console.log("❌ No authorization header or invalid format");
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    // Extract token
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      console.log("❌ Token is empty");
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    console.log("✓ Token verified for user:", req.userId);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
};
