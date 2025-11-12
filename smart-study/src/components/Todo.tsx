import React, { useEffect, useState } from "react";
import { ListChecks, Clock, CheckCircle, Circle, Sparkles } from "lucide-react";

interface TodoItem {
  createdAt: string | number | Date;
  _id: string;
  task: string;
  completed: boolean;
  topic?: string;
  created_at: string;
}

interface TodoProps {
  refreshKey?: number;
}

const Todo: React.FC<TodoProps> = ({ refreshKey }) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [aiAnswers, setAiAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);

  const token = localStorage.getItem("token") || "";

  const fetchTodosForTopic = async (topic: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/todo?topic=${encodeURIComponent(topic)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
      setSelectedTopic(topic);
      setSelectedQuestions([]);
      setAiAnswers({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/todo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      let allTopics: string[] = [];
      if (typeof data === "object" && !Array.isArray(data)) {
        allTopics = Object.keys(data);
        setTodos([]);
      } else if (Array.isArray(data)) {
        allTopics = [...new Set(data.map((t: TodoItem) => t.topic || "General"))];
      }
      setTopics(allTopics);
      if (allTopics.length && !selectedTopic) fetchTodosForTopic(allTopics[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const generateAnswers = async () => {
    setGenerating(true);
    try {
      const selectedTasks = todos
        .filter((t) => selectedQuestions.includes(t._id))
        .map((t) => t.task);

      const res = await fetch("http://localhost:5000/api/aitodo/generateAnswers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questions: selectedTasks }),
      });

      const data = await res.json();
      if (data.answers) setAiAnswers(data.answers);
    } catch (err) {
      console.error("AI generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [refreshKey]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar */}
      <div className="w-80 glass-card p-6 rounded-3xl shadow-xl flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <ListChecks className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold gradient-text">Todo Topics</h2>
        </div>
        <div className="space-y-2 overflow-y-auto">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <button
                key={topic}
                onClick={() => fetchTodosForTopic(topic)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${
                  selectedTopic === topic
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                    : "glass-button hover:bg-white/20"
                }`}
              >
                <span className="font-medium">{topic}</span>
              </button>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">No todos yet.</p>
          )}
        </div>
      </div>

      {/* Todos display */}
      <div className="flex-1 glass-card p-8 rounded-3xl shadow-xl overflow-y-auto">
        <h2 className="text-4xl font-black gradient-text mb-8">
          {selectedTopic || "All Todos"}
        </h2>

        {todos.length > 0 ? (
          <div className="space-y-4">
            {todos.map((t) => (
              <div
                key={t._id}
                className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                  selectedQuestions.includes(t._id)
                    ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500 shadow-cyan-500/20"
                    : "glass-card hover:bg-white/20"
                }`}
                onClick={() => toggleSelectQuestion(t._id)}
              >
                <div className="flex items-start gap-4">
                  {selectedQuestions.includes(t._id) ? (
                    <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="text-white text-lg mb-2">{t.task}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <Clock size={14} />
                      <span>
                        {new Date(t.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

           {selectedQuestions.length > 0 && (
  <div className="text-center mt-6">
    <button
      onClick={generateAnswers}
      disabled={generating}
      className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:shadow-lg hover:shadow-cyan-500/30 text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 disabled:opacity-50"
    >
      {generating ? "Generating Answers..." : "Generate Answers"}
    </button>
  </div>
)}

{/* ✅ After generation show link instead of answers directly */}
{Object.keys(aiAnswers).length > 0 && (
  <div className="text-center mt-8">
    <a
      href="/ai-todo-results"
      className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300"
      onClick={() =>
        localStorage.setItem("aiTodoResults", JSON.stringify(aiAnswers))
      }
    >
      Click here to view generated answers →
    </a>
  </div>
)}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No todos for this topic yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo;
