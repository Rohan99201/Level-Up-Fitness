/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { supabase, isDemo } from './supabaseClient'

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO = {
  client: { id:'demo', name:'ROHAN CHOUBEY', email:'rohan@example.com', age:25, gender:'MALE', height_cm:180, start_weight:93, goal_weight:79, current_weight:90, start_date:'2026-03-30', end_date:'2026-08-31', join_date:'2026-03-28' },
  weightLogs: [
    { id:1, date:'2026-03-25', weight:93.00, unit:'Kg', bmi:28.70 },
    { id:2, date:'2026-03-31', weight:92.35, unit:'Kg', bmi:28.50 },
    { id:3, date:'2026-04-05', weight:92.80, unit:'Kg', bmi:28.64 },
    { id:4, date:'2026-04-10', weight:91.60, unit:'Kg', bmi:28.27 },
    { id:5, date:'2026-04-20', weight:90.00, unit:'Kg', bmi:27.78 },
  ],
  targets: { diet_type:'veg', calories:2036, protein_g:137.78, fats_g:61.05, carbs_g:233.87, fibre_g:15.51, daily_steps:'8k', cardio:'Daily: 20min' },
  workoutProgram: [
    { day_number:1, day_name:'DAY 1', workout_type:'Legs',         exercise_name:'Leg extension',            set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:'https://youtu.be/wrU4hx4W3do' },
    { day_number:1, day_name:'DAY 1', workout_type:'Legs',         exercise_name:'Smith machine calf raises',set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/1lKjFPrYqf0' },
    { day_number:1, day_name:'DAY 1', workout_type:'Legs',         exercise_name:'Belt squats',              set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:'https://youtu.be/FCIZZvIM-I0' },
    { day_number:1, day_name:'DAY 1', workout_type:'Legs',         exercise_name:'Low feet leg press',       set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/xYGyCXx0kUs' },
    { day_number:2, day_name:'DAY 2', workout_type:'Push',         exercise_name:'Incline Db press',         set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:'https://youtu.be/IP4oeKh1Sd4' },
    { day_number:2, day_name:'DAY 2', workout_type:'Push',         exercise_name:'Machine press flat',       set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/sreMgnjczh4' },
    { day_number:2, day_name:'DAY 2', workout_type:'Push',         exercise_name:'Db lateral raises',        set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/PzsMitRdI_8' },
    { day_number:2, day_name:'DAY 2', workout_type:'Push',         exercise_name:'Tricep pushdown',          set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/-zLyUAo1gMw' },
    { day_number:3, day_name:'DAY 3', workout_type:'Pull',         exercise_name:'Cable row',                set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:null },
    { day_number:3, day_name:'DAY 3', workout_type:'Pull',         exercise_name:'Lat pulldown',             set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:null },
    { day_number:4, day_name:'DAY 4', workout_type:'Rest',         exercise_name:'REST DAY',                 set_rep:null,          tempo:null,   rest_seconds:null, sets:null, video_url:null },
    { day_number:5, day_name:'DAY 5', workout_type:'Legs & Chest', exercise_name:'Stiff leg deadlift',       set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/CN_7cz3P-1U' },
    { day_number:5, day_name:'DAY 5', workout_type:'Legs & Chest', exercise_name:'Bulgarian Split squats',   set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/SkNsa3eBwLA' },
    { day_number:5, day_name:'DAY 5', workout_type:'Legs & Chest', exercise_name:'Seated calf raises',       set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/kmaNMXIQIAY' },
  ],
  mealPlan: [
    { meal_number:1, meal_name:'MEAL 1', food_name:'Whey protein', category:'Proteins',      qty_g:35, calories:131.6, protein_g:25,   fat_g:2.4,  carbs_g:2.5,  fibre_g:0 },
    { meal_number:1, meal_name:'MEAL 1', food_name:'Oats',         category:'Carbohydrates', qty_g:60, calories:219.2, protein_g:7.56, fat_g:3.18, carbs_g:40.1, fibre_g:6.18 },
  ],
  roadmap: [
    { month_number:1,  month_name:'JANUARY',   phase:'Lean Gain' },
    { month_number:2,  month_name:'FEBRUARY',  phase:null },
    { month_number:3,  month_name:'MARCH',     phase:'Fat-Loss' },
    { month_number:4,  month_name:'APRIL',     phase:'Fat-Loss' },
    { month_number:5,  month_name:'MAY',       phase:'Fat-Loss' },
    { month_number:6,  month_name:'JUNE',      phase:'Fat-Loss' },
    { month_number:7,  month_name:'JULY',      phase:'Lean Gain' },
    { month_number:8,  month_name:'AUGUST',    phase:'Lean Gain' },
    { month_number:9,  month_name:'SEPTEMBER', phase:'Lean Gain' },
    { month_number:10, month_name:'OCTOBER',   phase:null },
    { month_number:11, month_name:'NOVEMBER',  phase:null },
    { month_number:12, month_name:'DECEMBER',  phase:null },
  ],
  foodDb: [
    { food_name:'Whey protein',   portion_g:35,  protein_g:25,   fat_g:2.4,  carbs_g:2.5,  fibre_g:0,    calories:131.6 },
    { food_name:'Chicken Breast', portion_g:100, protein_g:23.2, fat_g:1.1,  carbs_g:0,    fibre_g:0,    calories:102.7 },
    { food_name:'Oats',           portion_g:100, protein_g:12.6, fat_g:5.3,  carbs_g:66.8, fibre_g:10.3, calories:367.5 },
    { food_name:'White rice raw', portion_g:100, protein_g:6.5,  fat_g:0.5,  carbs_g:79.2, fibre_g:1.3,  calories:347.3 },
    { food_name:'Paneer raw',     portion_g:100, protein_g:18.3, fat_g:20.8, carbs_g:1.2,  fibre_g:0,    calories:265.2 },
    { food_name:'Soya chunk',     portion_g:100, protein_g:52,   fat_g:1,    carbs_g:50,   fibre_g:16.2, calories:417 },
    { food_name:'Tofu',           portion_g:100, protein_g:15,   fat_g:6,    carbs_g:6.4,  fibre_g:2.3,  calories:139.6 },
    { food_name:'Egg whites',     portion_g:100, protein_g:10.7, fat_g:0,    carbs_g:2.4,  fibre_g:0,    calories:52.4 },
    { food_name:'Salmon',         portion_g:100, protein_g:25.8, fat_g:13.5, carbs_g:0,    fibre_g:0,    calories:224.7 },
    { food_name:'Greek yogurt',   portion_g:100, protein_g:5.9,  fat_g:2,    carbs_g:12.9, fibre_g:0.7,  calories:93.2 },
    { food_name:'Kidney beans',   portion_g:100, protein_g:24,   fat_g:0.8,  carbs_g:85,   fibre_g:14,   calories:443.2 },
    { food_name:'Moong dal',      portion_g:100, protein_g:23.7, fat_g:1.4,  carbs_g:57.6, fibre_g:12,   calories:337.8 },
    { food_name:'Dahi',           portion_g:100, protein_g:4,    fat_g:1,    carbs_g:5,    fibre_g:0,    calories:45 },
    { food_name:'Skimmed milk',   portion_g:100, protein_g:3.4,  fat_g:0.1,  carbs_g:5,    fibre_g:0,    calories:34.5 },
  ],
  adminClients: [
    { id:'1', name:'ROHAN CHOUBEY', email:'rohanchoubey7@gmail.com', age:25, current_weight:90, goal_weight:79, end_date:'2026-08-31', is_active:true },
  ]
}

// ─── SUPABASE HELPERS ─────────────────────────────────────────────────────────
async function sbQuery(table, options={}) {
  let q = supabase.from(table).select(options.select||'*')
  if (options.eq)    Object.entries(options.eq).forEach(([k,v])=>{ q=q.eq(k,v) })
  if (options.order) q=q.order(options.order,{ascending:options.asc!==false})
  if (options.single) q=q.single()
  const { data, error } = await q
  if (error && error.code!=='PGRST116') throw error
  return data
}
async function sbInsert(table, values) {
  const { data, error } = await supabase.from(table).insert([values]).select().single()
  if (error) throw error
  return data
}

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640)
  useEffect(()=>{
    const fn = ()=>setMobile(window.innerWidth<640)
    window.addEventListener('resize',fn)
    return ()=>window.removeEventListener('resize',fn)
  },[])
  return mobile
}

// ─── COLORS & BASE STYLES ─────────────────────────────────────────────────────
const C = {
  accent:'#FF6B35', accentL:'#fff4f0',
  green:'#16a34a',  greenL:'#f0fdf4',
  blue:'#2563eb',   blueL:'#eff6ff',
  red:'#dc2626',    redL:'#fef2f2',
  amber:'#d97706',  amberL:'#fef3c7',
  gray:'#6b7280',   border:'rgba(0,0,0,0.09)'
}

const base = {
  inp: { width:'100%', padding:'10px 13px', borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:15, outline:'none', boxSizing:'border-box', background:'#fff', WebkitAppearance:'none' },
  card: { background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, padding:'18px', marginBottom:14 },
  cardS: { background:'#fff', borderRadius:12, border:`1px solid ${C.border}`, padding:'14px' },
  lbl: { fontSize:11, fontWeight:600, color:C.gray, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:5, display:'block' },
  th: { padding:'9px 11px', textAlign:'left', fontSize:11, fontWeight:600, color:C.gray, textTransform:'uppercase', letterSpacing:'0.4px', borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' },
  td: { padding:'10px 11px', fontSize:13, borderBottom:`1px solid ${C.border}` },
  table: { width:'100%', borderCollapse:'collapse' },
}

function btn(v='primary') {
  return { padding:'10px 18px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:600, fontSize:14, WebkitTapHighlightColor:'transparent',
    background:v==='primary'?C.accent:v==='danger'?C.redL:v==='green'?C.greenL:'#f3f4f6',
    color:v==='primary'?'#fff':v==='danger'?C.red:v==='green'?C.green:'#111' }
}
function badge(c) {
  return { display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:6, fontSize:11, fontWeight:600,
    background:c==='green'?C.greenL:c==='red'?C.redL:c==='blue'?C.blueL:c==='amber'?C.amberL:C.accentL,
    color:c==='green'?C.green:c==='red'?C.red:c==='blue'?C.blue:c==='amber'?C.amber:C.accent }
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Stat({ label, value, sub, color }) {
  return (
    <div style={base.cardS}>
      <span style={base.lbl}>{label}</span>
      <div style={{ fontSize:20, fontWeight:700, color:color==='green'?C.green:color==='red'?C.red:color==='blue'?C.blue:color==='amber'?C.amber:'#111' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.gray, marginTop:2 }}>{sub}</div>}
    </div>
  )
}

function Bar({ pct, color=C.accent }) {
  return (
    <div style={{ height:8, background:'#f0f0f0', borderRadius:4 }}>
      <div style={{ height:8, width:`${Math.min(100,Math.max(0,pct))}%`, background:color, borderRadius:4, transition:'width .6s' }} />
    </div>
  )
}

function MsgBox({ msg }) {
  if (!msg) return null
  const isErr = msg.startsWith('Error') || msg.startsWith('error')
  return <div style={{ padding:'10px 14px', background:isErr?C.redL:C.greenL, borderRadius:9, fontSize:13, color:isErr?C.red:C.green, marginTop:12 }}>{msg}</div>
}

// ─── INTERACTIVE WEIGHT CHART ─────────────────────────────────────────────────
function WeightChart({ data }) {
  const [tooltip, setTooltip] = useState(null)
  const svgRef = useRef(null)
  const isMobile = useIsMobile()

  if (!data || data.length < 2) {
    return <div style={{ textAlign:'center', padding:'32px 0', color:C.gray, fontSize:13 }}>Log at least 2 entries to see your chart</div>
  }

  const sorted = [...data].sort((a,b)=>new Date(a.date)-new Date(b.date))
  const weights = sorted.map(d=>d.weight)
  const minW = Math.min(...weights)-1, maxW = Math.max(...weights)+1
  const W=520, H=150, PL=36, PR=12, PT=14, PB=26
  const iW=W-PL-PR, iH=H-PT-PB
  const px = i => PL+(i/(sorted.length-1||1))*iW
  const py = w => PT+iH-((w-minW)/(maxW-minW||1))*iH
  const pts = sorted.map((d,i)=>({ x:px(i), y:py(d.weight), ...d }))
  const line = pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length-1].x.toFixed(1)},${(PT+iH).toFixed(1)} L${PL},${(PT+iH).toFixed(1)} Z`
  const yTicks = [minW+0.5,(minW+maxW)/2,maxW-0.5]

  const handleInteract = (e) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const mouseX = (clientX - rect.left) * (W/rect.width)
    let closest=pts[0], minDist=Infinity
    pts.forEach(p=>{ const d=Math.abs(p.x-mouseX); if(d<minDist){minDist=d;closest=p} })
    setTooltip(minDist < 40 ? closest : null)
  }

  return (
    <div style={{ position:'relative', touchAction:'pan-y' }}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`}
        style={{ overflow:'visible', display:'block', cursor:'crosshair' }}
        onMouseMove={handleInteract} onMouseLeave={()=>setTooltip(null)}
        onTouchMove={handleInteract} onTouchEnd={()=>setTimeout(()=>setTooltip(null),2000)}>
        <defs>
          <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={C.accent} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {yTicks.map((w,i)=>(
          <g key={i}>
            <line x1={PL} y1={py(w)} x2={W-PR} y2={py(w)} stroke={C.border} strokeWidth="1" strokeDasharray="3,3"/>
            <text x={PL-4} y={py(w)+4} textAnchor="end" fontSize="9" fill={C.gray}>{w.toFixed(0)}</text>
          </g>
        ))}
        <path d={area} fill="url(#wgrad)"/>
        <path d={line} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {pts.map((p,i)=>(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={tooltip?.date===p.date?7:4} fill="#fff" stroke={C.accent} strokeWidth="2" style={{ transition:'r .1s' }}/>
            {(i===0||i===pts.length-1||i%Math.ceil(pts.length/4)===0)&&(
              <text x={p.x} y={H-4} textAnchor="middle" fontSize={isMobile?'8':'9'} fill={C.gray}>{p.date?.slice(5)}</text>
            )}
          </g>
        ))}
        {tooltip&&(
          <g>
            <line x1={tooltip.x} y1={PT} x2={tooltip.x} y2={PT+iH} stroke={C.accent} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
            <rect x={Math.min(tooltip.x+8,W-108)} y={tooltip.y-40} width={100} height={36} rx="7" fill="#111" fillOpacity="0.9"/>
            <text x={Math.min(tooltip.x+58,W-58)} y={tooltip.y-23} textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">{tooltip.weight} kg</text>
            <text x={Math.min(tooltip.x+58,W-58)} y={tooltip.y-8}  textAnchor="middle" fontSize="9"  fill="rgba(255,255,255,0.55)">{tooltip.date}</text>
          </g>
        )}
      </svg>
      <div style={{ fontSize:11, color:C.gray, textAlign:'center', marginTop:4 }}>
        {isMobile ? 'Tap a point for details' : 'Hover over points for details'}
      </div>
    </div>
  )
}

// ─── BOTTOM NAV (mobile) ──────────────────────────────────────────────────────
function BottomNav({ tabs, tab, setTab }) {
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#0d0d0d', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', zIndex:200, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
      {tabs.map(([id,label,icon])=>(
        <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:'10px 4px 8px', background:'transparent', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, WebkitTapHighlightColor:'transparent' }}>
          <span style={{ fontSize:18 }}>{icon}</span>
          <span style={{ fontSize:10, fontWeight:600, color:tab===id?C.accent:'rgba(255,255,255,0.45)' }}>{label}</span>
          {tab===id && <div style={{ width:18, height:2, background:C.accent, borderRadius:1 }}/>}
        </button>
      ))}
    </div>
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
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      if (isDemo) {
        if (mode==='admin'&&email==='admin@levelup.com'&&pass==='admin123') onLogin({role:'admin',name:'Admin',email})
        else if (mode==='client'&&email&&pass) onLogin({role:'client',name:'ROHAN CHOUBEY',email,clientId:'demo'})
        else setErr('Demo: admin@levelup.com / admin123 for admin, any email+pass for client')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({email,password:pass})
        if (error) throw error
        const userId = data.user.id
        const { data: adminRow } = await supabase.from('admins').select('id').eq('auth_user_id',userId).single()
        if (adminRow) {
          onLogin({role:'admin',name:'Admin',email,userId})
        } else {
          const { data: profile, error: pe } = await supabase.from('clients').select('*').eq('auth_user_id',userId).single()
          if (pe) throw new Error('Client profile not found. Contact your coach.')
          onLogin({role:'client',name:profile.name,email,userId,clientId:profile.id})
        }
      }
    } catch(ex) { setErr(ex.message||'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px' }}>
      <div style={{ marginBottom:28, textAlign:'center' }}>
        <div style={{ fontSize:30, fontWeight:800, color:'#fff', letterSpacing:'-1px' }}>LEVELUP📈</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:4 }}>Coaching Portal</div>
        {isDemo&&<div style={{ fontSize:11, color:C.accent, marginTop:8, padding:'4px 12px', background:'rgba(255,107,53,0.1)', borderRadius:6, display:'inline-block' }}>Demo mode</div>}
      </div>
      <div style={{ background:'#1a1a1a', borderRadius:18, padding:'24px 20px', width:'100%', maxWidth:400, border:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', gap:6, marginBottom:22, background:'rgba(255,255,255,0.05)', borderRadius:10, padding:4 }}>
          {['client','admin'].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:'9px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:13, background:mode===m?C.accent:'transparent', color:mode===m?'#fff':'rgba(255,255,255,0.4)', textTransform:'capitalize', WebkitTapHighlightColor:'transparent' }}>{m}</button>
          ))}
        </div>
        <form onSubmit={handle}>
          {[['Email','email',email,setEmail,'your@email.com'],['Password','password',pass,setPass,'••••••••']].map(([lbl,type,val,set,ph])=>(
            <div key={lbl} style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:'rgba(255,255,255,0.45)', display:'block', marginBottom:6 }}>{lbl}</label>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} required
                style={{ ...base.inp, background:'rgba(255,255,255,0.07)', color:'#fff', borderColor:'rgba(255,255,255,0.1)', fontSize:16 }}/>
            </div>
          ))}
          {err&&<div style={{ fontSize:13, color:'#f87171', marginBottom:12, padding:'9px 13px', background:'rgba(239,68,68,0.08)', borderRadius:8 }}>{err}</div>}
          <button type="submit" disabled={loading} style={{ ...btn('primary'), width:'100%', fontSize:15, padding:'13px', opacity:loading?0.6:1 }}>
            {loading?'Signing in…':'Sign In'}
          </button>
        </form>
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
  const isMobile = useIsMobile()

  const load = async () => {
    try {
      if (isDemo||user.clientId==='demo') { setClient(DEMO.client); setLogs(DEMO.weightLogs); setTargets(DEMO.targets) }
      else {
        const [c,l,t] = await Promise.all([
          sbQuery('clients',{eq:{auth_user_id:user.userId},single:true}),
          sbQuery('weight_logs',{eq:{client_id:user.clientId},order:'date',asc:true}),
          sbQuery('weekly_targets',{eq:{client_id:user.clientId},order:'created_at',asc:false,single:true})
        ])
        setClient(c); setLogs(l||[]); setTargets(t)
      }
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }

  useEffect(()=>{ load() },[user]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    if (isDemo||user.clientId==='demo') return
    const sub = supabase.channel('dash-changes')
      .on('postgres_changes',{event:'*',schema:'public',table:'clients',filter:`auth_user_id=eq.${user.userId}`},()=>load())
      .on('postgres_changes',{event:'*',schema:'public',table:'weight_logs',filter:`client_id=eq.${user.clientId}`},()=>load())
      .on('postgres_changes',{event:'*',schema:'public',table:'weekly_targets',filter:`client_id=eq.${user.clientId}`},()=>load())
      .subscribe()
    return ()=>supabase.removeChannel(sub)
  },[user])

  if (loading) return <div style={{ textAlign:'center', padding:60, color:C.gray }}>Loading…</div>
  if (!client) return null

  const latest = logs.length ? logs[logs.length-1] : {weight:client.current_weight,bmi:null}
  const loss = ((client.start_weight||0)-(latest.weight||0)).toFixed(2)
  const pct  = Math.max(0,Math.min(100,((client.start_weight-latest.weight)/(client.start_weight-client.goal_weight))*100))
  const weeks= Math.max(0,Math.floor((new Date()-new Date(client.start_date))/(7*864e5)))
  const bmi  = latest.bmi || ((latest.weight/((client.height_cm/100)**2)).toFixed(1))

  const gridCols = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)'

  return (
    <div style={{ padding: isMobile?'16px 14px':'24px 20px', maxWidth:1080, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize: isMobile?20:24, fontWeight:700, letterSpacing:'-0.5px' }}>{client.name}</div>
        <div style={{ color:C.gray, fontSize:12, marginTop:3, flexWrap:'wrap', display:'flex', gap:8 }}>
          <span>Age {client.age}</span><span>·</span><span>{client.gender}</span><span>·</span><span>{client.height_cm}cm</span><span>·</span><span>BMI {bmi}</span>
          <span style={badge('blue')}>Week {weeks}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:gridCols, gap:10, marginBottom:14 }}>
        <Stat label="Start" value={`${client.start_weight}kg`}/>
        <Stat label="Current" value={`${latest.weight}kg`} color="blue"/>
        <Stat label="Goal" value={`${client.goal_weight}kg`}/>
        <Stat label="Lost" value={`${loss}kg`} color={parseFloat(loss)>0?'green':'red'} sub="since start"/>
      </div>

      {/* Progress card */}
      <div style={base.card}>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Weight progress</div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:C.gray, marginBottom:6 }}>
          <span>Fat loss progress</span><span>{pct.toFixed(1)}%</span>
        </div>
        <Bar pct={pct}/>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.gray, marginTop:5 }}>
          <span>Start {client.start_weight}kg</span><span>Now {latest.weight}kg</span><span>Goal {client.goal_weight}kg</span>
        </div>
        <div style={{ marginTop:18 }}>
          <WeightChart data={logs}/>
        </div>
      </div>

      {/* Macros + Info */}
      {targets && (
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14 }}>
          <div style={base.card}>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Daily targets</div>
            {[
              ['Calories',`${Number(targets.calories).toFixed(0)} kcal`,C.accent],
              ['Protein', `${Number(targets.protein_g).toFixed(0)}g`,   C.blue],
              ['Carbs',   `${Number(targets.carbs_g).toFixed(0)}g`,     C.green],
              ['Fats',    `${Number(targets.fats_g).toFixed(0)}g`,      '#f59e0b'],
              ['Fibre',   `${Number(targets.fibre_g).toFixed(1)}g`,     '#8b5cf6'],
            ].map(([lbl,val,clr])=>(
              <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:clr, flexShrink:0 }}/>
                  <span style={{ fontSize:14 }}>{lbl}</span>
                </div>
                <span style={{ fontWeight:600, fontSize:14 }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={base.card}>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Program info</div>
            {[
              ['Daily steps', targets.daily_steps],
              ['Cardio',      targets.cardio],
              ['Diet type',   targets.diet_type?.toUpperCase()],
              ['Start date',  client.start_date],
              ['End date',    client.end_date],
            ].map(([lbl,val])=>(
              <div key={lbl} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}`, fontSize:14 }}>
                <span style={{ color:C.gray }}>{lbl}</span>
                <span style={{ fontWeight:500 }}>{val||'—'}</span>
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
  const clientId = user.clientId||'demo'

  const load = async () => {
    if (isDemo||clientId==='demo') { setLogs(DEMO.weightLogs); return }
    const data = await sbQuery('weight_logs',{eq:{client_id:clientId},order:'date',asc:true})
    setLogs(data||[])
  }

  useEffect(()=>{ load() },[clientId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    if (isDemo||clientId==='demo') return
    const sub = supabase.channel('wlog').on('postgres_changes',{event:'*',schema:'public',table:'weight_logs',filter:`client_id=eq.${clientId}`},()=>load()).subscribe()
    return ()=>supabase.removeChannel(sub)
  },[clientId])

  const addLog = async () => {
    if (!wt) return
    setLoading(true)
    try {
      const w = parseFloat(wt)
      const bmi = parseFloat((w/((1.80)**2)).toFixed(2))
      if (isDemo||clientId==='demo') { setLogs(prev=>[...prev,{id:Date.now(),date,weight:w,unit,bmi}]) }
      else {
        await sbInsert('weight_logs',{client_id:clientId,date,weight:w,unit,bmi})
        await supabase.from('clients').update({current_weight:w}).eq('id',clientId)
      }
      setMsg(`✓ Logged ${w}${unit}`); setWt('')
      setTimeout(()=>setMsg(''),3000)
    } catch(e){ setMsg(`Error: ${e.message}`) }
    finally{ setLoading(false) }
  }

  const sorted = [...logs].sort((a,b)=>new Date(b.date)-new Date(a.date))

  return (
    <div style={{ padding:'16px 14px', maxWidth:1080, margin:'0 auto' }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:22, fontWeight:700 }}>Weight logger</div>
        <div style={{ fontSize:13, color:C.gray }}>{logs.length} entries</div>
      </div>

      <div style={base.card}>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:14 }}>Log today</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
          <div>
            <span style={base.lbl}>Date</span>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={base.inp}/>
          </div>
          <div>
            <span style={base.lbl}>Weight</span>
            <input type="number" value={wt} onChange={e=>setWt(e.target.value)} placeholder="e.g. 91.5" step=".1" inputMode="decimal" style={base.inp}/>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ width:100 }}>
            <span style={base.lbl}>Unit</span>
            <select value={unit} onChange={e=>setUnit(e.target.value)} style={{ ...base.inp, width:'100%' }}>
              <option>Kg</option><option>Lbs</option>
            </select>
          </div>
          <button onClick={addLog} disabled={loading} style={{ ...btn('primary'), marginTop:18, flex:1 }}>{loading?'Saving…':'Log weight'}</button>
        </div>
        <MsgBox msg={msg}/>
      </div>

      <div style={base.card}>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:14 }}>History</div>
        <WeightChart data={[...logs].sort((a,b)=>new Date(a.date)-new Date(b.date))}/>
        <div style={{ marginTop:16, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          <table style={base.table}>
            <thead><tr>{['Date','Weight','BMI','Change'].map(h=><th key={h} style={base.th}>{h}</th>)}</tr></thead>
            <tbody>
              {sorted.map((l,i)=>{
                const prev = sorted[i+1]
                const chg  = prev ? +(l.weight-prev.weight).toFixed(2) : null
                return (
                  <tr key={l.id}>
                    <td style={base.td}>{l.date}</td>
                    <td style={{ ...base.td, fontWeight:600 }}>{l.weight} kg</td>
                    <td style={base.td}>{l.bmi||'—'}</td>
                    <td style={base.td}>{chg!=null&&<span style={badge(chg<0?'green':chg>0?'red':'blue')}>{chg>0?'+':''}{chg}</span>}</td>
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
  const [inputs, setInputs]   = useState({})
  const [saving, setSaving]   = useState('')
  const [showDayPicker, setShowDayPicker] = useState(false)
  const clientId = user.clientId||'demo'
  const isMobile = useIsMobile()

  useEffect(()=>{
    if (isDemo||clientId==='demo') { setProgram(DEMO.workoutProgram); return }
    sbQuery('workout_programs',{eq:{client_id:clientId},order:'day_number',asc:true}).then(d=>setProgram(d||[]))
  },[clientId])

  useEffect(()=>{
    if (isDemo||clientId==='demo') return
    sbQuery('workout_logs',{eq:{client_id:clientId,week},order:'logged_at',asc:false}).then(d=>setLogs(d||[]))
  },[clientId,week])

  const days = [...new Set(program.map(p=>p.day_number))].sort((a,b)=>a-b)
  const selDay = days[dayIdx]
  const dayExs = program.filter(p=>p.day_number===selDay)
  const dayType = dayExs[0]?.workout_type||''

  const logSet = async (exName, setNum) => {
    const key=`${exName}_${setNum}`
    const inp=inputs[key]||{}
    if (!inp.reps&&!inp.weight) return
    setSaving(key)
    try {
      const entry={client_id:clientId,week,day_number:selDay,exercise_name:exName,set_number:setNum,reps:parseInt(inp.reps)||0,weight_kg:parseFloat(inp.weight)||0}
      if (isDemo||clientId==='demo') setLogs(prev=>[...prev,{id:Date.now(),...entry}])
      else { const saved=await sbInsert('workout_logs',entry); setLogs(prev=>[...prev,saved]) }
      setInputs(prev=>({...prev,[key]:{reps:'',weight:''}}))
    } catch(e){console.error(e)}
    finally{setSaving('')}
  }

  const getLog = (exName,setNum) => logs.find(l=>l.exercise_name===exName&&l.set_number===setNum&&l.day_number===selDay)

  return (
    <div style={{ padding:'16px 14px', maxWidth:1080, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700 }}>Workout</div>
          <div style={{ fontSize:12, color:C.gray }}>Log your sets</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12, color:C.gray }}>Week</span>
          <select value={week} onChange={e=>setWeek(Number(e.target.value))} style={{ ...base.inp, width:85, padding:'8px 10px', fontSize:14 }}>
            {Array.from({length:48},(_,i)=><option key={i+1} value={i+1}>Wk {i+1}</option>)}
          </select>
        </div>
      </div>

      {/* Day selector */}
      {isMobile ? (
        <div style={{ marginBottom:14 }}>
          <button onClick={()=>setShowDayPicker(!showDayPicker)} style={{ ...btn('secondary'), width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:14 }}>
            <span>Day {selDay} — {dayType}</span>
            <span>{showDayPicker?'▲':'▼'}</span>
          </button>
          {showDayPicker&&(
            <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:10, marginTop:6, overflow:'hidden' }}>
              {days.map((d,i)=>{
                const type=program.find(p=>p.day_number===d)?.workout_type||''
                return (
                  <button key={d} onClick={()=>{setDayIdx(i);setShowDayPicker(false)}} style={{ width:'100%', padding:'13px 16px', background:dayIdx===i?C.accentL:'#fff', border:'none', borderBottom:`1px solid ${C.border}`, textAlign:'left', cursor:'pointer', fontSize:14, color:dayIdx===i?C.accent:'#111', fontWeight:dayIdx===i?600:400 }}>
                    Day {d} — {type}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display:'flex', gap:7, marginBottom:16, flexWrap:'wrap' }}>
          {days.map((d,i)=>{
            const type=program.find(p=>p.day_number===d)?.workout_type||''
            return <button key={d} onClick={()=>setDayIdx(i)} style={{ ...btn(dayIdx===i?'primary':'secondary'), fontSize:12, padding:'8px 14px' }}>Day {d} · {type}</button>
          })}
        </div>
      )}

      {/* Exercises */}
      {dayType==='Rest' ? (
        <div style={{ ...base.card, textAlign:'center', padding:'50px 24px' }}>
          <div style={{ fontSize:40 }}>😴</div>
          <div style={{ fontSize:17, fontWeight:600, marginTop:10 }}>Rest & Recovery Day</div>
          <div style={{ fontSize:13, color:C.gray, marginTop:6 }}>Sleep, hydrate, stretch</div>
        </div>
      ) : isMobile ? (
        // Mobile: card per exercise
        dayExs.map((ex,i)=>(
          <div key={i} style={{ ...base.card, marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ fontWeight:600, fontSize:15, flex:1, marginRight:8 }}>{ex.exercise_name}</div>
              {ex.video_url&&<a href={ex.video_url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:C.accent, textDecoration:'none', fontWeight:500, flexShrink:0 }}>Watch →</a>}
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
              <span style={badge('blue')}>{ex.set_rep}</span>
              <span style={{ ...badge('amber'), fontSize:11 }}>{ex.tempo}</span>
              <span style={{ fontSize:12, color:C.gray }}>Rest: {ex.rest_seconds}s</span>
            </div>
            {Array.from({length:ex.sets||2},(_,si)=>{
              const setNum=si+1
              const key=`${ex.exercise_name}_${setNum}`
              const done=getLog(ex.exercise_name,setNum)
              return (
                <div key={si} style={{ padding:'10px 0', borderTop:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:12, color:C.gray, marginBottom:8, fontWeight:600 }}>Set {setNum}</div>
                  {done ? (
                    <span style={badge('green')}>✓ {done.reps} reps @ {done.weight_kg}kg</span>
                  ) : (
                    <div style={{ display:'flex', gap:8 }}>
                      <input value={inputs[key]?.reps||''} onChange={e=>setInputs(p=>({...p,[key]:{...p[key],reps:e.target.value}}))}
                        placeholder="Reps" inputMode="numeric" style={{ ...base.inp, flex:1 }}/>
                      <input value={inputs[key]?.weight||''} onChange={e=>setInputs(p=>({...p,[key]:{...p[key],weight:e.target.value}}))}
                        placeholder="kg" inputMode="decimal" style={{ ...base.inp, flex:1 }}/>
                      <button onClick={()=>logSet(ex.exercise_name,setNum)} disabled={saving===key} style={{ ...btn('primary'), padding:'10px 14px', flexShrink:0 }}>
                        {saving===key?'…':'Log'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))
      ) : (
        // Desktop: table
        <div style={base.card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:17, fontWeight:600 }}>Day {selDay} — {dayType}</div>
            <span style={badge('blue')}>Week {week}</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={base.table}>
              <thead><tr>{['Exercise','Scheme','Tempo','Rest','Video','Set','Log'].map(h=><th key={h} style={base.th}>{h}</th>)}</tr></thead>
              <tbody>
                {dayExs.map((ex,i)=>{
                  const sets=ex.sets||2
                  return Array.from({length:sets},(_,si)=>{
                    const setNum=si+1
                    const key=`${ex.exercise_name}_${setNum}`
                    const done=getLog(ex.exercise_name,setNum)
                    return (
                      <tr key={`${i}_${si}`} style={{ background:i%2===0?'#fafafa':'#fff' }}>
                        {si===0&&(
                          <>
                            <td style={{ ...base.td, fontWeight:600 }} rowSpan={sets}>{ex.exercise_name}</td>
                            <td style={base.td} rowSpan={sets}><span style={badge('blue')}>{ex.set_rep}</span></td>
                            <td style={base.td} rowSpan={sets}>{ex.tempo}</td>
                            <td style={base.td} rowSpan={sets}>{ex.rest_seconds}s</td>
                            <td style={base.td} rowSpan={sets}>{ex.video_url&&<a href={ex.video_url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:C.accent, textDecoration:'none', fontWeight:500 }}>Watch →</a>}</td>
                          </>
                        )}
                        <td style={{ ...base.td, color:C.gray, fontSize:12 }}>Set {setNum}</td>
                        <td style={base.td}>
                          {done ? <span style={badge('green')}>✓ {done.reps} reps @ {done.weight_kg}kg</span> : (
                            <div style={{ display:'flex', gap:5 }}>
                              <input value={inputs[key]?.reps||''} onChange={e=>setInputs(p=>({...p,[key]:{...p[key],reps:e.target.value}}))} placeholder="reps" style={{ ...base.inp, width:56, padding:'6px 8px' }}/>
                              <input value={inputs[key]?.weight||''} onChange={e=>setInputs(p=>({...p,[key]:{...p[key],weight:e.target.value}}))} placeholder="kg" style={{ ...base.inp, width:56, padding:'6px 8px' }}/>
                              <button onClick={()=>logSet(ex.exercise_name,setNum)} disabled={saving===key} style={{ ...btn('primary'), padding:'6px 12px', fontSize:12 }}>{saving===key?'…':'Log'}</button>
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
  const clientId = user.clientId||'demo'
  const isMobile = useIsMobile()

  useEffect(()=>{
    const load = async () => {
      if (isDemo||clientId==='demo') { setMeals(DEMO.mealPlan); setFoods(DEMO.foodDb); setTargets(DEMO.targets); return }
      const [m,t,f] = await Promise.all([
        sbQuery('meal_plans',{eq:{client_id:clientId,diet_type:dietType},order:'meal_number',asc:true}),
        sbQuery('weekly_targets',{eq:{client_id:clientId},order:'created_at',asc:false,single:true}),
        sbQuery('food_database',{order:'food_name',asc:true})
      ])
      setMeals(m||[]); setTargets(t); setFoods(f||[])
    }
    load()
  },[clientId,dietType])

  const grouped = meals.reduce((acc,m)=>{ const k=m.meal_name||`Meal ${m.meal_number}`; (acc[k]=acc[k]||[]).push(m); return acc },{})
  const filtered = foods.filter(f=>f.food_name?.toLowerCase().includes(search.toLowerCase()))
  const t = targets||{}

  return (
    <div style={{ padding:'16px 14px', maxWidth:1080, margin:'0 auto' }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:22, fontWeight:700 }}>Nutrition</div>
        <div style={{ fontSize:13, color:C.gray }}>Your personalised meal guide</div>
      </div>

      {targets&&(
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:10, marginBottom:14 }}>
          <Stat label="Calories" value={`${Number(t.calories||0).toFixed(0)}`} sub="kcal" color="green"/>
          <Stat label="Protein"  value={`${Number(t.protein_g||0).toFixed(0)}g`} color="blue"/>
          <Stat label="Carbs"    value={`${Number(t.carbs_g||0).toFixed(0)}g`}/>
          <Stat label="Fats"     value={`${Number(t.fats_g||0).toFixed(0)}g`}/>
        </div>
      )}

      <div style={base.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:8 }}>
          <div style={{ fontSize:16, fontWeight:600 }}>Meal plan</div>
          <div style={{ display:'flex', gap:7 }}>
            {['veg','non-veg'].map(dt=>(
              <button key={dt} onClick={()=>setDietType(dt)} style={{ ...btn(dietType===dt?'primary':'secondary'), fontSize:12, padding:'7px 13px' }}>{dt}</button>
            ))}
          </div>
        </div>

        {Object.keys(grouped).length===0 ? (
          <div style={{ padding:24, textAlign:'center', color:C.gray, fontSize:13, background:'#fafafa', borderRadius:9 }}>
            {isAdmin?'No meals added yet':'Your coach will set up your meal plan soon'}
          </div>
        ) : Object.entries(grouped).map(([mealName,items])=>(
          <div key={mealName} style={{ marginBottom:18 }}>
            <div style={{ fontWeight:600, fontSize:13, color:C.accent, marginBottom:8 }}>
              {mealName}
              <span style={{ fontSize:11, color:C.gray, fontWeight:400, marginLeft:8 }}>
                {items.reduce((s,i)=>s+(+i.calories||0),0).toFixed(0)} kcal · {items.reduce((s,i)=>s+(+i.protein_g||0),0).toFixed(1)}g protein
              </span>
            </div>
            {isMobile ? (
              items.map((item,i)=>(
                <div key={i} style={{ padding:'12px', background:i%2===0?'#fafafa':'#fff', borderRadius:8, marginBottom:6 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontWeight:600, fontSize:14 }}>{item.food_name}</span>
                    <span style={badge('blue')}>{item.category}</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4, fontSize:12 }}>
                    {[['Qty',`${item.qty_g}g`],['Cal',`${Number(item.calories||0).toFixed(0)}`],['Protein',`${Number(item.protein_g||0).toFixed(1)}g`],['Carbs',`${Number(item.carbs_g||0).toFixed(1)}g`],['Fat',`${Number(item.fat_g||0).toFixed(1)}g`],['Fibre',`${Number(item.fibre_g||0).toFixed(1)}g`]].map(([lbl,val])=>(
                      <div key={lbl} style={{ background:'#fff', borderRadius:6, padding:'5px 8px', border:`1px solid ${C.border}` }}>
                        <div style={{ color:C.gray, fontSize:10 }}>{lbl}</div>
                        <div style={{ fontWeight:600 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={base.table}>
                  <thead><tr>{['Category','Food','Qty','Cal','Protein','Carbs','Fat','Fibre'].map(h=><th key={h} style={base.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {items.map((item,i)=>(
                      <tr key={i} style={{ background:i%2===0?'#fafafa':'#fff' }}>
                        <td style={base.td}><span style={badge('blue')}>{item.category}</span></td>
                        <td style={{ ...base.td, fontWeight:500 }}>{item.food_name}</td>
                        <td style={base.td}>{item.qty_g}g</td>
                        <td style={base.td}>{Number(item.calories||0).toFixed(1)}</td>
                        <td style={base.td}>{Number(item.protein_g||0).toFixed(1)}g</td>
                        <td style={base.td}>{Number(item.carbs_g||0).toFixed(1)}g</td>
                        <td style={base.td}>{Number(item.fat_g||0).toFixed(1)}g</td>
                        <td style={base.td}>{Number(item.fibre_g||0).toFixed(1)}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Food DB */}
      <div style={base.card}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:8 }}>
          <div style={{ fontSize:16, fontWeight:600 }}>Food database</div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{ ...base.inp, width:isMobile?'100%':200 }}/>
        </div>
        <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          <table style={base.table}>
            <thead><tr>{['Food','Per','Cal','Pro','Carbs','Fat'].map(h=><th key={h} style={base.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((f,i)=>(
                <tr key={i} style={{ background:i%2===0?'#fafafa':'#fff' }}>
                  <td style={{ ...base.td, fontWeight:500, whiteSpace:'nowrap' }}>{f.food_name}</td>
                  <td style={base.td}>{f.portion_g}g</td>
                  <td style={base.td}>{f.calories}</td>
                  <td style={base.td}>{f.protein_g}g</td>
                  <td style={base.td}>{f.carbs_g}g</td>
                  <td style={base.td}>{f.fat_g}g</td>
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
function RoadmapPage({ user }) {
  const [roadmap, setRoadmap] = useState([])
  const clientId = user.clientId||'demo'

  useEffect(()=>{
    if (isDemo||clientId==='demo') { setRoadmap(DEMO.roadmap); return }
    sbQuery('roadmap',{eq:{client_id:clientId},order:'month_number',asc:true}).then(d=>setRoadmap(d||[]))
  },[clientId])

  const pc = p => p==='Fat-Loss'?{bg:'#fef3c7',text:'#92400e',e:'🔥'}:p==='Lean Gain'?{bg:'#dcfce7',text:'#166534',e:'📈'}:{bg:'#f3f4f6',text:C.gray,e:'○'}

  return (
    <div style={{ padding:'16px 14px', maxWidth:1080, margin:'0 auto' }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:22, fontWeight:700 }}>2026 Roadmap</div>
        <div style={{ fontSize:13, color:C.gray }}>Year-long periodization plan</div>
      </div>
      <div style={base.card}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:9 }}>
          {roadmap.map((m,i)=>{
            const c=pc(m.phase)
            return (
              <div key={i} style={{ ...base.cardS, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{c.e}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{m.month_name}</div>
                    {m.phase&&<div style={{ fontSize:11, color:C.gray }}>{m.phase}</div>}
                  </div>
                </div>
                {m.phase&&<span style={{ padding:'3px 8px', borderRadius:14, fontSize:11, fontWeight:600, background:c.bg, color:c.text, flexShrink:0 }}>{m.phase}</span>}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:14 }}>
        <div style={base.card}>
          <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Phase guide</div>
          {[['Fat-Loss 🔥','Caloric deficit, high protein, cardio emphasis. Strip fat while preserving muscle.','#fef3c7','#92400e'],['Lean Gain 📈','Slight caloric surplus, progressive overload focus. Build muscle with minimal fat gain.','#dcfce7','#166534']].map(([p,d,bg,tc])=>(
            <div key={p} style={{ padding:'13px', borderRadius:10, background:bg, marginBottom:10 }}>
              <div style={{ fontWeight:600, fontSize:13, color:tc, marginBottom:3 }}>{p}</div>
              <div style={{ fontSize:12, color:tc, opacity:.85 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={base.card}>
          <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Set & rep schemes</div>
          {[['5x5 1010 180s','Strength 1','Heavy compound, full recovery'],['4x4 2010 120s','Strength 2','Controlled eccentric'],['3x9-11 3010 120s','Hypertrophy 1','Volume block, main driver'],['2x2-Failure 3010 180s','Hypertrophy 2','Failure training']].map(([s,cat,desc])=>(
            <div key={s} style={{ padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div>
                  <div style={{ fontWeight:500, fontSize:13 }}>{s}</div>
                  <div style={{ fontSize:11, color:C.gray, marginTop:2 }}>{desc}</div>
                </div>
                <span style={badge('blue')}>{cat}</span>
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
  const [clients, setClients]   = useState([])
  const [sel, setSel]           = useState(null)
  const [tab, setTab]           = useState('clients')
  const [editForm, setEditForm] = useState({})
  const [newForm, setNewForm]   = useState({ name:'', email:'', age:'', gender:'MALE', height_cm:'', start_weight:'', goal_weight:'', start_date:'', end_date:'' })
  const [msg, setMsg]           = useState('')
  const [saving, setSaving]     = useState(false)
  const isMobile = useIsMobile()

  const loadClients = async () => {
    if (isDemo) { setClients(DEMO.adminClients); return }
    const data = await sbQuery('clients',{order:'created_at',asc:false})
    setClients(data||[])
  }

  useEffect(()=>{ loadClients() },[])

  useEffect(()=>{
    if (isDemo) return
    const sub = supabase.channel('admin-clients')
      .on('postgres_changes',{event:'*',schema:'public',table:'clients'},()=>loadClients())
      .subscribe()
    return ()=>supabase.removeChannel(sub)
  },[])

  const openEdit = async (c) => {
    setSel(c)
    const form = { current_weight:c.current_weight||'', goal_weight:c.goal_weight||'', start_weight:c.start_weight||'', calories:'', protein_g:'', carbs_g:'', fats_g:'', fibre_g:'', daily_steps:'', cardio:'' }
    if (!isDemo) {
      try {
        const t = await sbQuery('weekly_targets',{eq:{client_id:c.id},order:'created_at',asc:false,single:true})
        if (t) Object.assign(form, { calories:t.calories||'', protein_g:t.protein_g||'', carbs_g:t.carbs_g||'', fats_g:t.fats_g||'', fibre_g:t.fibre_g||'', daily_steps:t.daily_steps||'', cardio:t.cardio||'' })
      } catch(e){}
    }
    setEditForm(form)
  }

  const saveEdit = async () => {
    if (!sel) return
    setSaving(true)
    try {
      if (!isDemo) {
        await supabase.from('clients').update({
          current_weight: parseFloat(editForm.current_weight)||sel.current_weight,
          goal_weight:    parseFloat(editForm.goal_weight)||sel.goal_weight,
          start_weight:   parseFloat(editForm.start_weight)||sel.start_weight,
        }).eq('id',sel.id)

        if (editForm.calories||editForm.protein_g) {
          const { data: ex } = await supabase.from('weekly_targets').select('id').eq('client_id',sel.id).single()
          const td = { client_id:sel.id, diet_type:'veg', calories:parseFloat(editForm.calories)||0, protein_g:parseFloat(editForm.protein_g)||0, carbs_g:parseFloat(editForm.carbs_g)||0, fats_g:parseFloat(editForm.fats_g)||0, fibre_g:parseFloat(editForm.fibre_g)||0, daily_steps:editForm.daily_steps||'8k', cardio:editForm.cardio||'Daily: 20min' }
          if (ex) await supabase.from('weekly_targets').update(td).eq('id',ex.id)
          else    await supabase.from('weekly_targets').insert([td])
        }
      }
      await loadClients()
      setMsg('✓ Changes saved'); setSel(null)
      setTimeout(()=>setMsg(''),3000)
    } catch(e){ setMsg(`Error: ${e.message}`) }
    finally{ setSaving(false) }
  }

  const createClient = async () => {
    setSaving(true)
    try {
      if (!isDemo) {
        await sbInsert('clients',{
          name:newForm.name.toUpperCase(), email:newForm.email,
          age:parseInt(newForm.age)||null, gender:newForm.gender,
          height_cm:parseFloat(newForm.height_cm)||null,
          start_weight:parseFloat(newForm.start_weight)||null,
          goal_weight:parseFloat(newForm.goal_weight)||null,
          current_weight:parseFloat(newForm.start_weight)||null,
          start_date:newForm.start_date||null, end_date:newForm.end_date||null,
        })
      } else {
        setClients(prev=>[...prev,{id:Date.now().toString(),...newForm,is_active:true}])
      }
      await loadClients()
      setMsg('✓ Client created! Now create their auth user in Supabase → Authentication → Users')
      setTab('clients')
      setNewForm({name:'',email:'',age:'',gender:'MALE',height_cm:'',start_weight:'',goal_weight:'',start_date:'',end_date:''})
      setTimeout(()=>setMsg(''),8000)
    } catch(e){ setMsg(`Error: ${e.message}`) }
    finally{ setSaving(false) }
  }

  return (
    <div style={{ padding:'16px 14px', maxWidth:1080, margin:'0 auto' }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:22, fontWeight:700 }}>Admin</div>
        <div style={{ fontSize:13, color:C.gray }}>Manage clients · {isDemo?'Demo':'Live — real-time sync ✓'}</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:14 }}>
        <Stat label="Total clients" value={clients.length} color="blue"/>
        <Stat label="Active" value={clients.filter(c=>c.is_active).length} color="green"/>
      </div>

      <MsgBox msg={msg}/>

      <div style={{ display:'flex', gap:7, margin:'14px 0' }}>
        {['clients','add client'].map(t=>(
          <button key={t} onClick={()=>{ setTab(t); setSel(null) }} style={{ ...btn(tab===t?'primary':'secondary'), fontSize:13, textTransform:'capitalize' }}>{t}</button>
        ))}
      </div>

      {tab==='clients' && (
        <>
          {/* Mobile: cards */}
          {isMobile ? (
            clients.map(c=>(
              <div key={c.id} style={{ ...base.card, marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15 }}>{c.name}</div>
                    <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>{c.email}</div>
                  </div>
                  <span style={badge(c.is_active?'green':'red')}>{c.is_active?'Active':'Inactive'}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:12 }}>
                  {[['Age',c.age],['Current',`${c.current_weight}kg`],['Goal',`${c.goal_weight}kg`]].map(([lbl,val])=>(
                    <div key={lbl} style={{ background:'#f9f9f9', borderRadius:8, padding:'8px 10px' }}>
                      <div style={{ fontSize:10, color:C.gray, marginBottom:2 }}>{lbl}</div>
                      <div style={{ fontWeight:600, fontSize:14 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>sel?.id===c.id?setSel(null):openEdit(c)} style={{ ...btn(sel?.id===c.id?'danger':'secondary'), width:'100%', fontSize:13 }}>
                  {sel?.id===c.id?'Cancel editing':'Edit client'}
                </button>
                {sel?.id===c.id && (
                  <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                    <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>Body stats</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                      {[['Current weight (kg)','current_weight'],['Goal weight (kg)','goal_weight'],['Start weight (kg)','start_weight']].map(([lbl,k])=>(
                        <div key={k}>
                          <span style={base.lbl}>{lbl}</span>
                          <input value={editForm[k]||''} onChange={e=>setEditForm(p=>({...p,[k]:e.target.value}))} inputMode="decimal" placeholder={String(sel[k]||'')} style={base.inp}/>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>Nutrition targets</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
                      {[['Calories','calories'],['Protein (g)','protein_g'],['Carbs (g)','carbs_g'],['Fats (g)','fats_g'],['Fibre (g)','fibre_g'],['Steps goal','daily_steps']].map(([lbl,k])=>(
                        <div key={k}>
                          <span style={base.lbl}>{lbl}</span>
                          <input value={editForm[k]||''} onChange={e=>setEditForm(p=>({...p,[k]:e.target.value}))} inputMode="decimal" placeholder={lbl} style={base.inp}/>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom:14 }}>
                      <span style={base.lbl}>Cardio target</span>
                      <input value={editForm.cardio||''} onChange={e=>setEditForm(p=>({...p,cardio:e.target.value}))} placeholder="Daily: 20min" style={base.inp}/>
                    </div>
                    <div style={{ display:'flex', gap:9 }}>
                      <button onClick={saveEdit} disabled={saving} style={{ ...btn('primary'), flex:1, opacity:saving?0.6:1 }}>{saving?'Saving…':'Save changes'}</button>
                      <button onClick={()=>setSel(null)} style={{ ...btn('secondary'), flex:1 }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            // Desktop: table
            <div style={base.card}>
              <div style={{ fontSize:17, fontWeight:600, marginBottom:14 }}>All clients</div>
              <div style={{ overflowX:'auto' }}>
                <table style={base.table}>
                  <thead><tr>{['Name','Email','Age','Current Wt','Goal','End Date','Status',''].map(h=><th key={h} style={base.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {clients.map(c=>(
                      <tr key={c.id}>
                        <td style={{ ...base.td, fontWeight:600 }}>{c.name}</td>
                        <td style={{ ...base.td, color:C.gray }}>{c.email}</td>
                        <td style={base.td}>{c.age}</td>
                        <td style={base.td}><strong>{c.current_weight} kg</strong></td>
                        <td style={base.td}>{c.goal_weight} kg</td>
                        <td style={base.td}>{c.end_date}</td>
                        <td style={base.td}><span style={badge(c.is_active?'green':'red')}>{c.is_active?'Active':'Inactive'}</span></td>
                        <td style={base.td}>
                          <button onClick={()=>sel?.id===c.id?setSel(null):openEdit(c)} style={{ ...btn(sel?.id===c.id?'danger':'secondary'), padding:'5px 12px', fontSize:11 }}>
                            {sel?.id===c.id?'Cancel':'Edit'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sel&&(
                <div style={{ marginTop:16, padding:20, background:'#fafafa', borderRadius:12, border:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:600, fontSize:15, marginBottom:16 }}>Editing: {sel.name}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.gray, marginBottom:10, textTransform:'uppercase' }}>Body stats</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                    {[['Current weight (kg)','current_weight'],['Goal weight (kg)','goal_weight'],['Start weight (kg)','start_weight']].map(([lbl,k])=>(
                      <div key={k}>
                        <span style={base.lbl}>{lbl}</span>
                        <input value={editForm[k]||''} onChange={e=>setEditForm(p=>({...p,[k]:e.target.value}))} placeholder={String(sel[k]||'')} style={base.inp}/>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.gray, marginBottom:10, textTransform:'uppercase' }}>Nutrition targets</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                    {[['Calories (kcal)','calories'],['Protein (g)','protein_g'],['Carbs (g)','carbs_g'],['Fats (g)','fats_g'],['Fibre (g)','fibre_g'],['Daily steps','daily_steps']].map(([lbl,k])=>(
                      <div key={k}>
                        <span style={base.lbl}>{lbl}</span>
                        <input value={editForm[k]||''} onChange={e=>setEditForm(p=>({...p,[k]:e.target.value}))} placeholder={lbl} style={base.inp}/>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <span style={base.lbl}>Cardio target</span>
                    <input value={editForm.cardio||''} onChange={e=>setEditForm(p=>({...p,cardio:e.target.value}))} placeholder="Daily: 20min" style={{ ...base.inp, maxWidth:320 }}/>
                  </div>
                  <div style={{ display:'flex', gap:9 }}>
                    <button onClick={saveEdit} disabled={saving} style={{ ...btn('primary'), opacity:saving?0.6:1 }}>{saving?'Saving…':'Save all changes'}</button>
                    <button onClick={()=>setSel(null)} style={btn('secondary')}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {tab==='add client' && (
        <div style={base.card}>
          <div style={{ fontSize:17, fontWeight:600, marginBottom:16 }}>Add new client</div>
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:12 }}>
            {[['Full name','text','name','JOHN DOE'],['Email','email','email','john@email.com'],['Age','number','age','28'],['Height (cm)','number','height_cm','175'],['Start weight (kg)','number','start_weight','85'],['Goal weight (kg)','number','goal_weight','75'],['Start date','date','start_date',''],['End date','date','end_date','']].map(([lbl,type,key,ph])=>(
              <div key={key}>
                <span style={base.lbl}>{lbl}</span>
                <input type={type} value={newForm[key]} onChange={e=>setNewForm(p=>({...p,[key]:e.target.value}))} placeholder={ph} style={base.inp}/>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12 }}>
            <span style={base.lbl}>Gender</span>
            <select value={newForm.gender} onChange={e=>setNewForm(p=>({...p,gender:e.target.value}))} style={{ ...base.inp, maxWidth:180 }}>
              {['MALE','FEMALE','OTHER'].map(g=><option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ marginTop:16, display:'flex', gap:9 }}>
            <button onClick={createClient} disabled={saving} style={{ ...btn('primary'), opacity:saving?0.6:1 }}>{saving?'Creating…':'Create client'}</button>
            <button onClick={()=>setTab('clients')} style={btn('secondary')}>Cancel</button>
          </div>
          <div style={{ marginTop:14, padding:14, background:'#eff6ff', borderRadius:10, fontSize:12, color:'#1d4ed8', lineHeight:1.7 }}>
            <strong>After creating:</strong> Go to Supabase → Authentication → Users → Create user with their email → Copy UUID → Run SQL:<br/>
            <code style={{ fontSize:11 }}>UPDATE clients SET auth_user_id = '&lt;uuid&gt;' WHERE email = 'their@email.com';</code>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]     = useState(null)
  const [tab, setTab]       = useState('dashboard')
  const [booting, setBooting] = useState(true)
  const isMobile = useIsMobile()

  useEffect(()=>{
    if (isDemo) { setBooting(false); return }
    supabase.auth.getSession().then(async ({ data:{ session } })=>{
      if (session) {
        try {
          const userId = session.user.id
          const { data: adminRow } = await supabase.from('admins').select('id').eq('auth_user_id',userId).single()
          if (adminRow) {
            setUser({role:'admin',name:'Admin',email:session.user.email,userId})
          } else {
            const { data: profile } = await supabase.from('clients').select('*').eq('auth_user_id',userId).single()
            if (profile) setUser({role:'client',name:profile.name,email:profile.email,userId,clientId:profile.id})
          }
        } catch(e){ console.error(e) }
      }
      setBooting(false)
    })
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((event)=>{
      if (event==='SIGNED_OUT') setUser(null)
    })
    return ()=>subscription.unsubscribe()
  },[])

  if (booting) return (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>Loading…</div>
    </div>
  )

  if (!user) return <Login onLogin={u=>{ setUser(u); setTab('dashboard') }}/>

  const isAdmin = user.role==='admin'

  // Tab definitions with icons for bottom nav
  const tabs = isAdmin
    ? [['dashboard','Clients','👥'],['workout','Workouts','🏋️'],['nutrition','Nutrition','🥗'],['roadmap','Roadmap','🗺️']]
    : [['dashboard','Home','🏠'],['weight','Weight','⚖️'],['workout','Workout','🏋️'],['nutrition','Nutrition','🥗'],['roadmap','Roadmap','🗺️']]

  const logout = async () => {
    if (!isDemo) await supabase.auth.signOut()
    setUser(null)
  }

  // Mobile layout: sticky top bar + bottom nav
  if (isMobile) {
    return (
      <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#f6f6f4', minHeight:'100vh', color:'#111' }}>
        {/* Top bar */}
        <div style={{ background:'#0d0d0d', color:'#fff', padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', height:52, position:'sticky', top:0, zIndex:100 }}>
          <div style={{ fontSize:16, fontWeight:800, letterSpacing:'-0.5px' }}>LEVELUP📈</div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{isAdmin?'Admin':user.name?.split(' ')[0]}</span>
            <button onClick={logout} style={{ padding:'5px 10px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:11 }}>Out</button>
          </div>
        </div>

        {/* Page content with bottom padding so nav doesn't cover content */}
        <div style={{ paddingBottom:70 }}>
          {tab==='dashboard' && (isAdmin ? <AdminPanel user={user}/> : <Dashboard user={user}/>)}
          {tab==='weight'    && !isAdmin && <WeightLogger user={user}/>}
          {tab==='workout'   && <WorkoutPage user={user} isAdmin={isAdmin}/>}
          {tab==='nutrition' && <NutritionPage user={user} isAdmin={isAdmin}/>}
          {tab==='roadmap'   && <RoadmapPage user={user}/>}
        </div>

        {/* Bottom navigation */}
        <BottomNav tabs={tabs} tab={tab} setTab={setTab}/>
      </div>
    )
  }

  // Desktop layout: top nav
  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#f6f6f4', minHeight:'100vh', color:'#111' }}>
      <nav style={{ background:'#0d0d0d', color:'#fff', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:56, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontSize:16, fontWeight:800, letterSpacing:'-0.5px', color:'#fff' }}>
          LEVELUP📈 {isAdmin&&<span style={{ fontSize:10, fontWeight:400, color:'rgba(255,255,255,0.3)', marginLeft:6 }}>admin</span>}
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {tabs.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ padding:'6px 14px', borderRadius:7, border:'none', cursor:'pointer', fontWeight:600, fontSize:13, background:tab===id?C.accent:'transparent', color:tab===id?'#fff':'rgba(255,255,255,0.5)', WebkitTapHighlightColor:'transparent' }}>{label}</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{user.email}</span>
          <button onClick={logout} style={{ padding:'5px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:11 }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth:1080, margin:'0 auto' }}>
        {tab==='dashboard' && (isAdmin ? <AdminPanel user={user}/> : <Dashboard user={user}/>)}
        {tab==='weight'    && !isAdmin && <WeightLogger user={user}/>}
        {tab==='workout'   && <WorkoutPage user={user} isAdmin={isAdmin}/>}
        {tab==='nutrition' && <NutritionPage user={user} isAdmin={isAdmin}/>}
        {tab==='roadmap'   && <RoadmapPage user={user}/>}
      </div>
    </div>
  )
}