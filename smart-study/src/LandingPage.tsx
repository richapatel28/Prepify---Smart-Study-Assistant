import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Brain, Sparkles, X, GraduationCap, Star
} from "lucide-react";
import AuthForm from "./components/AuthForm";
import Footer from "./components/Footer";

const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleToggleMode = () => setMode(prev => prev === "login" ? "register" : "login");

  const features = [
    { icon: Brain, title: "AI-Powered Learning", desc: "Personalized study paths adapt to your pace", color: "from-purple-500 to-pink-500" },
    { icon: BookOpen, title: "Smart Notes", desc: "Transform your notes into study materials", color: "from-cyan-500 to-blue-500" },
    { icon: Sparkles, title: "Interactive Quizzes", desc: "Test your knowledge with AI-generated quizzes", color: "from-yellow-500 to-amber-500" },
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "50K+", label: "Study Sessions" },
    { value: "98%", label: "Success Rate" }
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-cyan-900 overflow-hidden text-white">
      
      {/* Cyan Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 L0 0 0 40" fill="none" stroke="#00FFFF" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-16 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-16 right-16 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section + Features + Stats */}
      <AnimatePresence mode="wait">
        {!showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg animate-glow">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Prepify</span>
              </div>
            </nav>

            {/* Hero Content */}
            <div className="container mx-auto px-6 py-20 text-center">
              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
                className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
              >
                Study Smarter, <span className="text-white">Not Harder</span>
              </motion.h1>

              <motion.p
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }}
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Transform your learning journey with AI-powered tools designed for modern students
              </motion.p>

              <motion.button
                onClick={() => { setMode("login"); setShowAuth(true); }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="px-10 py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:shadow-2xl transition-all relative overflow-hidden"
              >
                Start Learning Free
                <Star className="w-5 h-5 inline ml-2 animate-bounce" />
              </motion.button>

              {/* Stats */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
                className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
              >
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-6 py-20">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 + idx * 0.2, duration: 1, ease: "easeInOut" }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="glass-card p-8 rounded-3xl hover:shadow-2xl transition-all cursor-pointer bg-white/10 backdrop-blur-md border border-white/20"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <div className="glass-card rounded-3xl p-8 shadow-2xl bg-black/90 backdrop-blur-lg border border-white/20">
                <button
                  onClick={() => setShowAuth(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <AuthForm mode={mode} onToggleMode={handleToggleMode} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extra Tailwind Animations */}
      <style>{`
        .animate-float-slow {
          animation: float 12s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

    </div>
  );
};

export default Landing;
