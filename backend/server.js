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

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Team Task Manager Server is running' });
});

// Root health check for Railway default healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Team Task Manager API Server' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!' 
  });
});

// Serve static files from the React frontend build
// Check multiple possible locations for the dist folder
const possibleDistPaths = [
  path.resolve(__dirname, 'dist'),                  // Docker layout: backend/./dist
  path.resolve(__dirname, '..', 'dist'),             // Alternative: backend/../dist
  '/dist',                                            // Alternative Docker layout
  path.resolve(process.cwd(), 'dist'),              // Current working dir
];

let distPath = null;
for (const testPath of possibleDistPaths) {
  console.log(`Checking for dist at: ${testPath}`);
  if (fs.existsSync(testPath)) {
    distPath = testPath;
    console.log(`Found dist folder at: ${distPath}`);
    console.log(`Dist contents:`, fs.readdirSync(testPath));
    break;
  }
}

if (distPath) {
  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    console.log(`Serving index.html from: ${path.resolve(distPath, 'index.html')}`);
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  console.log('WARNING: No dist folder found. Static files will not be served.');
  // 404 handler for API only
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
