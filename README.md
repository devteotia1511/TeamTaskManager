# Team Task Manager

A full-stack web application for managing projects, teams, and tasks with role-based access control (Admin/Member).

## Features

- **Authentication**: Signup/Login with JWT tokens
- **Project Management**: Create, update, and manage projects
- **Team Management**: Create teams within projects, add/remove members
- **Task Management**: Create, assign, and track task status (New → Active → Completed/Failed)
- **Role-Based Access**: Admin has full control, Members have limited access
- **Dashboard**: View task statistics and overdue tasks
- **Overdue Detection**: Automatic task failure for overdue tasks

## Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS
- React Icons
- Spline 3D

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Project Structure

```
TeamTaskManager/
├── src/                    # React Frontend
│   ├── components/         # React components
│   ├── context/            # Auth context
│   └── utils/              # Local storage utilities
├── server/                 # Node.js Backend
│   ├── config/             # Database config
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   └── routes/             # API routes
├── .env.example            # Environment template
└── README.md               # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free tier works)

---

### Step 1: Get MongoDB Connection String

You need to manually set up MongoDB Atlas:

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Sign up or Login**
3. **Create a New Project** (or use existing)
4. **Create a Cluster** (M0 Free tier is sufficient)
5. **Wait for cluster to be created** (takes 1-2 minutes)
6. Click **"Database"** → **"Connect"**
7. Select **"Drivers"**
8. Select **"Node.js"** as driver
9. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
10. Replace `<username>` and `<password>` with your actual credentials

---

### Step 2: Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file and add your MongoDB URI:
# MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/etms?retryWrites=true&w=majority
# JWT_SECRET=your_random_secret_key_here
# PORT=5000
# CLIENT_URL=http://localhost:5173

# Generate JWT Secret (optional - you can use any random string)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

---

### Step 3: Frontend Setup

```bash
# In a new terminal, from project root
npm install

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Private |
| GET | `/api/users/profile` | Get current user | Private |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/projects` | Get all projects | Private |
| POST | `/api/projects` | Create project | Admin |
| GET | `/api/projects/:id` | Get project by ID | Private |
| PUT | `/api/projects/:id` | Update project | Private |
| DELETE | `/api/projects/:id` | Delete project | Admin |
| POST | `/api/projects/:id/members` | Add member | Admin |

### Teams
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/teams` | Get all teams | Private |
| GET | `/api/teams/project/:id` | Get project teams | Private |
| POST | `/api/teams` | Create team | Admin |
| POST | `/api/teams/:id/members` | Add member | Admin |
| DELETE | `/api/teams/:id/members/:id` | Remove member | Admin |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get all tasks | Private |
| GET | `/api/tasks/my-tasks` | Get my tasks | Private |
| GET | `/api/tasks/project/:id` | Get project tasks | Private |
| POST | `/api/tasks` | Create task | Admin |
| PUT | `/api/tasks/:id/status` | Update status | Private |
| DELETE | `/api/tasks/:id` | Delete task | Admin |

---

## 🔑 Default Admin Credentials

After first admin signup, use those credentials to login as admin.

**Note:** The first user can be registered via `/api/auth/signup` with `role: "admin"`

---

## 🚀 Deployment on Railway

### Backend Deployment:
1. Push code to GitHub
2. Go to https://railway.app/
3. New Project → Deploy from GitHub repo
4. Add environment variables in Railway Dashboard:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
   - `CLIENT_URL` = your frontend URL (after frontend deploy)

### Frontend Deployment:
1. In Railway, add a new service
2. Select your frontend build command: `npm run build`
3. Set start command: `npm run preview`
4. Add environment variable: `VITE_API_URL` = your backend URL

---

## 📦 Submission Checklist

- [ ] Live URL (Railway deployed)
- [ ] GitHub repo with all code
- [ ] Updated README (this file)
- [ ] 2-5 min demo video

---

## ✅ Project Status

### Completed Phases:
- ✅ **Phase 1**: Backend with MongoDB, JWT Auth, REST APIs
- ✅ **Phase 2**: Frontend-Backend Integration (Signup, Login, Dashboards, Tasks)

### Current Phase:
- 🚀 **Phase 3**: Deployment Preparation

---

## 🚀 Deployment Guide (Railway)

### Prerequisites:
1. GitHub account with code pushed
2. Railway account (https://railway.app)
3. MongoDB Atlas account

---

### Step 1: Deploy Backend

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/team-task-manager.git
   git push -u origin main
   ```

2. **Go to Railway** (https://railway.app)
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository
   - Click **"Add Variables"**

3. **Set Environment Variables** (in Railway Dashboard):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/etms?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-app.up.railway.app
   ```

4. **Deploy Backend**
   - Railway will auto-detect `railway.toml`
   - Click **"Deploy"**
   - Note the deployed URL: `https://your-backend.up.railway.app`

---

### Step 2: Deploy Frontend

1. **In Railway, add a new service**:
   - New → GitHub Repo → Select same repo
   - Root Directory: `/` (project root, not /server)

2. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

3. **Deploy Frontend**
   - Build command: `npm run build`
   - Start command: `npm run preview`
   - Click **"Deploy"**

4. **Update Backend CORS**:
   - Go back to backend service in Railway
   - Update `CLIENT_URL` to your frontend URL
   - Redeploy backend

---

### Step 3: Verify Deployment

1. **Test Health Endpoint**:
   ```
   https://your-backend.up.railway.app/api/health
   ```

2. **Test Frontend**:
   - Open frontend URL
   - Signup as admin
   - Create tasks and verify everything works

---

## 🔧 Local Development vs Production

| Environment | Frontend URL | Backend URL |
|-------------|--------------|-------------|
| Local Dev | http://localhost:5173 | http://localhost:5000 |
| Production | Railway Frontend URL | Railway Backend URL |

---

## 📝 Environment Files

### Frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api  # For local dev
# VITE_API_URL=https://your-backend.up.railway.app/api  # For production
```

### Backend `.env`:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173  # For local dev
# CLIENT_URL=https://your-frontend.up.railway.app  # For production
NODE_ENV=development  # Change to 'production' when deploying
```

---

## 📦 Submission Checklist

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Railway
- [ ] Live URLs working
- [ ] GitHub repo public
- [ ] README updated
- [ ] Demo video recorded (2-5 min)

---

## 🐛 Troubleshooting

### CORS Errors:
- Check `CLIENT_URL` in backend matches your frontend URL exactly
- Include `https://` and no trailing slash

### API Connection Errors:
- Verify `VITE_API_URL` ends with `/api`
- Check backend health endpoint works

### MongoDB Errors:
- Ensure IP whitelist in MongoDB Atlas allows all IPs (0.0.0.0/0)
- Verify connection string format

---

**Built with ❤️ for Team Task Manager Assignment**
