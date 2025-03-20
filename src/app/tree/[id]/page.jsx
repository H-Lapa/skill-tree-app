'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TreeVisualiser from '@/features/skill-tree/components/tree/TreeVisualiser';
import NodeSidebar from '@/features/skill-tree/components/sidebars/NodeSidebar';
import TreeSettingsSidebar from '@/features/skill-tree/components/sidebars/TreeSettingsSidebar';
import { ChevronLeftIcon, Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { v4 as uuidv4 } from 'uuid';

export default function TreePage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [treeTitle, setTreeTitle] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [nodes, setNodes] = useState([]);
  const [isAddingNode, setIsAddingNode] = useState(false);

  // Refs for click outside handling
  const settingsSidebarRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const renameModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useClickOutside(settingsSidebarRef, (event) => {
    if (settingsButtonRef.current?.contains(event.target)) return;
    setShowSettings(false);
  });
  useClickOutside(renameModalRef, () => setShowRenameModal(false));
  useClickOutside(deleteModalRef, () => setShowDeleteModal(false));

  useEffect(() => {
    const fetchTree = async () => {
      const treeRef = doc(db, 'skillTrees', id);
      const treeSnap = await getDoc(treeRef);
      if (treeSnap.exists()) {
        const treeData = treeSnap.data();
        setTreeTitle(treeData.title);
        setNodes(treeData.nodes || []);
      }
    };
    fetchTree();
  }, [id]);

  const handleRenameTree = async () => {
    try {
      const treeRef = doc(db, 'skillTrees', id);
      await updateDoc(treeRef, { title: newTitle });
      setTreeTitle(newTitle);
      setShowRenameModal(false);
    } catch (error) {
      console.error('Error renaming tree:', error);
    }
  };

  const handleDeleteTree = async () => {
    try {
      await deleteDoc(doc(db, 'skillTrees', id));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting tree:', error);
    }
  };

  const handleNodeSelect = (node) => {
    if (selectedNode && selectedNode.id === node.id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
    }
    setShowSettings(false);
  };

  const handleAddNode = async () => {
    try {
      setIsAddingNode(true);

      const treeRef = doc(db, 'skillTrees', id);
      const treeSnap = await getDoc(treeRef);
      if (!treeSnap.exists()) return;

      const treeData = treeSnap.data();
      const nodes = treeData.nodes || [];

      let newNodePosition = { x: 0, y: 0 };

      if (nodes.length > 0) {
        let lowestNode = nodes[0];
        for (const node of nodes) {
          if (node.position.y > lowestNode.position.y) {
            lowestNode = node;
          }
        }
        newNodePosition = { x: lowestNode.position.x, y: lowestNode.position.y + 100 };
      }

      const newNode = {
        id: uuidv4(),
        title: 'New Node',
        description: '',
        position: newNodePosition,
        children: [],
      };

      const updatedNodes = [...nodes, newNode];

      if (nodes.length > 0) {
        const updatedLowestNode = {
          ...nodes[0],
          children: [...(nodes[0].children || []), newNode.id],
        };

        const updatedNodesWithConnection = updatedNodes.map((node) =>
          node.id === updatedLowestNode.id ? updatedLowestNode : node
        );

        await updateDoc(treeRef, { nodes: updatedNodesWithConnection });
        setNodes(updatedNodesWithConnection);
      } else {
        await updateDoc(treeRef, { nodes: updatedNodes });
        setNodes(updatedNodes);
      }

      setSelectedNode(newNode);
    } catch (error) {
      console.error('Error adding node:', error);
      setIsAddingNode(false);
    }
  };

  const handleSaveNode = async (updatedNode) => {
    try {
      const treeRef = doc(db, 'skillTrees', id);
      const treeSnap = await getDoc(treeRef);
      if (!treeSnap.exists()) return;

      const treeData = treeSnap.data();
      const nodes = treeData.nodes || [];

      const updatedNodes = nodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      );

      await updateDoc(treeRef, { nodes: updatedNodes });
      setNodes(updatedNodes);
      setIsAddingNode(false);
    } catch (error) {
      console.error('Error saving node:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{treeTitle}</h1>
        </div>

        <div className="relative">
          <button
            ref={settingsButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
              setSelectedNode(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 relative z-10"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Tree Visualization */}
        <div className="flex-1 relative">
          {/* Add Node Button */}
          {!selectedNode && !showSettings && (
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleAddNode}
                disabled={isAddingNode}
                className={`p-2 rounded-lg ${
                  isAddingNode ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600 bg-white shadow-md'
                }`}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          <TreeVisualiser 
            key={nodes.length}
            treeId={id}
            nodes={nodes}
            onNodeSelect={handleNodeSelect}
            setShowSettings={setSelectedNode}
            setSelectedNode={setSelectedNode}
          />
        </div>

        {/* Node Sidebar */}
        <div className={`absolute right-0 top-0 h-full w-96 transform ${
          selectedNode ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out shadow-xl z-[1001]`}>
          <div className="h-full bg-white border-l border-gray-200">
            <NodeSidebar 
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onSave={handleSaveNode}
            />
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className={`absolute right-0 top-0 h-full transform ${
          showSettings ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out shadow-xl z-[1001]`} ref={settingsSidebarRef}>
          <TreeSettingsSidebar
            onClose={() => setShowSettings(false)}
            onRename={() => {
              setShowRenameModal(true);
              setShowSettings(false);
            }}
            onDelete={() => {
              setShowDeleteModal(true);
              setShowSettings(false);
            }}
          />
        </div>
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
          <div ref={renameModalRef} className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Rename Tree</h3>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="New tree name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameTree}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
          <div ref={deleteModalRef} className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Delete Tree</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTree}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}