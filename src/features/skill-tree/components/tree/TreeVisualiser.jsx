'use client';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

export default function TreeVisualiser({ treeId, nodes, onNodeSelect, setShowSettings, setSelectedNode }) {
  // Transform nodes to ReactFlow nodes
  const rfNodes = nodes.map((node) => ({
    id: node.id,
    data: { label: node.title },
    position: node.position,
    type: node.id === treeId ? 'input' : 'default', // Mark root node
  }));

  // Generate edges from node children
  const edges = nodes.flatMap((node) =>
    (node.children || []).map((childId) => ({
      id: `${node.id}-${childId}`,
      source: node.id,
      target: childId,
    }))
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={rfNodes}
        edges={edges}
        onNodeClick={(event, rfNode) => {
          const originalNode = nodes.find(node => node.id === rfNode.id);
          onNodeSelect(originalNode);
        }}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        nodeOrigin={[0.5, 0.5]} // Center nodes
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#888" gap={32} variant="dots" />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          position="bottom-left"
          zoomable
          pannable
          nodeColor={(node) => (node.id === treeId ? '#3b82f6' : '#94a3b8')}
        />
      </ReactFlow>
    </div>
  );
}