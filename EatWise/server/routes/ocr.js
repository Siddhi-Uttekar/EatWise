import express from "express"
import multer from "multer"
import { extractText } from "../services/ocrService.js"

const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),        // Store in memory (not disk)
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)  // Accept file
    } else {
      cb(new Error("Only image files allowed"))  // Reject file
    }
  },
})

// POST /api/ocr/extract - Extract text from uploaded image
router.post("/extract", upload.single("image"), async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" })
    }

    // Extract text using OCR service
    const text = await extractText(req.file.buffer)

    // Return extracted text
    res.json({ text })
  } catch (error) {
    // Pass error to error handler middleware
    next(error)
  }
})

export default router