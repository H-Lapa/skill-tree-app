import BaseSidebar from '@/shared/components/BaseSidebar';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react'; // Add useEffect

export default function NodeSidebar({ node, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(node?.title || '');
  const [description, setDescription] = useState(node?.description || '');

  // Sync local state with the node prop
  useEffect(() => {
    setTitle(node?.title || '');
    setDescription(node?.description || '');
  }, [node]);

  const handleSave = () => {
    onSave({ ...node, title, description });
    setIsEditing(false);
  };

  return (
    <BaseSidebar
      title={node?.title || 'Node Details'}
      onClose={onClose}
      headerActions={
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
      }
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            />
          ) : (
            <p className="text-gray-600 mt-2">{title}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            />
          ) : (
            <p className="text-gray-600 mt-2">{description || 'No description'}</p>
          )}
        </div>
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        )}
      </div>
    </BaseSidebar>
  );
}