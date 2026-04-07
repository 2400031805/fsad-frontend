import { useEffect, useState } from 'react';
import { getResources } from '../api.js';

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadResources() {
      try {
        const data = await getResources();
        setResources(data || []);
      } catch (err) {
        setError(err.message || 'Unable to load resources');
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  return (
    <section className="content-page">
      <div className="section-header">
        <h2>Mental Health Library</h2>
        <p>Browse curated articles, self-care guides, and videos for student wellbeing.</p>
      </div>
      {loading ? (
        <div className="loading-card">Loading resources...</div>
      ) : error ? (
        <div className="error-card">{error}</div>
      ) : (
        <div className="resource-grid">
          {resources.map((resource) => (
            <article key={resource.id} className="resource-card">
              <h3>{resource.title}</h3>
              <p>{resource.summary}</p>
              <a className="button button-secondary" href={resource.url} target="_blank" rel="noreferrer">
                Open Resource
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Resources;
