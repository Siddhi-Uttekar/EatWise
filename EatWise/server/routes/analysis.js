import express from "express";
import multer from "multer";
import path from "path";
import { analyzeIngredients, getAnalysisHistory } from "../services/analysisService.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Multer setup for file uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save uploads to the 'public/uploads' directory
    cb(null, "public/uploads/");
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
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Get file path if uploaded

    // Validate input
    if (!text?.trim()) {
      return res.status(400).json({ error: "No text provided" });
    }

    // Analyze ingredients using AI service
    const analysis = await analyzeIngredients(text, req.userId, imagePath);

    // Return analysis results
    res.json(analysis);
  } catch (error) {
    // Pass error to error handler middleware
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