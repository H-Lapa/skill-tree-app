import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useSkillTree = (treeId: string) => {
  const [tree, setTree] = useState<unknown>(null);
  const [nodes, setNodes] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!treeId) return;

    const unsubscribeTree = onSnapshot(doc(db, 'skillTrees', treeId), (doc) => {
      setTree({ id: doc.id, ...doc.data() });
    });

    const unsubscribeNodes = onSnapshot(
      collection(db, `skillTrees/${treeId}/nodes`),
      (snapshot) => {
        const nodesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNodes(nodesData);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeTree();
      unsubscribeNodes();
    };
  }, [treeId]);

  return { tree, nodes, loading };
};