import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import { toPng } from "html-to-image";
import dagre from "dagre";
import { ArrowLeft, Download } from "lucide-react";
import "reactflow/dist/style.css";

const nodeWidth = 220;
const nodeHeight = 80;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 50 });
  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const n = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: n.x - nodeWidth / 2, y: n.y - nodeHeight / 2 },
    };
  });
  return { nodes: layoutedNodes, edges };
};

const FlowchartContent = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { fitView } = useReactFlow();
  const token = localStorage.getItem("token") || "";
  const flowRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlowchart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/flowchart/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("AI failed to generate flowchart");

      const parsedData = data.data;
      const nodes = parsedData.map((step: any) => ({
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

      const edges = parsedData.flatMap((step: any) =>
        step.next.map((n: number) => ({
          id: `${step.id}-${n}`,
          source: step.id.toString(),
          target: n.toString(),
          animated: true,
          style: { stroke: "#06b6d4", strokeWidth: 2 },
        }))
      );

      const layouted = getLayoutedElements(nodes, edges, "TB");
      setNodes(layouted.nodes);
      setEdges(layouted.edges);

      setTimeout(() => fitView({ padding: 0.2 }), 300);
    } catch (err) {
      console.error(err);
      alert("Failed to load flowchart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowchart();
  }, []);

  const downloadFlowchart = useCallback(async () => {
    if (!flowRef.current) return;
    try {
      const image = await toPng(flowRef.current, {
        cacheBust: true,
        backgroundColor: "#1E293B",
        quality: 1,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.href = image;
      link.download = `${topic}_flowchart.png`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to download.");
    }
  }, [topic]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="h-screen w-full bg-gray-900 text-white relative">
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button
          onClick={downloadFlowchart}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download size={18} /> ScreenShot
        </button>
      </div>

      <div ref={flowRef} className="w-full h-full">
        <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.3 }}>
          <MiniMap />
          <Controls />
          <Background color="#444" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

const FlowchartPage = () => (
  <ReactFlowProvider>
    <FlowchartContent />
  </ReactFlowProvider>
);

export default FlowchartPage;
