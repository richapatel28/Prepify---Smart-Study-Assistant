import React, { useEffect, useState } from "react";

interface Leader {
  _id: string;
  name: string;
  points: number;
  dailyStreak?: number;
  createdAt?: string;
}

const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/leaderboard?limit=20", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLeaders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="p-6 bg-gray-900 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">Quiz Leaderboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ol className="space-y-3">
          {leaders.map((l, idx) => (
            <li key={l._id} className="flex justify-between items-center p-3 rounded-lg bg-gray-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">{idx+1}</div>
                <div>
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-sm text-gray-400">Streak: {l.dailyStreak || 0}d</div>
                </div>
              </div>
              <div className="text-xl font-bold">{l.points} pts</div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
