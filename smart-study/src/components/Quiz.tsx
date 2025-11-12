"use client";
import React, { useEffect, useState } from "react";
import { FileText, Clock, Lightbulb } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

interface QuizItem {
  _id: string;
  topic: string;
  questions: Question[];
  score?: number;
  created_at: string;
}

interface QuizProps {
  refreshKey?: number;
}

const Quiz: React.FC<QuizProps> = ({ refreshKey }) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<{ correct: number; wrong: number }>({ correct: 0, wrong: 0 });
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const token = localStorage.getItem("token") || "";

  // Fetch all topics
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/quiz", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch topics");

      const data = await res.json();
      let allTopics: string[] = [];

      if (typeof data === "object" && !Array.isArray(data)) {
        allTopics = Object.keys(data);
      } else if (Array.isArray(data)) {
        allTopics = [...new Set(data.map((q: QuizItem) => q.topic))];
      }

      setTopics(allTopics);
      if (allTopics.length > 0 && !selectedTopic) fetchQuizForTopic(allTopics[0]);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quiz for a topic
  const fetchQuizForTopic = async (topic: string) => {
    setLoading(true);
    setSelectedTopic(topic);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore({ correct: 0, wrong: 0 });
    setQuizFinished(false);

    try {
      const res = await fetch(`http://localhost:5000/api/quiz?topic=${encodeURIComponent(topic)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch quiz");

      const data = await res.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Submit final score to DB
  const submitScore = async () => {
    try {
      await fetch("http://localhost:5000/api/quiz/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic: selectedTopic, score: score.correct }),
      });
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(option);
    const currentQuiz = quizzes[0];
    const correctAnswer = currentQuiz.questions[currentQuestionIndex].answer;

    if (option === correctAnswer) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const handleNextQuestion = async () => {
    setSelectedAnswer(null);
    const currentQuiz = quizzes[0];

    if (currentQuestionIndex + 1 < currentQuiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      await submitScore(); // ✅ send score once quiz ends
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

  const currentQuiz = quizzes[0];

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar */}
      <div className="w-80 glass-card p-6 rounded-3xl shadow-xl flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold gradient-text">Quiz Topics</h2>
        </div>

        <div className="space-y-2 overflow-y-auto">
          {topics.length > 0 ? (
            <select
              value={selectedTopic}
              onChange={(e) => fetchQuizForTopic(e.target.value)}
              className="w-full p-3 rounded-xl glass-button text-black"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-400 text-center py-8">No quizzes yet.</p>
          )}
        </div>
      </div>

      {/* Quiz Display */}
      <div className="flex-1 glass-card p-8 rounded-3xl shadow-xl overflow-y-auto">
        <h2 className="text-4xl font-black gradient-text mb-8">
          {selectedTopic || "Select a Topic"}
        </h2>

        {quizFinished ? (
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-white">🎉 Quiz Completed!</h3>
            <p className="text-green-400">✅ Correct Answers: {score.correct}</p>
            <p className="text-red-400">❌ Wrong Answers: {score.wrong}</p>
            <button
              className="mt-4 py-3 px-6 bg-cyan-500 rounded-xl text-white font-bold hover:bg-cyan-600 transition-all"
              onClick={() => fetchQuizForTopic(selectedTopic)}
            >
              Retry Quiz
            </button>
          </div>
        ) : currentQuiz ? (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <p className="text-white font-bold text-xl">
                Q{currentQuestionIndex + 1}. {currentQuiz.questions[currentQuestionIndex].question}
              </p>

              <div className="space-y-3">
                {currentQuiz.questions[currentQuestionIndex].options.map((opt, idx) => {
                  let bgColor = "glass-button hover:bg-white/20";
                  if (selectedAnswer !== null) {
                    if (opt === currentQuiz.questions[currentQuestionIndex].answer)
                      bgColor = "bg-green-500/50 text-white rounded-xl p-3";
                    else if (
                      opt === selectedAnswer &&
                      opt !== currentQuiz.questions[currentQuestionIndex].answer
                    )
                      bgColor = "bg-red-500/50 text-white rounded-xl p-3";
                  }
                  return (
                    <div
                      key={idx}
                      onClick={() => handleAnswerSelect(opt)}
                      className={`cursor-pointer transition-all duration-300 ${bgColor}`}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </div>
                  );
                })}
              </div>

              {selectedAnswer !== null &&
                currentQuiz.questions[currentQuestionIndex].explanation && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 mt-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <p className="text-yellow-200 text-sm">
                      {currentQuiz.questions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}

              {selectedAnswer !== null && (
                <button
                  className="mt-4 py-2 px-4 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-all"
                  onClick={handleNextQuestion}
                >
                  Next
                </button>
              )}
            </div>

            <div className="text-gray-400 text-sm">
              <Clock size={14} className="inline mr-1" />
              Created: {new Date(currentQuiz.created_at).toLocaleString()}
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No quiz available for this topic yet.</p>
        )}
      </div>
    </div>
  );
};

export default Quiz;
