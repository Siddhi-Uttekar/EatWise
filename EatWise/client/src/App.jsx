import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { extractText, analyzeIngredients } from "./modules/api.js";
import { ResultCard } from "./components/ResultCard.jsx";


// This will be the component for the main page
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
    </div>
  );
}

// This is the main layout component
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

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
