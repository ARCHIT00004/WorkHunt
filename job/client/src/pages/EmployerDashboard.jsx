import React from 'react';
import AuthContext from '../context/AuthContext.js';
import SectionTitle from '../components/SectionTitle.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function EmployerDashboard() {
  const auth = React.useContext(AuthContext);
  const [jobs, setJobs] = React.useState([]);
  const [form, setForm] = React.useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salaryRange: '',
    jobType: 'full-time',
    skillsText: ''
  });
  const [posting, setPosting] = React.useState(false);
  const [appsByJobId, setAppsByJobId] = React.useState({}); // { [jobId]: { open, loading, items: [] } }

  const headers = React.useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth.token}`
  }), [auth.token]);

  const load = async () => {
    const res = await fetch(`${API}/jobs/me/listings`, { headers });
    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
  };

  React.useEffect(() => { load(); }, []);

  const postJob = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 3) return alert('Title is too short');
    if (form.description.trim().length < 20) return alert('Description is too short');

    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim() || 'Remote',
      description: form.description.trim(),
      salaryRange: form.salaryRange.trim(),
      jobType: form.jobType,
      skills: form.skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    };

    setPosting(true);
    const res = await fetch(`${API}/jobs`, { method: 'POST', headers, body: JSON.stringify(payload) });
    const data = await res.json();
    setPosting(false);
    if (!res.ok) return alert(data.message || 'Failed to post');
    setForm({ title: '', company: '', location: '', description: '', salaryRange: '', jobType: 'full-time', skillsText: '' });
    load();
  };

  const remove = async (job) => {
    const confirmed = window.confirm(`Delete "${job.title}" at ${job.company}? This cannot be undone.`);
    if (!confirmed) return;
    const res = await fetch(`${API}/jobs/${job._id}`, { method: 'DELETE', headers });
    if (res.ok) {
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.message || 'Failed to delete job');
    }
  };

  const toggleApplicants = async (jobId) => {
    setAppsByJobId((prev) => ({ ...prev, [jobId]: { ...(prev[jobId] || {}), open: !prev[jobId]?.open } }));
    const current = appsByJobId[jobId];
    if (!current || (!current.items && !current.loading)) {
      setAppsByJobId((prev) => ({ ...prev, [jobId]: { ...(prev[jobId] || {}), loading: true, open: true } }));
      const res = await fetch(`${API}/jobs/${jobId}/applications`, { headers });
      const items = res.ok ? await res.json() : [];
      setAppsByJobId((prev) => ({ ...prev, [jobId]: { open: true, loading: false, items } }));
    }
  };

  return (
    <section className="container" style={{ padding: 16 }}>
      <SectionTitle title="Employer dashboard" subtitle="Post new jobs and manage your listings." />

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
        <div className="card-surface">
          <h3 style={{ marginTop: 0 }}>Post a new job</h3>
          <form className="form" onSubmit={postJob} style={{ maxWidth: 720 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input className="input" placeholder="Title" value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} required />
              <input className="input" placeholder="Company" value={form.company} onChange={(e)=>setForm({ ...form, company: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input className="input" placeholder="Location (e.g., Remote / City)" value={form.location} onChange={(e)=>setForm({ ...form, location: e.target.value })} />
              <input className="input" placeholder="Salary range (e.g., $60k–$90k)" value={form.salaryRange} onChange={(e)=>setForm({ ...form, salaryRange: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <select className="select" value={form.jobType} onChange={(e)=>setForm({ ...form, jobType: e.target.value })}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
              <input className="input" placeholder="Skills (comma separated)" value={form.skillsText} onChange={(e)=>setForm({ ...form, skillsText: e.target.value })} />
            </div>
            <textarea className="textarea" placeholder="Short description" value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} required />
            <div>
              <button className="btn btn-primary" type="submit" disabled={posting}>{posting ? 'Posting…' : 'Post Job'}</button>
            </div>
          </form>
        </div>

        <div className="card-surface">
          <h3 style={{ marginTop: 0 }}>Overview</h3>
          <div className="stats">
            <div className="stat"><span className="num">{jobs.length}</span> Active listings</div>
          </div>
          <p className="muted" style={{ marginTop: 12 }}>Use the panel to the left to create a new job. Your listings appear below.</p>
        </div>
      </div>

      <SectionTitle title="My listings" />
      <div className="jobs">
        {jobs.map((j) => {
          const state = appsByJobId[j._id] || {};
          return (
            <div key={j._id} className="job-card">
              <div className="job-title">{j.title}</div>
              <div className="job-meta">{j.company} • {j.location}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn btn-outline" onClick={() => toggleApplicants(j._id)}>
                  Applicants {state.items ? `(${state.items.length})` : ''}
                </button>
                <button className="btn btn-outline" onClick={() => remove(j)}>Delete post</button>
              </div>
              {state.open && (
                <div style={{ marginTop: 10 }}>
                  {state.loading ? (
                    <p className="muted">Loading applicants…</p>
                  ) : state.items && state.items.length > 0 ? (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                      {state.items.map((a) => (
                        <li key={a._id} className="muted">{a.candidate?.name} — {a.candidate?.email}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted">No applicants yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}


