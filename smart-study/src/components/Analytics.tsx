"use client";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Award, BookOpen } from "lucide-react";

type ActivityTrend = {
  date: string;
  quizzes: number;
  notes: number;
  topics: number;
};

type AnalyticsData = {
  userName: string;
  totalTopics: number;
  quizzesTaken: number;
  notesTaken: number;
  recentScores: { quiz: string; score: number }[];
  activityTrend: ActivityTrend[];
};

interface AnalyticsProps {
  refreshKey?: number;
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

const Analytics: React.FC<AnalyticsProps> = ({ refreshKey }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data: AnalyticsData = await res.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [refreshKey]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );

  if (!analytics)
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">No analytics data available.</p>
      </div>
    );

  const circularData = [
    { name: "Topics Studied", value: analytics.totalTopics, color: "#3B82F6" },
    { name: "Quizzes Taken", value: analytics.quizzesTaken, color: "#10B981" },
    { name: "Notes Generated", value: analytics.notesTaken, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h2 className="text-4xl font-black gradient-text mb-2">
          Welcome, {analytics.userName}!
        </h2>
        <p className="text-gray-400">Here’s your learning dashboard</p>
      </div>

      {/* Circular Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {circularData.map((stat, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center"
          >
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={[
                    { name: stat.name, value: stat.value },
                    { name: "remaining", value: Math.max(100 - stat.value, 0) },
                  ]}
                  innerRadius={40}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell key="filled" fill={stat.color} />
                  <Cell key="empty" fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-2 text-white font-semibold">{stat.name}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Quiz Scores */}
      <div className="glass-card p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white">Recent Quiz Scores</h3>
        </div>
        {analytics.recentScores.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No quiz scores yet. Start learning!
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.recentScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="score" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Activity Trend */}
      <div className="glass-card p-8 rounded-3xl shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-4">Activity Trend (Last 7 days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.activityTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="quizzes" stackId="a" fill="#10B981" />
            <Bar dataKey="notes" stackId="a" fill="#F59E0B" />
            <Bar dataKey="topics" stackId="a" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
