"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface AuthFormProps {
  mode: "login" | "register";
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        const { error: err, token, user } = await login(email, password);
        if (err) {
          setError(err);
        } else {
          setSuccess("Login successful! Redirecting...");

          // ✅ Role-based redirect
          setTimeout(() => {
            if (user?.role === "admin") navigate("/admin-dashboard");
            else navigate("/dashboard");
          }, 1200);
        }
      } else {
        const { error: err, message } = await register(email, password, {
          full_name: fullName,
        });
        if (err) setError(err);
        else {
          setSuccess(message || "Registration successful!");
          setTimeout(() => {
            onToggleMode();
            setSuccess("");
          }, 1500);
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <motion.div
          className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <User className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back" : "Join Prepify"}
        </h2>
        <p className="text-gray-400 mt-2 text-sm leading-relaxed">
          {isLogin
            ? "Continue your learning journey"
            : "Start mastering any subject today"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ✅ Error / Success messages */}
        {error && (
          <motion.div
            className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 text-green-300 text-sm px-4 py-3 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* ✅ Register fields */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/90 text-white placeholder-gray-400 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* ✅ Email field */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/90 text-white placeholder-gray-400 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all"
            />
          </div>
        </div>

        {/* ✅ Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/90 text-white placeholder-gray-400 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ✅ Confirm Password for Register */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/90 text-white placeholder-gray-400 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* ✅ Submit button */}
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full mt-8 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : isLogin ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </motion.button>

        {/* ✅ Toggle link */}
        <div className="text-center mt-8 pt-6 border-t border-slate-700">
          <p className="text-gray-400 text-sm">
            {isLogin ? "New to Prepify? " : "Already have an account? "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors underline underline-offset-2"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
