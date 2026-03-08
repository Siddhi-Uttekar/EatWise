import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { analyzeIngredients, getAnalysisHistory } from "../services/analysisService.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Multer setup for file uploads ---
const uploadDir = "public/uploads";

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✓ Created uploads directory:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save uploads to the 'public/uploads' directory
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


// POST /api/analysis/analyze - Analyze ingredients text
router.post("/analyze", protect, upload.single("image"), async (req, res, next) => {
  try {
    const { text } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("📥 Analysis request from user:", req.userId);
    console.log("📄 Text length:", text?.length || 0);
    console.log("🖼️ Image uploaded:", !!req.file);
    console.log("🖼️ Image path:", imagePath);

    // Validate input
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "No text provided for analysis" });
    }

    if (text.trim().length < 5) {
      return res.status(400).json({ error: "Text too short. Please provide ingredient list." });
    }

    // Analyze ingredients using AI service
    const analysis = await analyzeIngredients(text, req.userId, imagePath);

    // Return analysis results
    res.json(analysis);
  } catch (error) {
    // Pass error to error handler middleware
    console.error("❌ Route error:", error.message);
    next(error);
  }
});

router.get("/history", protect, async (req, res, next) => {
  try {
    const history = await getAnalysisHistory(req.userId);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

export default router
