# WorkHunt - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### Prerequisites
1. GitHub account
2. Vercel account (free)
3. MongoDB Atlas account (free)

### Step 1: Setup Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string
6. Whitelist all IPs (0.0.0.0/0) for development

### Step 2: Deploy Backend to Vercel

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Select the `job/server` folder as root directory
   - Add environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_super_secret_jwt_key_change_this
     PORT=4000
     CLIENT_ORIGIN=https://your-frontend-url.vercel.app
     ```
   - Deploy

3. **Note your backend URL:** `https://your-backend-name.vercel.app`

### Step 3: Deploy Frontend to Vercel

1. **Create new Vercel project:**
   - Click "New Project" again
   - Import same repository
   - Select the `job/client` folder as root directory
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend-name.vercel.app
     ```
   - Deploy

2. **Update backend CORS:**
   - Go to your backend Vercel project
   - Update `CLIENT_ORIGIN` environment variable with your frontend URL
   - Redeploy backend

### Step 4: Test Your Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Try logging in
4. Try posting a job (as employer)
5. Try applying to a job (as candidate)

## 🎉 Success!

Your WorkHunt application is now live and accessible worldwide!