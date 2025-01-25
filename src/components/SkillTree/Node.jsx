import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

export default function Node({ node, treeId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(node.title);
  const [description, setDescription] = useState(node.description);

  const handleUpdate = async () => {
    const nodeRef = doc(db, `skillTrees/${treeId}/nodes`, node.id);
    await updateDoc(nodeRef, {
      title,
      description,
      updatedAt: new Date()
    });
    setIsEditing(false);
  };

  return (
    <div className="node-card">
      {isEditing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <h3>{title}</h3>
          <p>{description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
      {/* Add resource management here */}
    </div>
  );
}