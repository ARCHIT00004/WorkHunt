import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const [term, setTerm] = React.useState('');

  const goSearch = () => {
    const params = new URLSearchParams();
    if (term) params.set('q', term);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="container hero">
      <div>
        <span className="eyebrow">Explore over <b>1.3 Million+</b> vacancies waiting for you</span>
        <h1 className="heading">
          <span className="accent">Find the Job</span> You've Been Dreaming Of!
        </h1>
        <p className="subheading">Browse our job listings to find opportunities just for you. Start your journey today and make your dream job a reality.</p>

        <div className="hero-cta">
          <div className="search">
            <input placeholder="Job title or keyword" value={term} onChange={(e)=>setTerm(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') goSearch(); }} />
            <button className="btn btn-primary" onClick={goSearch}>Search</button>
          </div>
          <button className="btn btn-outline" onClick={()=>navigate('/jobs?location=Remote')}>Remote</button>
        </div>

        <div className="stats">
          <div className="stat"><span className="num">45,000+</span> Open positions</div>
          <div className="stat"><span className="num">1,234+</span> Hiring companies</div>
        </div>
      </div>

      <div className="hero-media">
        <div className="card">
          <img className="hero-img" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1400&auto=format&fit=crop" alt="Happy candidate" />
        </div>
        <div className="floating">
          <span style={{ fontWeight: 700 }}>4.9</span>
          <span style={{ color: '#64748b' }}>Average rating</span>
        </div>
      </div>
    </section>
  );
}


