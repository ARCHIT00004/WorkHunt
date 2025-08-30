import React from 'react';
import SectionTitle from '../components/SectionTitle.jsx';

export default function About() {
  return (
    <section className="container" style={{ padding: 24 }}>
      <SectionTitle title="About WorkHunt" subtitle="A modern job marketplace for candidates and employers." />
      <div className="card-surface" style={{ maxWidth: 980 }}>
        <p className="muted">
          WorkHunt helps people discover work they love. We combine thoughtful design and robust search so
          candidates can find roles quickly, and employers can reach the right talent.
        </p>
        <div className="features">
          <div className="card-surface">
            <div className="feature-title">Smart search</div>
            <p className="muted">Filter by title, location, job type, and more.</p>
          </div>
          <div className="card-surface">
            <div className="feature-title">1‑click applies</div>
            <p className="muted">Apply faster with your saved profile details.</p>
          </div>
          <div className="card-surface">
            <div className="feature-title">Employer tools</div>
            <p className="muted">Post, manage, and review applicants easily.</p>
          </div>
          <div className="card-surface">
            <div className="feature-title">Secure accounts</div>
            <p className="muted">Modern authentication and data best practices.</p>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-card"><div className="num">45,000+</div><div className="muted">Open positions</div></div>
          <div className="stat-card"><div className="num">1,234+</div><div className="muted">Hiring companies</div></div>
          <div className="stat-card"><div className="num">4.9/5</div><div className="muted">User rating</div></div>
        </div>

        <h3 style={{ marginTop: 18 }}>Our team</h3>
        <div className="team-grid">
          {[1,2,3,4].map((i) => (
            <div key={i} className="card-surface" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img className="avatar" src={`https://i.pravatar.cc/100?img=${i}`} alt="avatar" />
              <div>
                <div style={{ fontWeight: 700 }}>Team member {i}</div>
                <div className="muted">Product & Design</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


