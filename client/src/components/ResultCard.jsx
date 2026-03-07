import { getRatingColor, getRiskColor, getRiskEmoji } from "../modules/utils.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lightbulb } from "lucide-react";

export default function ResultCard({ analysis }) {
  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Overall Rating */}
      <Card className="shadow-lg border-2 border-gray-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Overall Safety Rating</CardTitle>
            <Badge
              className={`text-lg font-semibold px-4 py-2 rounded-full bg-${getRatingColor(
                analysis.overallRating
              )}-100 text-${getRatingColor(analysis.overallRating)}-800`}
            >
              {analysis.overallRating.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xl font-medium text-gray-600">Safety Score</span>
              <span className={`text-5xl font-bold text-${getRatingColor(analysis.overallRating)}-600`}>
                {analysis.overallScore}
                <span className="text-2xl font-medium text-gray-500">/100</span>
              </span>
            </div>
            <Progress
              value={analysis.overallScore}
              className={`h-3 [&>*]:bg-${getRatingColor(analysis.overallRating)}-500`}
            />
          </div>
          <p className="text-lg text-gray-700 pt-2">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Risky Ingredients */}
      {analysis.topRiskyIngredients.length > 0 && (
        <Alert variant="destructive" className="shadow-lg">
          <AlertCircle className="h-6 w-6" />
          <AlertTitle className="text-xl font-bold">Top Risky Ingredients</AlertTitle>
          <AlertDescription className="pt-2">
            <ul className="list-disc list-inside space-y-1 text-lg">
              {analysis.topRiskyIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Ingredient Analysis */}
      <Card className="shadow-lg border-2 border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Ingredient Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analysis.ingredients.map((ingredient) => (
              <div
                key={ingredient.name}
                className={`p-4 rounded-lg border-l-8 border-${getRiskColor(
                  ingredient.riskLevel
                )}-400 bg-gray-50`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{ingredient.name}</h3>
                  <Badge
                    className={`text-md font-medium px-3 py-1 bg-${getRiskColor(
                      ingredient.riskLevel
                    )}-100 text-${getRiskColor(ingredient.riskLevel)}-800`}
                  >
                    {getRiskEmoji(ingredient.riskLevel)} {ingredient.safetyScore}/100
                  </Badge>
                </div>
                {ingredient.allergenInfo.isAllergen && (
                  <p className="text-lg text-yellow-700 mt-2">
                    <span className="font-semibold">Allergen:</span> {ingredient.allergenInfo.allergenType}
                  </p>
                )}
                {ingredient.concerns.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold text-lg text-destructive">Concerns:</h4>
                    <ul className="text-lg text-destructive mt-1 list-disc list-inside space-y-1">
                      {ingredient.concerns.map((concern, concernIndex) => (
                        <li key={concernIndex}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Alert className="bg-sky-50 border-2 border-sky-200 text-sky-800 shadow-lg">
        <Lightbulb className="h-6 w-6 text-sky-600" />
        <AlertTitle className="text-xl font-bold">Recommendations</AlertTitle>
        <AlertDescription className="pt-2">
          <ul className="list-disc list-inside space-y-1 text-lg">
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
