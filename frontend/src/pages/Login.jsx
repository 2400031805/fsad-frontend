import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api.js';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const data = await loginUser(form);
      onLogin(data);
      navigate('/');
    } catch (error) {
      setSubmitError(error.message || 'Unable to sign in');
    }
  };

  return (
    <section className="form-page">
      <div className="form-card">
        <h2>Student Login</h2>
        <p>Access your mental health space and schedule sessions.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="student@example.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>
          {submitError && <div className="submit-error">{submitError}</div>}
          <button className="button button-primary" type="submit">Login</button>
        </form>
      </div>
    </section>
  );
}

export default Login;
