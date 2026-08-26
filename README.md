# QueueLess

QueueLess is a MERN-stack real-time queue management system. Customers can join a queue, receive a token, monitor their position, and hear an alert when their token is called. Staff can manage the live queue from a dashboard.

## Features
- Customer token generation
- Live queue tracking
- Business dashboard
- Authentication
- Queue management
- Notifications
- Responsive UI
  
For Customers

• Live Queue Tracking: See exactly who is currently being served and how many people are ahead in the queue.

• Remote Join: Join a queue virtually without having to be physically present at the venue.

• Real-time Alerts: Receive notifications (e.g., "🔔 Your turn is approaching") when it's almost time to be served.

For Staff & Businesses
• Staff Dashboard: A dedicated operations hub to manage businesses and queues.

• Multi-Business Support: Create and manage multiple businesses (e.g., City Care Clinic, Momoland) from a single account.

• Queue Generation: Create specific queues (e.g., "General Queue") under each business and manually or automatically move customers through it in real-time.

📸 Screenshots
1. Landing Page
  ![Landing Page](<Screenshot 2026-07-31 230844-1.png>)

2. Live Customer Queue
  ![Live Customer Queue](<Screenshot 2026-07-31 231059.png>)

3. Staff Dashboard
   ![Staff Dashboard](<Screenshot 2026-07-31 231121.png>)
## Project structure

```text
queueless/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── ...
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── sockets/
│   │   └── utils/
│   └── ...
├── package.json
└── README.md
```

## Tech stack

### Frontend
- React
- Vite
- React Router
- Axios
- Socket.IO Client
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Token
- bcryptjs
- Socket.IO
- Helmet
- CORS
- Morgan

# QueueLess — Frontend
React + Vite + Tailwind client for QueueLess. This folder is a **standalone
deployable static site** — it does not depend on the backend folder at all,
it just needs to know the backend's URL.

## 1. Local setup

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

Runs at `http://localhost:5173` and expects the backend at
`http://localhost:5000` by default.

## 2. Environment variables

**Vite bakes these in at build time, not at runtime.** Setting them only in a
local `.env` file that isn't committed does nothing on your host — you must
add them as real environment variables in your hosting provider's dashboard
*before* the build runs.

| Variable           | Notes |
|--------------------|-------|
| `VITE_API_URL`     | Your deployed backend URL + `/api`, e.g. `https://queueless-api.onrender.com/api` |
| `VITE_SOCKET_URL`  | Your deployed backend URL, e.g. `https://queueless-api.onrender.com` |

## 3. Deploying (Vercel or Netlify)

### Vercel
1. Import this `frontend/` folder as a new project (or set "Root Directory"
   to `frontend/` if deploying from a monorepo).
2. Framework preset: **Vite**. Build command: `npm run build`. Output
   directory: `dist`.
3. Add `VITE_API_URL` and `VITE_SOCKET_URL` under Project Settings →
   Environment Variables, then deploy.
4. `vercel.json` (included) already rewrites all routes to `index.html` so
   client-side routes like `/businesses` or `/queue/:id` don't 404 on refresh.

### Netlify
1. New site from Git, base directory `frontend/`.
2. Build command: `npm run build`. Publish directory: `dist`.
3. Add `VITE_API_URL` and `VITE_SOCKET_URL` under Site settings →
   Environment variables, then redeploy.
4. `public/_redirects` (included) already handles the SPA fallback.

### After deploying
Go back to the backend's `CLIENT_URL` environment variable, set it to this
site's live URL (no trailing slash), and redeploy the backend — otherwise the
API will reject requests from it with a CORS error.

## What was fixed for production deployment

- **Missing SPA fallback rules.** With client-side routing (`react-router`),
  refreshing any URL other than `/` (e.g. `/businesses`, `/queue/123`) 404s
  on a plain static host because there's no `businesses/index.html` file on
  disk. Added `public/_redirects` (Netlify) and `vercel.json` (Vercel) so all
  paths serve `index.html` and the router takes over client-side.
- Clarified in `.env.example` that `VITE_API_URL`/`VITE_SOCKET_URL` must be
  set as build-time environment variables on the host, not just in a local
  `.env` file — a very common first-deploy mistake with Vite.
