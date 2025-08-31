import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { extractText, analyzeIngredients } from "./modules/api.js";
import { ResultCard } from "./components/ResultCard.jsx";

export function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setError("");
      setAnalysisResults(null);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setError("");
      setAnalysisResults(null);
    } else {
      setError("Please drop a valid image file");
    }
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

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewURL("");
    setError("");
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              🍎 Food Safety Analyzer
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload food labels to analyze ingredient safety and get detailed
            insights about what you're eating
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 transition-all duration-300 hover:shadow-2xl">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
              <span className="mr-2">📷</span> Upload Food Label
            </h2>
            <p className="text-gray-500 text-sm">
              Drag & drop an image or click to browse
            </p>
          </div>

          <div
            className={`p-8 text-center cursor-pointer transition-colors duration-200 ${
              isDragging ? "bg-blue-50" : "bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label htmlFor="fileInput" className="block">
              <div
                className={`border-2 border-dashed rounded-xl p-10 transition-all duration-300 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl mb-4 text-blue-500">📤</div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, or WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {previewURL && (
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={previewURL}
                      alt="Preview"
                      className="w-full h-64 object-contain bg-white"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-1">
                      Selected File
                    </h3>
                    <p className="text-gray-900 font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🔍</span> Analyze Ingredients
                        </>
                      )}
                    </button>
                    <button
                      onClick={clearFile}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center"
                    >
                      <span className="mr-2">✕</span> Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {analysisResults && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Analysis Results
              </h2>
              <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                ✓ Analysis Complete
              </div>
            </div>
            <ResultCard analysis={analysisResults} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-blue-600 font-bold text-xl">
                  🍎 FoodSafety
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/history"
                  className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
                >
                  History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Food Safety Analyzer. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
