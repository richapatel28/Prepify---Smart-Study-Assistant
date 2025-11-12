import React from "react";
import { Heart, Users, Target, Sparkles, BookOpen } from "lucide-react";

const AboutUs: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: "Our Mission",
      desc: "To empower students through AI-driven tools that make learning smarter, faster, and more engaging.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Users,
      title: "Our Team",
      desc: "A diverse group of developers, educators, and innovators passionate about redefining digital education.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Heart,
      title: "Our Values",
      desc: "We believe in innovation, accessibility, and continuous improvement to make learning available for everyone.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-6 md:px-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-12 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg mb-6 animate-glow">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
          About Prepify
        </h1>
        <p className="text-gray-400 mt-3 text-lg max-w-2xl">
          Your AI-powered companion for smarter, more personalized learning.
        </p>
      </div>

      {/* About Text Section */}
      <div className="glass-card max-w-4xl mx-auto p-8 rounded-3xl shadow-2xl mb-12">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Prepify is an innovative learning platform designed to transform the way students study. By
          combining the power of artificial intelligence with modern education techniques, we help students
          grasp complex concepts with ease and stay motivated throughout their academic journey.
        </p>
        <p className="text-gray-300 text-lg leading-relaxed">
          Whether you’re preparing for competitive exams, organizing your study schedule, or practicing with
          personalized quizzes, Prepify adapts to your learning pace and style—making every session count.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
            >
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="glass-card max-w-3xl mx-auto p-8 rounded-3xl text-center shadow-xl">
        <div className="flex justify-center mb-4">
          <BookOpen className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">Start Your Learning Journey</h3>
        <p className="text-gray-300 mb-6">
          Thousands of students have already joined Prepify to experience the future of learning.  
          Take the next step toward your academic goals with us today.
        </p>

      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Prepify. Empowering Students with AI.
      </div>
    </div>
  );
};

export default AboutUs;
