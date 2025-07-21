export function errorHandler(error, req, res, next) {
  // Log error for debugging


  console.error("Server Error:", error.message)

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

  // Generic error response
  res.status(500).json({
    error: "Internal server error"
  })
}