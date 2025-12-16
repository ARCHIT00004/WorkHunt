// Main server file - this starts the entire backend API
// It sets up the Express server, connects to MongoDB, and defines all the API routes

// Load environment variables from .env file (like database URL, JWT secret, etc.)
require('dotenv').config();

// Import required libraries
const express = require('express');        // Web framework for creating API endpoints
const mongoose = require('mongoose');      // MongoDB connection library
const morgan = require('morgan');          // HTTP request logger
const cors = require('cors');             // Cross-Origin Resource Sharing (allows frontend to call backend)
const path = require('path');             // File path utilities

// Import our custom modules
const { connectToDatabase } = require('./lib/db');                    // Database connection function
const authRoutes = require('./routes/auth.routes');                  // User login/register endpoints
const jobRoutes = require('./routes/job.routes');                    // Job posting endpoints
const applicationRoutes = require('./routes/application.routes');    // Job application endpoints
const contactRoutes = require('./routes/contact.routes');            // Contact form endpoints

// Create the Express application
const app = express();

// Configure CORS (Cross-Origin Resource Sharing)
// This allows the frontend (React app) to communicate with the backend API
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174']; // Default development URLs
const configuredOrigin = process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : []; // Custom origin from .env
const allowedOrigins = [...configuredOrigin, ...defaultOrigins]; // Combine all allowed origins

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      // Allow any localhost URL (for development)
      const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);
      if (isLocalhost || allowedOrigins.includes(origin)) return callback(null, true);
      
      // Reject all other origins
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true // Allow cookies and authentication headers
  })
);

// Middleware setup
app.use(express.json());    // Parse JSON request bodies (so we can read data sent from frontend)
app.use(morgan('dev'));     // Log all HTTP requests to console (helpful for debugging)

// Serve uploaded files (resumes) as static files
// This allows browsers to download resumes via URLs like: http://localhost:4000/uploads/resume.pdf
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Root endpoint - shows the API is working
app.get('/', (req, res) => {
  res.json({ 
    message: 'WorkHunt API is running!', 
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      jobs: '/api/jobs',
      applications: '/api/applications',
      contact: '/api/contact'
    }
  });
});

// Health check endpoint - useful for monitoring if the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes - these handle different types of requests
app.use('/api/auth', authRoutes);         // Authentication: /api/auth/login, /api/auth/register
app.use('/api/jobs', jobRoutes);          // Jobs: /api/jobs (GET all, POST new job)
app.use('/api', applicationRoutes);       // Applications: /api/applications
app.use('/api', contactRoutes);           // Contact: /api/contact

// Global error handler - catches any errors that weren't handled elsewhere
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

// Get port from environment variable or use default
const port = process.env.PORT || 4000;

// Start the server
// First connect to database, then start listening for HTTP requests
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit the process if we can't connect to database
  });


