import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL, process.env.RAILWAY_STATIC_URL, 'https://*.up.railway.app'].filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Team Task Manager Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!' 
  });
});

// Serve static files from the React frontend build in production
if (process.env.NODE_ENV === 'production') {
  // In Docker: dist is at /dist, server is at /app
  // In regular deploy: dist is at parent of server
  const distPath = process.env.DOCKER_ENV === 'true'
    ? '/dist'
    : path.resolve(__dirname, '..', 'dist');

  app.use(express.static(distPath));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  // 404 handler for API only in development
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(` Team Task Manager Server running on port ${PORT}`);
  console.log(` API: http://localhost:${PORT}/api`);
  console.log(`=================================`);
});
