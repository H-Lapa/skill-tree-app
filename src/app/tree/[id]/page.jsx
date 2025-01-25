'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TreeVisualiser from '@/components/SkillTree/TreeVisualiser';
import Sidebar from '@/components/SkillTree/Sidebar';
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
  const settingsRef = useRef(null);
  const renameModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useClickOutside(settingsRef, () => setShowSettings(false));
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

        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 relative z-10"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>

          {showSettings && (
            <div className="fixed right-4 top-16 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowRenameModal(true);
                    setShowSettings(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                >
                  Rename Tree
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowSettings(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Delete Tree
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Tree Visualization */}
        <div className="flex-1 relative">
          <TreeVisualiser 
            treeId={id}
            onNodeSelect={setSelectedNode}
          />
        </div>

        {/* Sidebar */}
        <div className={`absolute right-0 top-0 h-full transform ${
          selectedNode ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out shadow-xl z-[1000] w-96`}>
          <div className="h-full bg-white border-l border-gray-200">
            <Sidebar 
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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