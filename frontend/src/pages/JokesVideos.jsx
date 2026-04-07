import { useEffect, useState } from 'react';
import { getJokes } from '../api.js';

function JokesVideos() {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadJokes() {
      try {
        const data = await getJokes();
        setJokes(data || []);
      } catch (err) {
        setError(err.message || 'Unable to load videos');
      } finally {
        setLoading(false);
      }
    }
    loadJokes();
  }, []);

  return (
    <section className="content-page">
      <div className="section-header">
        <h2>Comedy & Wellness Videos</h2>
        <p>Laugh and relax with humor focused on mental health and student life.</p>
      </div>
      {loading ? (
        <div className="loading-card">Loading videos...</div>
      ) : error ? (
        <div className="error-card">{error}</div>
      ) : (
        <div className="jokes-grid">
          {jokes.map((joke) => (
            <article key={joke.id} className="joke-card">
              <h3>{joke.title}</h3>
              <p>{joke.description}</p>
              <div className="video-container">
                <iframe
                  width="100%"
                  height="250"
                  src={joke.videoUrl}
                  title={joke.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="duration">Duration: {joke.duration}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default JokesVideos;
