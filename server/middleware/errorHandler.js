export function errorHandler(error, req, res, next) {
  console.error("🔴 Server Error:", error.message);
  console.error(error.stack);

  // Handle specific error types
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "File too large (max 10MB)"
    })
  }

  if (error.message === "Only image files allowed") {
    return res.status(400).json({
      error: "Only image files allowed"
    })
  }

  // Handle database errors
  if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
    return res.status(503).json({
      error: "Database connection failed. Please try again later."
    })
  }

  // Handle duplicate key errors
  if (error.code === "23505") {
    return res.status(400).json({
      error: "User with this email already exists"
    })
  }

  // Handle validation errors
  if (error.message.includes("already exists")) {
    return res.status(400).json({
      error: error.message
    })
  }

  if (error.message.includes("Invalid")) {
    return res.status(401).json({
      error: error.message
    })
  }

  // Generic error response
  res.status(500).json({
    error: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message
  })
}
