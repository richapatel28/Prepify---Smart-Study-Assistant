import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Flame,
  Award,
  TrendingUp,
  LogOut,
  Plus,
  Edit,
  Trash,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  avgStreak: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  dailyStreak: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", dailyStreak: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const statsRes = await fetch("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        setStats(statsData);

        const usersRes = await fetch("http://localhost:5000/api/admin/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await usersRes.json();
        setUsers(userData.leaderboard || []);
      } catch (err) {
        console.error("❌ Failed to fetch admin data:", err);
      }
    };

    fetchData();
  }, [navigate]);

  const logoutAdmin = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 📊 Prepare line chart data
  const chartData = users.map((u) => ({
    name: u.name,
    streak: u.dailyStreak,
  }));

  // ➕ Add User
  const addUser = async () => {
    if (!newUser.name || !newUser.email) return alert("Please fill all fields");
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      setUsers([...users, data.user]);
      setNewUser({ name: "", email: "", dailyStreak: 0 });
    } catch (err) {
      console.error("❌ Add user failed:", err);
    }
  };

  // ✏️ Edit User
  const saveUser = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editingUser),
      });
      const data = await res.json();
      setUsers(users.map((u) => (u._id === data.user._id ? data.user : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("❌ Update user failed:", err);
    }
  };

  // 🗑️ Delete User
  const deleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("❌ Delete user failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard ⚙️</h1>
        <button
          onClick={logoutAdmin}
          className="flex items-center bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all"
        >
          <LogOut className="mr-2" /> Logout
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
            <Users size={32} />
            <div>
              <h3>Total Users</h3>
              <p className="text-2xl">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
            <Flame size={32} />
            <div>
              <h3>Active Users</h3>
              <p className="text-2xl">{stats.activeUsers}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
            <Award size={32} />
            <div>
              <h3>Avg Streak</h3>
              <p className="text-2xl">{stats.avgStreak}</p>
            </div>
          </div>
        </div>
      )}

      {/* Line Graph */}
      <div className="bg-gray-800/70 p-6 rounded-2xl shadow-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">📈 User Activity Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="streak"
              stroke="#00FFFF"
              strokeWidth={2.5}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard CRUD */}
      <div className="bg-gray-800/70 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">🏆 Leaderboard & User Management</h2>

        {/* Add User */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="p-2 rounded bg-gray-700 w-1/4"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="p-2 rounded bg-gray-700 w-1/4"
          />
          <input
            type="number"
            placeholder="Streak"
            value={newUser.dailyStreak}
            onChange={(e) => setNewUser({ ...newUser, dailyStreak: +e.target.value })}
            className="p-2 rounded bg-gray-700 w-1/4"
          />
          <button
            onClick={addUser}
            className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="mr-2" /> Add
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700 text-cyan-300">
              <th className="p-2">#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Streak</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u._id}
                className="border-b border-gray-700 hover:bg-gray-700/30 transition"
              >
                <td className="p-2">{i + 1}</td>
                <td>
                  {editingUser?._id === u._id ? (
                    <input
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                      className="bg-gray-700 p-1 rounded"
                    />
                  ) : (
                    u.name || "Unnamed"
                  )}
                </td>
                <td>{u.email || "No Email"}</td>
                <td>
                  {editingUser?._id === u._id ? (
                    <input
                      type="number"
                      value={editingUser.dailyStreak}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          dailyStreak: +e.target.value,
                        })
                      }
                      className="bg-gray-700 p-1 rounded w-16"
                    />
                  ) : (
                    u.dailyStreak ?? 0
                  )}
                </td>
                <td className="flex gap-2">
                  {editingUser?._id === u._id ? (
                    <>
                      <button
                        onClick={saveUser}
                        className="bg-green-500 hover:bg-green-600 p-2 rounded"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-500 hover:bg-gray-600 p-2 rounded"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingUser(u)}
                        className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-500 hover:bg-red-600 p-2 rounded"
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
