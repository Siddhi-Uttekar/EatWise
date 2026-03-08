import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ocrRoutes from "./routes/ocr.js";
import analysisRoutes from "./routes/analysis.js";
import authRoutes from "./routes/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import pool from "./utils/db.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const PORT = process.env.PORT || 5000

// Log environment variables status
console.log("🔧 Environment variables loaded:");
console.log("  - DATABASE_URL:", !!process.env.DATABASE_URL);
console.log("  - JWT_SECRET:", !!process.env.JWT_SECRET);
console.log("  - GROQ_API_KEY:", !!process.env.GROQ_API_KEY);
console.log("  - PORT:", process.env.PORT || "5000 (default)");

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Analysis reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analysis_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        report_data JSONB,
        image_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✓ Database tables initialized");
  } catch (err) {
    console.error("✗ Error initializing database:", err.message);
  }
};

// Initialize database before starting server
await initializeDatabase();

// Verify database connection
try {
  const result = await pool.query('SELECT NOW()');
  console.log("✓ Database connection verified");
} catch (err) {
  console.error("✗ Failed to connect to database:", err.message);
  console.error("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
  process.exit(1);
}

// Middleware setup
app.use(cors()); // Enable cross-origin requests
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies up to 10MB

// Ensure public directories exist
const publicDir = path.join(__dirname, "public");
const uploadsDir = path.join(publicDir, "uploads");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log("✓ Created public directory");
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✓ Created uploads directory");
}

app.use("/uploads", express.static(uploadsDir));

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

// Error handling middleware (must be last)
app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("Welcome to EatWise API Server");
});

// Start server
app.listen(PORT, () => {
  console.log(`≡ƒÜÇ Server running on http://localhost:${PORT}`)
})
