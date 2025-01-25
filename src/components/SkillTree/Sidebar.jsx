import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ node, onClose }) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{node?.title}</h2>
        <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors duration-200"
            >
            <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-gray-600 mt-2">
            {node?.description || 'No description'}
          </p>
        </div>

        {node?.resources?.videos?.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Videos</h4>
            <div className="space-y-2">
              {node.resources.videos.map((video, index) => (
                <div key={index} className="aspect-video">
                  <iframe
                    src={video}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {node?.resources?.articles?.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Articles</h4>
            <div className="space-y-2">
              {node.resources.articles.map((article, index) => (
                <a
                  key={index}
                  href={article}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 hover:bg-gray-50 rounded-md border border-gray-200"
                >
                  Article {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}