'use client';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, or } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import { PlusIcon, FolderIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Query for trees that the user owns OR are public
    const q = query(
      collection(db, 'skillTrees'),
      or(
        where('ownerId', '==', user.uid),
        where('isPublic', '==', true)
      )
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
                    <FolderIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{tree.title}</h3>
                    {tree.ownerId !== user.uid && (
                      <p className="text-sm text-gray-500">Shared by {tree.ownerName || 'Anonymous'}</p>
                    )}
                  </div>
                </div>
                {tree.createdAt && (
                  <p className="text-sm text-gray-500">
                    Created: {new Date(tree.createdAt.toDate()).toLocaleDateString()}
                  </p>
                )}
                {!tree.isPublic && tree.ownerId === user.uid && (
                  <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Private
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}