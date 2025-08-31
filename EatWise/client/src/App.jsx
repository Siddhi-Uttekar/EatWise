import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { extractText, analyzeIngredients } from "./modules/api.js";
import { ResultCard } from "./components/ResultCard.jsx";


// This will be the component for the main page
export function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(file ? URL.createObjectURL(file) : "");
    setError("");
    setAnalysisResults(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError("");

      const { text } = await extractText(selectedFile);
      const analysis = await analyzeIngredients(text, selectedFile);

      setAnalysisResults(analysis);
    } catch (err) {
      setError(err.message);
      setAnalysisResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🍎 Food Safety Analyzer</h1>
        <p className="text-gray-600">Upload food label to analyze ingredient safety</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📷 Upload Food Label</h2>
        <label
          htmlFor="fileInput"
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer block"
        >
          <div className="text-4xl mb-2">📤</div>
          <p className="text-gray-700">Click to upload image</p>
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {previewURL && (
          <div className="mt-4 text-center">
            <img
              src={previewURL}
              alt="Preview"
              className="max-w-full h-48 object-contain mx-auto rounded"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "🔍 Analyze Ingredients"}
            </button>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
            {error}
          </div>
        )}
      </div>
      {analysisResults && <ResultCard analysis={analysisResults} />}
    </div>
  );
}

// This is the main layout component
export default function App() {
  return (
    <div>
      <nav className="bg-gray-100 p-4">
        <ul className="flex justify-center space-x-6">
          <li><Link to="/" className="text-blue-600 hover:underline">Home</Link></li>
          <li><Link to="/history" className="text-blue-600 hover:underline">History</Link></li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
