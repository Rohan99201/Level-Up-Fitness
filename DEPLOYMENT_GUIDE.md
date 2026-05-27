# LevelUp Coaching — Full Deployment Guide

## What you're deploying
- **Frontend**: React app (Vercel — free)
- **Database + Auth**: Supabase (free — handles 60-70 users easily)
- All of Rohan's data is pre-seeded in the SQL file

---

## PART 1 — SUPABASE SETUP (Database + Auth)

### Step 1: Create Supabase account
1. Go to **https://supabase.com**
2. Click **Start your project** → sign up with GitHub or email
3. Click **New project**
4. Fill in:
   - **Organization**: your name
   - **Project name**: `levelup-coaching`
   - **Database password**: pick a strong password (save it)
   - **Region**: Asia South (Mumbai) — closest to India
5. Click **Create new project** → wait ~2 minutes for it to provision

---

### Step 2: Run the database SQL
1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `supabase_setup.sql` from this folder
4. Copy the ENTIRE contents and paste into the SQL editor
5. Click **Run** (▶)
6. You should see: `Success. No rows returned`

This creates all 9 tables, seeds Rohan's data, and sets up Row Level Security.

---

### Step 3: Create the Admin auth user
1. Go to **Authentication** → **Users** (left sidebar)
2. Click **Invite user** (or **Add user** → **Create new user**)
3. Enter:
   - Email: `admin@yourdomain.com` (use your real email)
   - Password: choose a strong password
4. Click **Create user**
5. **Copy the UUID** of the created user (it looks like `550e8400-e29b-41d4-a716-446655440000`)
6. Go back to **SQL Editor** and run:

```sql
INSERT INTO admins (auth_user_id, email)
VALUES ('<paste-your-uuid-here>', 'admin@yourdomain.com');
```

---

### Step 4: Create Rohan's client auth user
1. In **Authentication** → **Users**, click **Add user** → **Create new user**
2. Enter:
   - Email: `rohan@example.com` (or Rohan's real email)
   - Password: send this to Rohan
3. **Copy the UUID** of this user
4. In SQL Editor run:

```sql
UPDATE clients
SET auth_user_id = '<rohan-uuid-here>'
WHERE email = 'rohan@example.com';
```

Repeat steps 1–4 for every new client you add.

---

### Step 5: Get your API keys
1. Go to **Settings** → **API** (left sidebar)
2. Copy these two values — you'll need them soon:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon / public key**: `eyJhbGci...` (long string)

---

## PART 2 — DEPLOY TO VERCEL (Recommended — simplest)

### Step 1: Push code to GitHub
You need Git and a GitHub account.

```bash
# In terminal, navigate to the fitness-app folder
cd fitness-app

# Initialize git
git init
git add .
git commit -m "Initial commit — LevelUp Coaching"

# Create a new repo on github.com (click New repository, name it levelup-coaching)
# Then connect and push:
git remote add origin https://github.com/YOUR-USERNAME/levelup-coaching.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy on Vercel
1. Go to **https://vercel.com** → sign up with GitHub
2. Click **Add New Project**
3. Click **Import** next to your `levelup-coaching` repo
4. Vercel auto-detects it's a React app — leave all settings as default
5. **IMPORTANT** — Before clicking Deploy, click **Environment Variables** and add:

| Variable name | Value |
|---|---|
| `REACT_APP_SUPABASE_URL` | your Supabase Project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | your Supabase anon key |

6. Click **Deploy**
7. Wait ~2 minutes → your app is live at `https://levelup-coaching.vercel.app`

That's it! Your site is live. ✅

---

### Step 3: Custom domain (optional)
1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add your domain (e.g., `coaching.levelupconsulting.com`)
3. Follow Vercel's DNS instructions

---

## PART 3 — DEPLOY TO RENDER (Alternative)

Use Render if you prefer not to use Vercel.

### Step 1: Push to GitHub (same as Vercel Step 1 above)

### Step 2: Deploy on Render
1. Go to **https://render.com** → sign up with GitHub
2. Click **New +** → **Static Site**
3. Connect your `levelup-coaching` GitHub repo
4. Fill in:
   - **Name**: `levelup-coaching`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
5. Click **Advanced** → **Add Environment Variable**:
   - `REACT_APP_SUPABASE_URL` = your Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **Create Static Site**
7. Your app deploys at `https://levelup-coaching.onrender.com`

---

## PART 4 — ADDING NEW CLIENTS

For each new client:

### 1. Create auth user in Supabase
```
Authentication → Users → Add user → Create new user
→ Enter their email + temporary password
→ Copy their UUID
```

### 2. Insert client record via SQL
```sql
INSERT INTO clients (
  auth_user_id, name, email, age, gender, height_cm,
  start_weight, goal_weight, start_date, end_date
)
VALUES (
  '<their-uuid>', 'CLIENT NAME', 'client@email.com',
  25, 'MALE', 175,
  80, 72, '2026-06-01', '2026-12-01'
);
```

### 3. Add their targets
```sql
INSERT INTO weekly_targets (client_id, diet_type, calories, protein_g, fats_g, carbs_g, fibre_g, daily_steps, cardio)
SELECT id, 'veg', 2000, 150, 55, 200, 18, '8k', 'Daily: 20min'
FROM clients WHERE email = 'client@email.com';
```

### 4. Add their workout program
Copy the workout insert block from `supabase_setup.sql` and change `rohan_id` to the new client's ID.

Or use the Admin panel in the app to manage targets after login.

---

## PART 5 — MANAGING THE APP

### Admin login
- URL: your Vercel/Render URL
- Select **Admin** tab on login screen
- Email + password you set in Supabase

### Client login
- URL: same URL
- Select **Client** tab
- Their email + password you created for them

### What admin can do
- View all clients and their data
- Edit weekly macro/calorie targets per client
- Add new clients

### What clients can do
- View their dashboard, progress, BMI
- Log daily bodyweight
- View their workout program + log sets/reps/weights
- View their meal plan and food database
- View their roadmap

---

## PART 6 — FREE TIER LIMITS

| Service | Free tier | Your usage |
|---|---|---|
| **Supabase** | 500MB DB, 50k monthly active users | 60-70 users ✅ easy |
| **Vercel** | 100GB bandwidth, unlimited deploys | fine for coaching app ✅ |
| **Render** | 100GB bandwidth (static sites free) | fine ✅ |

**Supabase free tier is more than enough** — 60-70 clients barely touch the limits.

---

## QUICK REFERENCE

```
Project files:
├── src/
│   ├── App.jsx           ← entire frontend
│   ├── db.js             ← all Supabase functions
│   ├── supabaseClient.js ← connection config
│   └── index.js          ← entry point
├── public/
│   └── index.html
├── supabase_setup.sql    ← run this in Supabase SQL Editor
├── .env.example          ← copy to .env.local with your keys
└── package.json
```

```
.env.local (create this file, never commit it):
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...
```

```
Test locally:
npm install
cp .env.example .env.local   # then fill in your keys
npm start                     # opens http://localhost:3000
```

---

## TROUBLESHOOTING

**"Invalid login credentials"**
→ Check the user exists in Supabase Auth → Users

**"relation does not exist"**
→ The SQL setup didn't run fully — re-run `supabase_setup.sql` in SQL Editor

**Client can see other clients' data**
→ Row Level Security may not be enabled — re-run the RLS section of the SQL

**App loads but shows "Demo mode"**
→ Environment variables not set in Vercel/Render — check spelling exactly:
  `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`

**Build fails on Vercel**
→ Check Node version: Vercel Settings → General → Node.js Version → set to 18.x
