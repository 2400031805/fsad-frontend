import { Link } from 'react-router-dom';

function Home({ user }) {
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">Student Mental Health Support</p>
        <h1>Safe space for wellness, counseling, and community.</h1>
        <p>
          Access self-help resources, schedule virtual therapy sessions, and join peer support groups to nurture your wellbeing.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/resources">Browse Resources</Link>
          <Link className="button button-secondary" to="/support-groups">Join Support Groups</Link>
        </div>
      </div>
      <div className="hero-panel">
        <div className="panel-card">
          <h2>Get started</h2>
          <p>{user ? `Welcome back, ${user.name}!` : 'Log in or register to personalize your care journey.'}</p>
          <div className="panel-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
