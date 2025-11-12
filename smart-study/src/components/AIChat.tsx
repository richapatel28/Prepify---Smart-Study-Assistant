import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";

interface AIChatProps {
  onClose: () => void;
  onSectionChange: (section: string) => void;
  refreshData: (section: string) => void;
}

interface Message {
  from: "ai" | "user";
  text: string;
}

const AIChat: React.FC<AIChatProps> = ({ onClose, onSectionChange, refreshData }) => {
  const [messages, setMessages] = useState<Message[]>([
    { from: "ai", text: "👋 Hi, how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | string>(null);
  const [pendingTopic, setPendingTopic] = useState<null | string>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("token") || "";

  const sendMessage = async (userAction?: string) => {
    if (!input.trim() && !userAction) return;

    const userMessage = userAction || input;
    if (!userAction) setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const body: any = { message: userMessage };
      if (userAction && pendingTopic) {
        body.action = userAction;
        body.topic = pendingTopic;
      }

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { from: "ai", text: data.reply }]);

      if (data.action === "pending") {
        setPendingAction("confirm");
        setPendingTopic(data.topic);
      } else if (["notes", "quiz", "todo"].includes(data.action)) {
        refreshData(data.action);
        onSectionChange(data.action);
        setPendingAction(null);
        setPendingTopic(null);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { from: "ai", text: "⚠️ Error connecting to AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="w-[480px] h-[680px] flex flex-col rounded-3xl shadow-2xl overflow-hidden glass-card">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
          <h2 className="text-xl font-black text-white">AI Tutor</h2>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 rounded-xl glass-button flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-black/40">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.from === "ai" ? "justify-start" : "justify-end"}`}>
            <div className={`inline-block max-w-[80%] p-4 rounded-2xl break-words shadow-lg ${
              m.from === "ai" 
                ? "glass-card text-white" 
                : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card px-6 py-4 rounded-2xl shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        {/* Pending Action Buttons */}
        {pendingAction && pendingTopic && (
          <div className="flex justify-center gap-3 mt-4">
            {["notes", "quiz", "todo"].map(act => (
              <button
                key={act}
                onClick={() => sendMessage(act)}
                className="glass-button px-6 py-3 rounded-2xl font-semibold hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-all duration-300"
              >
                {act === "notes" ? "📝 Explain" : act === "quiz" ? "❓ Quiz" : "✅ To-Do"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 flex gap-3 border-t border-white/10 bg-black/40">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-5 py-3 rounded-2xl glass-button text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
