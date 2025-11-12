import React from "react";
import { Shield, Lock, Eye, FileText, UserCheck } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      icon: Shield,
      title: "Data Protection",
      desc: "We prioritize your privacy by implementing advanced security measures to safeguard your personal information and study data from unauthorized access.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Lock,
      title: "Account Security",
      desc: "Your account details and credentials are encrypted. We never share or sell your data to third-party advertisers or analytics providers.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Eye,
      title: "Information Usage",
      desc: "We only use your data to enhance your learning experience — customizing quizzes, tracking progress, and providing personalized study insights.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: UserCheck,
      title: "User Control",
      desc: "You have full control over your personal data. You can request data deletion, export, or updates at any time through your account settings.",
      color: "from-orange-400 to-red-500",
    },
    {
      icon: FileText,
      title: "Policy Updates",
      desc: "We may update this policy periodically to comply with regulations or improve transparency. Updates will always be communicated via your dashboard or email.",
      color: "from-indigo-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-6 md:px-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Your trust is our top priority. This policy explains how Prepify collects, protects, and uses your
          information responsibly.
        </p>
      </div>

      {/* Policy Cards Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {sections.map((item, index) => (
          <div
            key={index}
            className="glass-card p-6 rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}
            >
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
            <p className="text-gray-300 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Detailed Info Section */}
      <div className="mt-16 glass-card max-w-5xl mx-auto p-8 rounded-3xl shadow-2xl space-y-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">How We Handle Your Data</h2>
        <p className="text-gray-300 leading-relaxed">
          At <span className="text-white font-medium">Prepify</span>, your data privacy is deeply valued. 
          We collect only essential information — such as your name, email, and study preferences — to improve 
          your learning experience. None of your personal details are ever disclosed to third parties.
        </p>
        <p className="text-gray-300 leading-relaxed">
          We use industry-standard encryption and secure cloud storage to ensure your data remains confidential. 
          You may contact our support team to request data deletion, review, or export at any time.
        </p>
      </div>

      {/* Footer Message */}
      <div className="text-center mt-12 text-gray-400 text-sm">
        © {new Date().getFullYear()} Prepify. All Rights Reserved.
      </div>
    </div>
  );
};

export default PrivacyPolicy;
