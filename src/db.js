import { supabase } from './supabaseClient'

// ─── AUTH ────────────────────────────────────────────────────────────────────

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function createUser(email, password) {
  const { data, error } = await supabase.auth.admin.createUser({
    email, password, email_confirm: true
  })
  if (error) throw error
  return data
}

// ─── CLIENT PROFILE ──────────────────────────────────────────────────────────

export async function getMyProfile(userId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('auth_user_id', userId)
    .single()
  if (error) throw error
  return data
}

export async function getAllClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createClient(profile) {
  const { data, error } = await supabase
    .from('clients')
    .insert([profile])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateClient(clientId, updates) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', clientId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── WEIGHT LOGS ─────────────────────────────────────────────────────────────

export async function getWeightLogs(clientId) {
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: true })
  if (error) throw error
  return data
}

export async function logWeight(clientId, date, weight, unit) {
  const heightM = 1.80
  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(2))
  const { data, error } = await supabase
    .from('weight_logs')
    .insert([{ client_id: clientId, date, weight, unit, bmi }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteWeightLog(logId) {
  const { error } = await supabase
    .from('weight_logs')
    .delete()
    .eq('id', logId)
  if (error) throw error
}

// ─── WEEKLY TARGETS ──────────────────────────────────────────────────────────

export async function getWeeklyTargets(clientId) {
  const { data, error } = await supabase
    .from('weekly_targets')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertWeeklyTargets(clientId, targets) {
  const { data, error } = await supabase
    .from('weekly_targets')
    .upsert([{ client_id: clientId, ...targets }], { onConflict: 'client_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── MEAL PLANS ──────────────────────────────────────────────────────────────

export async function getMealPlan(clientId, dietType = 'veg') {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('client_id', clientId)
    .eq('diet_type', dietType)
    .order('meal_number', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertMealItem(item) {
  const { data, error } = await supabase
    .from('meal_plans')
    .upsert([item])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMealItem(itemId) {
  const { error } = await supabase
    .from('meal_plans')
    .delete()
    .eq('id', itemId)
  if (error) throw error
}

// ─── WORKOUT PROGRAMS ────────────────────────────────────────────────────────

export async function getWorkoutProgram(clientId) {
  const { data, error } = await supabase
    .from('workout_programs')
    .select('*')
    .eq('client_id', clientId)
    .order('day_number', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertExercise(exercise) {
  const { data, error } = await supabase
    .from('workout_programs')
    .upsert([exercise])
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── WORKOUT LOGS (client fills in actual reps/weight) ───────────────────────

export async function getWorkoutLogs(clientId, week) {
  let q = supabase
    .from('workout_logs')
    .select('*')
    .eq('client_id', clientId)
    .order('logged_at', { ascending: false })
  if (week) q = q.eq('week', week)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function logSet(clientId, week, dayNumber, exercise, setNumber, reps, weight) {
  const { data, error } = await supabase
    .from('workout_logs')
    .insert([{ client_id: clientId, week, day_number: dayNumber, exercise, set_number: setNumber, reps, weight }])
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── ROADMAP ─────────────────────────────────────────────────────────────────

export async function getRoadmap(clientId) {
  const { data, error } = await supabase
    .from('roadmap')
    .select('*')
    .eq('client_id', clientId)
    .order('month_number', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertRoadmapMonth(item) {
  const { data, error } = await supabase
    .from('roadmap')
    .upsert([item], { onConflict: 'client_id,month_number' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── ADMIN CHECK ─────────────────────────────────────────────────────────────

export async function isAdmin(userId) {
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('auth_user_id', userId)
    .single()
  return !error && !!data
}
