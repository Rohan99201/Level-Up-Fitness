import { useState, useEffect } from 'react'
import { supabase, isDemo } from './supabaseClient'
import * as db from './db'

// ─── DEMO DATA (used when Supabase not configured) ────────────────────────────
const DEMO = {
  client: { id: 'demo', name: 'ROHAN CHOUBEY', email: 'rohan@example.com', age: 25, gender: 'MALE', height_cm: 180, start_weight: 93, goal_weight: 79, current_weight: 93.6, start_date: '2026-03-30', end_date: '2026-08-31', join_date: '2026-03-28' },
  weightLogs: [
    { id: 1, date: '2026-03-25', weight: 93.00, unit: 'Kg', bmi: 28.70 },
    { id: 2, date: '2026-03-31', weight: 92.35, unit: 'Kg', bmi: 28.50 },
    { id: 3, date: '2026-04-02', weight: 92.70, unit: 'Kg', bmi: 28.61 },
    { id: 4, date: '2026-04-05', weight: 92.80, unit: 'Kg', bmi: 28.64 },
    { id: 5, date: '2026-04-10', weight: 93.60, unit: 'Kg', bmi: 28.89 },
    { id: 6, date: '2026-04-14', weight: 93.60, unit: 'Kg', bmi: 28.89 },
  ],
  targets: { diet_type: 'veg', calories: 2036, protein_g: 137.78, fats_g: 61.05, carbs_g: 233.87, fibre_g: 15.51, daily_steps: '8k', cardio: 'Daily: 20min' },
  workoutProgram: [
    { day_number: 1, day_name: 'DAY 1', workout_type: 'Legs',         exercise_name: 'Leg extension',            set_rep: '3x9-11',      tempo: '3010', rest_seconds: 120, sets: 3, video_url: 'https://youtu.be/wrU4hx4W3do' },
    { day_number: 1, day_name: 'DAY 1', workout_type: 'Legs',         exercise_name: 'Smith machine calf raises',set_rep: '2x2-Failure', tempo: '3010', rest_seconds: 180, sets: 2, video_url: 'https://youtu.be/1lKjFPrYqf0' },
    { day_number: 1, day_name: 'DAY 1', workout_type: 'Legs',         exercise_name: 'Belt squats',              set_rep: '3x9-11',      tempo: '3010', rest_seconds: 120, sets: 3, video_url: 'https://youtu.be/FCIZZvIM-I0' },
    { day_number: 1, day_name: 'DAY 1', workout_type: 'Legs',         exercise_name: 'Low feet leg press',       set_rep: '2x2-Failure', tempo: '3010', rest_seconds: 180, sets: 2, video_url: 'https://youtu.be/xYGyCXx0kUs' },
    { day_number: 1, day_name: 'DAY 1', workout_type: 'Legs',         exercise_name: 'Lying leg raises',         set_rep: '2x2-Failure', tempo: '3010', rest_seconds: 180, sets: 2, video_url: 'https://youtu.be/9qbV7ZQNqqA' },
    { day_number: 2, day_name: 'DAY 2', workout_type: 'Push',         exercise_name: 'Incline Db press',         set_rep: '3x9-11',      tempo: '3010', rest_seconds: 120, sets: 3, video_url: 'https://youtu.be/IP4oeKh1Sd4' },
    { day_number: 2, day_name: 'DAY 2', workout_type: 'Push',         exercise_name: 'Machine press flat',       set_rep: '2x2-Failure', tempo: '3010', rest_seconds: 180, sets: 2, video_url: 'https://youtu.be/sreMgnjczh4' },
    { day_number: 2, day_name: 'DAY 2', workout_type: 'Push',         exercise_name: 'Db lateral raises',        set_rep: '2x2-Failure', tempo: '3010', rest_seconds: 180, sets: 2, video_url: 'https://youtu.be/PzsMitRdI_8' },
    { day_number: 2, day_name: 'DAY 2', workout_type: 'Push',         exercise_name: 'Tricep pushdown',          set_rep: '2x2-Failure', tempo: '3010', rest_seconds: 180, sets: 2, video_url: 'https://youtu.be/-zLyUAo1gMw' },
    { day_number: 3, day_name: 'DAY 3', workout_type: 'Pull',         exercise_name: 'Cable row',                set_rep: '3x9-11',      tempo: '3010', rest_seconds: 120, sets: 3, video_url: null },
    { day_number: 3, day_name: 'DAY 3', workout_type: 'Pull',         exercise_name: 'Lat pulldown',             set_rep: '3x9-11',      tempo: '3010', rest_seconds: 120, sets: 3, video_url: null },
    { day_number: 4, day_name: 'DAY 4', workout_type: 'Rest',         exercise_name: 'REST DAY',                 set_rep: null,          tempo: null,   rest_seconds: null, sets: null, video_url: null },
    { day_number: 5, day_name: 'DAY 5', workout_type: 'Legs & Chest', exercise_name: 'Stiff leg deadlift',       set_rep: '2x2-Failure', tempo: '3010', rest_seconds: 180, sets: 2, video_url: 'https://youtu.be/CN_7cz3P-1U' },
    { day_number: 5, day_name: 'DAY 5', workout_type: 'Legs & Chest', exercise_name: 'Bulgarian Split squats',   set_rep: '2x2-Failure', tempo: '3010', rest_seconds: 180, sets: 2, video_url: 'https://youtu.be/SkNsa3eBwLA' },
    { day_number: 5, day_name: 'DAY 5', workout_type: 'Legs & Chest', exercise_name: 'Seated calf raises',       set_rep: '2x2-Failure', tempo: '3010', rest_seconds: 180, sets: 2, video_url: 'https://youtu.be/kmaNMXIQIAY' },
  ],
  mealPlan: [
    { meal_number: 1, meal_name: 'MEAL 1', food_name: 'Whey protein', category: 'Proteins',      qty_g: 35, calories: 131.6, protein_g: 25,   fat_g: 2.4,  carbs_g: 2.5,  fibre_g: 0 },
    { meal_number: 1, meal_name: 'MEAL 1', food_name: 'Oats',         category: 'Carbohydrates', qty_g: 60, calories: 219.2, protein_g: 7.56, fat_g: 3.18, carbs_g: 40.1, fibre_g: 6.18 },
  ],
  roadmap: [
    { month_number: 1,  month_name: 'JANUARY',   phase: 'Lean Gain' },
    { month_number: 2,  month_name: 'FEBRUARY',  phase: null },
    { month_number: 3,  month_name: 'MARCH',     phase: 'Fat-Loss' },
    { month_number: 4,  month_name: 'APRIL',     phase: 'Fat-Loss' },
    { month_number: 5,  month_name: 'MAY',       phase: 'Fat-Loss' },
    { month_number: 6,  month_name: 'JUNE',      phase: 'Fat-Loss' },
    { month_number: 7,  month_name: 'JULY',      phase: 'Lean Gain' },
    { month_number: 8,  month_name: 'AUGUST',    phase: 'Lean Gain' },
    { month_number: 9,  month_name: 'SEPTEMBER', phase: 'Lean Gain' },
    { month_number: 10, month_name: 'OCTOBER',   phase: null },
    { month_number: 11, month_name: 'NOVEMBER',  phase: null },
    { month_number: 12, month_name: 'DECEMBER',  phase: null },
  ],
  foodDb: [
    { food_name: 'Whey protein',      portion_g: 35,  protein_g: 25,   fat_g: 2.4,  carbs_g: 2.5,  fibre_g: 0,    calories: 131.6 },
    { food_name: 'Chicken Breast',    portion_g: 100, protein_g: 23.2, fat_g: 1.1,  carbs_g: 0,    fibre_g: 0,    calories: 102.7 },
    { food_name: 'Oats',              portion_g: 100, protein_g: 12.6, fat_g: 5.3,  carbs_g: 66.8, fibre_g: 10.3, calories: 367.5 },
    { food_name: 'White rice raw',    portion_g: 100, protein_g: 6.5,  fat_g: 0.5,  carbs_g: 79.2, fibre_g: 1.3,  calories: 347.3 },
    { food_name: 'Paneer raw',        portion_g: 100, protein_g: 18.3, fat_g: 20.8, carbs_g: 1.2,  fibre_g: 0,    calories: 265.2 },
    { food_name: 'Low fat paneer',    portion_g: 100, protein_g: 25,   fat_g: 9,    carbs_g: 5.7,  fibre_g: 0,    calories: 203.8 },
    { food_name: 'Soya chunk',        portion_g: 100, protein_g: 52,   fat_g: 1,    carbs_g: 50,   fibre_g: 16.2, calories: 417 },
    { food_name: 'Tofu',              portion_g: 100, protein_g: 15,   fat_g: 6,    carbs_g: 6.4,  fibre_g: 2.3,  calories: 139.6 },
    { food_name: 'Egg whites',        portion_g: 100, protein_g: 10.7, fat_g: 0,    carbs_g: 2.4,  fibre_g: 0,    calories: 52.4 },
    { food_name: 'Salmon',            portion_g: 100, protein_g: 25.8, fat_g: 13.5, carbs_g: 0,    fibre_g: 0,    calories: 224.7 },
    { food_name: 'Greek yogurt',      portion_g: 100, protein_g: 5.9,  fat_g: 2,    carbs_g: 12.9, fibre_g: 0.7,  calories: 93.2 },
    { food_name: 'Kidney beans',      portion_g: 100, protein_g: 24,   fat_g: 0.8,  carbs_g: 85,   fibre_g: 14,   calories: 443.2 },
    { food_name: 'Moong dal',         portion_g: 100, protein_g: 23.7, fat_g: 1.4,  carbs_g: 57.6, fibre_g: 12,   calories: 337.8 },
    { food_name: 'Dahi',              portion_g: 100, protein_g: 4,    fat_g: 1,    carbs_g: 5,    fibre_g: 0,    calories: 45 },
    { food_name: 'Skimmed milk',      portion_g: 100, protein_g: 3.4,  fat_g: 0.1,  carbs_g: 5,    fibre_g: 0,    calories: 34.5 },
  ],
  adminClients: [
    { id: '1', name: 'ROHAN CHOUBEY', email: 'rohan@example.com', age: 25, current_weight: 93.6, goal_weight: 79, end_date: '2026-08-31', is_active: true },
    { id: '2', name: 'PRIYA SHARMA',  email: 'priya@example.com', age: 28, current_weight: 65.2, goal_weight: 58, end_date: '2026-09-01', is_active: true },
    { id: '3', name: 'AMIT VERMA',    email: 'amit@example.com',  age: 32, current_weight: 88,   goal_weight: 80, end_date: '2026-07-15', is_active: true },
  ]
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const C = { accent: '#FF6B35', accentL: '#fff4f0', green: '#16a34a', greenL: '#f0fdf4', blue: '#2563eb', blueL: '#eff6ff', red: '#dc2626', redL: '#fef2f2', gray: '#6b7280', border: 'rgba(0,0,0,0.09)' }

const st = {
  app:   { fontFamily: "'Inter',system-ui,sans-serif", minHeight:'100vh', background:'#f6f6f4', color:'#111' },
  nav:   { background:'#0d0d0d', color:'#fff', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:58, position:'sticky', top:0, zIndex:100, gap:16 },
  page:  { maxWidth:1080, margin:'0 auto', padding:'28px 20px' },
  card:  { background:'#fff', borderRadius:14, border:`1px solid ${C.border}`, padding:'22px', marginBottom:18 },
  cardS: { background:'#fff', borderRadius:10, border:`1px solid ${C.border}`, padding:'14px' },
  h1:    { fontSize:26, fontWeight:700, letterSpacing:'-0.5px', margin:'0 0 4px' },
  h2:    { fontSize:18, fontWeight:600, margin:'0 0 14px' },
  lbl:   { fontSize:11, fontWeight:600, color:C.gray, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4, display:'block' },
  val:   { fontSize:22, fontWeight:700 },
  g2:    { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 },
  g3:    { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 },
  g4:    { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 },
  inp:   { width:'100%', padding:'9px 13px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:13, outline:'none', boxSizing:'border-box', background:'#fff' },
  btn:   (v='primary') => ({ padding:'9px 18px', borderRadius:9, border:'none', cursor:'pointer', fontWeight:600, fontSize:13, background: v==='primary'?C.accent:v==='danger'?C.redL:'#f3f4f6', color: v==='primary'?'#fff':v==='danger'?C.red:'#111' }),
  badge: (c) => ({ display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:5, fontSize:11, fontWeight:600, background:c==='green'?C.greenL:c==='red'?C.redL:c==='blue'?C.blueL:c==='amber'?'#fef3c7':C.accentL, color:c==='green'?C.green:c==='red'?C.red:c==='blue'?C.blue:c==='amber'?'#92400e':C.accent }),
  th:    { padding:'9px 13px', textAlign:'left', fontSize:11, fontWeight:600, color:C.gray, textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' },
  td:    { padding:'11px 13px', fontSize:13, borderBottom:`1px solid ${C.border}` },
  table: { width:'100%', borderCollapse:'collapse' },
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Stat({ label, value, sub, color }) {
  return (
    <div style={st.cardS}>
      <span style={st.lbl}>{label}</span>
      <div style={{ ...st.val, color: color==='green'?C.green:color==='red'?C.red:color==='blue'?C.blue:'#111' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.gray, marginTop:3 }}>{sub}</div>}
    </div>
  )
}

function Bar({ pct, color=C.accent }) {
  return (
    <div style={{ height:7, background:'#f0f0f0', borderRadius:4 }}>
      <div style={{ height:7, width:`${Math.min(100,pct)}%`, background:color, borderRadius:4, transition:'width .5s' }} />
    </div>
  )
}

function WeightChart({ data }) {
  if (!data?.length) return null
  const ws = data.map(d=>d.weight), min=Math.min(...ws)-0.8, max=Math.max(...ws)+0.8
  const W=580, H=140
  const px = (i) => 36+(i/(data.length-1||1))*(W-52)
  const py = (w) => H-24-((w-min)/(max-min||1))*(H-40)
  const pts = data.map((d,i)=>({ x:px(i), y:py(d.weight), ...d }))
  const d = pts.map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ')
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible', display:'block' }}>
      <path d={`${d} L ${pts[pts.length-1].x} ${H-24} L ${pts[0].x} ${H-24} Z`} fill={C.accent} fillOpacity=".12" />
      <path d={d} fill="none" stroke={C.accent} strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p,i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke={C.accent} strokeWidth="1.8" />
          {(i===0||i===pts.length-1||i%3===0) && (
            <text x={p.x} y={H-8} textAnchor="middle" fontSize="9" fill={C.gray}>{p.date?.slice(5)}</text>
          )}
        </g>
      ))}
      <text x={4} y={py(max)+4} fontSize="9" fill={C.gray}>{max.toFixed(0)}</text>
      <text x={4} y={py(min)+4} fontSize="9" fill={C.gray}>{min.toFixed(0)}</text>
    </svg>
  )
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [mode, setMode]   = useState('client')
  const [err, setErr]     = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      if (isDemo) {
        if (mode==='admin' && email==='admin@levelup.com' && pass==='admin123') onLogin({ role:'admin', name:'Admin', email })
        else if (mode==='client' && email && pass) onLogin({ role:'client', name:'ROHAN CHOUBEY', email, clientId:'demo' })
        else setErr('Demo — use admin@levelup.com / admin123 for admin, any email+password for client')
      } else {
        const { user } = await db.signIn(email, pass)
        const admin = await db.isAdmin(user.id)
        if (admin) { onLogin({ role:'admin', name:'Admin', email, userId: user.id }) }
        else {
          const profile = await db.getMyProfile(user.id)
          onLogin({ role:'client', name: profile.name, email, userId: user.id, clientId: profile.id })
        }
      }
    } catch(ex) { setErr(ex.message || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ marginBottom:32, textAlign:'center' }}>
        <div style={{ fontSize:30, fontWeight:800, color:'#fff', letterSpacing:'-1px' }}>LEVELUP📈</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:4 }}>Coaching Portal</div>
        {isDemo && <div style={{ fontSize:11, color:C.accent, marginTop:6, padding:'4px 12px', background:'rgba(255,107,53,0.12)', borderRadius:6, display:'inline-block' }}>Demo mode — Supabase not connected</div>}
      </div>
      <div style={{ background:'#1a1a1a', borderRadius:18, padding:28, width:'100%', maxWidth:380, border:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', gap:6, marginBottom:22, background:'rgba(255,255,255,0.04)', borderRadius:9, padding:4 }}>
          {['client','admin'].map(m => (
            <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:'7px 14px', borderRadius:7, border:'none', cursor:'pointer', fontWeight:600, fontSize:12, background:mode===m?C.accent:'transparent', color:mode===m?'#fff':'rgba(255,255,255,0.4)', textTransform:'capitalize' }}>{m}</button>
          ))}
        </div>
        <form onSubmit={handle}>
          {[['Email','email',email,setEmail,'your@email.com'],['Password','password',pass,setPass,'••••••••']].map(([lbl,type,val,set,ph])=>(
            <div key={lbl} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:'rgba(255,255,255,0.4)', display:'block', marginBottom:5 }}>{lbl}</label>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} required style={{ ...st.inp, background:'rgba(255,255,255,0.05)', color:'#fff', borderColor:'rgba(255,255,255,0.08)' }} />
            </div>
          ))}
          {err && <div style={{ fontSize:12, color:'#f87171', marginBottom:12, padding:'8px 12px', background:'rgba(239,68,68,0.08)', borderRadius:7 }}>{err}</div>}
          <button type="submit" disabled={loading} style={{ ...st.btn('primary'), width:'100%', fontSize:14, padding:'11px', opacity:loading?.6:1 }}>{loading?'Signing in…':'Sign In'}</button>
        </form>
        <div style={{ marginTop:18, padding:14, background:'rgba(255,255,255,0.03)', borderRadius:9 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:6 }}>Demo credentials</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>Admin: admin@levelup.com / admin123</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:3 }}>Client: any email + any password</div>
        </div>
      </div>
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [client, setClient]   = useState(null)
  const [logs, setLogs]       = useState([])
  const [targets, setTargets] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load() {
      try {
        if (isDemo || user.clientId==='demo') {
          setClient(DEMO.client); setLogs(DEMO.weightLogs); setTargets(DEMO.targets)
        } else {
          const [c,l,t] = await Promise.all([
            db.getMyProfile(user.userId),
            db.getWeightLogs(user.clientId),
            db.getWeeklyTargets(user.clientId)
          ])
          setClient(c); setLogs(l); setTargets(t)
        }
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  },[user])

  if (loading) return <div style={{ ...st.page, color:C.gray }}>Loading…</div>
  if (!client) return null

  const latest = logs[logs.length-1] || { weight: client.current_weight }
  const loss = (client.start_weight - latest.weight).toFixed(2)
  const pct  = Math.max(0,Math.min(100,((client.start_weight-latest.weight)/(client.start_weight-client.goal_weight))*100))
  const weeks = Math.floor((new Date()-new Date(client.start_date))/(7*864e5))

  return (
    <div style={st.page}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <div style={st.h1}>{client.name}</div>
          <div style={{ color:C.gray, fontSize:13 }}>Age {client.age} · {client.gender} · Height {client.height_cm}cm · BMI {latest.bmi?.toFixed(1)||'—'}</div>
        </div>
        <span style={st.badge('blue')}>Week {weeks} of program</span>
      </div>

      <div style={{ ...st.g4, marginBottom:18 }}>
        <Stat label="Start weight" value={`${client.start_weight} kg`} />
        <Stat label="Current weight" value={`${latest.weight} kg`} color="blue" />
        <Stat label="Goal weight" value={`${client.goal_weight} kg`} />
        <Stat label="Total loss" value={`${loss} kg`} color={parseFloat(loss)>0?'green':'red'} sub="since start" />
      </div>

      <div style={st.card}>
        <div style={st.h2}>Progress toward goal</div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:C.gray, marginBottom:7 }}>
          <span>Fat loss progress</span><span>{pct.toFixed(1)}% complete</span>
        </div>
        <Bar pct={pct} />
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.gray, marginTop:5 }}>
          <span>Start {client.start_weight}kg</span><span>Now {latest.weight}kg</span><span>Goal {client.goal_weight}kg</span>
        </div>
        <div style={{ marginTop:22 }}><WeightChart data={logs} /></div>
      </div>

      {targets && (
        <div style={st.g2}>
          <div style={st.card}>
            <div style={st.h2}>Daily macro targets</div>
            {[
              ['Calories', `${targets.calories?.toFixed(0)} kcal`, C.accent],
              ['Protein',  `${targets.protein_g?.toFixed(0)}g`,    C.blue],
              ['Carbs',    `${targets.carbs_g?.toFixed(0)}g`,      C.green],
              ['Fats',     `${targets.fats_g?.toFixed(0)}g`,       '#f59e0b'],
              ['Fibre',    `${targets.fibre_g?.toFixed(1)}g`,      '#8b5cf6'],
            ].map(([lbl,val,clr])=>(
              <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:9, height:9, borderRadius:'50%', background:clr }} />
                  <span style={{ fontSize:13 }}>{lbl}</span>
                </div>
                <span style={{ fontWeight:600, fontSize:13 }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={st.card}>
            <div style={st.h2}>Weekly targets</div>
            {[
              ['Daily steps', targets.daily_steps],
              ['Cardio',      targets.cardio],
              ['Diet type',   targets.diet_type?.toUpperCase()],
              ['Program end', client.end_date],
              ['Join date',   client.join_date],
            ].map(([lbl,val])=>(
              <div key={lbl} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
                <span style={{ color:C.gray }}>{lbl}</span>
                <span style={{ fontWeight:500 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── WEIGHT LOGGER ────────────────────────────────────────────────────────────
function WeightLogger({ user }) {
  const [logs, setLogs]   = useState([])
  const [date, setDate]   = useState(new Date().toISOString().split('T')[0])
  const [wt, setWt]       = useState('')
  const [unit, setUnit]   = useState('Kg')
  const [msg, setMsg]     = useState('')
  const [loading, setLoading] = useState(false)
  const clientId = user.clientId || 'demo'

  useEffect(()=>{
    if (isDemo || clientId==='demo') { setLogs(DEMO.weightLogs); return }
    db.getWeightLogs(clientId).then(setLogs).catch(console.error)
  },[clientId])

  const addLog = async () => {
    if (!wt) return
    setLoading(true)
    try {
      const w = parseFloat(wt)
      if (isDemo || clientId==='demo') {
        const bmi = +(w/(1.80*1.80)).toFixed(2)
        const entry = { id: Date.now(), date, weight:w, unit, bmi }
        setLogs(prev=>[...prev, entry])
      } else {
        const entry = await db.logWeight(clientId, date, w, unit)
        setLogs(prev=>[...prev, entry])
      }
      setMsg(`Logged ${w}${unit} on ${date}`); setWt('')
      setTimeout(()=>setMsg(''), 3000)
    } catch(e) { setMsg(`Error: ${e.message}`) }
    finally { setLoading(false) }
  }

  const sorted = [...logs].sort((a,b)=>new Date(b.date)-new Date(a.date))

  return (
    <div style={st.page}>
      <div style={{ marginBottom:22 }}>
        <div style={st.h1}>Bodyweight logger</div>
        <div style={{ fontSize:13, color:C.gray }}>Track your daily weight — {logs.length} entries logged</div>
      </div>

      <div style={{ ...st.card, marginBottom:18 }}>
        <div style={st.h2}>Log today</div>
        <div style={{ display:'flex', gap:10, alignItems:'flex-end', flexWrap:'wrap' }}>
          {[['Date','date',date,setDate,'date'],['Weight (kg)','number',wt,setWt,'92.5']].map(([lbl,type,val,set,ph])=>(
            <div key={lbl} style={{ flex:1, minWidth:130 }}>
              <span style={st.lbl}>{lbl}</span>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} step=".1" min="0" style={st.inp} />
            </div>
          ))}
          <div>
            <span style={st.lbl}>Unit</span>
            <select value={unit} onChange={e=>setUnit(e.target.value)} style={{ ...st.inp, width:72 }}>
              <option>Kg</option><option>Lbs</option>
            </select>
          </div>
          <button onClick={addLog} disabled={loading} style={{ ...st.btn('primary'), marginBottom:1 }}>{loading?'Saving…':'Log weight'}</button>
        </div>
        {msg && <div style={{ marginTop:10, padding:'8px 13px', background:msg.startsWith('Error')?C.redL:C.greenL, borderRadius:7, fontSize:12, color:msg.startsWith('Error')?C.red:C.green }}>{msg}</div>}
      </div>

      <div style={st.card}>
        <div style={st.h2}>Weight history</div>
        <WeightChart data={[...logs].sort((a,b)=>new Date(a.date)-new Date(b.date))} />
        <div style={{ marginTop:18, overflowX:'auto' }}>
          <table style={st.table}>
            <thead><tr>{['Date','Weight','Unit','BMI','Change'].map(h=><th key={h} style={st.th}>{h}</th>)}</tr></thead>
            <tbody>
              {sorted.map((l,i)=>{
                const prev = sorted[i+1]
                const chg  = prev ? +(l.weight-prev.weight).toFixed(2) : null
                return (
                  <tr key={l.id}>
                    <td style={st.td}>{l.date}</td>
                    <td style={{ ...st.td, fontWeight:600 }}>{l.weight}</td>
                    <td style={st.td}>{l.unit}</td>
                    <td style={st.td}>{l.bmi||'—'}</td>
                    <td style={st.td}>{chg!=null && <span style={st.badge(chg<0?'green':chg>0?'red':'blue')}>{chg>0?'+':''}{chg}</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── WORKOUT PAGE ─────────────────────────────────────────────────────────────
function WorkoutPage({ user, isAdmin }) {
  const [program, setProgram] = useState([])
  const [logs, setLogs]       = useState([])
  const [dayIdx, setDayIdx]   = useState(0)
  const [week, setWeek]       = useState(1)
  const [setInputs, setSetInputs] = useState({})
  const [saving, setSaving]   = useState('')
  const clientId = user.clientId || 'demo'

  useEffect(()=>{
    const src = isDemo||clientId==='demo' ? Promise.resolve(DEMO.workoutProgram) : db.getWorkoutProgram(clientId)
    src.then(setProgram).catch(console.error)
  },[clientId])

  useEffect(()=>{
    if (isDemo||clientId==='demo') return
    db.getWorkoutLogs(clientId, week).then(setLogs).catch(console.error)
  },[clientId, week])

  const days = [...new Set(program.map(p=>p.day_number))].sort()
  const selDay = days[dayIdx]
  const dayExercises = program.filter(p=>p.day_number===selDay)
  const dayType = dayExercises[0]?.workout_type || ''

  const logSet = async (exName, setNum) => {
    const key = `${exName}_${setNum}`
    const inp = setInputs[key] || {}
    if (!inp.reps && !inp.weight) return
    setSaving(key)
    try {
      if (!(isDemo||clientId==='demo')) {
        await db.logSet(clientId, week, selDay, exName, setNum, parseInt(inp.reps)||0, parseFloat(inp.weight)||0)
        const newLogs = await db.getWorkoutLogs(clientId, week)
        setLogs(newLogs)
      } else {
        setLogs(prev=>[...prev, { id:Date.now(), week, day_number:selDay, exercise_name:exName, set_number:setNum, reps:inp.reps, weight_kg:inp.weight }])
      }
      setSetInputs(prev=>({ ...prev, [key]:{ reps:'', weight:'' } }))
    } catch(e) { console.error(e) }
    finally { setSaving('') }
  }

  const getLog = (exName, setNum) => logs.find(l=>l.exercise_name===exName&&l.set_number===setNum&&l.day_number===selDay)

  return (
    <div style={st.page}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <div style={st.h1}>Workout program</div>
          <div style={{ fontSize:13, color:C.gray }}>Log your sets and track progress week by week</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12, color:C.gray }}>Week</span>
          <select value={week} onChange={e=>setWeek(Number(e.target.value))} style={{ ...st.inp, width:90, padding:'7px 10px' }}>
            {Array.from({length:48},(_,i)=><option key={i+1} value={i+1}>Week {i+1}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display:'flex', gap:7, marginBottom:18, flexWrap:'wrap' }}>
        {days.map((d,i)=>{
          const type = program.find(p=>p.day_number===d)?.workout_type||''
          return <button key={d} onClick={()=>setDayIdx(i)} style={{ ...st.btn(dayIdx===i?'primary':'secondary'), fontSize:12, padding:'7px 14px' }}>Day {d} · {type}</button>
        })}
      </div>

      {dayType==='Rest' ? (
        <div style={{ ...st.card, textAlign:'center', padding:'52px 24px' }}>
          <div style={{ fontSize:44 }}>😴</div>
          <div style={{ fontSize:18, fontWeight:600, marginTop:10 }}>Rest & Recovery Day</div>
          <div style={{ fontSize:13, color:C.gray, marginTop:6 }}>Focus on sleep, hydration, and light stretching</div>
        </div>
      ) : (
        <div style={st.card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div style={st.h2}>Day {selDay} — {dayType}</div>
            <span style={st.badge('blue')}>Week {week}</span>
          </div>
          <table style={st.table}>
            <thead>
              <tr>{['Exercise','Scheme','Tempo','Rest','Sets','Video','Log set'].map(h=><th key={h} style={st.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {dayExercises.map((ex,i) => {
                const sets = ex.sets || 3
                return Array.from({length:sets},(_,si)=>{
                  const setNum = si+1
                  const key = `${ex.exercise_name}_${setNum}`
                  const done = getLog(ex.exercise_name, setNum)
                  return (
                    <tr key={`${i}_${si}`} style={{ background: i%2===0?'#fafafa':'#fff' }}>
                      {si===0 ? (
                        <>
                          <td style={{ ...st.td, fontWeight:600, verticalAlign:'top' }} rowSpan={sets}>{ex.exercise_name}</td>
                          <td style={{ ...st.td, verticalAlign:'top' }} rowSpan={sets}><span style={st.badge('blue')}>{ex.set_rep}</span></td>
                          <td style={{ ...st.td, verticalAlign:'top' }} rowSpan={sets}>{ex.tempo}</td>
                          <td style={{ ...st.td, verticalAlign:'top' }} rowSpan={sets}>{ex.rest_seconds}s</td>
                          <td style={{ ...st.td, verticalAlign:'top' }} rowSpan={sets}>{sets}</td>
                          <td style={{ ...st.td, verticalAlign:'top' }} rowSpan={sets}>
                            {ex.video_url && <a href={ex.video_url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:C.accent, textDecoration:'none', fontWeight:500 }}>Watch →</a>}
                          </td>
                        </>
                      ) : null}
                      <td style={st.td}>
                        {done ? (
                          <span style={st.badge('green')}>Set {setNum}: {done.reps} reps @ {done.weight_kg}kg ✓</span>
                        ) : (
                          <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                            <span style={{ fontSize:11, color:C.gray, minWidth:36 }}>Set {setNum}</span>
                            <input value={setInputs[key]?.reps||''} onChange={e=>setSetInputs(p=>({...p,[key]:{...p[key],reps:e.target.value}}))} placeholder="reps" style={{ ...st.inp, width:52, padding:'5px 7px' }} />
                            <input value={setInputs[key]?.weight||''} onChange={e=>setSetInputs(p=>({...p,[key]:{...p[key],weight:e.target.value}}))} placeholder="kg" style={{ ...st.inp, width:52, padding:'5px 7px' }} />
                            <button onClick={()=>logSet(ex.exercise_name,setNum)} disabled={saving===key} style={{ ...st.btn('primary'), padding:'5px 10px', fontSize:11 }}>{saving===key?'…':'Log'}</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── NUTRITION PAGE ───────────────────────────────────────────────────────────
function NutritionPage({ user, isAdmin }) {
  const [meals, setMeals]     = useState([])
  const [foods, setFoods]     = useState([])
  const [targets, setTargets] = useState(null)
  const [search, setSearch]   = useState('')
  const [dietType, setDietType] = useState('veg')
  const clientId = user.clientId || 'demo'

  useEffect(()=>{
    if (isDemo||clientId==='demo') { setMeals(DEMO.mealPlan); setFoods(DEMO.foodDb); setTargets(DEMO.targets); return }
    Promise.all([
      db.getMealPlan(clientId, dietType),
      db.getWeeklyTargets(clientId)
    ]).then(([m,t])=>{ setMeals(m); setTargets(t) }).catch(console.error)
    const { data } = supabase.from('food_database').select('*').order('food_name')
    data && setFoods(data)
  },[clientId, dietType])

  const grouped = meals.reduce((acc,m)=>{ const k=m.meal_name||`Meal ${m.meal_number}`; (acc[k]=acc[k]||[]).push(m); return acc }, {})
  const filtered = foods.filter(f=>f.food_name?.toLowerCase().includes(search.toLowerCase()))
  const t = targets || {}

  return (
    <div style={st.page}>
      <div style={{ marginBottom:22 }}>
        <div style={st.h1}>Meal planner</div>
        <div style={{ fontSize:13, color:C.gray }}>Personalised meal guide · Level Up Coaching</div>
      </div>

      {targets && (
        <div style={{ ...st.g4, marginBottom:18 }}>
          <Stat label="Calories" value={`${(+t.calories||0).toFixed(0)} kcal`} color="green" />
          <Stat label="Protein"  value={`${(+t.protein_g||0).toFixed(0)}g`} color="blue" />
          <Stat label="Carbs"    value={`${(+t.carbs_g||0).toFixed(0)}g`} />
          <Stat label="Fats"     value={`${(+t.fats_g||0).toFixed(0)}g`} />
        </div>
      )}

      <div style={st.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={st.h2}>Meal plan</div>
          <div style={{ display:'flex', gap:7 }}>
            {['veg','non-veg'].map(dt=>(
              <button key={dt} onClick={()=>setDietType(dt)} style={{ ...st.btn(dietType===dt?'primary':'secondary'), fontSize:11, padding:'6px 13px', textTransform:'capitalize' }}>{dt}</button>
            ))}
            {isAdmin && <button style={{ ...st.btn('secondary'), fontSize:11, padding:'6px 13px' }}>Edit meals</button>}
          </div>
        </div>

        {Object.keys(grouped).length===0 ? (
          <div style={{ padding:24, textAlign:'center', color:C.gray, fontSize:13, background:'#fafafa', borderRadius:9 }}>
            {isAdmin ? 'No meals yet — add items for this client' : 'Meal plan will be set up by your coach shortly'}
          </div>
        ) : (
          Object.entries(grouped).map(([mealName, items])=>(
            <div key={mealName} style={{ marginBottom:20 }}>
              <div style={{ fontWeight:600, fontSize:13, color:C.accent, marginBottom:9, display:'flex', alignItems:'center', gap:8 }}>
                {mealName}
                <span style={{ fontSize:11, color:C.gray, fontWeight:400 }}>
                  ({items.reduce((s,i)=>s+(+i.calories||0),0).toFixed(0)} kcal · {items.reduce((s,i)=>s+(+i.protein_g||0),0).toFixed(1)}g protein)
                </span>
              </div>
              <table style={st.table}>
                <thead><tr>{['Category','Food','Qty (g)','Cal','Protein','Carbs','Fat','Fibre'].map(h=><th key={h} style={st.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {items.map((item,i)=>(
                    <tr key={i} style={{ background:i%2===0?'#fafafa':'#fff' }}>
                      <td style={st.td}><span style={st.badge('blue')}>{item.category}</span></td>
                      <td style={{ ...st.td, fontWeight:500 }}>{item.food_name}</td>
                      <td style={st.td}>{item.qty_g}</td>
                      <td style={st.td}>{(+item.calories||0).toFixed(1)}</td>
                      <td style={st.td}>{(+item.protein_g||0).toFixed(1)}g</td>
                      <td style={st.td}>{(+item.carbs_g||0).toFixed(1)}g</td>
                      <td style={st.td}>{(+item.fat_g||0).toFixed(1)}g</td>
                      <td style={st.td}>{(+item.fibre_g||0).toFixed(1)}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      <div style={st.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div style={st.h2}>Food database</div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search foods…" style={{ ...st.inp, width:200 }} />
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={st.table}>
            <thead><tr>{['Food','Portion','Calories','Protein','Carbs','Fat','Fibre'].map(h=><th key={h} style={st.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((f,i)=>(
                <tr key={i} style={{ background:i%2===0?'#fafafa':'#fff' }}>
                  <td style={{ ...st.td, fontWeight:500 }}>{f.food_name}</td>
                  <td style={st.td}>{f.portion_g}g</td>
                  <td style={st.td}>{f.calories}</td>
                  <td style={st.td}>{f.protein_g}g</td>
                  <td style={st.td}>{f.carbs_g}g</td>
                  <td style={st.td}>{f.fat_g}g</td>
                  <td style={st.td}>{f.fibre_g}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage({ user, isAdmin }) {
  const [roadmap, setRoadmap] = useState([])
  const clientId = user.clientId || 'demo'

  useEffect(()=>{
    if (isDemo||clientId==='demo') { setRoadmap(DEMO.roadmap); return }
    db.getRoadmap(clientId).then(setRoadmap).catch(console.error)
  },[clientId])

  const phaseColor = (p) => p==='Fat-Loss'?{bg:'#fef3c7',text:'#92400e',emoji:'🔥'}:p==='Lean Gain'?{bg:'#dcfce7',text:'#166534',emoji:'📈'}:{bg:'#f3f4f6',text:C.gray,emoji:'○'}

  return (
    <div style={st.page}>
      <div style={{ marginBottom:24 }}>
        <div style={st.h1}>2026 Roadmap</div>
        <div style={{ fontSize:13, color:C.gray }}>Year-long periodization plan · Level Up Coaching</div>
      </div>

      <div style={st.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div style={st.h2}>Monthly phases</div>
          {isAdmin && <button style={{ ...st.btn('secondary'), fontSize:11, padding:'6px 13px' }}>Edit roadmap</button>}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
          {roadmap.map((m,i)=>{
            const pc = phaseColor(m.phase)
            return (
              <div key={i} style={{ ...st.cardS, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:pc.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{pc.emoji}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{m.month_name}</div>
                    {m.phase && <div style={{ fontSize:11, color:C.gray }}>{m.phase}</div>}
                  </div>
                </div>
                {m.phase && <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:16, fontSize:11, fontWeight:600, background:pc.bg, color:pc.text }}>{m.phase}</span>}
              </div>
            )
          })}
        </div>
      </div>

      <div style={st.g2}>
        <div style={st.card}>
          <div style={st.h2}>Phase guide</div>
          {[
            ['Fat-Loss 🔥','Caloric deficit, high protein, cardio emphasis. Strip fat while preserving muscle.','#fef3c7','#92400e'],
            ['Lean Gain 📈','Slight surplus, progressive overload focus. Build muscle with minimal fat gain.','#dcfce7','#166534'],
            ['Maintenance','Caloric maintenance, skill work. Consolidate gains and recover.','#f0f9ff','#0369a1'],
          ].map(([p,d,bg,tc])=>(
            <div key={p} style={{ padding:'13px 15px', borderRadius:9, background:bg, marginBottom:10 }}>
              <div style={{ fontWeight:600, fontSize:13, color:tc, marginBottom:3 }}>{p}</div>
              <div style={{ fontSize:12, color:tc, opacity:.85 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={st.card}>
          <div style={st.h2}>Set & rep schemes</div>
          {[
            ['5x5 1010 180s',      'Strength 1',     'Heavy compound, full recovery'],
            ['4x4 2010 120s',      'Strength 2',     'Controlled eccentric strength'],
            ['3x9-11 3010 120s',   'Hypertrophy 1',  'Volume block, main driver'],
            ['2x2-Failure 3010 180s','Hypertrophy 2','Failure training, intensification'],
          ].map(([s,cat,desc])=>(
            <div key={s} style={{ padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontWeight:500, fontSize:13 }}>{s}</div>
                  <div style={{ fontSize:11, color:C.gray, marginTop:2 }}>{desc}</div>
                </div>
                <span style={st.badge('blue')}>{cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ user }) {
  const [clients, setClients] = useState([])
  const [sel, setSel]         = useState(null)
  const [tab, setTab]         = useState('clients')
  const [form, setForm]       = useState({ name:'', email:'', age:'', gender:'MALE', height_cm:'', start_weight:'', goal_weight:'', start_date:'', end_date:'' })
  const [msg, setMsg]         = useState('')

  useEffect(()=>{
    if (isDemo) { setClients(DEMO.adminClients); return }
    db.getAllClients().then(setClients).catch(console.error)
  },[])

  const save = async () => {
    try {
      if (!isDemo) {
        await db.createClient(form)
        const updated = await db.getAllClients()
        setClients(updated)
      } else {
        setClients(prev=>[...prev,{...form, id:Date.now(), is_active:true}])
      }
      setMsg('Client created!'); setTab('clients')
      setTimeout(()=>setMsg(''),3000)
    } catch(e){ setMsg(`Error: ${e.message}`) }
  }

  const update = async (clientId, updates) => {
    try {
      if (!isDemo) await db.updateClient(clientId, updates)
      setClients(prev=>prev.map(c=>c.id===clientId?{...c,...updates}:c))
      setMsg('Saved!'); setTimeout(()=>setMsg(''),2500)
    } catch(e){ setMsg(`Error: ${e.message}`) }
  }

  return (
    <div style={st.page}>
      <div style={{ marginBottom:22 }}>
        <div style={st.h1}>Admin dashboard</div>
        <div style={{ fontSize:13, color:C.gray }}>Manage clients, programs and nutrition plans</div>
      </div>

      <div style={{ ...st.g4, marginBottom:18 }}>
        <Stat label="Total clients" value={clients.length} color="blue" />
        <Stat label="Active"        value={clients.filter(c=>c.is_active).length} color="green" />
        <Stat label="Programs"      value="1" />
        <Stat label="DB mode"       value={isDemo?'Demo':'Live'} color={isDemo?'amber':'green'} />
      </div>

      {msg && <div style={{ padding:'10px 16px', background:msg.startsWith('Error')?C.redL:C.greenL, borderRadius:9, fontSize:13, color:msg.startsWith('Error')?C.red:C.green, marginBottom:16 }}>{msg}</div>}

      <div style={{ display:'flex', gap:7, marginBottom:18 }}>
        {['clients','add client'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ ...st.btn(tab===t?'primary':'secondary'), fontSize:12, textTransform:'capitalize' }}>{t}</button>
        ))}
      </div>

      {tab==='clients' && (
        <div style={st.card}>
          <div style={st.h2}>All clients</div>
          <div style={{ overflowX:'auto' }}>
            <table style={st.table}>
              <thead><tr>{['Name','Email','Age','Weight','Goal','End date','Status',''].map(h=><th key={h} style={st.th}>{h}</th>)}</tr></thead>
              <tbody>
                {clients.map(c=>(
                  <>
                    <tr key={c.id}>
                      <td style={{ ...st.td, fontWeight:600 }}>{c.name}</td>
                      <td style={{ ...st.td, color:C.gray }}>{c.email}</td>
                      <td style={st.td}>{c.age}</td>
                      <td style={st.td}>{c.current_weight} kg</td>
                      <td style={st.td}>{c.goal_weight} kg</td>
                      <td style={st.td}>{c.end_date}</td>
                      <td style={st.td}><span style={st.badge(c.is_active?'green':'red')}>{c.is_active?'Active':'Inactive'}</span></td>
                      <td style={st.td}>
                        <button onClick={()=>setSel(sel?.id===c.id?null:c)} style={{ ...st.btn('secondary'), padding:'4px 11px', fontSize:11 }}>
                          {sel?.id===c.id?'Close':'Edit'}
                        </button>
                      </td>
                    </tr>
                    {sel?.id===c.id && (
                      <tr key={`edit_${c.id}`}>
                        <td colSpan={8} style={{ padding:16, background:'#fafafa' }}>
                          <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Edit: {c.name}</div>
                          <div style={st.g3}>
                            {[
                              ['Calories (kcal)','calories',''],
                              ['Protein (g)','protein_g',''],
                              ['Carbs (g)','carbs_g',''],
                              ['Fats (g)','fats_g',''],
                              ['Daily steps','daily_steps','8k'],
                              ['Cardio target','cardio','Daily: 20min'],
                            ].map(([lbl,k,ph])=>(
                              <div key={k}>
                                <span style={st.lbl}>{lbl}</span>
                                <input placeholder={ph} id={`${c.id}_${k}`} defaultValue={c[k]||''} style={st.inp} />
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop:14, display:'flex', gap:9 }}>
                            <button onClick={()=>{
                              const get = k => document.getElementById(`${c.id}_${k}`)?.value
                              update(c.id, { calories:get('calories'), protein_g:get('protein_g'), carbs_g:get('carbs_g'), fats_g:get('fats_g') })
                            }} style={st.btn('primary')}>Save changes</button>
                            <button onClick={()=>setSel(null)} style={st.btn('secondary')}>Cancel</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='add client' && (
        <div style={st.card}>
          <div style={st.h2}>Add new client</div>
          <div style={st.g2}>
            {[
              ['Full name','text','name','JOHN DOE'],
              ['Email','email','email','john@email.com'],
              ['Age','number','age','28'],
              ['Height (cm)','number','height_cm','175'],
              ['Start weight (kg)','number','start_weight','85'],
              ['Goal weight (kg)','number','goal_weight','75'],
              ['Start date','date','start_date',''],
              ['End date','date','end_date',''],
            ].map(([lbl,type,key,ph])=>(
              <div key={key}>
                <span style={st.lbl}>{lbl}</span>
                <input type={type} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} placeholder={ph} style={st.inp} />
              </div>
            ))}
          </div>
          <div style={{ marginTop:14 }}>
            <span style={st.lbl}>Gender</span>
            <select value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))} style={{ ...st.inp, width:160 }}>
              {['MALE','FEMALE','OTHER'].map(g=><option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ marginTop:16, display:'flex', gap:9 }}>
            <button onClick={save} style={st.btn('primary')}>Create client</button>
            <button onClick={()=>setTab('clients')} style={st.btn('secondary')}>Cancel</button>
          </div>
          {isDemo && <div style={{ marginTop:14, padding:13, background:C.blueL, borderRadius:9, fontSize:12, color:C.blue }}>Demo mode: client will be added locally only. Connect Supabase to persist data.</div>}
        </div>
      )}
    </div>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [tab, setTab]   = useState('dashboard')

  useEffect(()=>{
    if (isDemo) return
    supabase.auth.getSession().then(({ data:{ session } })=>{
      if (session) {
        db.isAdmin(session.user.id).then(admin=>{
          if (admin) setUser({ role:'admin', name:'Admin', email:session.user.email, userId:session.user.id })
          else db.getMyProfile(session.user.id).then(p=>setUser({ role:'client', name:p.name, email:p.email, userId:session.user.id, clientId:p.id })).catch(()=>{})
        })
      }
    })
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_event, session)=>{
      if (!session) setUser(null)
    })
    return ()=>subscription.unsubscribe()
  },[])

  if (!user) return <Login onLogin={u=>{ setUser(u); setTab('dashboard') }} />

  const isAdmin = user.role==='admin'
  const tabs = isAdmin
    ? [['dashboard','Clients'],['workout','Workouts'],['nutrition','Nutrition'],['roadmap','Roadmap']]
    : [['dashboard','Dashboard'],['weight','Weight log'],['workout','Workout'],['nutrition','Nutrition'],['roadmap','Roadmap']]

  const logout = async () => {
    if (!isDemo) await db.signOut()
    setUser(null)
  }

  return (
    <div style={st.app}>
      <nav style={st.nav}>
        <div style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', flexShrink:0 }}>
          LEVELUP📈 {isAdmin && <span style={{ fontSize:10, fontWeight:400, color:'rgba(255,255,255,0.35)', marginLeft:6 }}>admin</span>}
        </div>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {tabs.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ padding:'6px 13px', borderRadius:7, border:'none', cursor:'pointer', fontWeight:600, fontSize:12, background:tab===id?C.accent:'transparent', color:tab===id?'#fff':'rgba(255,255,255,0.5)' }}>{label}</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{user.email}</span>
          <button onClick={logout} style={{ padding:'5px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:11 }}>Sign out</button>
        </div>
      </nav>

      {tab==='dashboard' && (isAdmin ? <AdminPanel user={user} /> : <Dashboard user={user} />)}
      {tab==='weight'    && !isAdmin && <WeightLogger user={user} />}
      {tab==='workout'   && <WorkoutPage user={user} isAdmin={isAdmin} />}
      {tab==='nutrition' && <NutritionPage user={user} isAdmin={isAdmin} />}
      {tab==='roadmap'   && <RoadmapPage user={user} isAdmin={isAdmin} />}
    </div>
  )
}
