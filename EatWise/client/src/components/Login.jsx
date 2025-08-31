import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../modules/auth.js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-cyan-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-gray-100 animate-in fade-in-50 duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 pt-2">
            Sign in to access your analysis history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">Email</Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-6 w-6 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="pl-12 h-12 text-lg border-2 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">Password</Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-6 w-6 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-12 h-12 text-lg border-2 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading} className="w-full h-14 text-xl font-semibold bg-green-600 hover:bg-green-700">
              {loading ? "Logging in..." : "Log In"}
              {!loading && <ArrowRight className="ml-2 h-6 w-6" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-lg text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
