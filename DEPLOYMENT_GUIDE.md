# Smart Leads - Deployment & User Manual

This guide walks you through pushing your local project to GitHub and deploying the application to production for free. 

> **Important Note about Supabase**: This project was built using **MongoDB** (NoSQL) with Mongoose. **Supabase** is a PostgreSQL (SQL) provider. You cannot directly deploy a MongoDB database to Supabase without rewriting the backend. Therefore, this guide uses **MongoDB Atlas** for the database, **Railway** for the backend, and **Vercel** for the frontend.

---

## Step 1: Upload to GitHub

Before deploying, your code needs to be on GitHub.

1. Create a new empty repository on [GitHub](https://github.com/new) (do not initialize with a README).
2. Open your terminal in the root of the `smart-leads` project.
3. Initialize git and push your code:

```bash
git init
git add .
git commit -m "Initial commit: Smart Leads full stack"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## Step 2: Database Setup (MongoDB Atlas)

Since this app relies on MongoDB, we'll use MongoDB Atlas for free cloud hosting.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a new **Free Cluster** (M0).
3. Under **Database Access**, create a new database user (e.g., username: `admin`, password: `your_password`).
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Go to **Database** -> Click **Connect** -> **Connect your application** -> **Drivers** (Node.js).
6. Copy the connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart-leads?retryWrites=true&w=majority`
   *(Replace `<username>` and `<password>` with the user you created in step 3).*

---

## Step 3: Backend Deployment (Railway)

Railway is perfect for hosting our Node.js/Express backend.

1. Go to [Railway](https://railway.app/) and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your `smart-leads` repository.
4. Click **Add Variables** before deploying, or go to the **Variables** tab and add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `[Your MongoDB Atlas Connection String from Step 2]`
   - `JWT_SECRET` = `generate_a_random_long_string_here`
   - `JWT_EXPIRES_IN` = `7d`
   - `BCRYPT_ROUNDS` = `12`
   - `CORS_ORIGIN` = `*` *(We will update this to your Vercel URL later)*
5. Go to the **Settings** tab -> **Service**:
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Go to **Settings** -> **Networking** -> **Generate Domain**.
7. Once deployed, copy your new backend URL (e.g., `https://smart-leads-backend.up.railway.app`).

---

## Step 4: Frontend Deployment (Vercel)

Vercel is the easiest platform for hosting Vite/React frontends.

1. First, we need to tell the frontend where the backend lives. Since the frontend doesn't have a hardcoded API URL in the codebase, you should ensure your `frontend/src/api/` points to the `VITE_API_URL` environment variable if configured, or update your API base URL to point to the new Render URL.
   *Note: Ensure your Vite app relies on `import.meta.env.VITE_API_URL` for API calls.*
2. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
3. Click **Add New...** -> **Project**.
4. Import your `smart-leads` repository from GitHub.
5. In the **Configure Project** section:
   - **Framework Preset**: Vercel should automatically detect **Vite**.
   - **Root Directory**: Click "Edit" and select the `frontend` directory.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Open **Environment Variables** and add:
   - `VITE_API_URL` = `https://smart-leads-backend.up.railway.app/api` *(Your Railway URL from Step 3 + `/api`)*
7. Click **Deploy**.
8. Once complete, copy your new Vercel domain (e.g., `https://smart-leads-frontend.vercel.app`).

---

## Step 5: Finalizing Security (Important)

Now that Vercel is live, you should restrict your backend to only accept requests from your Vercel frontend.

1. Go back to your Backend project on **Railway**.
2. Go to **Variables**, find `CORS_ORIGIN`, and change it from `*` to your Vercel URL (e.g., `https://smart-leads-frontend.vercel.app`).
3. Save changes (Railway will automatically redeploy).

---

## Summary of Live Architecture

- **Frontend**: Hosted on Vercel (Global Edge CDN)
- **Backend**: Hosted on Railway (Node.js container)
- **Database**: Hosted on MongoDB Atlas (Cloud NoSQL)

Your application is now fully live and accessible to anyone!
