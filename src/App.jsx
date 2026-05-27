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
    { id:'w1', day_number:1, day_name:'DAY 1', workout_type:'Legs',         exercise_name:'Leg extension',            set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:'https://youtu.be/wrU4hx4W3do' },
    { id:'w2', day_number:1, day_name:'DAY 1', workout_type:'Legs',         exercise_name:'Smith machine calf raises',set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/1lKjFPrYqf0' },
    { id:'w3', day_number:1, day_name:'DAY 1', workout_type:'Legs',         exercise_name:'Belt squats',              set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:'https://youtu.be/FCIZZvIM-I0' },
    { id:'w4', day_number:2, day_name:'DAY 2', workout_type:'Push',         exercise_name:'Incline Db press',         set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:'https://youtu.be/IP4oeKh1Sd4' },
    { id:'w5', day_number:2, day_name:'DAY 2', workout_type:'Push',         exercise_name:'Machine press flat',       set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/sreMgnjczh4' },
    { id:'w6', day_number:2, day_name:'DAY 2', workout_type:'Push',         exercise_name:'Db lateral raises',        set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/PzsMitRdI_8' },
    { id:'w7', day_number:3, day_name:'DAY 3', workout_type:'Pull',         exercise_name:'Cable row',                set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:null },
    { id:'w8', day_number:3, day_name:'DAY 3', workout_type:'Pull',         exercise_name:'Lat pulldown',             set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:null },
    { id:'w9', day_number:4, day_name:'DAY 4', workout_type:'Rest',         exercise_name:'REST DAY',                 set_rep:null,          tempo:null,   rest_seconds:null, sets:null, video_url:null },
    { id:'w10',day_number:5, day_name:'DAY 5', workout_type:'Legs & Chest', exercise_name:'Stiff leg deadlift',       set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/CN_7cz3P-1U' },
    { id:'w11',day_number:5, day_name:'DAY 5', workout_type:'Legs & Chest', exercise_name:'Bulgarian Split squats',   set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/SkNsa3eBwLA' },
  ],
  mealPlan: [
    { id:'m1', meal_number:1, meal_name:'MEAL 1', food_name:'Whey protein', category:'Proteins',      qty_g:35, calories:131.6, protein_g:25,   fat_g:2.4,  carbs_g:2.5,  fibre_g:0 },
    { id:'m2', meal_number:1, meal_name:'MEAL 1', food_name:'Oats',         category:'Carbohydrates', qty_g:60, calories:219.2, protein_g:7.56, fat_g:3.18, carbs_g:40.1, fibre_g:6.18 },
    { id:'m3', meal_number:2, meal_name:'MEAL 2', food_name:'Paneer raw',   category:'Proteins',      qty_g:100,calories:265.2, protein_g:18.3, fat_g:20.8, carbs_g:1.2,  fibre_g:0 },
  ],
  roadmap: [
    { id:'r1',  month_number:1,  month_name:'JANUARY',   phase:'Lean Gain', notes:'' },
    { id:'r2',  month_number:2,  month_name:'FEBRUARY',  phase:null,        notes:'' },
    { id:'r3',  month_number:3,  month_name:'MARCH',     phase:'Fat-Loss',  notes:'Started cut' },
    { id:'r4',  month_number:4,  month_name:'APRIL',     phase:'Fat-Loss',  notes:'' },
    { id:'r5',  month_number:5,  month_name:'MAY',       phase:'Fat-Loss',  notes:'' },
    { id:'r6',  month_number:6,  month_name:'JUNE',      phase:'Fat-Loss',  notes:'' },
    { id:'r7',  month_number:7,  month_name:'JULY',      phase:'Lean Gain', notes:'' },
    { id:'r8',  month_number:8,  month_name:'AUGUST',    phase:'Lean Gain', notes:'' },
    { id:'r9',  month_number:9,  month_name:'SEPTEMBER', phase:'Lean Gain', notes:'' },
    { id:'r10', month_number:10, month_name:'OCTOBER',   phase:null,        notes:'' },
    { id:'r11', month_number:11, month_name:'NOVEMBER',  phase:null,        notes:'' },
    { id:'r12', month_number:12, month_name:'DECEMBER',  phase:null,        notes:'' },
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
    { food_name:'Dahi',           portion_g:100, protein_g:4,    fat_g:1,    carbs_g:5,    fibre_g:0,    calories:45 },
    { food_name:'Kidney beans',   portion_g:100, protein_g:24,   fat_g:0.8,  carbs_g:85,   fibre_g:14,   calories:443.2 },
    { food_name:'Moong dal',      portion_g:100, protein_g:23.7, fat_g:1.4,  carbs_g:57.6, fibre_g:12,   calories:337.8 },
  ],
  adminClients: [
    { id:'1', name:'ROHAN CHOUBEY', email:'rohanchoubey7@gmail.com', age:25, current_weight:90, goal_weight:79, end_date:'2026-08-31', is_active:true },
  ]
}

// ─── DB HELPERS ───────────────────────────────────────────────────────────────
async function sbQuery(table, opts={}) {
  let q = supabase.from(table).select(opts.select||'*')
  if (opts.eq)     Object.entries(opts.eq).forEach(([k,v])=>{ q=q.eq(k,v) })
  if (opts.order)  q=q.order(opts.order,{ascending:opts.asc!==false})
  if (opts.single) q=q.single()
  const { data, error } = await q
  if (error && error.code!=='PGRST116') throw error
  return data
}
async function sbInsert(table, values) {
  const { data, error } = await supabase.from(table).insert([values]).select().single()
  if (error) throw error
  return data
}
async function sbUpdate(table, id, values) {
  const { data, error } = await supabase.from(table).update(values).eq('id',id).select().single()
  if (error) throw error
  return data
}
async function sbDelete(table, id) {
  const { error } = await supabase.from(table).delete().eq('id',id)
  if (error) throw error
}

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window!=='undefined' && window.innerWidth<640)
  useEffect(()=>{
    const fn=()=>setMobile(window.innerWidth<640)
    window.addEventListener('resize',fn)
    return ()=>window.removeEventListener('resize',fn)
  },[])
  return mobile
}

// ─── COLORS & STYLES ──────────────────────────────────────────────────────────
const C = { accent:'#FF6B35', accentL:'#fff4f0', green:'#16a34a', greenL:'#f0fdf4', blue:'#2563eb', blueL:'#eff6ff', red:'#dc2626', redL:'#fef2f2', amber:'#d97706', amberL:'#fef3c7', gray:'#6b7280', border:'rgba(0,0,0,0.09)' }

const S = {
  inp: { width:'100%', padding:'10px 13px', borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:15, outline:'none', boxSizing:'border-box', background:'#fff', WebkitAppearance:'none', appearance:'none' },
  card: { background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, padding:'18px', marginBottom:14 },
  cardS: { background:'#fff', borderRadius:12, border:`1px solid ${C.border}`, padding:'14px' },
  lbl: { fontSize:11, fontWeight:600, color:C.gray, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:5, display:'block' },
  th: { padding:'9px 11px', textAlign:'left', fontSize:11, fontWeight:600, color:C.gray, textTransform:'uppercase', letterSpacing:'0.4px', borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' },
  td: { padding:'10px 11px', fontSize:13, borderBottom:`1px solid ${C.border}` },
  table: { width:'100%', borderCollapse:'collapse' },
  page: { padding:'16px 14px', maxWidth:1080, margin:'0 auto' },
  h1: { fontSize:22, fontWeight:700, margin:'0 0 4px' },
}

function Btn({ children, variant='primary', onClick, disabled, style={}, small }) {
  const base = { border:'none', cursor:'pointer', fontWeight:600, WebkitTapHighlightColor:'transparent', borderRadius:9, transition:'opacity .15s',
    padding: small ? '6px 12px' : '10px 18px',
    fontSize: small ? 12 : 14,
    opacity: disabled ? 0.5 : 1,
    background: variant==='primary'?C.accent : variant==='danger'?C.redL : variant==='green'?C.greenL : variant==='ghost'?'transparent' : '#f3f4f6',
    color: variant==='primary'?'#fff' : variant==='danger'?C.red : variant==='green'?C.green : variant==='ghost'?C.gray : '#111',
  }
  return <button onClick={onClick} disabled={disabled} style={{...base,...style}}>{children}</button>
}

function Badge({ children, color='accent' }) {
  const bg = color==='green'?C.greenL:color==='red'?C.redL:color==='blue'?C.blueL:color==='amber'?C.amberL:C.accentL
  const tc = color==='green'?C.green:color==='red'?C.red:color==='blue'?C.blue:color==='amber'?C.amber:C.accent
  return <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:6, fontSize:11, fontWeight:600, background:bg, color:tc }}>{children}</span>
}

function Stat({ label, value, sub, color }) {
  return (
    <div style={S.cardS}>
      <span style={S.lbl}>{label}</span>
      <div style={{ fontSize:20, fontWeight:700, color:color==='green'?C.green:color==='red'?C.red:color==='blue'?C.blue:color==='amber'?C.amber:'#111' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.gray, marginTop:2 }}>{sub}</div>}
    </div>
  )
}

function Bar({ pct, color=C.accent }) {
  return <div style={{ height:8, background:'#f0f0f0', borderRadius:4 }}><div style={{ height:8, width:`${Math.min(100,Math.max(0,pct))}%`, background:color, borderRadius:4, transition:'width .6s' }}/></div>
}

function MsgBox({ msg }) {
  if (!msg) return null
  const err = msg.startsWith('Error')||msg.startsWith('error')
  return <div style={{ padding:'10px 14px', background:err?C.redL:C.greenL, borderRadius:9, fontSize:13, color:err?C.red:C.green, marginTop:12 }}>{msg}</div>
}

// Simple modal overlay
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose() }}>
      <div style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:'20px 18px', width:'100%', maxWidth:640, maxHeight:'90vh', overflowY:'auto', WebkitOverflowScrolling:'touch' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontSize:17, fontWeight:700 }}>{title}</div>
          <button onClick={onClose} style={{ background:'#f3f4f6', border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:18, lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── INTERACTIVE WEIGHT CHART ─────────────────────────────────────────────────
function WeightChart({ data }) {
  const [tip, setTip] = useState(null)
  const svgRef = useRef(null)
  const isMobile = useIsMobile()
  if (!data||data.length<2) return <div style={{ textAlign:'center', padding:'28px 0', color:C.gray, fontSize:13 }}>Log at least 2 entries to see chart</div>
  const sorted=[...data].sort((a,b)=>new Date(a.date)-new Date(b.date))
  const ws=sorted.map(d=>d.weight), minW=Math.min(...ws)-1, maxW=Math.max(...ws)+1
  const W=520,H=150,PL=36,PR=12,PT=14,PB=26
  const iW=W-PL-PR, iH=H-PT-PB
  const px=i=>PL+(i/(sorted.length-1||1))*iW
  const py=w=>PT+iH-((w-minW)/(maxW-minW||1))*iH
  const pts=sorted.map((d,i)=>({x:px(i),y:py(d.weight),...d}))
  const line=pts.map((p,i)=>`${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area=`${line} L${pts[pts.length-1].x.toFixed(1)},${(PT+iH).toFixed(1)} L${PL},${(PT+iH).toFixed(1)} Z`
  const yTicks=[minW+0.5,(minW+maxW)/2,maxW-0.5]
  const interact=e=>{
    const svg=svgRef.current; if(!svg) return
    const rect=svg.getBoundingClientRect()
    const cx=(e.touches?e.touches[0].clientX:e.clientX)
    const mouseX=(cx-rect.left)*(W/rect.width)
    let closest=pts[0],minD=Infinity
    pts.forEach(p=>{ const d=Math.abs(p.x-mouseX); if(d<minD){minD=d;closest=p} })
    setTip(minD<40?closest:null)
  }
  return (
    <div style={{ touchAction:'pan-y' }}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible', display:'block', cursor:'crosshair' }}
        onMouseMove={interact} onMouseLeave={()=>setTip(null)}
        onTouchMove={interact} onTouchEnd={()=>setTimeout(()=>setTip(null),2000)}>
        <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity=".2"/><stop offset="100%" stopColor={C.accent} stopOpacity="0"/></linearGradient></defs>
        {yTicks.map((w,i)=>(
          <g key={i}>
            <line x1={PL} y1={py(w)} x2={W-PR} y2={py(w)} stroke={C.border} strokeWidth="1" strokeDasharray="3,3"/>
            <text x={PL-4} y={py(w)+4} textAnchor="end" fontSize="9" fill={C.gray}>{w.toFixed(0)}</text>
          </g>
        ))}
        <path d={area} fill="url(#wg)"/>
        <path d={line} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {pts.map((p,i)=>(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={tip?.date===p.date?7:4} fill="#fff" stroke={C.accent} strokeWidth="2" style={{transition:'r .1s'}}/>
            {(i===0||i===pts.length-1||i%Math.ceil(pts.length/4)===0)&&<text x={p.x} y={H-4} textAnchor="middle" fontSize={isMobile?'8':'9'} fill={C.gray}>{p.date?.slice(5)}</text>}
          </g>
        ))}
        {tip&&(
          <g>
            <line x1={tip.x} y1={PT} x2={tip.x} y2={PT+iH} stroke={C.accent} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
            <rect x={Math.min(tip.x+8,W-108)} y={tip.y-40} width={100} height={36} rx="7" fill="#111" fillOpacity="0.9"/>
            <text x={Math.min(tip.x+58,W-58)} y={tip.y-23} textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">{tip.weight} kg</text>
            <text x={Math.min(tip.x+58,W-58)} y={tip.y-8}  textAnchor="middle" fontSize="9"  fill="rgba(255,255,255,0.55)">{tip.date}</text>
          </g>
        )}
      </svg>
      <div style={{ fontSize:11, color:C.gray, textAlign:'center', marginTop:4 }}>{isMobile?'Tap point for details':'Hover for details'}</div>
    </div>
  )
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ tabs, tab, setTab }) {
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#0d0d0d', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', zIndex:200, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
      {tabs.map(([id,label,icon])=>(
        <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:'10px 4px 8px', background:'transparent', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, WebkitTapHighlightColor:'transparent' }}>
          <span style={{ fontSize:20 }}>{icon}</span>
          <span style={{ fontSize:10, fontWeight:600, color:tab===id?C.accent:'rgba(255,255,255,0.4)' }}>{label}</span>
          {tab===id&&<div style={{ width:18, height:2, background:C.accent, borderRadius:1 }}/>}
        </button>
      ))}
    </div>
  )
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email,setEmail]=useState('')
  const [pass,setPass]=useState('')
  const [mode,setMode]=useState('client')
  const [err,setErr]=useState('')
  const [loading,setLoading]=useState(false)
  const handle=async e=>{
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      if (isDemo) {
        if (mode==='admin'&&email==='admin@levelup.com'&&pass==='admin123') onLogin({role:'admin',name:'Admin',email})
        else if (mode==='client'&&email&&pass) onLogin({role:'client',name:'ROHAN CHOUBEY',email,clientId:'demo'})
        else setErr('Demo: admin@levelup.com / admin123 for admin, any email+pass for client')
      } else {
        const { data, error }=await supabase.auth.signInWithPassword({email,password:pass})
        if (error) throw error
        const userId=data.user.id
        const { data:adminRow }=await supabase.from('admins').select('id').eq('auth_user_id',userId).single()
        if (adminRow) { onLogin({role:'admin',name:'Admin',email,userId}) }
        else {
          const { data:profile, error:pe }=await supabase.from('clients').select('*').eq('auth_user_id',userId).single()
          if (pe) throw new Error('Client profile not found. Contact your coach.')
          onLogin({role:'client',name:profile.name,email,userId,clientId:profile.id})
        }
      }
    } catch(ex){ setErr(ex.message||'Login failed') }
    finally{ setLoading(false) }
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
          {['client','admin'].map(m=><button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:'9px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:13, background:mode===m?C.accent:'transparent', color:mode===m?'#fff':'rgba(255,255,255,0.4)', textTransform:'capitalize', WebkitTapHighlightColor:'transparent' }}>{m}</button>)}
        </div>
        <form onSubmit={handle}>
          {[['Email','email',email,setEmail,'your@email.com'],['Password','password',pass,setPass,'••••••••']].map(([lbl,type,val,set,ph])=>(
            <div key={lbl} style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:'rgba(255,255,255,0.45)', display:'block', marginBottom:6 }}>{lbl}</label>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} required style={{ ...S.inp, background:'rgba(255,255,255,0.07)', color:'#fff', borderColor:'rgba(255,255,255,0.1)', fontSize:16 }}/>
            </div>
          ))}
          {err&&<div style={{ fontSize:13, color:'#f87171', marginBottom:12, padding:'9px 13px', background:'rgba(239,68,68,0.08)', borderRadius:8 }}>{err}</div>}
          <Btn disabled={loading} style={{ width:'100%', fontSize:15, padding:'13px' }}>{loading?'Signing in…':'Sign In'}</Btn>
        </form>
      </div>
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [client,setClient]=useState(null)
  const [logs,setLogs]=useState([])
  const [targets,setTargets]=useState(null)
  const [loading,setLoading]=useState(true)
  const isMobile=useIsMobile()

  const load=async()=>{
    try {
      if (isDemo||user.clientId==='demo') { setClient(DEMO.client); setLogs(DEMO.weightLogs); setTargets(DEMO.targets) }
      else {
        const [c,l,t]=await Promise.all([
          sbQuery('clients',{eq:{auth_user_id:user.userId},single:true}),
          sbQuery('weight_logs',{eq:{client_id:user.clientId},order:'date',asc:true}),
          sbQuery('weekly_targets',{eq:{client_id:user.clientId},order:'created_at',asc:false,single:true})
        ])
        setClient(c); setLogs(l||[]); setTargets(t)
      }
    } catch(e){console.error(e)} finally{setLoading(false)}
  }

  useEffect(()=>{ load() },[user])
  useEffect(()=>{
    if (isDemo||user.clientId==='demo') return
    const sub=supabase.channel('dash')
      .on('postgres_changes',{event:'*',schema:'public',table:'clients',filter:`auth_user_id=eq.${user.userId}`},()=>load())
      .on('postgres_changes',{event:'*',schema:'public',table:'weight_logs',filter:`client_id=eq.${user.clientId}`},()=>load())
      .on('postgres_changes',{event:'*',schema:'public',table:'weekly_targets',filter:`client_id=eq.${user.clientId}`},()=>load())
      .subscribe()
    return ()=>supabase.removeChannel(sub)
  },[user])

  if (loading) return <div style={{ textAlign:'center', padding:60, color:C.gray }}>Loading…</div>
  if (!client) return null
  const latest=logs.length?logs[logs.length-1]:{weight:client.current_weight,bmi:null}
  const loss=((client.start_weight||0)-(latest.weight||0)).toFixed(2)
  const pct=Math.max(0,Math.min(100,((client.start_weight-latest.weight)/(client.start_weight-client.goal_weight))*100))
  const weeks=Math.max(0,Math.floor((new Date()-new Date(client.start_date))/(7*864e5)))
  const bmi=latest.bmi||((latest.weight/((client.height_cm/100)**2)).toFixed(1))
  const gridCols=isMobile?'repeat(2,1fr)':'repeat(4,1fr)'

  return (
    <div style={S.page}>
      <div style={{ marginBottom:18 }}>
        <div style={S.h1}>{client.name}</div>
        <div style={{ color:C.gray, fontSize:12, marginTop:3, display:'flex', flexWrap:'wrap', gap:'4px 10px', alignItems:'center' }}>
          <span>Age {client.age}</span><span>·</span><span>{client.gender}</span><span>·</span><span>{client.height_cm}cm</span><span>·</span><span>BMI {bmi}</span>
          <Badge color="blue">Week {weeks}</Badge>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:gridCols, gap:10, marginBottom:14 }}>
        <Stat label="Start"   value={`${client.start_weight}kg`}/>
        <Stat label="Current" value={`${latest.weight}kg`} color="blue"/>
        <Stat label="Goal"    value={`${client.goal_weight}kg`}/>
        <Stat label="Lost"    value={`${loss}kg`} color={parseFloat(loss)>0?'green':'red'} sub="since start"/>
      </div>
      <div style={S.card}>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Weight progress</div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:C.gray, marginBottom:6 }}>
          <span>Fat loss</span><span>{pct.toFixed(1)}%</span>
        </div>
        <Bar pct={pct}/>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.gray, marginTop:5 }}>
          <span>Start {client.start_weight}kg</span><span>Now {latest.weight}kg</span><span>Goal {client.goal_weight}kg</span>
        </div>
        <div style={{ marginTop:18 }}><WeightChart data={logs}/></div>
      </div>
      {targets&&(
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:14 }}>
          <div style={S.card}>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Daily targets</div>
            {[['Calories',`${Number(targets.calories).toFixed(0)} kcal`,C.accent],['Protein',`${Number(targets.protein_g).toFixed(0)}g`,C.blue],['Carbs',`${Number(targets.carbs_g).toFixed(0)}g`,C.green],['Fats',`${Number(targets.fats_g).toFixed(0)}g`,'#f59e0b'],['Fibre',`${Number(targets.fibre_g).toFixed(1)}g`,'#8b5cf6']].map(([lbl,val,clr])=>(
              <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:8, height:8, borderRadius:'50%', background:clr, flexShrink:0 }}/><span style={{ fontSize:14 }}>{lbl}</span></div>
                <span style={{ fontWeight:600, fontSize:14 }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>Program info</div>
            {[['Daily steps',targets.daily_steps],['Cardio',targets.cardio],['Diet',targets.diet_type?.toUpperCase()],['Start',client.start_date],['End',client.end_date]].map(([lbl,val])=>(
              <div key={lbl} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}`, fontSize:14 }}>
                <span style={{ color:C.gray }}>{lbl}</span><span style={{ fontWeight:500 }}>{val||'—'}</span>
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
  const [logs,setLogs]=useState([])
  const [date,setDate]=useState(new Date().toISOString().split('T')[0])
  const [wt,setWt]=useState('')
  const [unit,setUnit]=useState('Kg')
  const [msg,setMsg]=useState('')
  const [saving,setSaving]=useState(false)
  const clientId=user.clientId||'demo'

  const load=async()=>{
    if (isDemo||clientId==='demo'){setLogs(DEMO.weightLogs);return}
    const data=await sbQuery('weight_logs',{eq:{client_id:clientId},order:'date',asc:true})
    setLogs(data||[])
  }
  useEffect(()=>{ load() },[clientId])
  useEffect(()=>{
    if (isDemo||clientId==='demo') return
    const sub=supabase.channel('wlog').on('postgres_changes',{event:'*',schema:'public',table:'weight_logs',filter:`client_id=eq.${clientId}`},()=>load()).subscribe()
    return ()=>supabase.removeChannel(sub)
  },[clientId])

  const addLog=async()=>{
    if (!wt) return; setSaving(true)
    try {
      const w=parseFloat(wt), bmi=parseFloat((w/1.80**2).toFixed(2))
      if (isDemo||clientId==='demo'){setLogs(prev=>[...prev,{id:Date.now(),date,weight:w,unit,bmi}])}
      else { await sbInsert('weight_logs',{client_id:clientId,date,weight:w,unit,bmi}); await supabase.from('clients').update({current_weight:w}).eq('id',clientId) }
      setMsg(`✓ Logged ${w}${unit}`); setWt(''); setTimeout(()=>setMsg(''),3000)
    } catch(e){setMsg(`Error: ${e.message}`)} finally{setSaving(false)}
  }

  const deleteLog=async(id)=>{
    if (!window.confirm('Delete this entry?')) return
    if (isDemo||clientId==='demo'){setLogs(prev=>prev.filter(l=>l.id!==id));return}
    try { await sbDelete('weight_logs',id); load() } catch(e){setMsg(`Error: ${e.message}`)}
  }

  const sorted=[...logs].sort((a,b)=>new Date(b.date)-new Date(a.date))

  return (
    <div style={S.page}>
      <div style={{ marginBottom:18 }}><div style={S.h1}>Weight logger</div><div style={{ fontSize:13, color:C.gray }}>{logs.length} entries</div></div>
      <div style={S.card}>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:14 }}>Log today</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
          <div><span style={S.lbl}>Date</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={S.inp}/></div>
          <div><span style={S.lbl}>Weight</span><input type="number" value={wt} onChange={e=>setWt(e.target.value)} placeholder="e.g. 91.5" step=".1" inputMode="decimal" style={S.inp}/></div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ width:100 }}><span style={S.lbl}>Unit</span><select value={unit} onChange={e=>setUnit(e.target.value)} style={S.inp}><option>Kg</option><option>Lbs</option></select></div>
          <Btn onClick={addLog} disabled={saving} style={{ flex:1, marginTop:18 }}>{saving?'Saving…':'Log weight'}</Btn>
        </div>
        <MsgBox msg={msg}/>
      </div>
      <div style={S.card}>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:14 }}>History</div>
        <WeightChart data={[...logs].sort((a,b)=>new Date(a.date)-new Date(b.date))}/>
        <div style={{ marginTop:16, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          <table style={S.table}>
            <thead><tr>{['Date','Weight','BMI','Change',''].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {sorted.map((l,i)=>{
                const prev=sorted[i+1], chg=prev?+(l.weight-prev.weight).toFixed(2):null
                return (
                  <tr key={l.id}>
                    <td style={S.td}>{l.date}</td>
                    <td style={{ ...S.td, fontWeight:600 }}>{l.weight} kg</td>
                    <td style={S.td}>{l.bmi||'—'}</td>
                    <td style={S.td}>{chg!=null&&<Badge color={chg<0?'green':chg>0?'red':'blue'}>{chg>0?'+':''}{chg}</Badge>}</td>
                    <td style={S.td}><Btn variant="danger" small onClick={()=>deleteLog(l.id)}>Delete</Btn></td>
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


// ─── CLIENT SELECTOR (admin uses this to pick which client to edit) ────────────
function useAdminClient(user, isAdmin) {
  const [clients, setClients] = useState([])
  const [selClientId, setSelClientId] = useState('')

  useEffect(() => {
    if (!isAdmin || isDemo) return
    sbQuery('clients', { order: 'name', asc: true }).then(d => {
      const list = d || []
      setClients(list)
      if (list.length > 0) setSelClientId(list[0].id)
    })
  }, [isAdmin])

  const clientId = isAdmin ? selClientId : (user.clientId || 'demo')
  return { clients, selClientId, setSelClientId, clientId }
}

function ClientSelector({ clients, selClientId, setSelClientId }) {
  if (!clients.length) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, color: C.gray, fontWeight: 600 }}>Client:</span>
      <select value={selClientId} onChange={e => setSelClientId(e.target.value)}
        style={{ ...S.inp, width: 'auto', minWidth: 180, padding: '7px 12px', fontSize: 13 }}>
        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
  )
}

// ─── WORKOUT PAGE ─────────────────────────────────────────────────────────────
function WorkoutPage({ user, isAdmin }) {
  const { clients, selClientId, setSelClientId, clientId } = useAdminClient(user, isAdmin)
  const [program, setProgram] = useState([])
  const [logs, setLogs] = useState([])
  const [dayIdx, setDayIdx] = useState(0)
  const [week, setWeek] = useState(1)
  const [inputs, setInputs] = useState({})
  const [saving, setSaving] = useState('')
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editEx, setEditEx] = useState(null)
  const [exForm, setExForm] = useState({ day_number: 1, workout_type: 'Legs', exercise_name: '', set_rep: '', tempo: '3010', rest_seconds: 120, sets: 3, video_url: '' })
  const [formMsg, setFormMsg] = useState('')
  const isMobile = useIsMobile()

  const isDemoMode = isDemo || clientId === 'demo' || !clientId

  const load = async () => {
    if (isDemoMode) { setProgram(DEMO.workoutProgram); return }
    const d = await sbQuery('workout_programs', { eq: { client_id: clientId }, order: 'day_number', asc: true })
    setProgram(d || [])
  }
  const loadLogs = async () => {
    if (isDemoMode) return
    const d = await sbQuery('workout_logs', { eq: { client_id: clientId, week }, order: 'logged_at', asc: false })
    setLogs(d || [])
  }
  useEffect(() => { if (clientId) load() }, [clientId])
  useEffect(() => { if (clientId) loadLogs() }, [clientId, week])

  const days = [...new Set(program.map(p => p.day_number))].sort((a, b) => a - b)
  const selDay = days[dayIdx] || 1
  const dayExs = program.filter(p => p.day_number === selDay)
  const dayType = dayExs[0]?.workout_type || ''

  const logSet = async (exName, setNum) => {
    const key = `${exName}_${setNum}`, inp = inputs[key] || {}
    if (!inp.reps && !inp.weight) return
    setSaving(key)
    try {
      const entry = { client_id: clientId, week, day_number: selDay, exercise_name: exName, set_number: setNum, reps: parseInt(inp.reps) || 0, weight_kg: parseFloat(inp.weight) || 0 }
      if (isDemoMode) setLogs(prev => [...prev, { id: Date.now(), ...entry }])
      else { const saved = await sbInsert('workout_logs', entry); setLogs(prev => [...prev, saved]) }
      setInputs(prev => ({ ...prev, [key]: { reps: '', weight: '' } }))
    } catch (e) { console.error(e) }
    finally { setSaving('') }
  }
  const getLog = (exName, setNum) => logs.find(l => l.exercise_name === exName && l.set_number === setNum && l.day_number === selDay)

  const saveExercise = async () => {
    setFormMsg('')
    if (!exForm.exercise_name) { setFormMsg('Error: Exercise name required'); return }
    try {
      if (isDemoMode) {
        if (editEx) setProgram(prev => prev.map(p => p.id === editEx.id ? { ...p, ...exForm } : p))
        else setProgram(prev => [...prev, { id: 'w' + Date.now(), ...exForm, client_id: clientId }])
      } else {
        if (editEx) await sbUpdate('workout_programs', editEx.id, exForm)
        else await sbInsert('workout_programs', { ...exForm, client_id: clientId })
        await load()
      }
      setFormMsg('✓ Saved'); setTimeout(() => { setShowAddModal(false); setEditEx(null); setFormMsg('') }, 800)
      setExForm({ day_number: 1, workout_type: 'Legs', exercise_name: '', set_rep: '', tempo: '3010', rest_seconds: 120, sets: 3, video_url: '' })
    } catch (e) { setFormMsg(`Error: ${e.message}`) }
  }

  const deleteExercise = async (ex) => {
    if (!window.confirm(`Delete "${ex.exercise_name}"?`)) return
    if (isDemoMode) { setProgram(prev => prev.filter(p => p.id !== ex.id)); return }
    try { await sbDelete('workout_programs', ex.id); await load() } catch (e) { alert(e.message) }
  }

  const openEdit = (ex) => {
    setEditEx(ex)
    setExForm({ day_number: ex.day_number, workout_type: ex.workout_type, exercise_name: ex.exercise_name, set_rep: ex.set_rep || '', tempo: ex.tempo || '3010', rest_seconds: ex.rest_seconds || 120, sets: ex.sets || 3, video_url: ex.video_url || '' })
    setShowAddModal(true)
  }

  const ExForm = (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><span style={S.lbl}>Day number</span><input type="number" value={exForm.day_number} onChange={e => setExForm(p => ({ ...p, day_number: parseInt(e.target.value) || 1 }))} style={S.inp} min="1" max="7" /></div>
        <div><span style={S.lbl}>Workout type</span><input value={exForm.workout_type} onChange={e => setExForm(p => ({ ...p, workout_type: e.target.value }))} placeholder="Legs, Push, Pull…" style={S.inp} /></div>
        <div style={{ gridColumn: '1/-1' }}><span style={S.lbl}>Exercise name *</span><input value={exForm.exercise_name} onChange={e => setExForm(p => ({ ...p, exercise_name: e.target.value }))} placeholder="Incline Db press" style={S.inp} /></div>
        <div><span style={S.lbl}>Set & Rep</span><input value={exForm.set_rep} onChange={e => setExForm(p => ({ ...p, set_rep: e.target.value }))} placeholder="3x9-11" style={S.inp} /></div>
        <div><span style={S.lbl}>Tempo</span><input value={exForm.tempo} onChange={e => setExForm(p => ({ ...p, tempo: e.target.value }))} placeholder="3010" style={S.inp} /></div>
        <div><span style={S.lbl}>Rest (sec)</span><input type="number" value={exForm.rest_seconds} onChange={e => setExForm(p => ({ ...p, rest_seconds: parseInt(e.target.value) || 120 }))} style={S.inp} /></div>
        <div><span style={S.lbl}>Sets</span><input type="number" value={exForm.sets} onChange={e => setExForm(p => ({ ...p, sets: parseInt(e.target.value) || 3 }))} style={S.inp} /></div>
        <div style={{ gridColumn: '1/-1' }}><span style={S.lbl}>Video URL</span><input value={exForm.video_url} onChange={e => setExForm(p => ({ ...p, video_url: e.target.value }))} placeholder="https://youtu.be/…" style={S.inp} /></div>
      </div>
      <MsgBox msg={formMsg} />
      <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
        <Btn onClick={saveExercise} style={{ flex: 1 }}>{editEx ? 'Save changes' : 'Add exercise'}</Btn>
        <Btn variant="secondary" onClick={() => { setShowAddModal(false); setEditEx(null) }} style={{ flex: 1 }}>Cancel</Btn>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div><div style={S.h1}>Workout</div><div style={{ fontSize: 12, color: C.gray }}>Log your sets</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {isAdmin && <ClientSelector clients={clients} selClientId={selClientId} setSelClientId={setSelClientId} />}
          {isAdmin && <Btn variant="green" small onClick={() => { setEditEx(null); setShowAddModal(true) }}>+ Add exercise</Btn>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: C.gray }}>Week</span>
            <select value={week} onChange={e => setWeek(Number(e.target.value))} style={{ ...S.inp, width: 85, padding: '8px 10px', fontSize: 14 }}>
              {Array.from({ length: 48 }, (_, i) => <option key={i + 1} value={i + 1}>Wk {i + 1}</option>)}
            </select>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div style={{ marginBottom: 14 }}>
          <button onClick={() => setShowDayPicker(!showDayPicker)} style={{ ...S.inp, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#fff', fontWeight: 600 }}>
            <span>Day {selDay} — {dayType}</span><span style={{ fontSize: 10 }}>{showDayPicker ? '▲' : '▼'}</span>
          </button>
          {showDayPicker && (
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, marginTop: 6, overflow: 'hidden' }}>
              {days.map((d, i) => { const t = program.find(p => p.day_number === d)?.workout_type || ''; return (<button key={d} onClick={() => { setDayIdx(i); setShowDayPicker(false) }} style={{ width: '100%', padding: '13px 16px', background: dayIdx === i ? C.accentL : '#fff', border: 'none', borderBottom: `1px solid ${C.border}`, textAlign: 'left', cursor: 'pointer', fontSize: 14, color: dayIdx === i ? C.accent : '#111', fontWeight: dayIdx === i ? 600 : 400 }}>Day {d} — {t}</button>) })}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
          {days.map((d, i) => { const t = program.find(p => p.day_number === d)?.workout_type || ''; return <Btn key={d} variant={dayIdx === i ? 'primary' : 'secondary'} small onClick={() => setDayIdx(i)}>Day {d} · {t}</Btn> })}
        </div>
      )}

      {showAddModal && <Modal title={editEx ? `Edit: ${editEx.exercise_name}` : 'Add exercise'} onClose={() => { setShowAddModal(false); setEditEx(null) }}>{ExForm}</Modal>}

      {dayType === 'Rest' ? (
        <div style={{ ...S.card, textAlign: 'center', padding: '50px 24px' }}>
          <div style={{ fontSize: 40 }}>😴</div>
          <div style={{ fontSize: 17, fontWeight: 600, marginTop: 10 }}>Rest & Recovery Day</div>
          <div style={{ fontSize: 13, color: C.gray, marginTop: 6 }}>Sleep, hydrate, stretch</div>
        </div>
      ) : isMobile ? (
        dayExs.map((ex, i) => (
          <div key={ex.id || i} style={{ ...S.card, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 15, flex: 1, marginRight: 8 }}>{ex.exercise_name}</div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {ex.video_url && <a href={ex.video_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.accent, textDecoration: 'none', fontWeight: 600 }}>Watch</a>}
                {isAdmin && <><Btn variant="secondary" small onClick={() => openEdit(ex)}>Edit</Btn><Btn variant="danger" small onClick={() => deleteExercise(ex)}>Del</Btn></>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
              <Badge color="blue">{ex.set_rep}</Badge>
              <Badge color="amber">{ex.tempo}</Badge>
              <span style={{ fontSize: 12, color: C.gray }}>Rest: {ex.rest_seconds}s</span>
            </div>
            {Array.from({ length: ex.sets || 2 }, (_, si) => {
              const setNum = si + 1, key = `${ex.exercise_name}_${setNum}`, done = getLog(ex.exercise_name, setNum)
              return (
                <div key={si} style={{ padding: '10px 0', borderTop: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, color: C.gray, marginBottom: 8, fontWeight: 600 }}>Set {setNum}</div>
                  {done ? <Badge color="green">✓ {done.reps} reps @ {done.weight_kg}kg</Badge> : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={inputs[key]?.reps || ''} onChange={e => setInputs(p => ({ ...p, [key]: { ...p[key], reps: e.target.value } }))} placeholder="Reps" inputMode="numeric" style={{ ...S.inp, flex: 1 }} />
                      <input value={inputs[key]?.weight || ''} onChange={e => setInputs(p => ({ ...p, [key]: { ...p[key], weight: e.target.value } }))} placeholder="kg" inputMode="decimal" style={{ ...S.inp, flex: 1 }} />
                      <Btn onClick={() => logSet(ex.exercise_name, setNum)} disabled={saving === key} style={{ flexShrink: 0 }}>{saving === key ? '…' : 'Log'}</Btn>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))
      ) : (
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>Day {selDay} — {dayType}</div>
            <Badge color="blue">Week {week}</Badge>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={S.table}>
              <thead><tr>{['Exercise', 'Scheme', 'Tempo', 'Rest', 'Video', 'Set', 'Log', isAdmin ? 'Actions' : ''].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {dayExs.map((ex, i) => {
                  const sets = ex.sets || 2
                  return Array.from({ length: sets }, (_, si) => {
                    const setNum = si + 1, key = `${ex.exercise_name}_${setNum}`, done = getLog(ex.exercise_name, setNum)
                    return (
                      <tr key={`${i}_${si}`} style={{ background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                        {si === 0 && <>
                          <td style={{ ...S.td, fontWeight: 600 }} rowSpan={sets}>{ex.exercise_name}</td>
                          <td style={S.td} rowSpan={sets}><Badge color="blue">{ex.set_rep}</Badge></td>
                          <td style={S.td} rowSpan={sets}>{ex.tempo}</td>
                          <td style={S.td} rowSpan={sets}>{ex.rest_seconds}s</td>
                          <td style={S.td} rowSpan={sets}>{ex.video_url && <a href={ex.video_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.accent, textDecoration: 'none', fontWeight: 500 }}>Watch →</a>}</td>
                        </>}
                        <td style={{ ...S.td, color: C.gray, fontSize: 12 }}>Set {setNum}</td>
                        <td style={S.td}>
                          {done ? <Badge color="green">✓ {done.reps}r @ {done.weight_kg}kg</Badge> : (
                            <div style={{ display: 'flex', gap: 5 }}>
                              <input value={inputs[key]?.reps || ''} onChange={e => setInputs(p => ({ ...p, [key]: { ...p[key], reps: e.target.value } }))} placeholder="reps" style={{ ...S.inp, width: 54, padding: '5px 7px', fontSize: 13 }} />
                              <input value={inputs[key]?.weight || ''} onChange={e => setInputs(p => ({ ...p, [key]: { ...p[key], weight: e.target.value } }))} placeholder="kg" style={{ ...S.inp, width: 54, padding: '5px 7px', fontSize: 13 }} />
                              <Btn small onClick={() => logSet(ex.exercise_name, setNum)} disabled={saving === key}>{saving === key ? '…' : 'Log'}</Btn>
                            </div>
                          )}
                        </td>
                        {isAdmin && si === 0 && <td style={S.td} rowSpan={sets}><div style={{ display: 'flex', gap: 5 }}><Btn variant="secondary" small onClick={() => openEdit(ex)}>Edit</Btn><Btn variant="danger" small onClick={() => deleteExercise(ex)}>Del</Btn></div></td>}
                        {isAdmin && si > 0 && <td style={S.td} />}
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
  const { clients, selClientId, setSelClientId, clientId } = useAdminClient(user, isAdmin)
  const [meals, setMeals] = useState([])
  const [foods, setFoods] = useState([])
  const [targets, setTargets] = useState(null)
  const [search, setSearch] = useState('')
  const [dietType, setDietType] = useState('veg')
  const [showMealModal, setShowMealModal] = useState(false)
  const [showFoodModal, setShowFoodModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [editFood, setEditFood] = useState(null)
  const [mealForm, setMealForm] = useState({ meal_number: 1, meal_name: 'MEAL 1', food_name: '', category: 'Proteins', qty_g: 100, calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, fibre_g: 0 })
  const [foodForm, setFoodForm] = useState({ food_name: '', portion_g: 100, protein_g: 0, fat_g: 0, carbs_g: 0, fibre_g: 0, calories: 0, is_veg: true })
  const [formMsg, setFormMsg] = useState('')
  const [foodMsg, setFoodMsg] = useState('')
  const isMobile = useIsMobile()

  const isDemoMode = isDemo || clientId === 'demo' || !clientId

  const load = async () => {
    if (isDemoMode) { setMeals(DEMO.mealPlan); setFoods(DEMO.foodDb); setTargets(DEMO.targets); return }
    const [m, t, f] = await Promise.all([
      sbQuery('meal_plans', { eq: { client_id: clientId, diet_type: dietType }, order: 'meal_number', asc: true }),
      sbQuery('weekly_targets', { eq: { client_id: clientId }, order: 'created_at', asc: false, single: true }),
      sbQuery('food_database', { order: 'food_name', asc: true })
    ])
    setMeals(m || []); setTargets(t); setFoods(f || [])
  }
  useEffect(() => { if (clientId || isDemoMode) load() }, [clientId, dietType])

  // Real-time subscription
  useEffect(() => {
    if (isDemoMode) return
    const sub = supabase.channel('nutrition-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meal_plans', filter: `client_id=eq.${clientId}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'food_database' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weekly_targets', filter: `client_id=eq.${clientId}` }, () => load())
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [clientId])

  // ── Meal plan CRUD ──
  const saveMealItem = async () => {
    setFormMsg('')
    if (!mealForm.food_name) { setFormMsg('Error: Food name required'); return }
    try {
      if (isDemoMode) {
        if (editItem) setMeals(prev => prev.map(m => m.id === editItem.id ? { ...m, ...mealForm } : m))
        else setMeals(prev => [...prev, { id: 'm' + Date.now(), ...mealForm }])
      } else {
        if (editItem) {
          await sbUpdate('meal_plans', editItem.id, { ...mealForm, client_id: clientId, diet_type: dietType })
        } else {
          await sbInsert('meal_plans', { ...mealForm, client_id: clientId, diet_type: dietType })
        }
        await load()
      }
      setFormMsg('✓ Saved')
      setTimeout(() => { setShowMealModal(false); setEditItem(null); setFormMsg('') }, 700)
      setMealForm({ meal_number: 1, meal_name: 'MEAL 1', food_name: '', category: 'Proteins', qty_g: 100, calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, fibre_g: 0 })
    } catch (e) { setFormMsg(`Error: ${e.message}`) }
  }

  const deleteMealItem = async (item) => {
    if (!window.confirm(`Delete "${item.food_name}" from meal plan?`)) return
    if (isDemoMode) { setMeals(prev => prev.filter(m => m.id !== item.id)); return }
    try { await sbDelete('meal_plans', item.id); await load() } catch (e) { alert(e.message) }
  }

  const openEditMeal = (item) => {
    setEditItem(item)
    setMealForm({ meal_number: item.meal_number, meal_name: item.meal_name || 'MEAL 1', food_name: item.food_name, category: item.category || 'Proteins', qty_g: item.qty_g || 0, calories: item.calories || 0, protein_g: item.protein_g || 0, fat_g: item.fat_g || 0, carbs_g: item.carbs_g || 0, fibre_g: item.fibre_g || 0 })
    setShowMealModal(true)
  }

  // ── Food database CRUD ──
  const saveFoodItem = async () => {
    setFoodMsg('')
    if (!foodForm.food_name) { setFoodMsg('Error: Food name required'); return }
    try {
      if (isDemoMode) {
        if (editFood) setFoods(prev => prev.map(f => f.food_name === editFood.food_name ? { ...f, ...foodForm } : f))
        else setFoods(prev => [...prev, { ...foodForm }])
      } else {
        if (editFood) {
          await supabase.from('food_database').update(foodForm).eq('id', editFood.id)
        } else {
          await supabase.from('food_database').insert([foodForm])
        }
        await load()
      }
      setFoodMsg('✓ Saved')
      setTimeout(() => { setShowFoodModal(false); setEditFood(null); setFoodMsg('') }, 700)
      setFoodForm({ food_name: '', portion_g: 100, protein_g: 0, fat_g: 0, carbs_g: 0, fibre_g: 0, calories: 0, is_veg: true })
    } catch (e) { setFoodMsg(`Error: ${e.message}`) }
  }

  const deleteFoodItem = async (food) => {
    if (!window.confirm(`Delete "${food.food_name}" from database?`)) return
    if (isDemoMode) { setFoods(prev => prev.filter(f => f.food_name !== food.food_name)); return }
    try {
      await supabase.from('food_database').delete().eq('id', food.id)
      await load()
    } catch (e) { alert(e.message) }
  }

  const openEditFood = (food) => {
    setEditFood(food)
    setFoodForm({ food_name: food.food_name, portion_g: food.portion_g || 100, protein_g: food.protein_g || 0, fat_g: food.fat_g || 0, carbs_g: food.carbs_g || 0, fibre_g: food.fibre_g || 0, calories: food.calories || 0, is_veg: food.is_veg !== false })
    setShowFoodModal(true)
  }

  const grouped = meals.reduce((acc, m) => { const k = m.meal_name || `Meal ${m.meal_number}`; (acc[k] = acc[k] || []).push(m); return acc }, {})
  const filtered = foods.filter(f => f.food_name?.toLowerCase().includes(search.toLowerCase()))
  const t = targets || {}

  const MealItemForm = (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><span style={S.lbl}>Meal number</span><input type="number" value={mealForm.meal_number} onChange={e => setMealForm(p => ({ ...p, meal_number: parseInt(e.target.value) || 1, meal_name: `MEAL ${e.target.value}` }))} style={S.inp} min="1" /></div>
        <div><span style={S.lbl}>Meal name</span><input value={mealForm.meal_name} onChange={e => setMealForm(p => ({ ...p, meal_name: e.target.value }))} placeholder="MEAL 1" style={S.inp} /></div>
        <div style={{ gridColumn: '1/-1' }}><span style={S.lbl}>Food name *</span><input value={mealForm.food_name} onChange={e => setMealForm(p => ({ ...p, food_name: e.target.value }))} placeholder="Oats" style={S.inp} /></div>
        <div>
          <span style={S.lbl}>Category</span>
          <select value={mealForm.category} onChange={e => setMealForm(p => ({ ...p, category: e.target.value }))} style={S.inp}>
            {['Proteins', 'Carbohydrates', 'Fats', 'Vegetables', 'Dairy', 'Supplements'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><span style={S.lbl}>Quantity (g)</span><input type="number" value={mealForm.qty_g} onChange={e => setMealForm(p => ({ ...p, qty_g: parseFloat(e.target.value) || 0 }))} style={S.inp} /></div>
        {[['Calories', 'calories'], ['Protein (g)', 'protein_g'], ['Fat (g)', 'fat_g'], ['Carbs (g)', 'carbs_g'], ['Fibre (g)', 'fibre_g']].map(([lbl, k]) => (
          <div key={k}><span style={S.lbl}>{lbl}</span><input type="number" value={mealForm[k]} onChange={e => setMealForm(p => ({ ...p, [k]: parseFloat(e.target.value) || 0 }))} step=".1" inputMode="decimal" style={S.inp} /></div>
        ))}
      </div>
      <MsgBox msg={formMsg} />
      <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
        <Btn onClick={saveMealItem} style={{ flex: 1 }}>{editItem ? 'Save changes' : 'Add food item'}</Btn>
        <Btn variant="secondary" onClick={() => { setShowMealModal(false); setEditItem(null) }} style={{ flex: 1 }}>Cancel</Btn>
      </div>
    </div>
  )

  const FoodDbForm = (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ gridColumn: '1/-1' }}><span style={S.lbl}>Food name *</span><input value={foodForm.food_name} onChange={e => setFoodForm(p => ({ ...p, food_name: e.target.value }))} placeholder="Paneer raw" style={S.inp} /></div>
        <div><span style={S.lbl}>Portion (g)</span><input type="number" value={foodForm.portion_g} onChange={e => setFoodForm(p => ({ ...p, portion_g: parseFloat(e.target.value) || 100 }))} style={S.inp} /></div>
        <div><span style={S.lbl}>Calories</span><input type="number" value={foodForm.calories} onChange={e => setFoodForm(p => ({ ...p, calories: parseFloat(e.target.value) || 0 }))} step=".1" style={S.inp} /></div>
        {[['Protein (g)', 'protein_g'], ['Fat (g)', 'fat_g'], ['Carbs (g)', 'carbs_g'], ['Fibre (g)', 'fibre_g']].map(([lbl, k]) => (
          <div key={k}><span style={S.lbl}>{lbl}</span><input type="number" value={foodForm[k]} onChange={e => setFoodForm(p => ({ ...p, [k]: parseFloat(e.target.value) || 0 }))} step=".1" inputMode="decimal" style={S.inp} /></div>
        ))}
        <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="isVeg" checked={foodForm.is_veg} onChange={e => setFoodForm(p => ({ ...p, is_veg: e.target.checked }))} style={{ width: 18, height: 18 }} />
          <label htmlFor="isVeg" style={{ fontSize: 14, cursor: 'pointer' }}>Vegetarian</label>
        </div>
      </div>
      <MsgBox msg={foodMsg} />
      <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
        <Btn onClick={saveFoodItem} style={{ flex: 1 }}>{editFood ? 'Save changes' : 'Add to database'}</Btn>
        <Btn variant="secondary" onClick={() => { setShowFoodModal(false); setEditFood(null) }} style={{ flex: 1 }}>Cancel</Btn>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 18 }}>
        <div style={S.h1}>Nutrition</div>
        <div style={{ fontSize: 13, color: C.gray }}>Personalised meal guide</div>
      </div>

      {isAdmin && (
        <div style={{ ...S.card, marginBottom: 14, padding: '14px 18px' }}>
          <ClientSelector clients={clients} selClientId={selClientId} setSelClientId={setSelClientId} />
        </div>
      )}

      {targets && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
          <Stat label="Calories" value={`${Number(t.calories || 0).toFixed(0)}`} sub="kcal" color="green" />
          <Stat label="Protein" value={`${Number(t.protein_g || 0).toFixed(0)}g`} color="blue" />
          <Stat label="Carbs" value={`${Number(t.carbs_g || 0).toFixed(0)}g`} />
          <Stat label="Fats" value={`${Number(t.fats_g || 0).toFixed(0)}g`} />
        </div>
      )}

      {showMealModal && <Modal title={editItem ? `Edit: ${editItem.food_name}` : 'Add food item'} onClose={() => { setShowMealModal(false); setEditItem(null) }}>{MealItemForm}</Modal>}
      {showFoodModal && <Modal title={editFood ? `Edit: ${editFood.food_name}` : 'Add to food database'} onClose={() => { setShowFoodModal(false); setEditFood(null) }}>{FoodDbForm}</Modal>}

      {/* Meal plan */}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Meal plan</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {['veg', 'non-veg'].map(dt => <Btn key={dt} variant={dietType === dt ? 'primary' : 'secondary'} small onClick={() => setDietType(dt)}>{dt}</Btn>)}
            {isAdmin && <Btn variant="green" small onClick={() => { setEditItem(null); setMealForm({ meal_number: 1, meal_name: 'MEAL 1', food_name: '', category: 'Proteins', qty_g: 100, calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, fibre_g: 0 }); setShowMealModal(true) }}>+ Add item</Btn>}
          </div>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: C.gray, fontSize: 13, background: '#fafafa', borderRadius: 9 }}>
            {isAdmin ? 'No meals added yet — click + Add item' : 'Your coach will set up your meal plan soon'}
          </div>
        ) : Object.entries(grouped).map(([mealName, items]) => (
          <div key={mealName} style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.accent, marginBottom: 8 }}>
              {mealName}
              <span style={{ fontSize: 11, color: C.gray, fontWeight: 400, marginLeft: 8 }}>
                {items.reduce((s, i) => s + (+i.calories || 0), 0).toFixed(0)} kcal · {items.reduce((s, i) => s + (+i.protein_g || 0), 0).toFixed(1)}g protein
              </span>
            </div>
            {isMobile ? (
              items.map((item, i) => (
                <div key={item.id || i} style={{ padding: 12, background: i % 2 === 0 ? '#fafafa' : '#fff', borderRadius: 10, marginBottom: 8, border: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.food_name}</div>
                      <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>{item.qty_g}g · <Badge color="blue">{item.category}</Badge></div>
                    </div>
                    {isAdmin && <div style={{ display: 'flex', gap: 6 }}><Btn variant="secondary" small onClick={() => openEditMeal(item)}>Edit</Btn><Btn variant="danger" small onClick={() => deleteMealItem(item)}>Del</Btn></div>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                    {[['Cal', `${Number(item.calories || 0).toFixed(0)}`], ['Pro', `${Number(item.protein_g || 0).toFixed(1)}g`], ['Carbs', `${Number(item.carbs_g || 0).toFixed(1)}g`], ['Fat', `${Number(item.fat_g || 0).toFixed(1)}g`], ['Fibre', `${Number(item.fibre_g || 0).toFixed(1)}g`]].map(([lbl, val]) => (
                      <div key={lbl} style={{ background: '#fff', borderRadius: 7, padding: '5px 8px', border: `1px solid ${C.border}` }}>
                        <div style={{ color: C.gray, fontSize: 10 }}>{lbl}</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead><tr>{['Category', 'Food', 'Qty', 'Cal', 'Protein', 'Carbs', 'Fat', 'Fibre', isAdmin ? 'Actions' : ''].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={item.id || i} style={{ background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                        <td style={S.td}><Badge color="blue">{item.category}</Badge></td>
                        <td style={{ ...S.td, fontWeight: 500 }}>{item.food_name}</td>
                        <td style={S.td}>{item.qty_g}g</td>
                        <td style={S.td}>{Number(item.calories || 0).toFixed(1)}</td>
                        <td style={S.td}>{Number(item.protein_g || 0).toFixed(1)}g</td>
                        <td style={S.td}>{Number(item.carbs_g || 0).toFixed(1)}g</td>
                        <td style={S.td}>{Number(item.fat_g || 0).toFixed(1)}g</td>
                        <td style={S.td}>{Number(item.fibre_g || 0).toFixed(1)}g</td>
                        {isAdmin && <td style={S.td}><div style={{ display: 'flex', gap: 5 }}><Btn variant="secondary" small onClick={() => openEditMeal(item)}>Edit</Btn><Btn variant="danger" small onClick={() => deleteMealItem(item)}>Del</Btn></div></td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Food database */}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Food database</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {isAdmin && <Btn variant="green" small onClick={() => { setEditFood(null); setFoodForm({ food_name: '', portion_g: 100, protein_g: 0, fat_g: 0, carbs_g: 0, fibre_g: 0, calories: 0, is_veg: true }); setShowFoodModal(true) }}>+ Add food</Btn>}
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ ...S.inp, width: isMobile ? '100%' : 200 }} />
          </div>
        </div>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={S.table}>
            <thead><tr>{['Food', 'Per', 'Cal', 'Pro', 'Carbs', 'Fat', isAdmin ? 'Actions' : ''].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                  <td style={{ ...S.td, fontWeight: 500, whiteSpace: 'nowrap' }}>{f.food_name}</td>
                  <td style={S.td}>{f.portion_g}g</td>
                  <td style={S.td}>{f.calories}</td>
                  <td style={S.td}>{f.protein_g}g</td>
                  <td style={S.td}>{f.carbs_g}g</td>
                  <td style={S.td}>{f.fat_g}g</td>
                  {isAdmin && <td style={S.td}><div style={{ display: 'flex', gap: 5 }}><Btn variant="secondary" small onClick={() => openEditFood(f)}>Edit</Btn><Btn variant="danger" small onClick={() => deleteFoodItem(f)}>Del</Btn></div></td>}
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
  const { clients, selClientId, setSelClientId, clientId } = useAdminClient(user, isAdmin)
  const [roadmap, setRoadmap] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editMonth, setEditMonth] = useState(null)
  const [rmForm, setRmForm] = useState({ month_number: 1, month_name: 'JANUARY', phase: '', notes: '' })
  const [formMsg, setFormMsg] = useState('')

  const isDemoMode = isDemo || clientId === 'demo' || !clientId

  const load = async () => {
    if (isDemoMode) { setRoadmap(DEMO.roadmap); return }
    const d = await sbQuery('roadmap', { eq: { client_id: clientId }, order: 'month_number', asc: true })
    setRoadmap(d || [])
  }
  useEffect(() => { if (clientId || isDemoMode) load() }, [clientId])

  const saveMonth = async () => {
    setFormMsg('')
    const payload = { month_number: parseInt(rmForm.month_number), month_name: rmForm.month_name.toUpperCase(), phase: rmForm.phase || null, notes: rmForm.notes || '' }
    try {
      if (isDemoMode) {
        if (editMonth) setRoadmap(prev => prev.map(r => r.id === editMonth.id ? { ...r, ...payload } : r))
        else setRoadmap(prev => [...prev, { id: 'r' + Date.now(), ...payload }].sort((a, b) => a.month_number - b.month_number))
      } else {
        if (editMonth) {
          await sbUpdate('roadmap', editMonth.id, payload)
        } else {
          const exists = roadmap.find(r => r.month_number === payload.month_number)
          if (exists) await sbUpdate('roadmap', exists.id, payload)
          else await sbInsert('roadmap', { ...payload, client_id: clientId })
        }
        await load()
      }
      setFormMsg('✓ Saved')
      setTimeout(() => { setShowModal(false); setEditMonth(null); setFormMsg('') }, 700)
    } catch (e) { setFormMsg(`Error: ${e.message}`) }
  }

  const clearPhase = async (r) => {
    if (!window.confirm(`Clear phase for ${r.month_name}?`)) return
    if (isDemoMode) { setRoadmap(prev => prev.map(m => m.id === r.id ? { ...m, phase: null, notes: '' } : m)); return }
    try { await sbUpdate('roadmap', r.id, { phase: null, notes: '' }); await load() } catch (e) { alert(e.message) }
  }

  const openEdit = (r) => { setEditMonth(r); setRmForm({ month_number: r.month_number, month_name: r.month_name, phase: r.phase || '', notes: r.notes || '' }); setShowModal(true) }

  const pc = p => p === 'Fat-Loss' ? { bg: '#fef3c7', text: '#92400e', e: '🔥' } : p === 'Lean Gain' ? { bg: '#dcfce7', text: '#166534', e: '📈' } : p === 'Maintenance' ? { bg: C.blueL, text: C.blue, e: '⚖️' } : { bg: '#f3f4f6', text: C.gray, e: '○' }

  const RoadmapForm = (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><span style={S.lbl}>Month (1-12)</span><input type="number" value={rmForm.month_number} onChange={e => setRmForm(p => ({ ...p, month_number: e.target.value }))} min="1" max="12" style={S.inp} /></div>
        <div><span style={S.lbl}>Month name</span><input value={rmForm.month_name} onChange={e => setRmForm(p => ({ ...p, month_name: e.target.value }))} placeholder="JANUARY" style={S.inp} /></div>
        <div style={{ gridColumn: '1/-1' }}>
          <span style={S.lbl}>Phase</span>
          <select value={rmForm.phase} onChange={e => setRmForm(p => ({ ...p, phase: e.target.value }))} style={S.inp}>
            <option value="">— No phase —</option>
            <option>Fat-Loss</option>
            <option>Lean Gain</option>
            <option>Maintenance</option>
          </select>
        </div>
        <div style={{ gridColumn: '1/-1' }}><span style={S.lbl}>Notes</span><textarea value={rmForm.notes} onChange={e => setRmForm(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="e.g. Started cut…" style={{ ...S.inp, resize: 'vertical' }} /></div>
      </div>
      <MsgBox msg={formMsg} />
      <div style={{ display: 'flex', gap: 9, marginTop: 14 }}>
        <Btn onClick={saveMonth} style={{ flex: 1 }}>{editMonth ? 'Save changes' : 'Save month'}</Btn>
        <Btn variant="secondary" onClick={() => { setShowModal(false); setEditMonth(null) }} style={{ flex: 1 }}>Cancel</Btn>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div><div style={S.h1}>2026 Roadmap</div><div style={{ fontSize: 13, color: C.gray }}>Year-long periodization</div></div>
        {isAdmin && <Btn variant="green" small onClick={() => { setEditMonth(null); setRmForm({ month_number: 1, month_name: 'JANUARY', phase: '', notes: '' }); setShowModal(true) }}>+ Edit month</Btn>}
      </div>

      {isAdmin && (
        <div style={{ ...S.card, marginBottom: 14, padding: '14px 18px' }}>
          <ClientSelector clients={clients} selClientId={selClientId} setSelClientId={setSelClientId} />
        </div>
      )}

      {showModal && <Modal title={editMonth ? `Edit: ${editMonth.month_name}` : 'Update roadmap'} onClose={() => { setShowModal(false); setEditMonth(null) }}>{RoadmapForm}</Modal>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
        {roadmap.map((m, i) => {
          const c = pc(m.phase)
          return (
            <div key={m.id || i} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.e}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{m.month_name}</div>
                  <div style={{ fontSize: 11, color: C.gray, marginTop: 1 }}>{m.phase || 'No phase'}</div>
                </div>
              </div>
              {m.phase && <span style={{ alignSelf: 'flex-start', padding: '3px 10px', borderRadius: 14, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>{m.phase}</span>}
              {m.notes && <div style={{ fontSize: 11, color: C.gray, fontStyle: 'italic' }}>{m.notes}</div>}
              {isAdmin && (
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <Btn variant="secondary" small onClick={() => openEdit(m)} style={{ flex: 1 }}>Edit</Btn>
                  {m.phase && <Btn variant="danger" small onClick={() => clearPhase(m)} style={{ flex: 1 }}>Clear phase</Btn>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
        <div style={S.card}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Phase guide</div>
          {[['Fat-Loss 🔥', 'Caloric deficit, high protein, cardio. Strip fat, preserve muscle.', '#fef3c7', '#92400e'], ['Lean Gain 📈', 'Slight surplus, progressive overload. Build muscle, minimal fat.', '#dcfce7', '#166534'], ['Maintenance ⚖️', 'Caloric balance, skill focus. Consolidate and recover.', C.blueL, C.blue]].map(([p, d, bg, tc]) => (
            <div key={p} style={{ padding: '12px', borderRadius: 10, background: bg, marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: tc, marginBottom: 3 }}>{p}</div>
              <div style={{ fontSize: 12, color: tc, opacity: .85 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Set & rep schemes</div>
          {[['5x5 1010 180s', 'Strength 1', 'Heavy compound'], ['4x4 2010 120s', 'Strength 2', 'Controlled eccentric'], ['3x9-11 3010 120s', 'Hypertrophy 1', 'Volume block'], ['2x2-Failure 3010 180s', 'Hypertrophy 2', 'Failure training']].map(([s, cat, desc]) => (
            <div key={s} style={{ padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div><div style={{ fontWeight: 500, fontSize: 13 }}>{s}</div><div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{desc}</div></div>
                <Badge color="blue">{cat}</Badge>
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
  const [sel, setSel] = useState(null)
  const [tab, setTab] = useState('clients')
  const [editForm, setEditForm] = useState({})
  const [newForm, setNewForm] = useState({ name:'', email:'', age:'', gender:'MALE', height_cm:'', start_weight:'', goal_weight:'', start_date:'', end_date:'' })
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const isMobile = useIsMobile()

  const loadClients = async () => {
    if (isDemo) { setClients(DEMO.adminClients); return }
    const data = await sbQuery('clients', { order: 'created_at', asc: false })
    setClients(data || [])
  }
  useEffect(() => { loadClients() }, [])
  useEffect(() => {
    if (isDemo) return
    const sub = supabase.channel('admin-clients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => loadClients())
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [])

  const openEdit = async (c) => {
    setSel(c)
    const form = { current_weight: c.current_weight || '', goal_weight: c.goal_weight || '', start_weight: c.start_weight || '', calories: '', protein_g: '', carbs_g: '', fats_g: '', fibre_g: '', daily_steps: '', cardio: '' }
    if (!isDemo) {
      try {
        const t = await sbQuery('weekly_targets', { eq: { client_id: c.id }, order: 'created_at', asc: false, single: true })
        if (t) Object.assign(form, { calories: t.calories || '', protein_g: t.protein_g || '', carbs_g: t.carbs_g || '', fats_g: t.fats_g || '', fibre_g: t.fibre_g || '', daily_steps: t.daily_steps || '', cardio: t.cardio || '' })
      } catch (e) {}
    }
    setEditForm(form)
  }

  const saveEdit = async () => {
    if (!sel) return
    setSaving(true)
    try {
      if (!isDemo) {
        await supabase.from('clients').update({
          current_weight: parseFloat(editForm.current_weight) || sel.current_weight,
          goal_weight: parseFloat(editForm.goal_weight) || sel.goal_weight,
          start_weight: parseFloat(editForm.start_weight) || sel.start_weight,
        }).eq('id', sel.id)
        if (editForm.calories || editForm.protein_g) {
          const { data: ex } = await supabase.from('weekly_targets').select('id').eq('client_id', sel.id).single()
          const td = { client_id: sel.id, diet_type: 'veg', calories: parseFloat(editForm.calories) || 0, protein_g: parseFloat(editForm.protein_g) || 0, carbs_g: parseFloat(editForm.carbs_g) || 0, fats_g: parseFloat(editForm.fats_g) || 0, fibre_g: parseFloat(editForm.fibre_g) || 0, daily_steps: editForm.daily_steps || '8k', cardio: editForm.cardio || 'Daily: 20min' }
          if (ex) await supabase.from('weekly_targets').update(td).eq('id', ex.id)
          else await supabase.from('weekly_targets').insert([td])
        }
      }
      await loadClients()
      setMsg('✓ Changes saved'); setSel(null); setTimeout(() => setMsg(''), 3000)
    } catch (e) { setMsg(`Error: ${e.message}`) }
    finally { setSaving(false) }
  }

  const createClient = async () => {
    setSaving(true)
    try {
      if (!isDemo) {
        await sbInsert('clients', {
          name: newForm.name.toUpperCase(), email: newForm.email,
          age: parseInt(newForm.age) || null, gender: newForm.gender,
          height_cm: parseFloat(newForm.height_cm) || null,
          start_weight: parseFloat(newForm.start_weight) || null,
          goal_weight: parseFloat(newForm.goal_weight) || null,
          current_weight: parseFloat(newForm.start_weight) || null,
          start_date: newForm.start_date || null, end_date: newForm.end_date || null,
        })
      } else {
        setClients(prev => [...prev, { id: Date.now().toString(), ...newForm, is_active: true }])
      }
      await loadClients()
      setMsg('✓ Client created! Now create their auth user in Supabase Auth.')
      setTab('clients')
      setNewForm({ name: '', email: '', age: '', gender: 'MALE', height_cm: '', start_weight: '', goal_weight: '', start_date: '', end_date: '' })
      setTimeout(() => setMsg(''), 8000)
    } catch (e) { setMsg(`Error: ${e.message}`) }
    finally { setSaving(false) }
  }

  const ClientEditForm = (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.gray, marginBottom: 10, textTransform: 'uppercase' }}>Body stats</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[['Current weight (kg)', 'current_weight'], ['Goal weight (kg)', 'goal_weight'], ['Start weight (kg)', 'start_weight']].map(([lbl, k]) => (
          <div key={k}><span style={S.lbl}>{lbl}</span><input value={editForm[k] || ''} onChange={e => setEditForm(p => ({ ...p, [k]: e.target.value }))} inputMode="decimal" placeholder={String(sel?.[k] || '')} style={S.inp} /></div>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.gray, marginBottom: 10, textTransform: 'uppercase' }}>Nutrition targets</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {[['Calories', 'calories'], ['Protein (g)', 'protein_g'], ['Carbs (g)', 'carbs_g'], ['Fats (g)', 'fats_g'], ['Fibre (g)', 'fibre_g'], ['Steps goal', 'daily_steps']].map(([lbl, k]) => (
          <div key={k}><span style={S.lbl}>{lbl}</span><input value={editForm[k] || ''} onChange={e => setEditForm(p => ({ ...p, [k]: e.target.value }))} inputMode="decimal" placeholder={lbl} style={S.inp} /></div>
        ))}
      </div>
      <div style={{ marginBottom: 14 }}><span style={S.lbl}>Cardio target</span><input value={editForm.cardio || ''} onChange={e => setEditForm(p => ({ ...p, cardio: e.target.value }))} placeholder="Daily: 20min" style={S.inp} /></div>
      <div style={{ display: 'flex', gap: 9 }}>
        <Btn onClick={saveEdit} disabled={saving} style={{ flex: 1 }}>{saving ? 'Saving…' : 'Save all changes'}</Btn>
        <Btn variant="secondary" onClick={() => setSel(null)} style={{ flex: 1 }}>Cancel</Btn>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 18 }}>
        <div style={S.h1}>Admin</div>
        <div style={{ fontSize: 13, color: C.gray }}>Manage clients · {isDemo ? 'Demo' : 'Live ✓'}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 14 }}>
        <Stat label="Total clients" value={clients.length} color="blue" />
        <Stat label="Active" value={clients.filter(c => c.is_active).length} color="green" />
      </div>
      <MsgBox msg={msg} />
      <div style={{ display: 'flex', gap: 7, margin: '14px 0' }}>
        {['clients', 'add client'].map(t => <Btn key={t} variant={tab === t ? 'primary' : 'secondary'} small onClick={() => { setTab(t); setSel(null) }} style={{ textTransform: 'capitalize' }}>{t}</Btn>)}
      </div>

      {tab === 'clients' && (
        <>
          {clients.map(c => (
            <div key={c.id} style={{ ...S.card, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>{c.email}</div>
                </div>
                <Badge color={c.is_active ? 'green' : 'red'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 12 }}>
                {[['Age', c.age || '—'], ['Current', `${c.current_weight || '—'}kg`], ['Goal', `${c.goal_weight || '—'}kg`]].map(([lbl, val]) => (
                  <div key={lbl} style={{ background: '#f9f9f9', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: C.gray, marginBottom: 2 }}>{lbl}</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{val}</div>
                  </div>
                ))}
              </div>
              <Btn variant={sel?.id === c.id ? 'danger' : 'secondary'} onClick={() => sel?.id === c.id ? setSel(null) : openEdit(c)} style={{ width: '100%' }}>
                {sel?.id === c.id ? 'Cancel editing' : 'Edit client targets'}
              </Btn>
              {sel?.id === c.id && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>{ClientEditForm}</div>
              )}
            </div>
          ))}
        </>
      )}

      {tab === 'add client' && (
        <div style={S.card}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Add new client</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            {[['Full name', 'text', 'name', 'JOHN DOE'], ['Email', 'email', 'email', 'john@email.com'], ['Age', 'number', 'age', '28'], ['Height (cm)', 'number', 'height_cm', '175'], ['Start weight (kg)', 'number', 'start_weight', '85'], ['Goal weight (kg)', 'number', 'goal_weight', '75'], ['Start date', 'date', 'start_date', ''], ['End date', 'date', 'end_date', '']].map(([lbl, type, key, ph]) => (
              <div key={key}><span style={S.lbl}>{lbl}</span><input type={type} value={newForm[key]} onChange={e => setNewForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} style={S.inp} /></div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <span style={S.lbl}>Gender</span>
            <select value={newForm.gender} onChange={e => setNewForm(p => ({ ...p, gender: e.target.value }))} style={{ ...S.inp, maxWidth: 180 }}>
              {['MALE', 'FEMALE', 'OTHER'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 9 }}>
            <Btn onClick={createClient} disabled={saving} style={{ flex: 1 }}>{saving ? 'Creating…' : 'Create client'}</Btn>
            <Btn variant="secondary" onClick={() => setTab('clients')} style={{ flex: 1 }}>Cancel</Btn>
          </div>
          <div style={{ marginTop: 14, padding: 14, background: C.blueL, borderRadius: 10, fontSize: 12, color: C.blue, lineHeight: 1.7 }}>
            <strong>After creating:</strong> Supabase → Authentication → Users → Create user → Copy UUID → Run:<br />
            <code style={{ fontSize: 11 }}>UPDATE clients SET auth_user_id='&lt;uuid&gt;' WHERE email='their@email.com';</code>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null)
  const [tab,setTab]=useState('dashboard')
  const [booting,setBooting]=useState(true)
  const isMobile=useIsMobile()

  useEffect(()=>{
    if (isDemo){setBooting(false);return}
    supabase.auth.getSession().then(async({data:{session}})=>{
      if (session) {
        try {
          const userId=session.user.id
          const { data:adminRow }=await supabase.from('admins').select('id').eq('auth_user_id',userId).single()
          if (adminRow) setUser({role:'admin',name:'Admin',email:session.user.email,userId})
          else {
            const { data:profile }=await supabase.from('clients').select('*').eq('auth_user_id',userId).single()
            if (profile) setUser({role:'client',name:profile.name,email:profile.email,userId,clientId:profile.id})
          }
        } catch(e){console.error(e)}
      }
      setBooting(false)
    })
    const { data:{subscription} }=supabase.auth.onAuthStateChange(event=>{ if(event==='SIGNED_OUT') setUser(null) })
    return ()=>subscription.unsubscribe()
  },[])

  if (booting) return <div style={{ minHeight:'100vh', background:'#0d0d0d', display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>Loading…</div></div>
  if (!user) return <Login onLogin={u=>{ setUser(u); setTab('dashboard') }}/>

  const isAdmin=user.role==='admin'
  const tabs=isAdmin
    ?[['dashboard','Clients','👥'],['workout','Workouts','🏋️'],['nutrition','Nutrition','🥗'],['roadmap','Roadmap','🗺️']]
    :[['dashboard','Home','🏠'],['weight','Weight','⚖️'],['workout','Workout','🏋️'],['nutrition','Nutrition','🥗'],['roadmap','Roadmap','🗺️']]

  const logout=async()=>{ if(!isDemo) await supabase.auth.signOut(); setUser(null) }

  const Page=()=>{
    if (tab==='dashboard') return isAdmin?<AdminPanel user={user}/>:<Dashboard user={user}/>
    if (tab==='weight'&&!isAdmin) return <WeightLogger user={user}/>
    if (tab==='workout')   return <WorkoutPage user={user} isAdmin={isAdmin}/>
    if (tab==='nutrition') return <NutritionPage user={user} isAdmin={isAdmin}/>
    if (tab==='roadmap')   return <RoadmapPage user={user} isAdmin={isAdmin}/>
    return null
  }

  if (isMobile) return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#f6f6f4', minHeight:'100vh', color:'#111' }}>
      <div style={{ background:'#0d0d0d', padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', height:52, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontSize:16, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>LEVELUP📈</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{isAdmin?'Admin':user.name?.split(' ')[0]}</span>
          <button onClick={logout} style={{ padding:'5px 10px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:11, WebkitTapHighlightColor:'transparent' }}>Out</button>
        </div>
      </div>
      <div style={{ paddingBottom:74 }}><Page/></div>
      <BottomNav tabs={tabs} tab={tab} setTab={setTab}/>
    </div>
  )

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#f6f6f4', minHeight:'100vh', color:'#111' }}>
      <nav style={{ background:'#0d0d0d', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:56, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontSize:16, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>LEVELUP📈 {isAdmin&&<span style={{ fontSize:10, fontWeight:400, color:'rgba(255,255,255,0.3)', marginLeft:6 }}>admin</span>}</div>
        <div style={{ display:'flex', gap:4 }}>
          {tabs.map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={{ padding:'6px 14px', borderRadius:7, border:'none', cursor:'pointer', fontWeight:600, fontSize:13, background:tab===id?C.accent:'transparent', color:tab===id?'#fff':'rgba(255,255,255,0.5)', WebkitTapHighlightColor:'transparent' }}>{label}</button>)}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{user.email}</span>
          <button onClick={logout} style={{ padding:'5px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:11 }}>Sign out</button>
        </div>
      </nav>
      <div style={{ maxWidth:1080, margin:'0 auto' }}><Page/></div>
    </div>
  )
}