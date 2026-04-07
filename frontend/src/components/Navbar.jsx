import { NavLink } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand">Student Wellness Hub</div>
      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/resources">Resources</NavLink>
        <NavLink to="/counseling">Counseling</NavLink>
        <NavLink to="/support-groups">Support Groups</NavLink>
        {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : (
          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
