import express from "express"
import { analyzeIngredients } from "../services/analysisService.js"

const router = express.Router()

// POST /api/analysis/analyze - Analyze ingredients text
router.post("/analyze", async (req, res, next) => {
  try {
    const { text } = req.body

    // Validate input
    if (!text?.trim()) {
      return res.status(400).json({ error: "No text provided" })
    }

    // Analyze ingredients using AI service
    const analysis = await analyzeIngredients(text)

    // Return analysis results
    res.json(analysis)
  } catch (error) {
    // Pass error to error handler middleware
    next(error)
  }
})

export default router