import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ right }) {
  return (
    <div className="header">
      <div className="container header-inner">
        <Link className="logo" to="/">
          <span className="logo-badge">W</span>
          WORKHUNT
        </Link>
        <nav className="nav">
          <Link to="/jobs">Jobboard</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="grow" />
        {right}
      </div>
    </div>
  );
}


