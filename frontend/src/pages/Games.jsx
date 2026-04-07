import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGames } from '../api.js';

function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGames() {
      try {
        const data = await getGames();
        setGames(data || []);
      } catch (err) {
        setError(err.message || 'Unable to load games');
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  const puzzleGames = games.filter((game) => game.category === 'puzzle');
  const comedyGames = games.filter((game) => game.category === 'comedy');
  const otherGames = games.filter((game) => !['puzzle', 'comedy'].includes(game.category));

  const renderSection = (title, items) => {
    if (!items.length) return null;
    return (
      <>
        <div className="section-header">
          <h3>{title}</h3>
        </div>
        <div className="resource-grid">
          {items.map((game) => (
            <article key={game.id} className="resource-card">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <p className="meta-text">{game.instructions}</p>
              <Link className="button button-secondary" to={game.action}>
                Play Now
              </Link>
            </article>
          ))}
        </div>
      </>
    );
  };

  return (
    <section className="content-page">
      <div className="section-header">
        <h2>Fun Games</h2>
        <p>Play quick, light-hearted wellness games to boost your mood and focus.</p>
      </div>
      {loading ? (
        <div className="loading-card">Loading games...</div>
      ) : error ? (
        <div className="error-card">{error}</div>
      ) : (
        <>
          {renderSection('Puzzle Games', puzzleGames)}
          {renderSection('Comedy Games', comedyGames)}
          {renderSection('More Fun Games', otherGames)}
        </>
      )}
    </section>
  );
}

export default Games;
