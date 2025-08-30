import React from 'react';
import SectionTitle from '../components/SectionTitle.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Contact() {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(data.message || 'Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="container" style={{ padding: 24, textAlign: 'center' }}>
        <div className="card-surface" style={{ maxWidth: 500, margin: '0 auto' }}>
          <h3 style={{ color: '#10b981' }}>✓ Message Sent Successfully!</h3>
          <p className="muted">Thank you for contacting us. We've received your message and will get back to you shortly.</p>
          <p className="muted">A copy has been sent to our team and saved in our system.</p>
          <button 
            className="btn btn-outline" 
            onClick={() => setSent(false)}
            style={{ marginTop: 16 }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="container" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div>
        <SectionTitle title="Get in touch" subtitle="Have a question or feedback? Send us a message and we'll respond soon." />
        <div className="card-surface">
          <form className="form" onSubmit={submit} style={{ maxWidth: 520 }}>
            {error && (
              <div style={{ 
                background: '#fef2f2', 
                border: '1px solid #fecaca', 
                color: '#dc2626', 
                padding: '12px', 
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}
            <input className="input" placeholder="Your name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required />
            <input className="input" type="email" placeholder="Your email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} required />
            <input className="input" placeholder="Subject" value={form.subject} onChange={(e)=>setForm({ ...form, subject: e.target.value })} required />
            <textarea className="textarea" placeholder="Message" value={form.message} onChange={(e)=>setForm({ ...form, message: e.target.value })} required />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      <div className="card-surface">
        <h3>Contact details</h3>
        <p className="muted">Email: support@workhunt.test</p>
        <p className="muted">Phone: +1 (555) 123-4567</p>
        <p className="muted">Address: 100 Market Street, San Francisco, CA</p>
        <div style={{ marginTop: 20, padding: 16, background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#0369a1' }}>📧 Email Notifications</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#0369a1' }}>
            When you submit this form, we'll send you a confirmation and notify our team immediately.
          </p>
        </div>
      </div>
    </section>
  );
}


