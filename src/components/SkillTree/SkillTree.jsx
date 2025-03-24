import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot, addDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import Node from './Node';
import { v4 as uuidv4 } from 'uuid';

const VERTICAL_SPACING = 120;
const HORIZONTAL_SPACING = 200;

export default function SkillTree({ treeId }) {
  const [nodes, setNodes] = useState({});
  const [rootNodes, setRootNodes] = useState([]);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeDescription, setNewNodeDescription] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(null);

  useEffect(() => {
    const nodesRef = collection(db, `skillTrees/${treeId}/nodes`);
    const unsubscribe = onSnapshot(nodesRef, (snapshot) => {
      const nodesData = {};
      snapshot.forEach((doc) => {
        nodesData[doc.id] = { id: doc.id, ...doc.data() };
      });
      setNodes(nodesData);

      const rootNodeIds = Object.keys(nodesData).filter(nodeId => {
        return !Object.values(nodesData).some(node => 
          node.children && node.children.includes(nodeId)
        );
      });
      setRootNodes(rootNodeIds);
    });

    return () => unsubscribe();
  }, [treeId]);

  const calculateNodePositions = (nodeId, level = 0, offset = 0, positions = {}) => {
    const node = nodes[nodeId];
    if (!node) return { positions, width: 0 };

    const children = node.children || [];
    let totalWidth = 0;
    let childrenPositions = {};

    children.forEach((childId, index) => {
      const { positions: childPos, width } = calculateNodePositions(
        childId,
        level + 1,
        offset + totalWidth,
        positions
      );
      childrenPositions = { ...childrenPositions, ...childPos };
      totalWidth += width || HORIZONTAL_SPACING;
    });

    if (totalWidth === 0) {
      totalWidth = HORIZONTAL_SPACING;
    }

    const x = offset + totalWidth / 2 - HORIZONTAL_SPACING / 2;
    const y = level * VERTICAL_SPACING;

    positions[nodeId] = { x, y };

    return {
      positions: { ...positions, ...childrenPositions },
      width: totalWidth
    };
  };

  const handleAddChild = async (parentId, childId) => {
    const nodeRef = doc(db, `skillTrees/${treeId}/nodes`, parentId);
    await updateDoc(nodeRef, {
      children: arrayUnion(childId)
    });
  };

  const handleRemoveChild = async (parentId, childId) => {
    const nodeRef = doc(db, `skillTrees/${treeId}/nodes`, parentId);
    await updateDoc(nodeRef, {
      children: arrayRemove(childId)
    });
  };

  const handleCreateNode = async () => {
    if (!newNodeTitle) return;

    try {
      const newNode = {
        id: uuidv4(),
        title: newNodeTitle,
        description: newNodeDescription,
        children: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, `skillTrees/${treeId}/nodes`), newNode);

      // If a parent is selected, add this node as its child
      if (selectedParentId) {
        await handleAddChild(selectedParentId, docRef.id);
      }

      setNewNodeTitle('');
      setNewNodeDescription('');
      setIsCreatingNode(false);
      setSelectedParentId(null);
    } catch (error) {
      console.error('Error creating node:', error);
    }
  };

  const nodePositions = rootNodes.reduce((acc, rootId, index) => {
    const { positions } = calculateNodePositions(
      rootId,
      0,
      index * HORIZONTAL_SPACING * 1.5
    );
    return { ...acc, ...positions };
  }, {});

  const renderNode = (nodeId, level = 0) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const position = nodePositions[nodeId] || { x: 0, y: 0 };
    const isSelected = selectedParentId === nodeId;

    return (
      <div
        key={nodeId}
        className="relative"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div 
          className={`relative ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isCreatingNode) {
              setSelectedParentId(isSelected ? null : nodeId);
            }
          }}
        >
          <Node
            node={node}
            treeId={treeId}
            onAddChild={handleAddChild}
            onRemoveChild={handleRemoveChild}
          />
          {isCreatingNode && !isSelected && (
            <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 text-xs cursor-pointer">
              Click to add here
            </div>
          )}
        </div>

        {node.children && node.children.length > 0 && (
          <div className="absolute w-full">
            {node.children.map((childId) => {
              const childPosition = nodePositions[childId];
              if (!childPosition) return null;

              const startX = position.x;
              const startY = position.y + 40;
              const endX = childPosition.x;
              const endY = childPosition.y - 40;

              return (
                <svg
                  key={`${nodeId}-${childId}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                    pointerEvents: 'none'
                  }}
                >
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#CBD5E1"
                    strokeWidth="2"
                  />
                </svg>
              );
            })}
            {node.children.map((childId) => renderNode(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8" onClick={() => isCreatingNode && setSelectedParentId(null)}>
      {/* Create New Node Section */}
      <div className="mb-8 flex justify-center">
        {isCreatingNode ? (
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {selectedParentId 
                ? `Add Child Node to ${nodes[selectedParentId]?.title || 'Selected Node'}`
                : 'Create Root Node'
              }
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNodeTitle}
                  onChange={(e) => setNewNodeTitle(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter node title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newNodeDescription}
                  onChange={(e) => setNewNodeDescription(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter node description"
                />
              </div>
              {isCreatingNode && (
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                  Click on any node in the tree to add this as its child, or create it as a root node.
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleCreateNode}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  {selectedParentId ? 'Add Child Node' : 'Create Root Node'}
                </button>
                <button
                  onClick={() => {
                    setIsCreatingNode(false);
                    setSelectedParentId(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreatingNode(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add New Node
          </button>
        )}
      </div>

      {/* Tree Display */}
      <div className="relative" style={{ height: '800px', overflow: 'auto' }}>
        <div className="absolute" style={{ minWidth: '100%', minHeight: '100%' }}>
          {rootNodes.map((nodeId) => renderNode(nodeId))}
        </div>
      </div>
    </div>
  );
} 