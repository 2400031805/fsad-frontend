import { useEffect, useState } from 'react';
import { getTherapyClasses, enrollTherapyClass } from '../api.js';

function TherapyClasses({ user }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await getTherapyClasses();
        setClasses(data || []);
      } catch (err) {
        setError(err.message || 'Unable to load classes');
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  const handleEnroll = async (therapyClass) => {
    if (!user) {
      setMessage('Please log in to enroll in classes.');
      return;
    }

    try {
      await enrollTherapyClass(therapyClass.id, user.id);
      setMessage(`Successfully enrolled in "${therapyClass.title}"!`);
    } catch (err) {
      setMessage(err.message || 'Unable to enroll');
    }
  };

  return (
    <section className="content-page">
      <div className="section-header">
        <h2>Therapy Classes</h2>
        <p>Join guided therapy sessions and workshops led by experienced professionals.</p>
      </div>
      {loading ? (
        <div className="loading-card">Loading classes...</div>
      ) : error ? (
        <div className="error-card">{error}</div>
      ) : (
        <div className="resource-grid">
          {classes.map((therapyClass) => (
            <article key={therapyClass.id} className="resource-card">
              <h3>{therapyClass.title}</h3>
              <p className="instructor">Instructor: {therapyClass.instructor}</p>
              <p>{therapyClass.description}</p>
              <div className="class-meta">
                <span>📅 {therapyClass.schedule}</span>
                <span>⏱️ {therapyClass.duration}</span>
                <span>👥 {therapyClass.enrolled}/{therapyClass.capacity}</span>
              </div>
              <button className="button button-secondary" type="button" onClick={() => handleEnroll(therapyClass)}>
                Enroll Now
              </button>
            </article>
          ))}
        </div>
      )}
      {message && <div className="success-card">{message}</div>}
    </section>
  );
}

export default TherapyClasses;
