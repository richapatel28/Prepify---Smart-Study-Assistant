import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-900/80 backdrop-blur-lg border-t border-gray-700/30 text-gray-300 px-6 py-12">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* About */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-white">Prepify</h3>
        <p className="text-gray-400 text-sm">
          Your AI-powered study companion. Transform learning, track progress, and achieve academic success.
        </p>
      </div>

      {/* Features */}
      <div>
        <h4 className="font-semibold text-lg mb-4 text-white">Features</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li><a href="#" className="hover:text-cyan-400 transition-colors">AI Learning</a></li>
          <li><a href="#" className="hover:text-cyan-400 transition-colors">Smart Notes</a></li>
          <li><a href="#" className="hover:text-cyan-400 transition-colors">Quizzes</a></li>
          <li><a href="#" className="hover:text-cyan-400 transition-colors">To-Do Lists</a></li>
        </ul>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li><a href="/" className="hover:text-cyan-400 transition-colors">Home</a></li>
          <li><a href="/about" className="hover:text-cyan-400 transition-colors">About Us</a></li>
          <li><a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
          <li><a href="/privacy-policy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
        </ul>
      </div>

      {/* Contact & Social */}
      <div>
        <h4 className="font-semibold text-lg mb-4 text-white">Connect</h4>
        <p className="text-gray-400 text-sm mb-4">Email: support@prepify.com</p>
        <div className="flex gap-4">
          <a href="https://www.facebook.com/" className="hover:text-cyan-400 transition-colors"><Facebook className="w-5 h-5"/></a>
          <a href="https://x.com/?lang=en-in/" className="hover:text-cyan-400 transition-colors"><Twitter className="w-5 h-5"/></a>
          <a href="https://www.instagram.com/" className="hover:text-cyan-400 transition-colors"><Instagram className="w-5 h-5"/></a>
          <a href="https://www.linkedin.com/" className="hover:text-cyan-400 transition-colors"><Linkedin className="w-5 h-5"/></a>
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className="mt-12 border-t border-gray-700/50 pt-6 text-center text-gray-500 text-sm">
      <p>© 2025 Prepify. All rights reserved.</p>
      <p>Designed with ❤️ for smarter studying.</p>
    </div>
  </footer>
);

export default Footer;
