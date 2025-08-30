import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.js';
import SectionTitle from '../components/SectionTitle.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('candidate');
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message || 'Register failed');
      return;
    }
    auth.login(data.token, data.user);
    navigate('/');
  };

  return (
    <section className="container" style={{ padding: 24, display: 'grid', placeItems: 'center' }}>
      <div className="card-surface" style={{ width: 'min(520px, 100%)' }}>
        <SectionTitle title="Create your account" subtitle="Join WorkHunt as a candidate or an employer." />
        {error && <div className="muted" style={{ color: '#ef4444', marginBottom: 10 }}>{error}</div>}
        <form className="form" onSubmit={onSubmit}>
          <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <div style={{ position: 'relative' }}>
            <input className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type={show ? 'text' : 'password'} required />
            <button type="button" className="btn btn-outline" onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 6, top: 6 }}>
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
          </select>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>Already have an account? <Link to="/login" style={{ textDecoration: 'underline' }}>Login</Link></p>
      </div>
    </section>
  );
}


