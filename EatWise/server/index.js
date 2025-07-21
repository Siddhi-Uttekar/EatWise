import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import ocrRoutes from "./routes/ocr.js"
import analysisRoutes from "./routes/analysis.js"
import { errorHandler } from "./middleware/errorHandler.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware setup
app.use(cors())                           // Enable cross-origin requests
app.use(express.json({ limit: "10mb" }))  // Parse JSON bodies up to 10MB

// Route handlers
app.use("/api/ocr", ocrRoutes)           // OCR-related endpoints
app.use("/api/analysis", analysisRoutes)  // Analysis-related endpoints

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("Welcome to EatWise API Server");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})