import BaseSidebar from '@/shared/components/BaseSidebar';

export default function TreeSettingsSidebar({ onClose, onRename, onDelete }) {
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