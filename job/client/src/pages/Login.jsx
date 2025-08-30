import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.js';
import SectionTitle from '../components/SectionTitle.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message || 'Invalid email or password');
      return;
    }
    auth.login(data.token, data.user);
    navigate('/');
  };

  return (
    <section className="container" style={{ padding: 24, display: 'grid', placeItems: 'center' }}>
      <div className="card-surface" style={{ width: 'min(480px, 100%)' }}>
        <SectionTitle title="Welcome back" subtitle="Login to continue to WorkHunt." />
        {error && <div className="muted" style={{ color: '#ef4444', marginBottom: 10 }}>{error}</div>}
        <form className="form" onSubmit={onSubmit}>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
          <div style={{ position: 'relative' }}>
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type={show ? 'text' : 'password'} placeholder="Password" required />
            <button type="button" className="btn btn-outline" onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 6, top: 6 }}>
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>No account? <Link to="/register" style={{ textDecoration: 'underline' }}>Create one</Link></p>
      </div>
    </section>
  );
}


