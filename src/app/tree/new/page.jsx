'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export default function NewTreePage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateTree = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Please enter a title');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('You must be logged in to create a tree');
      setLoading(false);
      return;
    }

    try {
      // Generate unique ID for root node
      const rootNodeId = uuidv4();

      // Create root node
      const rootNode = {
        id: rootNodeId,
        title: title.trim(),
        description: "Root node of the skill tree",
        position: { x: 0, y: 0 },
        children: [],
      };

      // Create tree document with nodes array
      const newTree = {
        title: title.trim(),
        ownerId: user.uid,
        nodes: [rootNode],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const treesCollection = collection(db, 'skillTrees');
      const newTreeRef = await addDoc(treesCollection, newTree);

      // Redirect to the new tree's page
      router.push(`/tree/${newTreeRef.id}`);
    } catch (err) {
      console.error('Error creating tree:', err);
      setError('Failed to create tree. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Skill Tree</h1>
        
        <form onSubmit={handleCreateTree} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Tree Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tree title"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Creating...
              </span>
            ) : (
              'Create Tree'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}