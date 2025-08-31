import { getRatingColor, getRiskColor, getRiskEmoji } from "../modules/utils.js";

export function ResultCard({ analysis }) {
  // Return null or a placeholder if there's no analysis data
  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Overall Safety Rating Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Overall Safety Rating</h2>
          <span className={`px-3 py-1 bg-${getRatingColor(analysis.overallRating)}-100 text-${getRatingColor(analysis.overallRating)}-800 rounded`}>
            {analysis.overallRating.toUpperCase()}
          </span>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Safety Score</span>
            <span>{analysis.overallScore}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analysis.overallScore}%` }}></div>
          </div>
        </div>
        <p className="text-gray-700">{analysis.summary}</p>
      </div>

      {/* Risky Ingredients Card */}
      {analysis.topRiskyIngredients.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Risky Ingredients:</h3>
          <ul className="text-red-700 list-disc list-inside">
            {analysis.topRiskyIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Ingredient Analysis Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">🧪 Ingredient Analysis</h2>
        <div className="space-y-4">
          {analysis.ingredients.map((ingredient, index) => (
            <div key={index} className={`border-l-4 border-${getRiskColor(ingredient.riskLevel)}-400 pl-4`}>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{ingredient.name}</h3>
                <span className={`text-sm text-${getRiskColor(ingredient.riskLevel)}-600`}>
                  {getRiskEmoji(ingredient.riskLevel)} {ingredient.safetyScore}/100
                </span>
              </div>
              {ingredient.allergenInfo.isAllergen && (
                <p className="text-sm text-yellow-600 mt-1">
                  ⚠️ Allergen: {ingredient.allergenInfo.allergenType}
                </p>
              )}
              {ingredient.concerns.length > 0 && (
                <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
                  {ingredient.concerns.map((concern, concernIndex) => (
                    <li key={concernIndex}>{concern}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Recommendations:</h3>
        <ul className="text-blue-700 list-disc list-inside">
          {analysis.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
