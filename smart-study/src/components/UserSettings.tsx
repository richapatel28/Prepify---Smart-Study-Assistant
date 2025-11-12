import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Save, Settings as SettingsIcon, Loader2 } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
  lastActiveAt?: string;
  totalStudyTime?: number;
}

const UserSettings: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // ✅ Fetch user data on mount
useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get<{ user: UserProfile }>(
        "http://localhost:5000/api/user/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = res.data.user;
      setUser(userData);
      setFormData({ name: userData.name, email: userData.email });
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  // ✅ Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.type === "email" ? "email" : "name"]: e.target.value });
  };

  // ✅ Save changes to DB
const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      "http://localhost:5000/api/user/update",
      { name: formData.name, email: formData.email },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Profile updated successfully!");
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Failed to update profile");
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300">
        <Loader2 className="animate-spin w-8 h-8 mr-2" /> Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg animate-glow">
          <SettingsIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-4xl font-black gradient-text">User Settings</h2>
          <p className="text-gray-400 mt-1">Manage your account preferences</p>
        </div>
      </div>

      {/* Editable Form */}
      <div className="glass-card p-8 rounded-3xl shadow-xl space-y-6">
        <div>
          <label className="block mb-3">
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <User size={18} className="text-cyan-400" />
              <span className="font-semibold">Full Name</span>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full bg-black/40 border border-white/20 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </label>
        </div>

        <div>
          <label className="block mb-3">
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <Mail size={18} className="text-purple-400" />
              <span className="font-semibold">Email Address</span>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-black/40 border border-white/20 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/30 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Account Info */}
      <div className="glass-card p-8 rounded-3xl shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-4">Account Information</h3>
        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between p-4 rounded-2xl glass-button">
            <span>Account Status</span>
            <span className="text-green-400 font-semibold">Active</span>
          </div>
          <div className="flex justify-between p-4 rounded-2xl glass-button">
            <span>Member Since</span>
            <span className="text-cyan-400 font-semibold">
              {new Date(user?.createdAt || "").toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between p-4 rounded-2xl glass-button">
            <span>Yesterday’s Study Time</span>
            <span className="text-purple-400 font-semibold">
              {user?.totalStudyTime ? `${user.totalStudyTime} hrs` : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
