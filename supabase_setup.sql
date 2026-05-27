-- ============================================================
-- LEVELUP COACHING — SUPABASE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================================


-- ─── 1. EXTENSIONS ───────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ─── 2. ADMINS TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Only one admin row needed; insert after creating admin auth user
-- INSERT INTO admins (auth_user_id, email) VALUES ('<your-admin-uuid>', 'admin@yourdomain.com');


-- ─── 3. CLIENTS TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  age             INT,
  gender          TEXT CHECK (gender IN ('MALE','FEMALE','OTHER')),
  height_cm       NUMERIC(5,2),
  start_weight    NUMERIC(5,2),
  goal_weight     NUMERIC(5,2),
  current_weight  NUMERIC(5,2),
  start_date      DATE,
  end_date        DATE,
  join_date       DATE DEFAULT CURRENT_DATE,
  progress_pic_url TEXT,
  notes           TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Rohan's data
INSERT INTO clients (name, email, age, gender, height_cm, start_weight, goal_weight, current_weight, start_date, end_date, join_date)
VALUES ('ROHAN CHOUBEY', 'rohan@example.com', 25, 'MALE', 180, 93, 79, 93.6, '2026-03-30', '2026-08-31', '2026-03-28')
ON CONFLICT (email) DO NOTHING;


-- ─── 4. WEIGHT LOGS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weight_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  weight      NUMERIC(5,2) NOT NULL,
  unit        TEXT DEFAULT 'Kg' CHECK (unit IN ('Kg','Lbs')),
  bmi         NUMERIC(5,2),
  notes       TEXT,
  logged_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS weight_logs_client_date ON weight_logs (client_id, date);

-- Seed Rohan's weight history
DO $$
DECLARE rohan_id UUID;
BEGIN
  SELECT id INTO rohan_id FROM clients WHERE email = 'rohan@example.com';
  INSERT INTO weight_logs (client_id, date, weight, unit, bmi) VALUES
    (rohan_id, '2026-03-25', 93.00, 'Kg', 28.70),
    (rohan_id, '2026-03-30', 92.65, 'Kg', NULL),
    (rohan_id, '2026-03-31', 92.35, 'Kg', 28.50),
    (rohan_id, '2026-04-01', 92.35, 'Kg', 28.50),
    (rohan_id, '2026-04-02', 92.70, 'Kg', 28.61),
    (rohan_id, '2026-04-04', 93.55, 'Kg', 28.87),
    (rohan_id, '2026-04-05', 92.80, 'Kg', 28.64),
    (rohan_id, '2026-04-06', 92.80, 'Kg', 28.64),
    (rohan_id, '2026-04-07', 93.25, 'Kg', 28.78),
    (rohan_id, '2026-04-09', 93.25, 'Kg', 28.78),
    (rohan_id, '2026-04-10', 93.60, 'Kg', 28.89),
    (rohan_id, '2026-04-11', 94.35, 'Kg', 29.12),
    (rohan_id, '2026-04-12', 94.35, 'Kg', 29.12),
    (rohan_id, '2026-04-14', 93.60, 'Kg', 28.89),
    (rohan_id, '2026-04-15', 93.60, 'Kg', 28.89)
  ON CONFLICT DO NOTHING;
END $$;


-- ─── 5. WEEKLY TARGETS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_targets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  diet_type     TEXT DEFAULT 'veg' CHECK (diet_type IN ('veg','non-veg')),
  calories      NUMERIC(7,2),
  protein_g     NUMERIC(6,2),
  fats_g        NUMERIC(6,2),
  carbs_g       NUMERIC(6,2),
  fibre_g       NUMERIC(6,2),
  daily_steps   TEXT,
  cardio        TEXT,
  rest_cardio   TEXT,
  effective_from DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (client_id, diet_type, effective_from)
);

-- Seed Rohan's veg targets
DO $$
DECLARE rohan_id UUID;
BEGIN
  SELECT id INTO rohan_id FROM clients WHERE email = 'rohan@example.com';
  INSERT INTO weekly_targets (client_id, diet_type, calories, protein_g, fats_g, carbs_g, fibre_g, daily_steps, cardio)
  VALUES (rohan_id, 'veg', 2036.01, 137.78, 61.05, 233.87, 15.51, '8k', 'Daily: 20min')
  ON CONFLICT DO NOTHING;
END $$;


-- ─── 6. MEAL PLANS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meal_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  diet_type     TEXT DEFAULT 'veg' CHECK (diet_type IN ('veg','non-veg')),
  meal_number   INT NOT NULL,
  meal_name     TEXT,
  food_name     TEXT NOT NULL,
  category      TEXT,
  qty_g         NUMERIC(7,2),
  portion_size  NUMERIC(7,2),
  portions      NUMERIC(5,2),
  calories      NUMERIC(7,2),
  protein_g     NUMERIC(6,2),
  fat_g         NUMERIC(6,2),
  carbs_g       NUMERIC(6,2),
  fibre_g       NUMERIC(6,2),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Rohan's veg meal 1
DO $$
DECLARE rohan_id UUID;
BEGIN
  SELECT id INTO rohan_id FROM clients WHERE email = 'rohan@example.com';
  INSERT INTO meal_plans (client_id, diet_type, meal_number, meal_name, food_name, category, qty_g, calories, protein_g, fat_g, carbs_g, fibre_g)
  VALUES
    (rohan_id, 'veg', 1, 'MEAL 1', 'Whey protein', 'Proteins', 35, 131.6, 25, 2.4, 2.5, 0),
    (rohan_id, 'veg', 1, 'MEAL 1', 'Oats', 'Carbohydrates', 60, 219.18, 7.56, 3.18, 40.08, 6.18)
  ON CONFLICT DO NOTHING;
END $$;


-- ─── 7. FOOD DATABASE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS food_database (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food_name     TEXT NOT NULL,
  portion_g     NUMERIC(7,2),
  protein_g     NUMERIC(6,2),
  fat_g         NUMERIC(6,2),
  carbs_g       NUMERIC(6,2),
  fibre_g       NUMERIC(6,2),
  calories      NUMERIC(7,2),
  category      TEXT,
  is_veg        BOOLEAN DEFAULT TRUE
);

INSERT INTO food_database (food_name, portion_g, protein_g, fat_g, carbs_g, fibre_g, calories, is_veg) VALUES
  ('Whey protein',           35,  25.0,  2.4,  2.5,  0.0, 131.6,  false),
  ('Chicken Breast',        100,  23.2,  1.1,  0.0,  0.0, 102.7,  false),
  ('Chicken Breast cooked', 100,  31.0,  1.1,  0.0,  0.0, 133.9,  false),
  ('5% Lean Beef Mince',    100,  20.8,  4.5,  0.5,  0.0, 125.7,  false),
  ('Whole egg medium',        1,   5.5,  4.4,  0.4,  0.0,  63.2,  false),
  ('Egg whites',            100,  10.7,  0.0,  2.4,  0.0,  52.4,  false),
  ('Salmon',                100,  25.8, 13.5,  0.0,  0.0, 224.7,  false),
  ('Tuna canned in water',  100,  19.0,  0.9,  0.1,  0.0,  84.5,  false),
  ('Basa',                  100,  17.4,  4.0,  0.0,  0.0, 105.6,  false),
  ('Prawns',                100,  17.3,  3.6,  1.2,  0.0, 106.4,  false),
  ('Oats',                  100,  12.6,  5.3, 66.8, 10.3, 367.5,  true),
  ('White rice raw',        100,   6.5,  0.5, 79.2,  1.3, 347.3,  true),
  ('Paneer raw',            100,  18.3, 20.8,  1.2,  0.0, 265.2,  true),
  ('Low fat paneer',        100,  25.0,  9.0,  5.7,  0.0, 203.8,  true),
  ('Kidney beans',          100,  24.0,  0.8, 85.0, 14.0, 443.2,  true),
  ('Soya chunk',            100,  52.0,  1.0, 50.0, 16.2, 417.0,  true),
  ('Tofu',                  100,  15.0,  6.0,  6.4,  2.3, 139.6,  true),
  ('Dahi',                  100,   4.0,  1.0,  5.0,  0.0,  45.0,  true),
  ('Greek yogurt',          100,   5.9,  2.0, 12.9,  0.7,  93.2,  true),
  ('Skimmed milk',          100,   3.4,  0.1,  5.0,  0.0,  34.5,  true),
  ('Moong dal',             100,  23.7,  1.4, 57.6, 12.0, 337.8,  true),
  ('Tur dal raw',           100,  19.0,  2.5, 63.3, 15.0, 351.7,  true),
  ('Tur dal cooked',        100,  11.4,  1.4, 21.8,  2.0, 145.4,  true),
  ('Chana',                 100,  18.8,  6.3, 75.0, 17.5, 431.9,  true),
  ('Tempeh',                100,  18.0,  6.5, 29.8,  4.8, 249.7,  true)
ON CONFLICT DO NOTHING;


-- ─── 8. WORKOUT PROGRAMS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_programs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  day_number    INT NOT NULL,
  day_name      TEXT,
  workout_type  TEXT,
  exercise_name TEXT NOT NULL,
  set_rep       TEXT,
  tempo         TEXT,
  rest_seconds  INT,
  sets          INT,
  video_url     TEXT,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Rohan's workout program
DO $$
DECLARE rohan_id UUID;
BEGIN
  SELECT id INTO rohan_id FROM clients WHERE email = 'rohan@example.com';
  INSERT INTO workout_programs (client_id, day_number, day_name, workout_type, exercise_name, set_rep, tempo, rest_seconds, sets, video_url, sort_order) VALUES
    (rohan_id, 1, 'DAY 1', 'Legs',          'Leg extension',            '3x9-11',     '3010', 120, 3, 'https://youtu.be/wrU4hx4W3do', 1),
    (rohan_id, 1, 'DAY 1', 'Legs',          'Smith machine calf raises','2x2-Failure','3010', 180, 2, 'https://youtu.be/1lKjFPrYqf0', 2),
    (rohan_id, 1, 'DAY 1', 'Legs',          'Belt squats',              '3x9-11',     '3010', 120, 3, 'https://youtu.be/FCIZZvIM-I0', 3),
    (rohan_id, 1, 'DAY 1', 'Legs',          'Low feet leg press',       '2x2-Failure','3010', 180, 2, 'https://youtu.be/xYGyCXx0kUs', 4),
    (rohan_id, 1, 'DAY 1', 'Legs',          'Lying leg raises',         '2x2-Failure','3010', 180, 2, 'https://youtu.be/9qbV7ZQNqqA', 5),
    (rohan_id, 1, 'DAY 1', 'Legs',          'Crunches',                 '2x2-Failure','3010', 180, 2, 'https://youtube.com/shorts/eeJ_CYqSoT4', 6),
    (rohan_id, 2, 'DAY 2', 'Push',          'Incline Db press',         '3x9-11',     '3010', 120, 3, 'https://youtu.be/IP4oeKh1Sd4', 1),
    (rohan_id, 2, 'DAY 2', 'Push',          'Machine press flat',       '2x2-Failure','3010', 180, 2, 'https://youtu.be/sreMgnjczh4', 2),
    (rohan_id, 2, 'DAY 2', 'Push',          'Db lateral raises',        '2x2-Failure','3010', 180, 2, 'https://youtu.be/PzsMitRdI_8', 3),
    (rohan_id, 2, 'DAY 2', 'Push',          'Cable flys high-low',      '2x2-Failure','3010', 180, 2, 'https://youtu.be/KwvJEXts2lg', 4),
    (rohan_id, 2, 'DAY 2', 'Push',          'Tricep pushdown',          '2x2-Failure','3010', 180, 2, 'https://youtu.be/-zLyUAo1gMw', 5),
    (rohan_id, 2, 'DAY 2', 'Push',          'Db skull crusher',         '2x2-Failure','3010', 180, 2, 'https://youtu.be/xVmy477E-3c', 6),
    (rohan_id, 3, 'DAY 3', 'Pull',          'Cable row',                '3x9-11',     '3010', 120, 3, NULL, 1),
    (rohan_id, 3, 'DAY 3', 'Pull',          'Lat pulldown',             '3x9-11',     '3010', 120, 3, NULL, 2),
    (rohan_id, 3, 'DAY 3', 'Pull',          'Face pulls',               '2x2-Failure','3010', 180, 2, NULL, 3),
    (rohan_id, 3, 'DAY 3', 'Pull',          'Bicep curls',              '2x2-Failure','3010', 180, 2, NULL, 4),
    (rohan_id, 4, 'DAY 4', 'Rest',          'REST DAY',                 NULL,          NULL,   NULL, NULL, NULL, 1),
    (rohan_id, 5, 'DAY 5', 'Legs & Chest',  'Stiff leg deadlift',       '2x2-Failure','3010', 180, 2, 'https://youtu.be/CN_7cz3P-1U', 1),
    (rohan_id, 5, 'DAY 5', 'Legs & Chest',  'Lying Leg curl',           '2x2-Failure','3010', 180, 2, 'https://youtu.be/vl5nUdE9mWM', 2),
    (rohan_id, 5, 'DAY 5', 'Legs & Chest',  'Bulgarian Split squats',   '2x2-Failure','3010', 180, 2, 'https://youtu.be/SkNsa3eBwLA', 3),
    (rohan_id, 5, 'DAY 5', 'Legs & Chest',  'Smith machine incline',    '2x2-Failure','3010', 180, 2, 'https://youtu.be/EeLLZMdg6zI', 4),
    (rohan_id, 5, 'DAY 5', 'Legs & Chest',  'Pec deck flys',            '2x2-Failure','3010', 180, 2, 'https://youtu.be/10hg4LAa7UQ', 5),
    (rohan_id, 5, 'DAY 5', 'Legs & Chest',  'Seated calf raises',       '2x2-Failure','3010', 180, 2, 'https://youtu.be/kmaNMXIQIAY', 6)
  ON CONFLICT DO NOTHING;
END $$;


-- ─── 9. WORKOUT LOGS (client inputs actual reps/weights) ─────
CREATE TABLE IF NOT EXISTS workout_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  week          INT NOT NULL,
  day_number    INT NOT NULL,
  exercise_name TEXT NOT NULL,
  set_number    INT NOT NULL,
  reps          INT,
  weight_kg     NUMERIC(6,2),
  notes         TEXT,
  logged_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Week 1 sample logs for Rohan
DO $$
DECLARE rohan_id UUID;
BEGIN
  SELECT id INTO rohan_id FROM clients WHERE email = 'rohan@example.com';
  INSERT INTO workout_logs (client_id, week, day_number, exercise_name, set_number, reps, weight_kg) VALUES
    (rohan_id, 1, 1, 'Leg extension', 1, 9, 30),
    (rohan_id, 1, 1, 'Leg extension', 2, 9, 35),
    (rohan_id, 1, 1, 'Leg extension', 3, 11, 35),
    (rohan_id, 1, 1, 'Belt squats',   1, 19, 20),
    (rohan_id, 1, 1, 'Belt squats',   2, 18, 20),
    (rohan_id, 1, 1, 'Belt squats',   3, 20, 20),
    (rohan_id, 1, 2, 'Incline Db press', 1, 10, 35),
    (rohan_id, 1, 2, 'Incline Db press', 2, 10, 35),
    (rohan_id, 1, 2, 'Incline Db press', 3, 10, 55),
    (rohan_id, 1, 2, 'Machine press flat', 1, 15, 40),
    (rohan_id, 1, 2, 'Machine press flat', 2, 15, 50)
  ON CONFLICT DO NOTHING;
END $$;


-- ─── 10. ROADMAP ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmap (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  month_number  INT NOT NULL CHECK (month_number BETWEEN 1 AND 12),
  month_name    TEXT NOT NULL,
  phase         TEXT CHECK (phase IN ('Fat-Loss','Lean Gain','Maintenance',NULL)),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (client_id, month_number)
);

-- Seed Rohan's roadmap
DO $$
DECLARE rohan_id UUID;
BEGIN
  SELECT id INTO rohan_id FROM clients WHERE email = 'rohan@example.com';
  INSERT INTO roadmap (client_id, month_number, month_name, phase) VALUES
    (rohan_id,  1, 'JANUARY',   'Lean Gain'),
    (rohan_id,  2, 'FEBRUARY',  NULL),
    (rohan_id,  3, 'MARCH',     'Fat-Loss'),
    (rohan_id,  4, 'APRIL',     'Fat-Loss'),
    (rohan_id,  5, 'MAY',       'Fat-Loss'),
    (rohan_id,  6, 'JUNE',      'Fat-Loss'),
    (rohan_id,  7, 'JULY',      'Lean Gain'),
    (rohan_id,  8, 'AUGUST',    'Lean Gain'),
    (rohan_id,  9, 'SEPTEMBER', 'Lean Gain'),
    (rohan_id, 10, 'OCTOBER',   NULL),
    (rohan_id, 11, 'NOVEMBER',  NULL),
    (rohan_id, 12, 'DECEMBER',  NULL)
  ON CONFLICT (client_id, month_number) DO NOTHING;
END $$;


-- ─── 11. ROW LEVEL SECURITY (RLS) ────────────────────────────
-- Enable RLS on all tables
ALTER TABLE admins           ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_targets   ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_database    ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap          ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE auth_user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ADMINS: only admins can read admins table
CREATE POLICY "admins_select" ON admins FOR SELECT USING (is_admin());

-- CLIENTS
CREATE POLICY "clients_admin_all"   ON clients FOR ALL    USING (is_admin());
CREATE POLICY "clients_own_select"  ON clients FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "clients_own_update"  ON clients FOR UPDATE USING (auth_user_id = auth.uid());

-- WEIGHT LOGS
CREATE POLICY "weight_logs_admin"   ON weight_logs FOR ALL    USING (is_admin());
CREATE POLICY "weight_logs_own"     ON weight_logs FOR ALL    USING (
  client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
);

-- WEEKLY TARGETS (read-only for clients)
CREATE POLICY "targets_admin"       ON weekly_targets FOR ALL    USING (is_admin());
CREATE POLICY "targets_own_read"    ON weekly_targets FOR SELECT USING (
  client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
);

-- MEAL PLANS (read-only for clients)
CREATE POLICY "meals_admin"         ON meal_plans FOR ALL    USING (is_admin());
CREATE POLICY "meals_own_read"      ON meal_plans FOR SELECT USING (
  client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
);

-- FOOD DATABASE (everyone can read)
CREATE POLICY "food_db_read"        ON food_database FOR SELECT USING (TRUE);
CREATE POLICY "food_db_admin"       ON food_database FOR ALL USING (is_admin());

-- WORKOUT PROGRAMS (read-only for clients)
CREATE POLICY "workout_prog_admin"  ON workout_programs FOR ALL    USING (is_admin());
CREATE POLICY "workout_prog_read"   ON workout_programs FOR SELECT USING (
  client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
);

-- WORKOUT LOGS (clients can log their own)
CREATE POLICY "workout_logs_admin"  ON workout_logs FOR ALL USING (is_admin());
CREATE POLICY "workout_logs_own"    ON workout_logs FOR ALL USING (
  client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
);

-- ROADMAP (read-only for clients)
CREATE POLICY "roadmap_admin"       ON roadmap FOR ALL    USING (is_admin());
CREATE POLICY "roadmap_own_read"    ON roadmap FOR SELECT USING (
  client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
);


-- ─── 12. UPDATED_AT TRIGGER ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── DONE ────────────────────────────────────────────────────
-- Next steps:
-- 1. Go to Supabase Auth > Users > Create user (your admin email)
-- 2. Copy the UUID of that user
-- 3. Run: INSERT INTO admins (auth_user_id, email) VALUES ('<uuid>', 'admin@yourdomain.com');
-- 4. For each client: Create auth user, copy UUID, UPDATE clients SET auth_user_id = '<uuid>' WHERE email = 'client@email.com';
