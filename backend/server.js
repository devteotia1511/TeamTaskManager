import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import teamRoutes from './routes/team.routes.js';
import taskRoutes from './routes/task.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Start server first, then connect to MongoDB
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================`);
  console.log(` Team Task Manager Server running on port ${PORT}`);
  console.log(` API: http://localhost:${PORT}/api`);
  console.log(`=================================`);
});

// Connect to MongoDB asynchronously (don't crash if it fails)
connectDB().catch(err => {
  console.error('MongoDB connection failed, but server continues running:', err.message);
  // Don't exit - let server continue even without MongoDB
});

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL, 'https://teamtaskmanager.vercel.app', 'https://*.vercel.app'].filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files FIRST
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Team Task Manager Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!' 
  });
});

// Catch-all: send React app for any non-API route (must be LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Server already started above with MongoDB connection handled
