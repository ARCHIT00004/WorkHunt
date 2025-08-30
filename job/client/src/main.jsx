import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App, { Home, RequireCandidate, RequireEmployer } from './pages/App.jsx';
import Jobs from './pages/Jobs.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import EmployerDashboard from './pages/EmployerDashboard.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Apply from './pages/Apply.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'apply/:jobId', element: <RequireCandidate><Apply /></RequireCandidate> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'dashboard', element: <RequireEmployer><EmployerDashboard /></RequireEmployer> }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


