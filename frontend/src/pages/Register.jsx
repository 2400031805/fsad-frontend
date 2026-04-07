import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api.js';

function Register({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.password.trim()) newErrors.password = 'Password is required';
    if (form.password.length > 0 && form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (form.confirm !== form.password) {
      newErrors.confirm = 'Passwords do not match';
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
      const data = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      onRegister(data);
      navigate('/');
    } catch (error) {
      setSubmitError(error.message || 'Unable to register');
    }
  };

  return (
    <section className="form-page">
      <div className="form-card">
        <h2>Create Student Account</h2>
        <p>Register now to access support services and track your wellbeing.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Full Name
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Campus Email
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@example.edu" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create a password" />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>
          <label>
            Confirm Password
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Repeat password" />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </label>
          {submitError && <div className="submit-error">{submitError}</div>}
          <button className="button button-primary" type="submit">Register</button>
        </form>
      </div>
    </section>
  );
}

export default Register;
