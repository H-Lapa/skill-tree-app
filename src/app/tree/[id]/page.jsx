'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TreeVisualiser from '@/components/SkillTree/TreeVisualiser';
import NodeSidebar from '@/components/SkillTree/sidebars/NodeSidebar';
import TreeSettingsSidebar from '@/components/SkillTree/sidebars/TreeSettingsSidebar';
import { ChevronLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function TreePage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [treeTitle, setTreeTitle] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Refs for click outside handling
  const settingsSidebarRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const renameModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useClickOutside(settingsSidebarRef, (event) => {
    // Don't close if clicking the settings button
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
        setTreeTitle(treeSnap.data().title);
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

  // Update node selection to close settings sidebar
  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    setShowSettings(false);
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
              setSelectedNode(null); // Close node sidebar when opening settings
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
          <TreeVisualiser 
            treeId={id}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        {/* Node Sidebar */}
        <div className={`absolute right-0 top-0 h-full transform ${
          selectedNode && !showSettings ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out shadow-xl z-[1000]`}>
          <div className="h-full bg-white border-l border-gray-200">
            <NodeSidebar 
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
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