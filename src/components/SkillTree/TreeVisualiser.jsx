import { useState } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useSkillTree } from '@/lib/useSkillTree';
import Sidebar from './Sidebar';

export default function TreeVisualiser({ treeId, onNodeSelect }) {
  const { nodes: firebaseNodes, loading } = useSkillTree(treeId);

  const nodes = firebaseNodes.map((node) => ({
    id: node.id,
    data: { label: node.title, ...node },
    position: node.position || { x: 0, y: 0 }, // Fallback position
  }));

  const edges = firebaseNodes.flatMap((node) =>
    (node.children || []).map((childId) => ({
      id: `${node.id}-${childId}`,
      source: node.id,
      target: childId,
    }))
  );

  const handleNodeClick = (event, node) => onNodeSelect(node.data);

  if (loading) return <div>Loading skill tree...</div>;

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodeClick={handleNodeClick}
          fitView
          style={{ zIndex: 10 }}
        >
          <Background />
          <Controls />
        </ReactFlow>

    </div>
  );
}