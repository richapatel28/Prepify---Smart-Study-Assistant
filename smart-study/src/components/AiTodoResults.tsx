import React, { useEffect, useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AiTodoResults: React.FC = () => {
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem("aiTodoResults");
    if (stored) setResults(JSON.parse(stored));
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-cyan-900 text-white font-sans overflow-hidden">
      {/* Cyan Grid Overlay for theme consistency */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 L0 0 0 40" fill="none" stroke="#00FFFF" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Background Blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-16 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-16 right-16 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Todos
          </Link>

          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
            <h1 className="text-3xl font-extrabold gradient-text">
              AI Generated Todo Insights
            </h1>
          </div>
        </div>

        {/* AI Results */}
        {Object.keys(results).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(results).map(([task, answer], idx) => (
              <div
                key={idx}
                className="glass-card p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
              >
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  Task {idx + 1}: {task}
                </h3>

                <div className="text-gray-200 whitespace-pre-line leading-relaxed break-words mt-3 p-4 bg-black/40 rounded-2xl border border-white/10">
                  {typeof answer === "string" ? (
                    <>{answer}</>
                  ) : (
                    Object.entries(answer as Record<string, string>).map(
                      ([key, text]) => (
                        <div key={key} className="mb-4">
                          <h4 className="text-cyan-400 font-semibold">{key}</h4>
                          <p className="text-gray-300 whitespace-pre-line">{text}</p>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-20 text-lg">
            No AI-generated data found. Please go back and generate answers.
          </p>
        )}
      </div>
    </div>
  );
};

export default AiTodoResults;
