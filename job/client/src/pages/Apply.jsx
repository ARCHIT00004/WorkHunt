import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function Apply() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const auth = React.useContext(AuthContext);
  const [coverLetter, setCoverLetter] = React.useState('');
  const [resumeFile, setResumeFile] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!auth.token) return alert('Please login');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      if (resumeFile) formData.append('resume', resumeFile);
      const res = await fetch(`${API}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to apply');
      alert('Application submitted');
      navigate('/jobs');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: 16 }}>
      <h2>Apply for Job</h2>
      <form className="form" onSubmit={onSubmit}>
        <label>Cover Letter</label>
        <textarea className="textarea" value={coverLetter} onChange={(e)=>setCoverLetter(e.target.value)} placeholder="Write a short cover letter..." required />
        <label>Resume (PDF/DOC)</label>
        <input className="input" type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e)=>setResumeFile(e.target.files?.[0] || null)} />
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'}</button>
      </form>
    </div>
  );
}


