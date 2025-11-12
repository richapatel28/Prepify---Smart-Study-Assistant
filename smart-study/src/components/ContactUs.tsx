import React, { useState } from "react";
import { Send, Mail, MessageSquare, User } from "lucide-react";
import axios from "axios";
import Footer from "./Footer";
const ContactUs: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({
    type: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);
      if (res.status === 200) {
        setStatus({ type: "success", message: "✅ Message sent successfully!" });
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", message: "⚠️ Something went wrong. Try again later." });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setStatus({ type: "error", message: "❌ Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.2),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,0,255,0.15),transparent_60%)] animate-pulse" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-stretch gap-10 p-8 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
        
        {/* Left Info Section */}
        <div className="flex-1 flex flex-col justify-center p-6 md:p-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-300 mb-8 leading-relaxed">
            We'd love to hear from you! Whether you have a question, feedback, or just want to say hi —
            feel free to reach out. Our team will get back to you as soon as possible.
          </p>

          <div className="space-y-4 text-gray-300">
            <p>
              📧 <span className="text-cyan-400">support@smartstudyassistant.com</span>
            </p>
            <p>
              📞 <span className="text-purple-400">+91 98765 43210</span>
            </p>
            <p>
              📍 <span className="text-pink-400">Mumbai, India</span>
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 glass-card p-8 rounded-3xl space-y-6 bg-black/40 border border-white/10"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-cyan-400">Send us a message</h2>

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
              <User size={18} className="text-cyan-400" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-gray-600 rounded-xl p-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
              <Mail size={18} className="text-purple-400" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-gray-600 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
              <MessageSquare size={18} className="text-pink-400" /> Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-white/10 border border-gray-600 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none resize-none"
              placeholder="Write your message..."
            />
          </div>

          {status.message && (
            <div
              className={`text-center p-3 rounded-xl text-sm ${
                status.type === "success"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 font-semibold text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-cyan-500/30 hover:shadow-lg"
            }`}
          >
            <Send size={20} className={`${loading ? "animate-pulse" : ""}`} />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
    
  );

};

export default ContactUs;
