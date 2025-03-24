import BaseSidebar from '@/shared/components/BaseSidebar';
import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TreeSettingsSidebar({ onClose, onRename, onDelete, treeId, isPublic, onPrivacyChange }) {
  const [isPublicState, setIsPublicState] = useState(isPublic);

  useEffect(() => {
    setIsPublicState(isPublic);
  }, [isPublic]);

  const handlePrivacyToggle = async () => {
    try {
      const treeRef = doc(db, 'skillTrees', treeId);
      await updateDoc(treeRef, { isPublic: !isPublicState });
      setIsPublicState(!isPublicState);
      onPrivacyChange?.(!isPublicState);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  };

  return (
    <BaseSidebar title="Skilltree Actions" onClose={onClose} width="w-64">
      <div className="flex-1 flex flex-col gap-4 p-4">
        <button
          onClick={onRename}
          type="button"
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Rename Skilltree
        </button>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Privacy Settings</h3>
            <p className="text-xs text-gray-500">
              {isPublicState ? 'Anyone can view this tree' : 'Only you can view this tree'}
            </p>
          </div>
          <button
            onClick={handlePrivacyToggle}
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isPublicState ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isPublicState ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        
        <button
          onClick={onDelete}
          type="button"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Skilltree
        </button>
      </div>
    </BaseSidebar>
  );
} 