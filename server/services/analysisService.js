import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import pool from "../utils/db.js";

// AI prompt template for ingredient analysis
const ANALYSIS_PROMPT = (ingredients) => `
Analyze these food ingredients for safety: "${ingredients}"

Return only JSON with this structure:
{
  "overallScore": (0-100),
  "overallRating": ("excellent"|"good"|"fair"|"poor"|"dangerous"),
  "ingredients": [
    {
      "name": "ingredient name",
      "safetyScore": (0-100),
      "riskLevel": ("safe"|"moderate"|"risky"),
      "concerns": ["concern1", "concern2"],
      "allergenInfo": {
        "isAllergen": true/false,
        "allergenType": "nuts" | "dairy" | "gluten" | "none"
      }
    }
  ],
  "summary": "brief safety explanation",
  "topRiskyIngredients": ["ingredient1", "ingredient2"],
  "recommendations": ["recommendation1", "recommendation2"]
}

Only return valid JSON. Do not include any explanation or text outside the JSON.
Focus on harmful additives, preservatives, allergens, and health risks.
`;

export async function analyzeIngredients(text, userId, imagePath) {
  const cleanText = text.replace(/\s+/g, " ").trim();

  if (cleanText.length < 5) {
    throw new Error("Text too short to analyze");
  }

  try {
    const result = await generateText({
      model: groq("llama-3.1-8b-instant"),
      messages: [{
        role: "user",
        content: ANALYSIS_PROMPT(cleanText)
      }],
    });

    console.log("AI raw response:", result.text); // Γ£à Log AI response

    const analysis = parseAnalysis(result.text);

    await pool.query(
      "INSERT INTO analysis_reports (user_id, report_data, image_path) VALUES ($1, $2, $3)",
      [userId, JSON.stringify(analysis), imagePath]
    );

    return analysis;
  } catch (error) {
    console.error("Analysis failed:", error);
    return createFallbackAnalysis();
  }
}

function parseAnalysis(text) {
  let cleanedJson = "";
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedJson = jsonMatch[0]
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');

      console.log("Attempting to parse cleaned JSON:", cleanedJson);
      return JSON.parse(cleanedJson);
    }
  } catch (error) {
    console.error("Failed to parse AI response JSON:", error.message);
    console.error("Problematic JSON string:", cleanedJson);
  }

  console.log("Returning fallback analysis due to parsing error.");
  return createFallbackAnalysis();
}

export const getAnalysisHistory = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM analysis_reports WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

function createFallbackAnalysis() {
  return {
    overallScore: 60,
    overallRating: "fair",
    ingredients: [
      {
        name: "General ingredients",
        safetyScore: 60,
        riskLevel: "moderate",
        concerns: ["Unable to identify specific ingredients"],
        allergenInfo: {
          isAllergen: false,
          allergenType: "none"
        }
      }
    ],
    summary: "Basic analysis completed. Upload clearer image for better results.",
    topRiskyIngredients: [],
    recommendations: [
      "Choose products with fewer additives",
      "Read labels carefully"
    ]
  };
}

