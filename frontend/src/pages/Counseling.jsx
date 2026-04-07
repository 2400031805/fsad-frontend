import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookSession } from '../api.js';

function Counseling({ user }) {
  const [form, setForm] = useState({ topic: '', date: '', time: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const validation = {};
    if (!form.topic.trim()) validation.topic = 'Please select a counseling topic';
    if (!form.date) validation.date = 'Choose a date';
    if (!form.time) validation.time = 'Select a time';
    setErrors(validation);
    return Object.keys(validation).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await bookSession({
        studentId: user.id,
        topic: form.topic,
        date: form.date,
        time: form.time,
        notes: form.notes,
      });
      setMessage('Your counseling session has been requested. A counselor will reach out soon.');
      setForm({ topic: '', date: '', time: '', notes: '' });
    } catch (err) {
      setMessage(err.message || 'Unable to book session');
    }
  };

  return (
    <section className="content-page">
      <div className="section-header">
        <h2>Schedule a Virtual Therapy Session</h2>
        <p>Fill out the form to request a one-on-one counseling appointment.</p>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Topic
            <select name="topic" value={form.topic} onChange={handleChange}>
              <option value="">Select a counseling reason</option>
              <option value="stress">Stress & Anxiety</option>
              <option value="academic">Academic Pressure</option>
              <option value="relationships">Relationships & Support</option>
              <option value="self-esteem">Self-esteem & Identity</option>
            </select>
            {errors.topic && <span className="field-error">{errors.topic}</span>}
          </label>
          <label>
            Preferred Date
            <input name="date" type="date" value={form.date} onChange={handleChange} />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </label>
          <label>
            Preferred Time
            <input name="time" type="time" value={form.time} onChange={handleChange} />
            {errors.time && <span className="field-error">{errors.time}</span>}
          </label>
          <label>
            Notes
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Share topics or concerns you want support with." />
          </label>
          {message && <div className="success-card">{message}</div>}
          <button className="button button-primary" type="submit">Request Session</button>
        </form>
      </div>
    </section>
  );
}

export default Counseling;
