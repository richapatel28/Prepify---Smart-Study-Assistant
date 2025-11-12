import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  BookOpen,
  Clock,
  ChevronDown,
  ChevronUp,
  Brain,
  Download,
  X,
} from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import { toPng } from "html-to-image";
import dagre from "dagre";
import "reactflow/dist/style.css";

interface Note {
  _id: string;
  topic: string;
  content: string;
  created_at: string;
}

interface NotesProps {
  refreshKey?: number;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 80;

const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
  dagreGraph.setGraph({ rankdir: direction, ranksep: 120, nodesep: 60 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const NotesContent: React.FC<NotesProps> = ({ refreshKey }) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [showFlowchart, setShowFlowchart] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const flowRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  const token = localStorage.getItem("token") || "";

  const fetchNotesForTopic = async (topic: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/notes?topic=${encodeURIComponent(topic)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setNotes(data);
      setSelectedTopic(topic);
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      let allTopics: string[] = [];
      if (typeof data === "object" && !Array.isArray(data)) {
        allTopics = Object.keys(data);
      } else if (Array.isArray(data)) {
        allTopics = [...new Set(data.map((n: Note) => n.topic))];
      }
      setTopics(allTopics);
      if (allTopics.length && !selectedTopic) {
        fetchNotesForTopic(allTopics[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [refreshKey]);

  const generateFlowchart = async () => {
    if (!selectedTopic) return alert("Please select a topic first!");
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:5000/api/flowchart/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic: selectedTopic }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "AI failed.");

      const parsedData = data.data;
      const generatedNodes = parsedData.map((step: any) => ({
        id: step.id.toString(),
        data: { label: step.text },
        position: { x: 0, y: 0 },
        style: {
          background: "linear-gradient(135deg, #2563EB, #06B6D4)",
          color: "#fff",
          padding: 12,
          borderRadius: 10,
          fontWeight: "bold",
          width: nodeWidth,
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        },
      }));

      const generatedEdges = parsedData.flatMap((step: any) =>
        step.next.map((n: number) => ({
          id: `${step.id}-${n}`,
          source: step.id.toString(),
          target: n.toString(),
          animated: true,
          style: { stroke: "#06b6d4", strokeWidth: 2 },
        }))
      );

      const layouted = getLayoutedElements(generatedNodes, generatedEdges, "TB");
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      setShowFlowchart(true);

      setTimeout(() => fitView({ padding: 0.3 }), 300);
    } catch (err) {
      console.error(err);
      alert("Failed to generate flowchart.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFlowchart = useCallback(async () => {
    if (!flowRef.current) return;
    try {
      const image = await toPng(flowRef.current, {
        cacheBust: true,
        backgroundColor: "#1E293B",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.href = image;
      link.download = `${selectedTopic}_flowchart.png`;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download. Try again.");
    }
  }, [selectedTopic]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6 h-full">
      {!showFlowchart && (
        <>
          {/* Topic Dropdown */}
          <div className="relative w-80 mx-auto glass-card p-4 rounded-3xl shadow-xl">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-800/50 text-white font-semibold shadow-md hover:bg-gray-700/50 transition-colors"
            >
              {selectedTopic || "Select a Topic"}
              {dropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 w-full mt-2 max-h-64 overflow-y-auto bg-gray-800/80 rounded-2xl shadow-lg">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => fetchNotesForTopic(topic)}
                    className={`w-full text-left px-4 py-2 transition-colors hover:bg-cyan-500/30 ${
                      selectedTopic === topic ? "bg-cyan-500/20 font-semibold" : ""
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes Display */}
          <div className="flex-1 glass-card p-8 rounded-3xl shadow-xl overflow-y-auto mx-6">
            <h2 className="text-4xl font-black gradient-text mb-8 text-center">
              {selectedTopic || "Select a Topic"}
            </h2>

            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="glass-card p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 max-h-80 overflow-y-auto"
                  >
                    <pre className="text-white leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </pre>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                      <Clock size={14} />
                      <span>{new Date(note.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">No notes for this topic yet.</p>
              </div>
            )}

            {notes.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={generateFlowchart}
                  disabled={isGenerating}
                  className={`${
                    isGenerating
                      ? "bg-cyan-400 cursor-not-allowed"
                      : "bg-cyan-500 hover:bg-cyan-600"
                  } text-white px-6 py-3 rounded-lg font-semibold flex items-center mx-auto gap-2`}
                >
                  <Brain /> {isGenerating ? "Generating..." : "Generate Flowchart"}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Fullscreen Flowchart */}
      {showFlowchart && (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
            <h2 className="text-white text-lg font-semibold">
              {selectedTopic} - Flowchart
            </h2>
            <div className="flex gap-3">
              <button
                onClick={downloadFlowchart}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={() => setShowFlowchart(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <X size={16} /> Close
              </button>
            </div>
          </div>

          <div
            ref={flowRef}
            className="flex-1 bg-gray-800 overflow-auto relative"
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              minZoom={0.3}
              maxZoom={1.2}
              panOnScroll
            >
              <MiniMap />
              <Controls />
              <Background color="#555" gap={16} />
            </ReactFlow>
          </div>
        </div>
      )}
    </div>
  );
};

const Notes: React.FC<NotesProps> = (props) => (
  <ReactFlowProvider>
    <NotesContent {...props} />
  </ReactFlowProvider>
);

export default Notes;
