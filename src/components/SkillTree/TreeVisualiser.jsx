'use client';
import { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useSkillTree } from '@/lib/useSkillTree';
import Sidebar from './Sidebar';

export default function TreeVisualiser({ treeId, onNodeSelect }) {
  const { tree, nodes: firebaseNodes, loading } = useSkillTree(treeId);
  const [rfInstance, setRfInstance] = useState(null);

  // Transform Firestore nodes to ReactFlow nodes
  const nodes = firebaseNodes.map((node) => ({
    id: node.id,
    data: { 
      label: node.title,
      ...node,
    },
    position: node.position || { x: 0, y: 0 },
    type: node.id === tree?.rootNodeId ? 'input' : 'default', // Mark root node
  }));

  // Generate edges from node children
  const edges = firebaseNodes.flatMap((node) =>
    (node.children || []).map((childId) => ({
      id: `${node.id}-${childId}`,
      source: node.id,
      target: childId,
    }))
  );

  // Handle node clicks
  const handleNodeClick = useCallback((event, node) => {
    onNodeSelect(node.data);
  }, [onNodeSelect]);

  // Fit view to root node on initial load
  useEffect(() => {
    if (rfInstance && tree?.rootNodeId && nodes.length > 0) {
      const rootNode = nodes.find(n => n.id === tree.rootNodeId);
      if (rootNode) {
        setTimeout(() => {
          rfInstance.fitView({ nodes: [rootNode], padding: 0.5 });
        }, 100);
      }
    }
  }, [rfInstance, tree, nodes]);

  if (loading) return <div className="text-center py-8">Loading skill tree...</div>;

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        onInit={setRfInstance}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        nodeOrigin={[0.5, 0.5]} // Center nodes
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          color="#888" 
          gap={32} 
          variant="dots" 
        />
        <Controls 
          position="bottom-right" 
          showInteractive={false}
        />
        <MiniMap 
          position="bottom-left" 
          zoomable 
          pannable
          nodeColor={(node) => 
            node.id === tree?.rootNodeId ? '#3b82f6' : '#94a3b8'
          }
        />
      </ReactFlow>
    </div>
  );
}