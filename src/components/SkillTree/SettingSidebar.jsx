import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SidebarActions({ onClose, onRename, onDelete }) {
  return (
    <div className="w-64 bg-white border-l border-gray-200 h-full flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Skilltree Actions</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors duration-200"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

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
    </div>
  );
}