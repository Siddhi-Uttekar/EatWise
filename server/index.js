import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import ocrRoutes from "./routes/ocr.js";
import analysisRoutes from "./routes/analysis.js";
import authRoutes from "./routes/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const PORT = process.env.PORT || 5000

// Middleware setup
app.use(cors()); // Enable cross-origin requests
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies up to 10MB
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Serve static files from the built frontend
app.use(express.static(path.join(__dirname, "../client/dist")));

// Route handlers
app.use("/api/ocr", ocrRoutes)           // OCR-related endpoints
app.use("/api/analysis", analysisRoutes);  // Analysis-related endpoints
app.use("/api/auth", authRoutes);           // Auth-related endpoints

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString()
  })
})

// Catch-all handler: send back index.html for any non-API routes (for SPA routing)
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  }
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})