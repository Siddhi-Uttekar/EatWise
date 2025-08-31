import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { extractText, analyzeIngredients } from "./modules/api.js";
import ResultCard from "./components/ResultCard.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Search,
  CheckCircle,
  AlertCircle,
  Zap,
  BookOpen,
  Home as HomeIcon,
  Clock,
  Camera,
  Sparkles,
  LogIn,
  LogOut
} from "lucide-react";

// Enhanced Home component with shadcn/ui
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
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className=" flex justify-center items-center mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className=" p-2.5 text-5xl font-bold text-slate-900 mb-4">
            EatWise
          </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload a food label image and get instant analysis of ingredient
            safety, nutritional information, and health recommendations
          </p>
        </div>

        {/* Upload Card */}
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              Upload Food Label
            </CardTitle>
            <CardDescription className="text-slate-600">
              Take a photo or upload an image of your food label for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div className="relative">
              <Label
                htmlFor="fileInput"
                className="group relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-lg p-12 text-center cursor-pointer block transition-all duration-300 hover:bg-slate-50"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900">
                    Drop your image here
                  </h3>
                  <p className="text-slate-600 mb-4">
                    or click to browse from your device
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <Badge variant="secondary" className="gap-1 bg-slate-100 text-slate-800">
                      <Camera className="w-3 h-3" />
                      JPG, PNG
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-800">Max 10MB</Badge>
                  </div>
                </div>
              </Label>
              <Input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Preview and Analysis */}
            {previewURL && (
              <Card className="bg-slate-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Image Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={previewURL}
                      alt="Preview"
                      className="max-w-full max-h-64 object-contain rounded-lg shadow-lg border border-slate-200"
                    />
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Analyzing Ingredients...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Analyze Ingredients
                      </>
                    )}
                  </Button>
                  {loading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Processing image...</span>
                        <span>Please wait</span>
                      </div>
                      <Progress value={33} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysisResults && (
          <div className="animate-in fade-in-50 duration-500">
            <ResultCard analysis={analysisResults} />
          </div>
        )}

        {/* Features Section */}
        {!analysisResults && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center border-0 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-2 text-slate-900">Instant Analysis</h3>
                <p className="text-sm text-slate-600">
                  Get immediate insights about ingredient safety and nutritional value
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2 text-slate-900">AI-Powered</h3>
                <p className="text-sm text-slate-600">
                  Advanced AI technology for accurate ingredient recognition and analysis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-semibold mb-2 text-slate-900">Health Insights</h3>
                <p className="text-sm text-slate-600">
                  Detailed health recommendations based on ingredient analysis
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced App layout component with shadcn/ui
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
    <div className="min-h-screen bg-slate-100">
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex align-center items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-green-600 rounded-full  shadow-lg">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
              <span className="text-xl font-bold text-slate-900">
                EatWise
              </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              <Button
                asChild
                variant={location.pathname === "/" ? "default" : "ghost"}
                className={
                  location.pathname === "/"
                    ? "bg-green-400 hover:bg-green-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }
              >
                <Link to="/">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Analyze
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/history" ? "default" : "ghost"}
                className={
                  location.pathname === "/history"
                    ? "bg-green-400 hover:bg-green-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }
              >
                <Link to="/history">
                  <Clock className="w-4 h-4 mr-2" />
                  History
                </Link>
              </Button>
              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  asChild
                  variant={location.pathname === "/login" ? "default" : "ghost"}
                  className={
                    location.pathname === "/login"
                      ? "bg-green-400 hover:bg-green-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }
                >
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}