# RailTrack Deployment Guide

## Architecture

- Frontend: Vercel
- Backend: Render Web Service
- Database: MongoDB Atlas

## 1. Prepare Secrets First

Before deploying, rotate the current backend secrets if they were ever committed or shared:

- `MONGODB_URI`
- `SECRET_KEY`

Keep these only in your deployment platforms and local `.env` files.

## 2. Deploy Backend on Render

Create a new **Web Service** from your GitHub repo.

Use these settings:

- Root Directory: `backend`
- Environment: `Python 3`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Add these environment variables in Render:

- `MONGODB_URI=your-mongodb-atlas-uri`
- `SECRET_KEY=your-new-secret-key`
- `ALGORITHM=HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES=30`
- `CORS_ORIGINS=https://your-frontend-domain.vercel.app`

After deploy, verify:

- `https://your-render-service.onrender.com/health`
- `https://your-render-service.onrender.com/docs`

## 3. Deploy Frontend on Vercel

Import the same repo into Vercel.

Use these settings:

- Framework Preset: `Vite`
- Root Directory: `.`
- Build Command: `npm run build`
- Output Directory: `dist`

Add this environment variable in Vercel:

- `VITE_API_BASE_URL=https://your-render-service.onrender.com`

This project already includes `vercel.json` so client-side routes work correctly on refresh.

## 4. Update CORS After Vercel Domain Is Ready

Once Vercel gives you the final production URL, update Render:

- `CORS_ORIGINS=https://your-project.vercel.app`

If you use a custom domain, include that exact domain instead.

For multiple frontend domains, separate them with commas:

```env
CORS_ORIGINS=https://your-project.vercel.app,https://www.yourdomain.com
```

## 5. Local Development

Frontend local env example:

```env
VITE_API_BASE_URL=http://localhost:8001
```

Backend local env example:

```env
MONGODB_URI=your-mongodb-atlas-uri
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173
```

## 6. Recommended Deploy Order

1. Deploy backend on Render
2. Copy the Render backend URL
3. Add it to Vercel as `VITE_API_BASE_URL`
4. Deploy frontend on Vercel
5. Copy the Vercel frontend URL
6. Add it to Render as `CORS_ORIGINS`
7. Redeploy Render

## 7. Common Issues

### CORS error

Usually means `CORS_ORIGINS` in Render does not exactly match the Vercel domain.

### Frontend refresh shows 404

Vercel SPA rewrite is required. This repo already has `vercel.json`.

### API calls still go to localhost

Check that Vercel has:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

Then redeploy the frontend.

### Render service sleeps on free tier

The first request can be slow if the service is inactive.
