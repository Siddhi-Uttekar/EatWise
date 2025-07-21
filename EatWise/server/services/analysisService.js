import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

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

export async function analyzeIngredients(text) {
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

    console.log("AI raw response:", result.text); // ✅ Log AI response

    return parseAnalysis(result.text);
  } catch (error) {
    console.error("Analysis failed:", error);
    return createFallbackAnalysis();
  }
}

function parseAnalysis(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const cleaned = jsonMatch[0]
        .replace(/(\r\n|\n|\r)/gm, "") // remove line breaks
        .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":') // ensure keys are quoted
        .replace(/,\s*}/g, '}') // remove trailing commas
        .replace(/,\s*]/g, ']');

      return JSON.parse(cleaned);
    }
  } catch (error) {
    console.error("Parse error:", error);
  }

  return createFallbackAnalysis();
}

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
