import { useState, useEffect } from 'react';
import { trackMood, getUserMoods } from '../api.js';

function MoodTracker({ user }) {
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const moods = ['😢 Sad', '😕 Down', '😐 Neutral', '🙂 Happy', '😄 Excited'];

  useEffect(() => {
    if (user) {
      loadMoodHistory();
    }
  }, [user]);

  const loadMoodHistory = async () => {
    try {
      const data = await getUserMoods(user.id);
      setMoodHistory(data || []);
    } catch (err) {
      console.error('Unable to load mood history');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please log in to track your mood.');
      return;
    }

    if (!mood) {
      setMessage('Please select a mood.');
      return;
    }

    setLoading(true);
    try {
      await trackMood({
        userId: user.id,
        mood,
        energy: parseInt(energy),
        notes,
      });
      setMessage('Mood logged successfully! 🎉');
      setMood('');
      setEnergy(5);
      setNotes('');
      loadMoodHistory();
    } catch (err) {
      setMessage(err.message || 'Unable to log mood');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-page">
      <div className="section-header">
        <h2>Mood Tracker</h2>
        <p>Track your emotional well-being and identify patterns to improve your mental health.</p>
      </div>

      <div className="mood-container">
        <div className="form-card">
          <h3>How are you feeling today?</h3>
          <form onSubmit={handleSubmit}>
            <div className="mood-selector">
              {moods.map((moodOption) => (
                <button
                  key={moodOption}
                  type="button"
                  className={`mood-button ${mood === moodOption ? 'active' : ''}`}
                  onClick={() => setMood(moodOption)}
                >
                  {moodOption}
                </button>
              ))}
            </div>

            <label>
              Energy Level: {energy}/10
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
              />
            </label>

            <label>
              Additional Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind today?"
              />
            </label>

            {message && <div className="success-card">{message}</div>}
            <button className="button button-primary" type="submit" disabled={loading}>
              {loading ? 'Logging...' : 'Log Mood'}
            </button>
          </form>
        </div>

        <div className="mood-history">
          <h3>Recent Entries</h3>
          {moodHistory.length === 0 ? (
            <p>No mood entries yet. Start tracking today!</p>
          ) : (
            <div className="history-list">
              {moodHistory.slice(-5).reverse().map((entry) => (
                <div key={entry.id} className="history-item">
                  <div className="entry-mood">{entry.mood}</div>
                  <div className="entry-details">
                    <p className="entry-date">
                      {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="entry-energy">Energy: {entry.energy}/10</p>
                    {entry.notes && <p className="entry-notes">{entry.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MoodTracker;
