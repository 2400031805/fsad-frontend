import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Resources from './pages/Resources.jsx';
import Counseling from './pages/Counseling.jsx';
import SupportGroups from './pages/SupportGroups.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('mentalHealthUser');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('mentalHealthUser', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('mentalHealthUser');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/counseling" element={<Counseling user={user} />} />
          <Route path="/support-groups" element={<SupportGroups user={user} />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
