import { useEffect, useState } from 'react';
import { getGroups } from '../api.js';

function SupportGroups({ user }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadGroups() {
      try {
        const data = await getGroups();
        setGroups(data || []);
      } catch (err) {
        setError(err.message || 'Unable to load groups');
      } finally {
        setLoading(false);
      }
    }
    loadGroups();
  }, []);

  const handleJoin = (group) => {
    if (!user) {
      setMessage('Please log in to join a support group.');
      return;
    }
    setMessage(`You requested to join ${group.name}. A group facilitator will contact you.`);
  };

  return (
    <section className="content-page">
      <div className="section-header">
        <h2>Peer Support Groups</h2>
        <p>Join moderated communities for students focused on mental health, stress, and resilience.</p>
      </div>
      {loading ? (
        <div className="loading-card">Loading group options...</div>
      ) : error ? (
        <div className="error-card">{error}</div>
      ) : (
        <div className="resource-grid">
          {groups.map((group) => (
            <article key={group.id} className="resource-card">
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <p className="meta-text">Meetings: {group.schedule}</p>
              <button className="button button-secondary" type="button" onClick={() => handleJoin(group)}>
                Join Group
              </button>
            </article>
          ))}
        </div>
      )}
      {message && <div className="success-card">{message}</div>}
    </section>
  );
}

export default SupportGroups;
