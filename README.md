# Rajakili Boutique (Demo Project)

A full-stack **MERN** boutique website built as a portfolio demo by **Thamu**.
It is not a real store and takes no real orders.

## Features
- Home page with hero, categories and new arrivals
- Shop with category filters, search and price sorting
- Product page with sizes, quantity and an **Order on WhatsApp** button (order details pre-filled)
- Shopping bag that sends the whole order as one WhatsApp message
- **Owner admin panel**: log in, add / edit / delete products, prices and stock, see stock stats
- Mobile-first, responsive design
- REST API with Express + MongoDB, JWT login and bcrypt-hashed passwords

## Tech stack
React 18, React Router, Vite · Node.js, Express, MongoDB (Mongoose), JWT

## Project structure
```
client/   React frontend (deploy to Vercel)
server/   Express + MongoDB API (deploy to Render)
```

## Two modes
- **Demo mode** (default): leave `VITE_API_URL` empty. The site works with no backend;
  admin changes are saved in the visitor's browser. Demo admin login:
  `admin@rajakili.demo` / `demo123` (filled in automatically).
- **Full MERN mode**: set `VITE_API_URL` to your deployed API. Products come from MongoDB.

---

## Run it on your computer
```bash
# Frontend
cd client
npm install
npm run dev          # opens http://localhost:5173

# Backend (optional, needs MongoDB)
cd server
npm install
cp .env.example .env # then fill in your values
npm run seed         # loads demo products + creates the admin login
npm run dev          # http://localhost:5000/api/health
```

---

## Put it live (free)

### Step 1 — Push to GitHub
Create a new repository called `rajakili-boutique` and push this whole folder.

### Step 2 — Frontend on Vercel (demo mode, takes 2 minutes)
1. Go to vercel.com and sign in with GitHub.
2. **Add New → Project**, pick the repository.
3. Set **Root Directory** to `client`. Framework: Vite (detected automatically).
4. Click **Deploy**. You get a live link like `rajakili-boutique.vercel.app`.

This alone is enough for your portfolio link.

### Step 3 — Database on MongoDB Atlas (for full MERN mode)
1. Create a free cluster at mongodb.com/atlas.
2. Create a database user, and under Network Access allow `0.0.0.0/0`.
3. Copy the connection string into `MONGODB_URI`.

### Step 4 — Backend on Render
1. Go to render.com → **New → Web Service** → pick the repository.
2. Root Directory: `server` · Build command: `npm install` · Start command: `npm start`.
3. Add environment variables from `.env.example` (`MONGODB_URI`, `JWT_SECRET`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL` = your Vercel URL).
4. After it deploys, open the Render **Shell** and run `npm run seed` once.

### Step 5 — Connect them
In Vercel → Project → Settings → Environment Variables, add
`VITE_API_URL` = your Render URL (e.g. `https://rajakili-api.onrender.com`), then redeploy.

Note: Render's free plan sleeps when idle, so the first load can take ~30 seconds.

---

## Reusing this for a real client
Change `client/src/config.js` (shop name, WhatsApp number, Instagram, categories),
the colours at the top of `client/src/styles.css`, and remove the demo banner in
`client/src/components/Layout.jsx`. Add real product photos via the admin panel (Image URL field).
