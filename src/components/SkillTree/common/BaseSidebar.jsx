import { XMarkIcon } from '@heroicons/react/24/outline';

export default function BaseSidebar({ 
  title, 
  onClose, 
  children, 
  width = 'w-96'
}) {
  return (
    <div className={`${width} bg-white border-l border-gray-200 h-full flex flex-col shadow-lg`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors duration-200"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      {children}
    </div>
  );
} 