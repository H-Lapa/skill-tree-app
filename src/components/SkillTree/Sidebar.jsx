export default function Sidebar({ node }) {
    if (!node) return null;
  
    // Safely access resources with defaults
    const resources = node.resources || {};
    const videos = resources.videos || [];
    const articles = resources.articles || [];
  
    return (
      <div className="sidebar">
        <h2>{node.title}</h2>
        <p>{node.description || 'No description available'}</p>
  
        <h3>Resources</h3>
        <div className="resources">
          {/* Videos */}
          {videos.map((video, index) => (
            <div key={index} className="resource">
              <iframe
                src={video}
                title={`Video ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
  
          {/* Articles */}
          {articles.map((article, index) => (
            <div key={index} className="resource">
              <a href={article} target="_blank" rel="noopener noreferrer">
                Article {index + 1}
              </a>
            </div>
          ))}
  
          {/* Show message if no resources */}
          {videos.length === 0 && articles.length === 0 && (
            <p>No resources added yet</p>
          )}
        </div>
      </div>
    );
  }