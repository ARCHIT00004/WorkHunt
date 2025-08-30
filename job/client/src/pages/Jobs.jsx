import React from 'react';
import AuthContext from '../context/AuthContext.js';
import SectionTitle from '../components/SectionTitle.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Jobs({ compact = false }) {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);
  const [q, setQ] = React.useState('');
  const [locationText, setLocationText] = React.useState('');
  const [type, setType] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const auth = React.useContext(AuthContext);
  const locationHook = useLocation();
  const navigate = useNavigate();
  const headers = React.useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: auth.token ? `Bearer ${auth.token}` : undefined
  }), [auth.token]);

  React.useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const qParam = params.get('q') || '';
    const locParam = params.get('location') || '';
    const typeParam = params.get('type') || '';
    const pageParam = Number(params.get('page') || '1');
    setQ(qParam);
    setLocationText(locParam);
    setType(typeParam);
    setPage(pageParam);
    const qs = new URLSearchParams();
    if (qParam) qs.set('q', qParam);
    if (locParam) qs.set('location', locParam);
    if (typeParam) qs.set('type', typeParam);
    if (pageParam && pageParam !== 1) qs.set('page', String(pageParam));
    const url = `${API}/jobs${qs.toString() ? `?${qs.toString()}` : ''}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        if (typeof data.total === 'number') setTotal(data.total);
        if (typeof data.page === 'number') setPage(data.page);
        if (typeof data.pages === 'number') setPages(data.pages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [locationHook.search]);

  const goToApply = (jobId) => {
    if (!auth.token) return alert('Please login as candidate to apply');
    navigate(`/apply/${jobId}`);
  };

  const canManage = (job) => auth.role === 'employer' && (job.employer?._id === auth.userId || job.employer === auth.userId);

  const deleteJob = async (job) => {
    if (!canManage(job)) return alert('Only the employer can delete this job');
    const confirmed = window.confirm(`Delete "${job.title}" at ${job.company}? This cannot be undone.`);
    if (!confirmed) return;
    const res = await fetch(`${API}/jobs/${job._id}`, { method: 'DELETE', headers });
    if (res.ok) setItems((prev) => prev.filter((j) => j._id !== job._id));
    else {
      const data = await res.json().catch(() => ({}));
      alert(data.message || 'Failed to delete job');
    }
  };

  const [newJob, setNewJob] = React.useState({ title: '', company: '', location: '', description: '', jobType: 'full-time', salaryRange: '' });
  const addJob = async (e) => {
    e.preventDefault();
    if (auth.role !== 'employer') return alert('Login as employer to post');
    const res = await fetch(`${API}/jobs`, { method: 'POST', headers, body: JSON.stringify(newJob) });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Failed to post');
    setItems((prev) => [data, ...prev]);
    setNewJob({ title: '', company: '', location: '', description: '', jobType: 'full-time', salaryRange: '' });
  };
  
  const buildQueryAndNavigate = (nextPage) => {
    const qs = new URLSearchParams();
    if (q) qs.set('q', q);
    if (locationText) qs.set('location', locationText);
    if (type) qs.set('type', type);
    if (nextPage && nextPage !== 1) qs.set('page', String(nextPage));
    navigate(`/jobs${qs.toString() ? `?${qs.toString()}` : ''}`);
  };

  return (
    <div className="container" style={{ padding: compact ? 0 : 16 }}>
      {!compact && (
        <>
          <SectionTitle title="Browse jobs" subtitle="Search vacancies by title, company or location." />
          <div className="search" style={{ marginBottom: 10 }}>
            <input placeholder="Search jobs..." value={q} onChange={(e) => setQ(e.target.value)} />
            <input placeholder="Location" value={locationText} onChange={(e) => setLocationText(e.target.value)} />
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Any type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="temporary">Temporary</option>
            </select>
            <button className="btn btn-primary" onClick={() => buildQueryAndNavigate(1)}>Search</button>
            <button className="btn btn-outline" onClick={() => { setQ(''); setLocationText(''); setType(''); buildQueryAndNavigate(1); }}>Clear</button>
          </div>
          {auth.role === 'employer' && (
            <div className="card-surface" style={{ marginTop: 12 }}>
              <h3 style={{ marginTop: 0 }}>Quick post</h3>
              <form className="form" onSubmit={addJob}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input className="input" placeholder="Title" value={newJob.title} onChange={(e)=>setNewJob({ ...newJob, title: e.target.value })} required />
                  <input className="input" placeholder="Company" value={newJob.company} onChange={(e)=>setNewJob({ ...newJob, company: e.target.value })} required />
                </div>
                <input className="input" placeholder="Location" value={newJob.location} onChange={(e)=>setNewJob({ ...newJob, location: e.target.value })} required />
                <textarea className="textarea" placeholder="Description" value={newJob.description} onChange={(e)=>setNewJob({ ...newJob, description: e.target.value })} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <select className="input" value={newJob.jobType} onChange={(e)=>setNewJob({ ...newJob, jobType: e.target.value })}>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="temporary">Temporary</option>
                  </select>
                  <input className="input" placeholder="Salary range (e.g. $60k-$80k)" value={newJob.salaryRange} onChange={(e)=>setNewJob({ ...newJob, salaryRange: e.target.value })} />
                </div>
                <button className="btn btn-primary" type="submit">Add Job</button>
              </form>
            </div>
          )}
        </>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="jobs">
          {items.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-title">{job.title}</div>
              <div className="job-meta">{job.company} • {job.location}{job.jobType ? ` • ${job.jobType}` : ''}{job.salaryRange ? ` • ${job.salaryRange}` : ''}</div>
              <p style={{ color: '#334155' }}>{job.description.slice(0, 120)}...</p>
              {auth.role === 'candidate' && (
                <button className="btn btn-primary" onClick={() => goToApply(job._id)}>Apply</button>
              )}
              {canManage(job) && (
                <button className="btn btn-outline" onClick={() => deleteJob(job)} style={{ marginLeft: 8 }}>Delete post</button>
              )}
            </div>
          ))}
        </div>
      )}
      {!compact && !loading && pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <button className="btn btn-outline" disabled={page <= 1} onClick={() => buildQueryAndNavigate(page - 1)}>Previous</button>
          <div style={{ color: '#475569' }}>Page {page} of {pages}{typeof total === 'number' ? ` • ${total} jobs` : ''}</div>
          <button className="btn btn-outline" disabled={page >= pages} onClick={() => buildQueryAndNavigate(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}


