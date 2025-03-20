import { XMarkIcon } from '@heroicons/react/24/outline';

export default function BaseSidebar({ title, onClose, children, headerActions }) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          {headerActions} {/* Pencil icon button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" /> {/* Close icon */}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}