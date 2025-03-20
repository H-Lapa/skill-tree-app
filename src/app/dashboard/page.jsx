'use client';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'skillTrees'), 
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrees(snapshot.docs.map(doc => ({ 
        id: doc.id,
        ...doc.data() 
      })));
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Skill Trees</h1>
          <Link
            href="/tree/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg
            hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            New Tree
          </Link>
        </div>

        {trees.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 mb-4">No skill trees created yet</p>
            <Link
              href="/tree/new"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first skill tree →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trees.map(tree => (
              <Link 
                key={tree.id} 
                href={`/tree/${tree.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md
                transition-shadow p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TreeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{tree.title}</h3>
                </div>
                {tree.createdAt && (
                  <p className="text-sm text-gray-500">
                    Created: {new Date(tree.createdAt.toDate()).toLocaleDateString()}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Add these SVG icons at the bottom of the file
function PlusIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
}

function TreeIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
      />
    </svg>
  );
}