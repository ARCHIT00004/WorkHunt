import React from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import Jobs from './Jobs.jsx';
import '../styles.css';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import AuthContext from '../context/AuthContext.js';

function useAuth() {
  const [state, setState] = React.useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');
    return { token, role, name, userId };
  });
  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
    localStorage.setItem('name', user.name);
    localStorage.setItem('userId', user.id);
    setState({ token, role: user.role, name: user.name, userId: user.id });
  };
  const logout = () => {
    localStorage.clear();
    setState({ token: null, role: null, name: null, userId: null });
  };
  return { ...state, login, logout };
}

export default function App() {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={auth}>
      <Header right={auth.token ? (
        <>
          {auth.role === 'employer' && <Link className="btn btn-outline" to="/dashboard">Dashboard</Link>}
          <button className="btn btn-primary" onClick={auth.logout} style={{ marginLeft: 8 }}>Logout</button>
        </>
      ) : (
        <>
          <Link className="btn btn-outline" to="/login">Login</Link>
          <Link className="btn btn-primary" to="/register" style={{ marginLeft: 8 }}>Post a Job</Link>
        </>
      )} />

      <Outlet />
    </AuthContext.Provider>
  );
}

export function RequireEmployer({ children }) {
  const auth = React.useContext(AuthContext);
  if (auth.role !== 'employer') return <Navigate to="/login" replace />;
  return children;
}

export function RequireCandidate({ children }) {
  const auth = React.useContext(AuthContext);
  if (auth.role !== 'candidate') return <Navigate to="/login" replace />;
  return children;
}

export function Home() {
  return (
    <>
      <Hero />
      <section className="container" style={{ paddingBottom: 40 }}>
        <h3 style={{ marginTop: 10 }}>Latest Jobs</h3>
        <Jobs compact />
      </section>
    </>
  );
}


