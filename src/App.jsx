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
    { id:'w1', day_number:1, workout_type:'Legs',         exercise_name:'Leg extension',            set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:'https://youtu.be/wrU4hx4W3do' },
    { id:'w2', day_number:1, workout_type:'Legs',         exercise_name:'Smith machine calf raises',set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/1lKjFPrYqf0' },
    { id:'w3', day_number:1, workout_type:'Legs',         exercise_name:'Belt squats',              set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:'https://youtu.be/FCIZZvIM-I0' },
    { id:'w4', day_number:2, workout_type:'Push',         exercise_name:'Incline Db press',         set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:'https://youtu.be/IP4oeKh1Sd4' },
    { id:'w5', day_number:2, workout_type:'Push',         exercise_name:'Machine press flat',       set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/sreMgnjczh4' },
    { id:'w6', day_number:2, workout_type:'Push',         exercise_name:'Db lateral raises',        set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/PzsMitRdI_8' },
    { id:'w7', day_number:3, workout_type:'Pull',         exercise_name:'Cable row',                set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:null },
    { id:'w8', day_number:3, workout_type:'Pull',         exercise_name:'Lat pulldown',             set_rep:'3x9-11',      tempo:'3010', rest_seconds:120, sets:3, video_url:null },
    { id:'w9', day_number:4, workout_type:'Rest',         exercise_name:'REST DAY',                 set_rep:null,          tempo:null,   rest_seconds:null, sets:null, video_url:null },
    { id:'w10',day_number:5, workout_type:'Legs & Chest', exercise_name:'Stiff leg deadlift',       set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/CN_7cz3P-1U' },
    { id:'w11',day_number:5, workout_type:'Legs & Chest', exercise_name:'Bulgarian Split squats',   set_rep:'2x2-Failure', tempo:'3010', rest_seconds:180, sets:2, video_url:'https://youtu.be/SkNsa3eBwLA' },
  ],
  mealPlan: [
    { id:'m1', meal_number:1, meal_name:'MEAL 1', food_name:'Whey protein', category:'Proteins',      qty_g:35,  calories:131.6, protein_g:25,   fat_g:2.4,  carbs_g:2.5,  fibre_g:0 },
    { id:'m2', meal_number:1, meal_name:'MEAL 1', food_name:'Oats',         category:'Carbohydrates', qty_g:60,  calories:219.2, protein_g:7.56, fat_g:3.18, carbs_g:40.1, fibre_g:6.18 },
    { id:'m3', meal_number:2, meal_name:'MEAL 2', food_name:'Paneer raw',   category:'Proteins',      qty_g:100, calories:265.2, protein_g:18.3, fat_g:20.8, carbs_g:1.2,  fibre_g:0 },
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

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window!=='undefined' && window.innerWidth<640)
  useEffect(()=>{
    const fn=()=>setMobile(window.innerWidth<640)
    window.addEventListener('resize',fn)
    return ()=>window.removeEventListener('resize',fn)
  },[])
  return mobile
}

function useAdminClient(user, isAdmin) {
  const [clients, setClients] = useState([])
  const [selClientId, setSelClientId] = useState('')
  useEffect(()=>{
    if (!isAdmin||isDemo) return
    sbQuery('clients',{order:'name',asc:true}).then(d=>{
      const list=d||[]; setClients(list)
      if (list.length>0) setSelClientId(list[0].id)
    })
  },[isAdmin])
  const clientId = isAdmin ? selClientId : (user.clientId||'demo')
  return { clients, selClientId, setSelClientId, clientId }
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  // Brand — LevelUp gold
  orange:    '#F1C232',
  orangeD:   '#C9A000',
  orangeL:   '#FFFBE6',
  // Neutrals
  bg:        '#F7F5F0',
  surface:   '#FFFFFF',
  surfaceAlt:'#FAFAF6',
  border:    'rgba(0,0,0,0.08)',
  borderMid: 'rgba(0,0,0,0.14)',
  ink:       '#0A0A0A',
  inkMid:    '#3A3A3A',
  inkLight:  '#888880',
  // Semantic
  green:     '#1A7A4A',
  greenL:    '#EDFBF2',
  blue:      '#1A5FD4',
  blueL:     '#EBF3FF',
  red:       '#CC2B2B',
  redL:      '#FFF0F0',
  amber:     '#B45309',
  amberL:    '#FFFBEB',
  purple:    '#6D28D9',
  purpleL:   '#F5F3FF',
  // Dark nav — pitch black to match logo background
  navBg:     '#0A0A0A',
}

// Global font injection
const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.ink}; font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  input, select, textarea, button { font-family: inherit; }
  input[type=text], input[type=number], input[type=email], input[type=date], input[type=password], select, textarea { font-size: 16px !important; }
  ::selection { background: ${T.orange}; color: ${T.ink}; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(241,194,50,0.35); border-radius: 2px; }
  input[type=checkbox] { accent-color: ${T.orange}; }
`

// ─── BASE COMPONENTS ──────────────────────────────────────────────────────────

function StyleInjector() {
  useEffect(()=>{
    const el = document.createElement('style')
    el.textContent = STYLE_TAG
    document.head.appendChild(el)
    return ()=>document.head.removeChild(el)
  },[])
  return null
}

function Btn({ children, variant='primary', onClick, disabled, style={}, small, full }) {
  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
    border:'none', cursor: disabled?'not-allowed':'pointer', fontWeight:600,
    fontFamily:"'DM Sans',sans-serif",
    WebkitTapHighlightColor:'transparent', borderRadius:10, transition:'all .15s',
    padding: small ? '6px 12px' : '11px 20px',
    fontSize: small ? 12 : 14,
    width: full ? '100%' : undefined,
    opacity: disabled ? 0.45 : 1,
  }
  const variants = {
    primary:   { background: T.orange,   color: T.ink,    boxShadow:'0 2px 12px rgba(241,194,50,0.45)', fontWeight:700 },
    secondary: { background: T.surface,  color: T.ink,    border:`1.5px solid ${T.border}` },
    ghost:     { background:'transparent', color: T.inkMid, border:`1.5px solid ${T.border}` },
    danger:    { background: T.redL,     color: T.red,    border:`1.5px solid rgba(204,43,43,0.15)` },
    green:     { background: T.greenL,   color: T.green,  border:`1.5px solid rgba(26,122,74,0.15)` },
    dark:      { background: T.ink,      color:'#fff' },
  }
  return <button onClick={onClick} disabled={disabled} style={{...base,...variants[variant],...style}}>{children}</button>
}

function Badge({ children, color='orange', dot }) {
  const map = {
    orange: [T.orangeL, T.orange],
    green:  [T.greenL,  T.green],
    red:    [T.redL,    T.red],
    blue:   [T.blueL,   T.blue],
    amber:  [T.amberL,  T.amber],
    purple: [T.purpleL, T.purple],
    gray:   ['#F0F0EE',  T.inkLight],
  }
  const [bg, tc] = map[color]||map.orange
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:'0.2px', background:bg, color:tc }}>
      {dot && <span style={{ width:5, height:5, borderRadius:'50%', background:tc, flexShrink:0 }}/>}
      {children}
    </span>
  )
}

function Card({ children, style={}, onClick, hover }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={onClick}
      onMouseEnter={()=>hover&&setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:T.surface, borderRadius:18, border:`1px solid ${T.border}`, padding:'20px', marginBottom:14, cursor:onClick?'pointer':undefined, transition:'transform .2s, box-shadow .2s', transform: hov?'translateY(-2px)':'translateY(0)', boxShadow: hov?'0 8px 24px rgba(0,0,0,0.08)':'0 1px 4px rgba(0,0,0,0.04)', ...style }}>
      {children}
    </div>
  )
}

function KpiCard({ label, value, sub, color, icon }) {
  const colors = { green:[T.green,T.greenL], blue:[T.blue,T.blueL], orange:[T.orange,T.orangeL], red:[T.red,T.redL], amber:[T.amber,T.amberL], purple:[T.purple,T.purpleL] }
  const [tc, bg] = colors[color]||['#0F0F0F','#F7F5F2']
  return (
    <div style={{ background:T.surface, borderRadius:16, border:`1px solid ${T.border}`, padding:'16px', display:'flex', flexDirection:'column', gap:8 }}>
      {icon && <div style={{ width:36, height:36, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{icon}</div>}
      <div>
        <div style={{ fontSize:11, fontWeight:600, color:T.inkLight, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:4 }}>{label}</div>
        <div style={{ fontSize:24, fontWeight:700, color:tc||T.ink, fontFamily:"'Syne',sans-serif", letterSpacing:'-0.5px', lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:12, color:T.inkLight, marginTop:4 }}>{sub}</div>}
      </div>
    </div>
  )
}

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:10 }}>
      <div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, letterSpacing:'-0.5px', color:T.ink }}>{title}</h2>
        {sub && <p style={{ fontSize:13, color:T.inkLight, marginTop:3 }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

function Inp({ label, ...props }) {
  return (
    <div style={{ width:'100%', minWidth:0 }}>
      {label && <label style={{ fontSize:11, fontWeight:600, color:T.inkLight, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:6, display:'block' }}>{label}</label>}
      <input {...props} style={{ width:'100%', maxWidth:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:15, outline:'none', boxSizing:'border-box', background:T.surface, color:T.ink, transition:'border-color .15s', fontFamily:"'DM Sans',sans-serif", WebkitAppearance:'none', appearance:'none', display:'block', ...(props.style||{}) }}
        onFocus={e=>{ e.target.style.borderColor=T.orange }}
        onBlur={e=>{ e.target.style.borderColor=T.border }}
      />
    </div>
  )
}

function Sel({ label, children, ...props }) {
  return (
    <div>
      {label && <label style={{ fontSize:11, fontWeight:600, color:T.inkLight, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:6, display:'block' }}>{label}</label>}
      <select {...props} style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:15, outline:'none', boxSizing:'border-box', background:T.surface, color:T.ink, WebkitAppearance:'none', appearance:'none', fontFamily:"'DM Sans',sans-serif", ...(props.style||{}) }}>{children}</select>
    </div>
  )
}

function MsgBox({ msg }) {
  if (!msg) return null
  const err = msg.startsWith('Error')||msg.startsWith('error')
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:err?T.redL:T.greenL, borderRadius:10, fontSize:13, color:err?T.red:T.green, marginTop:12, border:`1px solid ${err?'rgba(204,43,43,0.2)':'rgba(26,122,74,0.2)'}` }}>
      <span>{err?'⚠️':'✓'}</span>{msg}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'center', animation:'fadeIn .2s' }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose() }}>
      <div style={{ background:T.surface, borderRadius:'24px 24px 0 0', padding:'24px 20px 32px', width:'100%', maxWidth:560, maxHeight:'92vh', overflowY:'auto', WebkitOverflowScrolling:'touch', boxShadow:'0 -8px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ width:36, height:4, background:T.border, borderRadius:2, margin:'0 auto 20px' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700 }}>{title}</h3>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:T.surfaceAlt, border:`1px solid ${T.border}`, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}


function Bar({ pct, color=T.orange, height=8 }) {
  return (
    <div style={{ height, background:'#EEECE9', borderRadius:99 }}>
      <div style={{ height, width:`${Math.min(100,Math.max(0,pct))}%`, background:color, borderRadius:99, transition:'width .8s cubic-bezier(.4,0,.2,1)' }}/>
    </div>
  )
}

// ─── WEIGHT CHART ─────────────────────────────────────────────────────────────
function WeightChart({ data }) {
  const [tip, setTip] = useState(null)
  const svgRef = useRef(null)
  const isMobile = useIsMobile()
  if (!data||data.length<2) return (
    <div style={{ textAlign:'center', padding:'40px 0', color:T.inkLight, fontSize:13 }}>
      <div style={{ fontSize:32, marginBottom:8 }}>📊</div>
      Log at least 2 entries to see your chart
    </div>
  )
  const sorted=[...data].sort((a,b)=>new Date(a.date)-new Date(b.date))
  const ws=sorted.map(d=>d.weight), minW=Math.min(...ws)-1.5, maxW=Math.max(...ws)+1.5
  const W=560,H=160,PL=40,PR=16,PT=16,PB=28
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
    <div style={{ touchAction:'pan-y', position:'relative' }}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`}
        style={{ overflow:'visible', display:'block', cursor:'crosshair' }}
        onMouseMove={interact} onMouseLeave={()=>setTip(null)}
        onTouchMove={interact} onTouchEnd={()=>setTimeout(()=>setTip(null),2500)}>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.orange} stopOpacity=".18"/>
            <stop offset="100%" stopColor={T.orange} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {yTicks.map((w,i)=>(
          <g key={i}>
            <line x1={PL} y1={py(w)} x2={W-PR} y2={py(w)} stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
            <text x={PL-6} y={py(w)+4} textAnchor="end" fontSize="9" fill={T.inkLight} fontFamily="DM Sans">{w.toFixed(0)}</text>
          </g>
        ))}
        <path d={area} fill="url(#cg)"/>
        <path d={line} fill="none" stroke={T.orange} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {pts.map((p,i)=>(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={tip?.date===p.date?7:4.5} fill={T.surface} stroke={T.orange} strokeWidth="2.5" style={{transition:'r .1s'}}/>
            {(i===0||i===pts.length-1||i%Math.ceil(pts.length/4)===0)&&(
              <text x={p.x} y={H-4} textAnchor="middle" fontSize={isMobile?'8':'9'} fill={T.inkLight} fontFamily="DM Sans">{p.date?.slice(5)}</text>
            )}
          </g>
        ))}
        {tip&&(
          <g>
            <line x1={tip.x} y1={PT} x2={tip.x} y2={PT+iH} stroke={T.orange} strokeWidth="1.5" strokeDasharray="4,3" strokeOpacity="0.4"/>
            <rect x={Math.min(tip.x+10,W-120)} y={tip.y-46} width={112} height={40} rx="10" fill={T.ink} fillOpacity="0.92"/>
            <text x={Math.min(tip.x+66,W-64)} y={tip.y-28} textAnchor="middle" fontSize="13" fill="#fff" fontWeight="700" fontFamily="Syne">{tip.weight} kg</text>
            <text x={Math.min(tip.x+66,W-64)} y={tip.y-12} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="DM Sans">{tip.date}</text>
          </g>
        )}
      </svg>
      <p style={{ fontSize:11, color:T.inkLight, textAlign:'center', marginTop:6 }}>{isMobile?'Tap for details':'Hover to inspect'}</p>
    </div>
  )
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ tabs, tab, setTab }) {
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:T.navBg, borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', zIndex:200, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
      {tabs.map(([id,label,icon])=>(
        <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:'10px 4px 8px', background:'transparent', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, WebkitTapHighlightColor:'transparent' }}>
          <span style={{ fontSize:20 }}>{icon}</span>
          <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.3px', color:tab===id?T.orange:'rgba(255,255,255,0.35)', transition:'color .15s' }}>{label}</span>
          {tab===id&&<div style={{ width:20, height:2.5, background:T.orange, borderRadius:99 }}/>}
        </button>
      ))}
    </div>
  )
}

// ─── CLIENT SELECTOR ──────────────────────────────────────────────────────────
function ClientSelector({ clients, selClientId, setSelClientId }) {
  if (!clients.length) return null
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
      <span style={{ fontSize:12, fontWeight:600, color:T.inkLight, textTransform:'uppercase', letterSpacing:'0.6px' }}>Client</span>
      <select value={selClientId} onChange={e=>setSelClientId(e.target.value)}
        style={{ padding:'8px 14px', borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontWeight:500, background:T.surface, color:T.ink, outline:'none', WebkitAppearance:'none', appearance:'none', fontFamily:"'DM Sans',sans-serif", minWidth:200 }}>
        {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
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
        else setErr('Demo: admin@levelup.com / admin123, or any client credentials')
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
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', fontFamily:"'DM Sans',sans-serif" }}>
      {/* Left panel — branding */}
      <div style={{ flex:1, display:'none', background:'linear-gradient(135deg,#1a1a1a 0%,#0c0c0c 100%)', padding:60, flexDirection:'column', justifyContent:'space-between', minWidth:420 }} className="login-left">
        <div><img src="/logo.jpeg" alt="LevelUp Coaching" style={{ height:56, width:"auto", objectFit:"contain", display:"block" }}/></div>
        <div>
          <div style={{ fontSize:48, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", lineHeight:1.1, letterSpacing:'-2px', marginBottom:20 }}>
            Train smarter.<br/><span style={{ color:T.orange }}>Level up.</span>
          </div>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>
            Your personalised coaching portal — workouts, nutrition, and progress tracking in one place.
          </p>
        </div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>© 2026 LevelUp Coaching</div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', minWidth:0 }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          {/* Logo (mobile) */}
          <div style={{ marginBottom:36, display:"flex", justifyContent:"center" }}><img src="/logo.jpeg" alt="LevelUp Coaching" style={{ height:56, width:"auto", objectFit:"contain", display:"block" }}/></div>

          <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:20, padding:'32px 28px', border:'1px solid rgba(255,255,255,0.07)' }}>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:'#fff', marginBottom:6 }}>Sign in</h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:24 }}>
              {isDemo ? 'Running in demo mode' : 'Welcome back to your portal'}
            </p>

            {/* Mode toggle */}
            <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', borderRadius:12, padding:4, marginBottom:24, gap:4 }}>
              {['client','admin'].map(m=>(
                <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:'9px', borderRadius:9, border:'none', cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'DM Sans',sans-serif", background:mode===m?T.orange:'transparent', color:mode===m?'#fff':'rgba(255,255,255,0.35)', textTransform:'capitalize', transition:'all .2s', WebkitTapHighlightColor:'transparent' }}>{m}</button>
              ))}
            </div>

            <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[['Email','email',email,setEmail,'you@email.com'],['Password','password',pass,setPass,'••••••••']].map(([lbl,type,val,set,ph])=>(
                <div key={lbl}>
                  <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.6px', display:'block', marginBottom:7 }}>{lbl}</label>
                  <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} required
                    style={{ width:'100%', padding:'12px 16px', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:16, outline:'none', fontFamily:"'DM Sans',sans-serif", transition:'border-color .15s', boxSizing:'border-box' }}
                    onFocus={e=>e.target.style.borderColor=T.orange} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.08)'}
                  />
                </div>
              ))}
              {err && <div style={{ padding:'10px 14px', background:'rgba(204,43,43,0.12)', borderRadius:10, fontSize:13, color:'#ff8080', border:'1px solid rgba(204,43,43,0.2)' }}>⚠️ {err}</div>}
              <button type="submit" disabled={loading} style={{ padding:'13px', borderRadius:12, border:'none', cursor:loading?'wait':'pointer', fontSize:15, background: loading?'rgba(241,194,50,0.5)':T.orange, color:T.ink, fontFamily:"'DM Sans',sans-serif", fontWeight:800, boxShadow:'0 4px 20px rgba(241,194,50,0.4)', transition:'all .2s', marginTop:4 }}>
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>

            {isDemo && (
              <div style={{ marginTop:20, padding:'12px 14px', background:'rgba(255,255,255,0.04)', borderRadius:10, fontSize:12, color:'rgba(255,255,255,0.3)', lineHeight:1.7 }}>
                Demo — Admin: <span style={{ color:'rgba(255,255,255,0.5)' }}>admin@levelup.com / admin123</span><br/>
                Client: any email + any password
              </div>
            )}
          </div>
        </div>
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
      if (isDemo||user.clientId==='demo'){setClient(DEMO.client);setLogs(DEMO.weightLogs);setTargets(DEMO.targets)}
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

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'50vh', color:T.inkLight, fontSize:14 }}>Loading your data…</div>
  if (!client) return null

  const latest=logs.length?logs[logs.length-1]:{weight:client.current_weight,bmi:null}
  const loss=((client.start_weight||0)-(latest.weight||0)).toFixed(1)
  const pct=Math.max(0,Math.min(100,((client.start_weight-latest.weight)/(client.start_weight-client.goal_weight))*100))
  const weeks=Math.max(0,Math.floor((new Date()-new Date(client.start_date))/(7*864e5)))
  const bmi=latest.bmi||(latest.weight/((client.height_cm/100)**2)).toFixed(1)

  return (
    <div style={{ padding: isMobile?'20px 16px 24px':'28px 24px', maxWidth:1080, margin:'0 auto' }}>

      {/* Hero header */}
      <div style={{ background:`linear-gradient(135deg, #0A0A0A 0%, #1A1400 100%)`, borderRadius:20, padding: isMobile?'20px':'28px 32px', marginBottom:20, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-20, right:-20, width:140, height:140, borderRadius:'50%', background:T.orange, opacity:.08 }}/>
        <div style={{ position:'absolute', bottom:-30, right:60, width:80, height:80, borderRadius:'50%', background:T.orange, opacity:.06 }}/>
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
            <div>
              <p style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:6 }}>Welcome back</p>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize: isMobile?26:34, fontWeight:800, color:'#fff', letterSpacing:'-1px', lineHeight:1, marginBottom:8 }}>{client.name}</h1>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 14px', fontSize:13, color:'rgba(255,255,255,0.45)' }}>
                <span>Age {client.age}</span><span>·</span><span>{client.gender}</span><span>·</span><span>{client.height_cm}cm</span><span>·</span><span>BMI {bmi}</span>
              </div>
            </div>
            <div style={{ textAlign: isMobile?'left':'right' }}>
              <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:4 }}>Program week</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:42, fontWeight:800, color:T.orange, lineHeight:1 }}>{weeks}</div>
            </div>
          </div>

          {/* Progress bar inside hero */}
          <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:8 }}>
              <span>Fat loss journey</span>
              <span style={{ color:T.orange, fontWeight:600 }}>{pct.toFixed(1)}% complete</span>
            </div>
            <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:99 }}>
              <div style={{ height:6, width:`${pct}%`, background:`linear-gradient(90deg,${T.orange},#FFD84D)`, borderRadius:99, transition:'width 1s cubic-bezier(.4,0,.2,1)', boxShadow:'0 0 12px rgba(255,92,0,0.5)' }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:6 }}>
              <span>Start {client.start_weight}kg</span><span>Now {latest.weight}kg</span><span>Goal {client.goal_weight}kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <KpiCard label="Start weight" value={`${client.start_weight}`} sub="kg" icon="⚖️"/>
        <KpiCard label="Current" value={`${latest.weight}`} sub="kg" color="blue" icon="📍"/>
        <KpiCard label="Goal weight" value={`${client.goal_weight}`} sub="kg" color="green" icon="🎯"/>
        <KpiCard label="Lost so far" value={`${loss}`} sub="kg" color={parseFloat(loss)>0?'orange':'red'} icon="📉"/>
      </div>

      {/* Daily Targets */}
      <DailyTargets user={user} targets={targets}/>

      {/* Chart */}
      <Card style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, marginBottom:2 }}>Weight trend</h3>
            <p style={{ fontSize:12, color:T.inkLight }}>{logs.length} data points</p>
          </div>
          <Badge color="orange" dot>{pct.toFixed(0)}% to goal</Badge>
        </div>
        <WeightChart data={logs}/>
      </Card>

      {/* Macros + Info */}
      {targets && (
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:14 }}>
          <Card>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, marginBottom:16 }}>Daily targets</h3>
            {[
              ['Calories',`${Number(targets.calories).toFixed(0)} kcal`,T.orange,85],
              ['Protein', `${Number(targets.protein_g).toFixed(0)}g`,  T.blue,  Number(targets.protein_g)/2],
              ['Carbs',   `${Number(targets.carbs_g).toFixed(0)}g`,    T.green, Number(targets.carbs_g)/3],
              ['Fats',    `${Number(targets.fats_g).toFixed(0)}g`,     T.amber, Number(targets.fats_g)/1.5],
              ['Fibre',   `${Number(targets.fibre_g).toFixed(1)}g`,    T.purple,Number(targets.fibre_g)*3],
            ].map(([lbl,val,clr,pct2])=>(
              <div key={lbl} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:clr }}/>
                    <span style={{ fontSize:13, fontWeight:500 }}>{lbl}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:clr }}>{val}</span>
                </div>
                <Bar pct={Math.min(100,pct2)} color={clr} height={5}/>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, marginBottom:16 }}>Program details</h3>
            {[
              ['🚶 Daily steps', targets.daily_steps],
              ['🏃 Cardio',      targets.cardio],
              ['🥗 Diet type',   targets.diet_type?.toUpperCase()],
              ['📅 Start date',  client.start_date],
              ['🏁 End date',    client.end_date],
              ['📆 Join date',   client.join_date],
            ].map(([lbl,val])=>(
              <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${T.border}`, fontSize:13 }}>
                <span style={{ color:T.inkMid }}>{lbl}</span>
                <span style={{ fontWeight:600 }}>{val||'—'}</span>
              </div>
            ))}
          </Card>
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
      setMsg(`✓ Logged ${w} ${unit}`); setWt(''); setTimeout(()=>setMsg(''),3000)
    } catch(e){setMsg(`Error: ${e.message}`)} finally{setSaving(false)}
  }
  const deleteLog=async(id)=>{
    if (!window.confirm('Delete this entry?')) return
    if (isDemo||clientId==='demo'){setLogs(prev=>prev.filter(l=>l.id!==id));return}
    try { await sbDelete('weight_logs',id); load() } catch(e){setMsg(`Error: ${e.message}`)}
  }
  const sorted=[...logs].sort((a,b)=>new Date(b.date)-new Date(a.date))

  return (
    <div style={{ padding:'20px 16px 24px', maxWidth:1080, margin:'0 auto' }}>
      <SectionHeader title="Weight log" sub={`${logs.length} entries tracked`}/>
      <Card>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, marginBottom:16 }}>Log today's weight</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:0 }}>
          <Inp label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ WebkitAppearance:'none', appearance:'none', width:'100%', boxSizing:'border-box' }}/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 84px', gap:12, alignItems:'flex-end' }}>
            <Inp label="Weight" type="number" value={wt} onChange={e=>setWt(e.target.value)} placeholder="92.5" step=".1" inputMode="decimal"/>
            <Sel label="Unit" value={unit} onChange={e=>setUnit(e.target.value)}>
              <option>Kg</option><option>Lbs</option>
            </Sel>
          </div>
        </div>

        <Btn onClick={addLog} disabled={saving} style={{ marginTop:12, width:'100%', padding:'12px' }}>{saving?'Saving…':'Log weight →'}</Btn>
        <MsgBox msg={msg}/>
      </Card>

      <Card>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, marginBottom:16 }}>History</h3>
        <WeightChart data={[...logs].sort((a,b)=>new Date(a.date)-new Date(b.date))}/>
        <div style={{ marginTop:20, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${T.border}` }}>
                {['Date','Weight','BMI','Change',''].map(h=><th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:11, fontWeight:700, color:T.inkLight, textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {sorted.map((l,i)=>{
                const prev=sorted[i+1], chg=prev?+(l.weight-prev.weight).toFixed(2):null
                return (
                  <tr key={l.id} style={{ borderBottom:`1px solid ${T.border}`, background:i%2===0?T.surfaceAlt:T.surface }}>
                    <td style={{ padding:'11px 12px', fontSize:13, color:T.inkMid }}>{l.date}</td>
                    <td style={{ padding:'11px 12px', fontSize:14, fontWeight:700, fontFamily:"'Syne',sans-serif" }}>{l.weight} <span style={{ fontSize:11, fontWeight:400, color:T.inkLight }}>{l.unit}</span></td>
                    <td style={{ padding:'11px 12px', fontSize:13, color:T.inkMid }}>{l.bmi||'—'}</td>
                    <td style={{ padding:'11px 12px' }}>{chg!=null&&<Badge color={chg<0?'green':chg>0?'red':'gray'}>{chg>0?'+':''}{chg}</Badge>}</td>
                    <td style={{ padding:'11px 12px' }}><Btn variant="danger" small onClick={()=>deleteLog(l.id)}>✕</Btn></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}


// ─── DAILY TARGETS ────────────────────────────────────────────────────────────
function DailyTargets({ user, targets }) {
  const today = new Date().toISOString().split('T')[0]
  const [checkin, setCheckin] = useState(null)
  const [saving, setSaving] = useState(false)
  const clientId = user.clientId || 'demo'
  const isDemoMode = isDemo || clientId === 'demo'

  const load = async () => {
    if (isDemoMode) {
      setCheckin({ steps_done:false, workout_done:false, cardio_done:false, meals_done:false })
      return
    }
    try {
      const { data } = await supabase.from('daily_checkins').select('*').eq('client_id', clientId).eq('date', today).single()
      setCheckin(data || { steps_done:false, workout_done:false, cardio_done:false, meals_done:false })
    } catch { setCheckin({ steps_done:false, workout_done:false, cardio_done:false, meals_done:false }) }
  }

  useEffect(() => { load() }, [clientId])

  useEffect(() => {
    if (isDemoMode) return
    const sub = supabase.channel('checkin-' + clientId)
      .on('postgres_changes', { event:'*', schema:'public', table:'daily_checkins', filter:`client_id=eq.${clientId}` }, () => load())
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [clientId])

  const toggle = async (field) => {
    if (!checkin) return
    const newVal = !checkin[field]
    const updated = { ...checkin, [field]: newVal }
    setCheckin(updated)
    if (isDemoMode) return
    setSaving(field)
    try {
      const { data: existing } = await supabase.from('daily_checkins').select('id').eq('client_id', clientId).eq('date', today).single()
      if (existing) {
        await supabase.from('daily_checkins').update({ [field]: newVal, updated_at: new Date().toISOString() }).eq('id', existing.id)
      } else {
        await supabase.from('daily_checkins').insert([{ client_id: clientId, date: today, ...updated }])
      }
    } catch(e) { console.error(e) }
    finally { setSaving('') }
  }

  const done = checkin ? [checkin.steps_done, checkin.workout_done, checkin.cardio_done, checkin.meals_done].filter(Boolean).length : 0
  const total = 4
  const pct = (done / total) * 100

  const items = [
    { key:'steps_done',   icon:'🚶', label:'Daily steps',   sub: targets?.daily_steps || '8k steps',   color:'blue' },
    { key:'workout_done', icon:'🏋️', label:'Workout',       sub:'Complete today\'s session',           color:'orange' },
    { key:'cardio_done',  icon:'🏃', label:'Cardio',         sub: targets?.cardio || 'Daily: 20min',   color:'green' },
    { key:'meals_done',   icon:'🥗', label:'Meals on track', sub:'Hit your macro targets',             color:'purple' },
  ]

  const colorMap = { blue:[T.blueL,T.blue], orange:[T.orangeL,T.orange], green:[T.greenL,T.green], purple:[T.purpleL,T.purple] }

  return (
    <Card style={{ marginBottom:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <div>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, marginBottom:2 }}>Daily targets 🎯</h3>
          <p style={{ fontSize:12, color:T.inkLight }}>{new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</p>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color: done===total ? T.green : T.orange }}>{done}/{total}</div>
          <div style={{ fontSize:11, color:T.inkLight }}>completed</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom:16 }}>
        <Bar pct={pct} color={done===total ? T.green : T.orange} height={6}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {items.map(item => {
          const isDone = checkin?.[item.key] || false
          const [bgC, tc] = colorMap[item.color]
          const isSaving = saving === item.key
          return (
            <button key={item.key} onClick={() => toggle(item.key)} disabled={isSaving}
              style={{ background: isDone ? bgC : T.surfaceAlt, border:`2px solid ${isDone ? tc : T.border}`, borderRadius:14, padding:'14px 12px', cursor:'pointer', textAlign:'left', transition:'all .2s', WebkitTapHighlightColor:'transparent', opacity: isSaving ? 0.6 : 1, position:'relative', overflow:'hidden' }}>
              {isDone && <div style={{ position:'absolute', top:0, right:0, width:0, height:0, borderLeft:'32px solid transparent', borderTop:`32px solid ${tc}`, opacity:0.15 }}/>}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <span style={{ fontSize:26 }}>{item.icon}</span>
                <div style={{ width:22, height:22, borderRadius:'50%', border:`2px solid ${isDone ? tc : T.border}`, background: isDone ? tc : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s', flexShrink:0 }}>
                  {isDone && <span style={{ color:'#fff', fontSize:12, fontWeight:700 }}>✓</span>}
                </div>
              </div>
              <div style={{ fontWeight:700, fontSize:13, color: isDone ? tc : T.ink, marginBottom:3 }}>{item.label}</div>
              <div style={{ fontSize:11, color: isDone ? tc : T.inkLight, opacity: isDone ? 0.8 : 1 }}>{item.sub}</div>
            </button>
          )
        })}
      </div>

      {done === total && (
        <div style={{ marginTop:14, padding:'12px 16px', background:T.greenL, borderRadius:12, border:`1px solid rgba(26,122,74,0.2)`, textAlign:'center', fontSize:14, fontWeight:600, color:T.green }}>
          🎉 All targets completed for today!
        </div>
      )}
    </Card>
  )
}

// ─── WORKOUT PAGE ─────────────────────────────────────────────────────────────
function WorkoutPage({ user, isAdmin }) {
  const { clients, selClientId, setSelClientId, clientId } = useAdminClient(user, isAdmin)
  const [program, setProgram] = useState([])
  const [logs, setLogs] = useState([])           // today's logs
  const [lastLogs, setLastLogs] = useState([])   // previous session logs for comparison
  const [dayIdx, setDayIdx] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [inputs, setInputs] = useState({})
  const [saving, setSaving] = useState('')
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editEx, setEditEx] = useState(null)
  const [exForm, setExForm] = useState({ day_number:1, workout_type:'Legs', exercise_name:'', set_rep:'', tempo:'3010', rest_seconds:120, sets:3, video_url:'' })
  const [formMsg, setFormMsg] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  const [loggedDates, setLoggedDates] = useState([]) // dates that have logs
  const isMobile = useIsMobile()
  const isDemoMode = isDemo || clientId === 'demo' || !clientId

  const load = async () => {
    if (isDemoMode) { setProgram(DEMO.workoutProgram); return }
    const d = await sbQuery('workout_programs', { eq:{ client_id:clientId }, order:'day_number', asc:true })
    setProgram(d || [])
  }

  const loadLogs = async () => {
    if (isDemoMode) return
    // Load logs for selected date
    const { data } = await supabase.from('workout_logs').select('*')
      .eq('client_id', clientId).eq('workout_date', selectedDate)
    setLogs(data || [])
    // Get all dates that have logs (for calendar dots)
    const { data: dates } = await supabase.from('workout_logs').select('workout_date')
      .eq('client_id', clientId)
    const unique = [...new Set((dates||[]).map(d => d.workout_date))]
    setLoggedDates(unique)
  }

  const loadLastSession = async (dayNum) => {
    if (isDemoMode) return
    // Find the most recent previous date for this day number
    const { data } = await supabase.from('workout_logs').select('*')
      .eq('client_id', clientId).eq('day_number', dayNum)
      .lt('workout_date', selectedDate)
      .order('workout_date', { ascending: false })
      .limit(50)
    setLastLogs(data || [])
  }

  useEffect(() => { if (clientId) load() }, [clientId])
  useEffect(() => { if (clientId) loadLogs() }, [clientId, selectedDate])

  const days = [...new Set(program.map(p => p.day_number))].sort((a,b)=>a-b)
  const selDay = days[dayIdx] || 1
  const dayExs = program.filter(p => p.day_number === selDay)
  const dayType = dayExs[0]?.workout_type || ''

  useEffect(() => { if (clientId && selDay) loadLastSession(selDay) }, [clientId, selDay, selectedDate])

  const getLog = (exName, setNum) => logs.find(l => l.exercise_name === exName && l.set_number === setNum && l.day_number === selDay)
  const getLastLog = (exName, setNum) => {
    if (!lastLogs.length) return null
    // Get the most recent date's log for this exercise+set
    const matches = lastLogs.filter(l => l.exercise_name === exName && l.set_number === setNum && l.day_number === selDay)
    if (!matches.length) return null
    // Most recent date
    const latestDate = matches.sort((a,b) => new Date(b.workout_date) - new Date(a.workout_date))[0].workout_date
    return matches.find(l => l.workout_date === latestDate)
  }
  const getLastSessionDate = (exName) => {
    const matches = lastLogs.filter(l => l.exercise_name === exName && l.day_number === selDay)
    if (!matches.length) return null
    return matches.sort((a,b) => new Date(b.workout_date) - new Date(a.workout_date))[0]?.workout_date
  }

  const logSet = async (exName, setNum) => {
    const key = `${exName}_${setNum}`, inp = inputs[key] || {}
    if (!inp.reps && !inp.weight) return
    setSaving(key)
    try {
      const entry = { client_id:clientId, week:1, day_number:selDay, exercise_name:exName, set_number:setNum, reps:parseInt(inp.reps)||0, weight_kg:parseFloat(inp.weight)||0, workout_date:selectedDate }
      if (isDemoMode) setLogs(prev => [...prev, { id:Date.now(), ...entry }])
      else { const saved = await sbInsert('workout_logs', entry); setLogs(prev => [...prev, saved]) }
      setInputs(prev => ({ ...prev, [key]:{ reps:'', weight:'' } }))
      await loadLogs()
    } catch(e) { console.error(e) }
    finally { setSaving('') }
  }

  const deleteLog = async (logId) => {
    if (isDemoMode) { setLogs(prev => prev.filter(l => l.id !== logId)); return }
    try { await sbDelete('workout_logs', logId); await loadLogs() } catch(e) { alert(e.message) }
  }

  const saveExercise = async () => {
    setFormMsg(''); if (!exForm.exercise_name) { setFormMsg('Error: Name required'); return }
    try {
      if (isDemoMode) {
        if (editEx) setProgram(prev => prev.map(p => p.id===editEx.id ? {...p,...exForm} : p))
        else setProgram(prev => [...prev, { id:'w'+Date.now(), ...exForm, client_id:clientId }])
      } else {
        if (editEx) await sbUpdate('workout_programs', editEx.id, exForm)
        else await sbInsert('workout_programs', { ...exForm, client_id:clientId })
        await load()
      }
      setFormMsg('✓ Saved'); setTimeout(() => { setShowAddModal(false); setEditEx(null); setFormMsg('') }, 700)
      setExForm({ day_number:1, workout_type:'Legs', exercise_name:'', set_rep:'', tempo:'3010', rest_seconds:120, sets:3, video_url:'' })
    } catch(e) { setFormMsg(`Error: ${e.message}`) }
  }

  const deleteExercise = async (ex) => {
    if (!window.confirm(`Delete "${ex.exercise_name}"?`)) return
    if (isDemoMode) { setProgram(prev => prev.filter(p => p.id!==ex.id)); return }
    try { await sbDelete('workout_programs', ex.id); await load() } catch(e) { alert(e.message) }
  }

  const openEditEx = (ex) => {
    setEditEx(ex)
    setExForm({ day_number:ex.day_number, workout_type:ex.workout_type, exercise_name:ex.exercise_name, set_rep:ex.set_rep||'', tempo:ex.tempo||'3010', rest_seconds:ex.rest_seconds||120, sets:ex.sets||3, video_url:ex.video_url||'' })
    setShowAddModal(true)
  }

  // Calendar mini component
  const CalendarPicker = () => {
    const [viewMonth, setViewMonth] = useState(new Date(selectedDate))
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month+1, 0).getDate()
    const monthName = viewMonth.toLocaleDateString('en-US', { month:'long', year:'numeric' })
    const today = new Date().toISOString().split('T')[0]
    const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
      if (i < firstDay) return null
      const day = i - firstDay + 1
      return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    })
    return (
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:16, marginBottom:14, boxShadow:'0 8px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <button onClick={() => setViewMonth(new Date(year, month-1))} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:T.inkMid, padding:'4px 8px' }}>←</button>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15 }}>{monthName}</span>
          <button onClick={() => setViewMonth(new Date(year, month+1))} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:T.inkMid, padding:'4px 8px' }}>→</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:6 }}>
          {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:T.inkLight, padding:'2px 0' }}>{d}</div>)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {cells.map((date, i) => {
            if (!date) return <div key={i}/>
            const isSelected = date === selectedDate
            const isToday = date === today
            const hasLog = loggedDates.includes(date)
            const isFuture = date > today
            return (
              <button key={date} onClick={() => { if (!isFuture) { setSelectedDate(date); setShowCalendar(false) } }}
                style={{ position:'relative', padding:'8px 2px', borderRadius:8, border:'none', cursor: isFuture?'default':'pointer', background: isSelected?T.orange:isToday?T.orangeL:'transparent', color: isSelected?T.ink:isFuture?T.border:T.ink, fontWeight: isSelected||isToday?700:400, fontSize:13, WebkitTapHighlightColor:'transparent', opacity: isFuture?0.3:1 }}>
                {String(new Date(date+'T12:00:00').getDate())}
                {hasLog && !isSelected && <div style={{ position:'absolute', bottom:2, left:'50%', transform:'translateX(-50%)', width:4, height:4, borderRadius:'50%', background:T.orange }}/>}
              </button>
            )
          })}
        </div>
        <div style={{ marginTop:12, display:'flex', gap:12, fontSize:11, color:T.inkLight }}>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:'50%', background:T.orange, display:'inline-block' }}/> Logged</span>
          <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:T.orangeL, border:`1px solid ${T.orange}`, display:'inline-block' }}/> Today</span>
        </div>
      </div>
    )
  }

  const ExForm = (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <Inp label="Day number" type="number" value={exForm.day_number} onChange={e=>setExForm(p=>({...p,day_number:parseInt(e.target.value)||1}))} min="1" max="7"/>
        <Inp label="Workout type" value={exForm.workout_type} onChange={e=>setExForm(p=>({...p,workout_type:e.target.value}))} placeholder="Legs, Push…"/>
      </div>
      <Inp label="Exercise name *" value={exForm.exercise_name} onChange={e=>setExForm(p=>({...p,exercise_name:e.target.value}))} placeholder="Incline Db press"/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <Inp label="Set & Rep" value={exForm.set_rep} onChange={e=>setExForm(p=>({...p,set_rep:e.target.value}))} placeholder="3x9-11"/>
        <Inp label="Tempo" value={exForm.tempo} onChange={e=>setExForm(p=>({...p,tempo:e.target.value}))} placeholder="3010"/>
        <Inp label="Rest (sec)" type="number" value={exForm.rest_seconds} onChange={e=>setExForm(p=>({...p,rest_seconds:parseInt(e.target.value)||120}))}/>
        <Inp label="Sets" type="number" value={exForm.sets} onChange={e=>setExForm(p=>({...p,sets:parseInt(e.target.value)||3}))}/>
      </div>
      <Inp label="Video URL" value={exForm.video_url} onChange={e=>setExForm(p=>({...p,video_url:e.target.value}))} placeholder="https://youtu.be/…"/>
      <MsgBox msg={formMsg}/>
      <div style={{ display:'flex', gap:9, marginTop:4 }}>
        <Btn onClick={saveExercise} full>{editEx?'Save changes':'Add exercise'}</Btn>
        <Btn variant="ghost" onClick={() => { setShowAddModal(false); setEditEx(null) }} full>Cancel</Btn>
      </div>
    </div>
  )

  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  const displayDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' })

  return (
    <div style={{ padding:'20px 16px 24px', maxWidth:1080, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, letterSpacing:'-0.5px' }}>Workout</h2>
          <p style={{ fontSize:13, color:T.inkLight }}>Log your sets & track progress</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          {isAdmin && <ClientSelector clients={clients} selClientId={selClientId} setSelClientId={setSelClientId}/>}
          {isAdmin && <Btn variant="green" small onClick={() => { setEditEx(null); setShowAddModal(true) }}>+ Add</Btn>}
        </div>
      </div>

      {/* Date picker row */}
      <div style={{ marginBottom:14 }}>
        <button onClick={() => setShowCalendar(!showCalendar)}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:T.surface, border:`1.5px solid ${showCalendar ? T.orange : T.border}`, borderRadius:12, cursor:'pointer', width:'100%', WebkitTapHighlightColor:'transparent', transition:'border-color .2s' }}>
          <span style={{ fontSize:20 }}>📅</span>
          <div style={{ flex:1, textAlign:'left' }}>
            <div style={{ fontWeight:700, fontSize:14, fontFamily:"'Syne',sans-serif", color: isToday ? T.orange : T.ink }}>
              {isToday ? 'Today' : displayDate}
            </div>
            {!isToday && <div style={{ fontSize:11, color:T.inkLight }}>{displayDate}</div>}
          </div>
          {loggedDates.includes(selectedDate) && <Badge color="green" dot>Logged</Badge>}
          <span style={{ color:T.orange, fontSize:12, fontWeight:600 }}>{showCalendar ? '▲' : '▼'}</span>
        </button>
        {showCalendar && <div style={{ marginTop:8 }}><CalendarPicker/></div>}
      </div>

      {/* Day selector */}
      {isMobile ? (
        <div style={{ marginBottom:14 }}>
          <button onClick={() => setShowDayPicker(!showDayPicker)}
            style={{ width:'100%', padding:'12px 16px', background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:12, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', fontSize:14, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
            <span>Day {selDay} — {dayType}</span>
            <span style={{ color:T.orange }}>{showDayPicker ? '▲' : '▼'}</span>
          </button>
          {showDayPicker && (
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, marginTop:6, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.1)' }}>
              {days.map((d,i) => { const t = program.find(p=>p.day_number===d)?.workout_type||''; return (
                <button key={d} onClick={() => { setDayIdx(i); setShowDayPicker(false) }}
                  style={{ width:'100%', padding:'13px 16px', background:dayIdx===i?T.orange:T.surface, border:'none', borderBottom:`1px solid ${T.border}`, textAlign:'left', cursor:'pointer', fontSize:14, color:dayIdx===i?T.ink:T.ink, fontWeight:dayIdx===i?700:400, fontFamily:"'DM Sans',sans-serif" }}>
                  Day {d} — {t}
                </button>
              )})}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display:'flex', gap:6, marginBottom:18, flexWrap:'wrap' }}>
          {days.map((d,i) => { const t = program.find(p=>p.day_number===d)?.workout_type||''; return (
            <button key={d} onClick={() => setDayIdx(i)}
              style={{ padding:'8px 16px', borderRadius:20, border:`1.5px solid ${dayIdx===i?T.orange:T.border}`, background:dayIdx===i?T.orange:T.surface, color:dayIdx===i?T.ink:T.inkMid, fontWeight:600, fontSize:13, cursor:'pointer', transition:'all .2s', fontFamily:"'DM Sans',sans-serif" }}>
              Day {d} · {t}
            </button>
          )})}
        </div>
      )}

      {showAddModal && <Modal title={editEx?`Edit: ${editEx.exercise_name}`:'Add exercise'} onClose={() => { setShowAddModal(false); setEditEx(null) }}>{ExForm}</Modal>}

      {dayType === 'Rest' ? (
        <Card style={{ textAlign:'center', padding:'60px 24px', background:`linear-gradient(135deg,${T.surfaceAlt},${T.surface})` }}>
          <div style={{ fontSize:52, marginBottom:12 }}>😴</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, marginBottom:8 }}>Rest & Recovery</h2>
          <p style={{ color:T.inkLight, fontSize:14 }}>Sleep well, hydrate, light stretching only</p>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {dayExs.map((ex, i) => {
            const lastDate = getLastSessionDate(ex.exercise_name)
            return (
              <Card key={ex.id||i} style={{ padding:'18px 20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, gap:10 }}>
                  <div style={{ flex:1 }}>
                    <h4 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, marginBottom:6 }}>{ex.exercise_name}</h4>
                    <div style={{ display:'flex', gap:7, flexWrap:'wrap', alignItems:'center' }}>
                      <Badge color="blue">{ex.set_rep}</Badge>
                      <Badge color="amber">{ex.tempo}</Badge>
                      {ex.rest_seconds && <Badge color="gray">Rest {ex.rest_seconds}s</Badge>}
                      {ex.video_url && <a href={ex.video_url} target="_blank" rel="noreferrer" style={{ fontSize:11, color:T.orange, textDecoration:'none', fontWeight:600, padding:'3px 9px', background:T.orangeL, borderRadius:20 }}>▶ Watch</a>}
                    </div>
                    {lastDate && (
                      <div style={{ marginTop:7, fontSize:11, color:T.inkLight, display:'flex', alignItems:'center', gap:5 }}>
                        <span>🕐</span> Last session: {new Date(lastDate+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                      <Btn variant="ghost" small onClick={() => openEditEx(ex)}>Edit</Btn>
                      <Btn variant="danger" small onClick={() => deleteExercise(ex)}>✕</Btn>
                    </div>
                  )}
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {Array.from({ length:ex.sets||2 }, (_,si) => {
                    const setNum = si+1
                    const key = `${ex.exercise_name}_${setNum}`
                    const done = getLog(ex.exercise_name, setNum)
                    const last = getLastLog(ex.exercise_name, setNum)

                    return (
                      <div key={si} style={{ borderRadius:12, border:`1.5px solid ${done ? 'rgba(26,122,74,0.25)' : T.border}`, background: done ? T.greenL : T.surfaceAlt, overflow:'hidden' }}>
                        {/* Set header with last session reference */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', borderBottom: done || last ? `1px solid ${done?'rgba(26,122,74,0.15)':T.border}` : 'none' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:24, height:24, borderRadius:'50%', background: done?T.green:T.border, color: done?'#fff':T.inkLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{setNum}</div>
                            <span style={{ fontSize:12, fontWeight:600, color:T.inkMid }}>Set {setNum}</span>
                          </div>
                          {/* Last session reference */}
                          {last && !done && (
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <span style={{ fontSize:10, color:T.inkLight }}>Last:</span>
                              <button onClick={() => setInputs(p => ({ ...p, [key]:{ reps:String(last.reps), weight:String(last.weight_kg) } }))}
                                style={{ fontSize:11, color:T.blue, background:T.blueL, border:`1px solid rgba(26,95,212,0.2)`, borderRadius:20, padding:'3px 9px', cursor:'pointer', fontWeight:600, WebkitTapHighlightColor:'transparent' }}>
                                {last.reps}r @ {last.weight_kg}kg ↑
                              </button>
                            </div>
                          )}
                        </div>

                        {done ? (
                          <div style={{ padding:'10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <span style={{ fontSize:13, fontWeight:700, color:T.green }}>✓ {done.reps} reps @ {done.weight_kg} kg</span>
                            {!isAdmin && <button onClick={() => deleteLog(done.id)} style={{ fontSize:11, color:T.red, background:'none', border:'none', cursor:'pointer', opacity:0.7 }}>undo</button>}
                          </div>
                        ) : (
                          <div style={{ padding:'10px 12px', display:'flex', gap:8, alignItems:'center' }}>
                            <div style={{ flex:1, position:'relative' }}>
                              <input value={inputs[key]?.reps||''} onChange={e => setInputs(p=>({...p,[key]:{...p[key],reps:e.target.value}}))}
                                placeholder={last ? `${last.reps} reps` : 'Reps'}
                                inputMode="numeric"
                                style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:`1.5px solid ${T.border}`, fontSize:15, outline:'none', boxSizing:'border-box', background:T.surface, fontFamily:"'DM Sans',sans-serif" }}
                                onFocus={e=>e.target.style.borderColor=T.orange} onBlur={e=>e.target.style.borderColor=T.border}
                              />
                            </div>
                            <div style={{ flex:1 }}>
                              <input value={inputs[key]?.weight||''} onChange={e => setInputs(p=>({...p,[key]:{...p[key],weight:e.target.value}}))}
                                placeholder={last ? `${last.weight_kg}kg` : 'kg'}
                                inputMode="decimal"
                                style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:`1.5px solid ${T.border}`, fontSize:15, outline:'none', boxSizing:'border-box', background:T.surface, fontFamily:"'DM Sans',sans-serif" }}
                                onFocus={e=>e.target.style.borderColor=T.orange} onBlur={e=>e.target.style.borderColor=T.border}
                              />
                            </div>
                            <Btn small onClick={() => logSet(ex.exercise_name, setNum)} disabled={saving===key} style={{ flexShrink:0, minWidth:52 }}>
                              {saving===key ? '…' : 'Log'}
                            </Btn>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── NUTRITION PAGE ───────────────────────────────────────────────────────────
function NutritionPage({ user, isAdmin }) {
  const { clients, selClientId, setSelClientId, clientId }=useAdminClient(user, isAdmin)
  const [meals,setMeals]=useState([])
  const [foods,setFoods]=useState([])
  const [targets,setTargets]=useState(null)
  const [search,setSearch]=useState('')
  const [dietType,setDietType]=useState('veg')
  const [showMealModal,setShowMealModal]=useState(false)
  const [showFoodModal,setShowFoodModal]=useState(false)
  const [editItem,setEditItem]=useState(null)
  const [editFood,setEditFood]=useState(null)
  const [mealForm,setMealForm]=useState({meal_number:1,meal_name:'MEAL 1',food_name:'',category:'Proteins',qty_g:100,calories:0,protein_g:0,fat_g:0,carbs_g:0,fibre_g:0})
  const [foodForm,setFoodForm]=useState({food_name:'',portion_g:100,protein_g:0,fat_g:0,carbs_g:0,fibre_g:0,calories:0,is_veg:true})
  const [formMsg,setFormMsg]=useState('')
  const [foodMsg,setFoodMsg]=useState('')
  const isMobile=useIsMobile()
  const isDemoMode=isDemo||clientId==='demo'||!clientId

  const load=async()=>{
    if (isDemoMode){setMeals(DEMO.mealPlan);setFoods(DEMO.foodDb);setTargets(DEMO.targets);return}
    const [m,t,f]=await Promise.all([
      sbQuery('meal_plans',{eq:{client_id:clientId,diet_type:dietType},order:'meal_number',asc:true}),
      sbQuery('weekly_targets',{eq:{client_id:clientId},order:'created_at',asc:false,single:true}),
      sbQuery('food_database',{order:'food_name',asc:true})
    ])
    setMeals(m||[]); setTargets(t); setFoods(f||[])
  }
  useEffect(()=>{ if(clientId||isDemoMode) load() },[clientId,dietType])
  useEffect(()=>{
    if (isDemoMode) return
    const sub=supabase.channel('nutr')
      .on('postgres_changes',{event:'*',schema:'public',table:'meal_plans',filter:`client_id=eq.${clientId}`},()=>load())
      .on('postgres_changes',{event:'*',schema:'public',table:'food_database'},()=>load())
      .subscribe()
    return ()=>supabase.removeChannel(sub)
  },[clientId])

  const saveMealItem=async()=>{
    setFormMsg(''); if(!mealForm.food_name){setFormMsg('Error: Food name required');return}
    try {
      if (isDemoMode){
        if(editItem) setMeals(prev=>prev.map(m=>m.id===editItem.id?{...m,...mealForm}:m))
        else setMeals(prev=>[...prev,{id:'m'+Date.now(),...mealForm}])
      } else {
        if(editItem) await sbUpdate('meal_plans',editItem.id,{...mealForm,client_id:clientId,diet_type:dietType})
        else await sbInsert('meal_plans',{...mealForm,client_id:clientId,diet_type:dietType})
        await load()
      }
      setFormMsg('✓ Saved'); setTimeout(()=>{setShowMealModal(false);setEditItem(null);setFormMsg('')},700)
      setMealForm({meal_number:1,meal_name:'MEAL 1',food_name:'',category:'Proteins',qty_g:100,calories:0,protein_g:0,fat_g:0,carbs_g:0,fibre_g:0})
    } catch(e){setFormMsg(`Error: ${e.message}`)}
  }
  const deleteMealItem=async(item)=>{
    if(!window.confirm(`Delete "${item.food_name}"?`)) return
    if(isDemoMode){setMeals(prev=>prev.filter(m=>m.id!==item.id));return}
    try{ await sbDelete('meal_plans',item.id); await load() }catch(e){alert(e.message)}
  }
  const openEditMeal=(item)=>{ setEditItem(item); setMealForm({meal_number:item.meal_number,meal_name:item.meal_name||'MEAL 1',food_name:item.food_name,category:item.category||'Proteins',qty_g:item.qty_g||0,calories:item.calories||0,protein_g:item.protein_g||0,fat_g:item.fat_g||0,carbs_g:item.carbs_g||0,fibre_g:item.fibre_g||0}); setShowMealModal(true) }

  const saveFoodItem=async()=>{
    setFoodMsg(''); if(!foodForm.food_name){setFoodMsg('Error: Name required');return}
    try {
      if (isDemoMode){
        if(editFood) setFoods(prev=>prev.map(f=>f.food_name===editFood.food_name?{...f,...foodForm}:f))
        else setFoods(prev=>[...prev,{...foodForm}])
      } else {
        if(editFood) await supabase.from('food_database').update(foodForm).eq('id',editFood.id)
        else await supabase.from('food_database').insert([foodForm])
        await load()
      }
      setFoodMsg('✓ Saved'); setTimeout(()=>{setShowFoodModal(false);setEditFood(null);setFoodMsg('')},700)
      setFoodForm({food_name:'',portion_g:100,protein_g:0,fat_g:0,carbs_g:0,fibre_g:0,calories:0,is_veg:true})
    } catch(e){setFoodMsg(`Error: ${e.message}`)}
  }
  const deleteFoodItem=async(food)=>{
    if(!window.confirm(`Delete "${food.food_name}"?`)) return
    if(isDemoMode){setFoods(prev=>prev.filter(f=>f.food_name!==food.food_name));return}
    try{ await supabase.from('food_database').delete().eq('id',food.id); await load() }catch(e){alert(e.message)}
  }
  const openEditFood=(food)=>{ setEditFood(food); setFoodForm({food_name:food.food_name,portion_g:food.portion_g||100,protein_g:food.protein_g||0,fat_g:food.fat_g||0,carbs_g:food.carbs_g||0,fibre_g:food.fibre_g||0,calories:food.calories||0,is_veg:food.is_veg!==false}); setShowFoodModal(true) }

  const grouped=meals.reduce((acc,m)=>{ const k=m.meal_name||`Meal ${m.meal_number}`; (acc[k]=acc[k]||[]).push(m); return acc },{})
  const filtered=foods.filter(f=>f.food_name?.toLowerCase().includes(search.toLowerCase()))
  const t=targets||{}

  const MealForm=(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Inp label="Meal number" type="number" value={mealForm.meal_number} onChange={e=>setMealForm(p=>({...p,meal_number:parseInt(e.target.value)||1,meal_name:`MEAL ${e.target.value}`}))} min="1"/>
        <Inp label="Meal name" value={mealForm.meal_name} onChange={e=>setMealForm(p=>({...p,meal_name:e.target.value}))} placeholder="MEAL 1"/>
      </div>
      <Inp label="Food name *" value={mealForm.food_name} onChange={e=>setMealForm(p=>({...p,food_name:e.target.value}))} placeholder="Oats"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Sel label="Category" value={mealForm.category} onChange={e=>setMealForm(p=>({...p,category:e.target.value}))}>
          {['Proteins','Carbohydrates','Fats','Vegetables','Dairy','Supplements'].map(c=><option key={c}>{c}</option>)}
        </Sel>
        <Inp label="Quantity (g)" type="number" value={mealForm.qty_g} onChange={e=>setMealForm(p=>({...p,qty_g:parseFloat(e.target.value)||0}))}/>
        {[['Calories','calories'],['Protein (g)','protein_g'],['Fat (g)','fat_g'],['Carbs (g)','carbs_g'],['Fibre (g)','fibre_g']].map(([lbl,k])=>(
          <Inp key={k} label={lbl} type="number" value={mealForm[k]} onChange={e=>setMealForm(p=>({...p,[k]:parseFloat(e.target.value)||0}))} step=".1" inputMode="decimal"/>
        ))}
      </div>
      <MsgBox msg={formMsg}/>
      <div style={{display:'flex',gap:9,marginTop:4}}>
        <Btn onClick={saveMealItem} full>{editItem?'Save changes':'Add item'}</Btn>
        <Btn variant="ghost" onClick={()=>{setShowMealModal(false);setEditItem(null)}} full>Cancel</Btn>
      </div>
    </div>
  )

  const FoodForm=(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <Inp label="Food name *" value={foodForm.food_name} onChange={e=>setFoodForm(p=>({...p,food_name:e.target.value}))} placeholder="Paneer raw"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Inp label="Portion (g)" type="number" value={foodForm.portion_g} onChange={e=>setFoodForm(p=>({...p,portion_g:parseFloat(e.target.value)||100}))}/>
        <Inp label="Calories" type="number" value={foodForm.calories} onChange={e=>setFoodForm(p=>({...p,calories:parseFloat(e.target.value)||0}))} step=".1"/>
        {[['Protein (g)','protein_g'],['Fat (g)','fat_g'],['Carbs (g)','carbs_g'],['Fibre (g)','fibre_g']].map(([lbl,k])=>(
          <Inp key={k} label={lbl} type="number" value={foodForm[k]} onChange={e=>setFoodForm(p=>({...p,[k]:parseFloat(e.target.value)||0}))} step=".1" inputMode="decimal"/>
        ))}
      </div>
      <label style={{display:'flex',alignItems:'center',gap:10,fontSize:14,cursor:'pointer'}}>
        <input type="checkbox" checked={foodForm.is_veg} onChange={e=>setFoodForm(p=>({...p,is_veg:e.target.checked}))} style={{width:18,height:18,accentColor:T.orange}}/>
        Vegetarian
      </label>
      <MsgBox msg={foodMsg}/>
      <div style={{display:'flex',gap:9,marginTop:4}}>
        <Btn onClick={saveFoodItem} full>{editFood?'Save changes':'Add to database'}</Btn>
        <Btn variant="ghost" onClick={()=>{setShowFoodModal(false);setEditFood(null)}} full>Cancel</Btn>
      </div>
    </div>
  )

  const macros=[
    {lbl:'Calories',val:Number(t.calories||0).toFixed(0),unit:'kcal',color:'orange',icon:'⚡'},
    {lbl:'Protein', val:Number(t.protein_g||0).toFixed(0),unit:'g',   color:'blue',  icon:'💪'},
    {lbl:'Carbs',   val:Number(t.carbs_g||0).toFixed(0), unit:'g',   color:'green', icon:'🌾'},
    {lbl:'Fats',    val:Number(t.fats_g||0).toFixed(0),  unit:'g',   color:'amber', icon:'🥑'},
  ]

  return (
    <div style={{padding:'20px 16px 24px',maxWidth:1080,margin:'0 auto'}}>
      <SectionHeader title="Nutrition" sub="Your personalised meal guide"/>
      {isAdmin&&<Card style={{padding:'14px 18px',marginBottom:14}}><ClientSelector clients={clients} selClientId={selClientId} setSelClientId={setSelClientId}/></Card>}

      {targets&&(
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:12,marginBottom:18}}>
          {macros.map(m=><KpiCard key={m.lbl} label={m.lbl} value={m.val} sub={m.unit} color={m.color} icon={m.icon}/>)}
        </div>
      )}

      {showMealModal&&<Modal title={editItem?`Edit: ${editItem.food_name}`:'Add meal item'} onClose={()=>{setShowMealModal(false);setEditItem(null)}}>{MealForm}</Modal>}
      {showFoodModal&&<Modal title={editFood?`Edit: ${editFood.food_name}`:'Add to food database'} onClose={()=>{setShowFoodModal(false);setEditFood(null)}}>{FoodForm}</Modal>}

      {/* Meal plan */}
      <Card>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:10}}>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700}}>Meal plan</h3>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {['veg','non-veg'].map(dt=>(
              <button key={dt} onClick={()=>setDietType(dt)} style={{padding:'7px 16px',borderRadius:20,border:`1.5px solid ${dietType===dt?T.orange:T.border}`,background:dietType===dt?T.orange:T.surface,color:dietType===dt?T.ink:T.inkMid,fontWeight:600,fontSize:13,cursor:'pointer',transition:'all .2s',fontFamily:"'DM Sans',sans-serif"}}>{dt}</button>
            ))}
            {isAdmin&&<Btn variant="green" small onClick={()=>{setEditItem(null);setMealForm({meal_number:1,meal_name:'MEAL 1',food_name:'',category:'Proteins',qty_g:100,calories:0,protein_g:0,fat_g:0,carbs_g:0,fibre_g:0});setShowMealModal(true)}}>+ Add item</Btn>}
          </div>
        </div>

        {Object.keys(grouped).length===0?(
          <div style={{padding:'40px 24px',textAlign:'center',color:T.inkLight,background:T.surfaceAlt,borderRadius:12}}>
            <div style={{fontSize:32,marginBottom:8}}>🥗</div>
            <p style={{fontSize:14}}>{isAdmin?'No meals — click + Add item':'Your coach will set up your meals soon'}</p>
          </div>
        ):Object.entries(grouped).map(([mealName,items])=>(
          <div key={mealName} style={{marginBottom:22}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:T.orange}}/>
              <span style={{fontWeight:700,fontSize:14,color:T.orange}}>{mealName}</span>
              <span style={{fontSize:12,color:T.inkLight}}>{items.reduce((s,i)=>s+(+i.calories||0),0).toFixed(0)} kcal · {items.reduce((s,i)=>s+(+i.protein_g||0),0).toFixed(1)}g protein</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {items.map((item,i)=>(
                <div key={item.id||i} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',background:T.surfaceAlt,borderRadius:12,border:`1px solid ${T.border}`}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontWeight:600,fontSize:14}}>{item.food_name}</span>
                      <Badge color="blue">{item.category}</Badge>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:4}}>
                      {[['Qty',`${item.qty_g}g`],['Cal',Number(item.calories||0).toFixed(0)],['Pro',`${Number(item.protein_g||0).toFixed(1)}g`],['Carbs',`${Number(item.carbs_g||0).toFixed(1)}g`],['Fat',`${Number(item.fat_g||0).toFixed(1)}g`]].map(([lbl,val])=>(
                        <div key={lbl} style={{textAlign:'center'}}>
                          <div style={{fontSize:9,color:T.inkLight,textTransform:'uppercase',letterSpacing:'0.4px'}}>{lbl}</div>
                          <div style={{fontSize:12,fontWeight:700,marginTop:2}}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {isAdmin&&<div style={{display:'flex',gap:6,flexShrink:0}}>
                    <Btn variant="ghost" small onClick={()=>openEditMeal(item)}>Edit</Btn>
                    <Btn variant="danger" small onClick={()=>deleteMealItem(item)}>✕</Btn>
                  </div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>

      {/* Food database */}
      <Card>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:10}}>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700}}>Food database</h3>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            {isAdmin&&<Btn variant="green" small onClick={()=>{setEditFood(null);setFoodForm({food_name:'',portion_g:100,protein_g:0,fat_g:0,carbs_g:0,fibre_g:0,calories:0,is_veg:true});setShowFoodModal(true)}}>+ Add food</Btn>}
            <div style={{position:'relative'}}>
              <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:14,color:T.inkLight}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search foods…" style={{paddingLeft:34,padding:'9px 14px 9px 34px',borderRadius:10,border:`1.5px solid ${T.border}`,fontSize:14,outline:'none',fontFamily:"'DM Sans',sans-serif",width:isMobile?'100%':200,background:T.surfaceAlt}}/>
            </div>
          </div>
        </div>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${T.border}`}}>
                {['Food','Per','Cal','Pro','Carbs','Fat',isAdmin?'Actions':''].map((h,i)=><th key={i} style={{padding:'8px 12px',textAlign:'left',fontSize:11,fontWeight:700,color:T.inkLight,textTransform:'uppercase',letterSpacing:'0.6px',whiteSpace:'nowrap'}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?T.surfaceAlt:T.surface}}>
                  <td style={{padding:'11px 12px',fontSize:13,fontWeight:600}}>{f.food_name}</td>
                  <td style={{padding:'11px 12px',fontSize:13,color:T.inkMid}}>{f.portion_g}g</td>
                  <td style={{padding:'11px 12px',fontSize:13,fontWeight:600,color:T.orange}}>{f.calories}</td>
                  <td style={{padding:'11px 12px',fontSize:13,color:T.blue}}>{f.protein_g}g</td>
                  <td style={{padding:'11px 12px',fontSize:13,color:T.green}}>{f.carbs_g}g</td>
                  <td style={{padding:'11px 12px',fontSize:13,color:T.amber}}>{f.fat_g}g</td>
                  {isAdmin&&<td style={{padding:'11px 12px'}}><div style={{display:'flex',gap:5}}><Btn variant="ghost" small onClick={()=>openEditFood(f)}>Edit</Btn><Btn variant="danger" small onClick={()=>deleteFoodItem(f)}>✕</Btn></div></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage({ user, isAdmin }) {
  const isMobile=useIsMobile()
  const { clients, selClientId, setSelClientId, clientId }=useAdminClient(user, isAdmin)
  const [roadmap,setRoadmap]=useState([])
  const [showModal,setShowModal]=useState(false)
  const [editMonth,setEditMonth]=useState(null)
  const [rmForm,setRmForm]=useState({month_number:1,month_name:'JANUARY',phase:'',notes:''})
  const [formMsg,setFormMsg]=useState('')
  const isDemoMode=isDemo||clientId==='demo'||!clientId

  const load=async()=>{
    if(isDemoMode){setRoadmap(DEMO.roadmap);return}
    const d=await sbQuery('roadmap',{eq:{client_id:clientId},order:'month_number',asc:true})
    setRoadmap(d||[])
  }
  useEffect(()=>{ if(clientId||isDemoMode) load() },[clientId])

  const saveMonth=async()=>{
    setFormMsg('')
    const payload={month_number:parseInt(rmForm.month_number),month_name:rmForm.month_name.toUpperCase(),phase:rmForm.phase||null,notes:rmForm.notes||''}
    try {
      if(isDemoMode){
        if(editMonth) setRoadmap(prev=>prev.map(r=>r.id===editMonth.id?{...r,...payload}:r))
        else setRoadmap(prev=>[...prev,{id:'r'+Date.now(),...payload}].sort((a,b)=>a.month_number-b.month_number))
      } else {
        if(editMonth) await sbUpdate('roadmap',editMonth.id,payload)
        else { const ex=roadmap.find(r=>r.month_number===payload.month_number); if(ex) await sbUpdate('roadmap',ex.id,payload); else await sbInsert('roadmap',{...payload,client_id:clientId}) }
        await load()
      }
      setFormMsg('✓ Saved'); setTimeout(()=>{setShowModal(false);setEditMonth(null);setFormMsg('')},700)
    } catch(e){setFormMsg(`Error: ${e.message}`)}
  }
  const clearPhase=async(r)=>{
    if(!window.confirm(`Clear phase for ${r.month_name}?`)) return
    if(isDemoMode){setRoadmap(prev=>prev.map(m=>m.id===r.id?{...m,phase:null,notes:''}:m));return}
    try{ await sbUpdate('roadmap',r.id,{phase:null,notes:''}); await load() }catch(e){alert(e.message)}
  }
  const openEdit=(r)=>{ setEditMonth(r); setRmForm({month_number:r.month_number,month_name:r.month_name,phase:r.phase||'',notes:r.notes||''}); setShowModal(true) }

  const phaseStyle=p=>p==='Fat-Loss'?{bg:'#FEF3C7',tc:'#92400E',e:'🔥',bar:T.amber}:p==='Lean Gain'?{bg:'#D1FAE5',tc:'#065F46',e:'📈',bar:T.green}:p==='Maintenance'?{bg:T.blueL,tc:'#1E40AF',e:'⚖️',bar:T.blue}:{bg:T.surfaceAlt,tc:T.inkLight,e:'○',bar:T.border}

  const RmForm=(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Inp label="Month (1-12)" type="number" value={rmForm.month_number} onChange={e=>setRmForm(p=>({...p,month_number:e.target.value}))} min="1" max="12"/>
        <Inp label="Month name" value={rmForm.month_name} onChange={e=>setRmForm(p=>({...p,month_name:e.target.value}))} placeholder="JANUARY"/>
      </div>
      <Sel label="Phase" value={rmForm.phase} onChange={e=>setRmForm(p=>({...p,phase:e.target.value}))}>
        <option value="">— No phase —</option>
        <option>Fat-Loss</option><option>Lean Gain</option><option>Maintenance</option>
      </Sel>
      <div>
        <label style={{fontSize:11,fontWeight:600,color:T.inkLight,textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:6,display:'block'}}>Notes</label>
        <textarea value={rmForm.notes} onChange={e=>setRmForm(p=>({...p,notes:e.target.value}))} rows={3} placeholder="e.g. Started cut…" style={{width:'100%',padding:'10px 14px',borderRadius:10,border:`1.5px solid ${T.border}`,fontSize:15,outline:'none',resize:'vertical',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box'}}/>
      </div>
      <MsgBox msg={formMsg}/>
      <div style={{display:'flex',gap:9,marginTop:4}}>
        <Btn onClick={saveMonth} full>{editMonth?'Save changes':'Save month'}</Btn>
        <Btn variant="ghost" onClick={()=>{setShowModal(false);setEditMonth(null)}} full>Cancel</Btn>
      </div>
    </div>
  )

  return (
    <div style={{padding:'20px 16px 24px',maxWidth:1080,margin:'0 auto'}}>
      <SectionHeader title="2026 Roadmap" sub="Your year-long training periodization"
        action={isAdmin&&<Btn variant="green" small onClick={()=>{setEditMonth(null);setRmForm({month_number:1,month_name:'JANUARY',phase:'',notes:''});setShowModal(true)}}>+ Edit month</Btn>}
      />
      {isAdmin&&<Card style={{padding:'14px 18px',marginBottom:14}}><ClientSelector clients={clients} selClientId={selClientId} setSelClientId={setSelClientId}/></Card>}
      {showModal&&<Modal title={editMonth?`Edit: ${editMonth.month_name}`:'Update roadmap'} onClose={()=>{setShowModal(false);setEditMonth(null)}}>{RmForm}</Modal>}

      <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(2,1fr)',gap:10,marginBottom:20}}>
        {roadmap.map((m,i)=>{
          const ps=phaseStyle(m.phase)
          return (
            <div key={m.id||i} style={{background:T.surface,borderRadius:16,border:`1px solid ${T.border}`,padding:'16px',display:'flex',flexDirection:'column',gap:10,transition:'box-shadow .2s'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:40,height:40,borderRadius:12,background:ps.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{ps.e}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>{m.month_name}</div>
                  <div style={{fontSize:11,color:T.inkLight,marginTop:1}}>{m.phase||'No phase assigned'}</div>
                </div>
                {m.phase&&<span style={{padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:700,background:ps.bg,color:ps.tc,flexShrink:0}}>{m.phase}</span>}
              </div>
              {m.phase&&<div style={{height:4,background:T.border,borderRadius:99}}><div style={{height:4,width:'100%',background:ps.bar,borderRadius:99}}/></div>}
              {m.notes&&<p style={{fontSize:12,color:T.inkMid,fontStyle:'italic',margin:0}}>"{m.notes}"</p>}
              {isAdmin&&(
                <div style={{display:'flex',gap:6}}>
                  <Btn variant="ghost" small onClick={()=>openEdit(m)} style={{flex:1}}>Edit</Btn>
                  {m.phase&&<Btn variant="danger" small onClick={()=>clearPhase(m)} style={{flex:1}}>Clear</Btn>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>
        <Card>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,marginBottom:14}}>Phase guide</h3>
          {[['Fat-Loss 🔥','Caloric deficit + high protein. Strip fat, preserve muscle.','#FEF3C7','#92400E'],['Lean Gain 📈','Slight surplus + progressive overload. Build muscle.','#D1FAE5','#065F46'],['Maintenance ⚖️','Caloric balance, skill focus. Consolidate gains.',T.blueL,'#1E40AF']].map(([p,d,bg,tc])=>(
            <div key={p} style={{padding:'14px',borderRadius:12,background:bg,marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:13,color:tc,marginBottom:4}}>{p}</div>
              <div style={{fontSize:12,color:tc,opacity:.8,lineHeight:1.5}}>{d}</div>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,marginBottom:14}}>Training schemes</h3>
          {[['5x5 · 1010 · 180s','Strength 1','Heavy compound lifts'],['4x4 · 2010 · 120s','Strength 2','Controlled eccentric phase'],['3x9-11 · 3010 · 120s','Hypertrophy 1','Volume-driven growth'],['2x Failure · 3010 · 180s','Hypertrophy 2','Max intensity, failure sets']].map(([s,cat,desc])=>(
            <div key={s} style={{padding:'10px 0',borderBottom:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{s}</div>
                <div style={{fontSize:11,color:T.inkLight,marginTop:2}}>{desc}</div>
              </div>
              <Badge color="blue">{cat}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}


// ─── MESSAGES ─────────────────────────────────────────────────────────────────
// Messages are encrypted server-side via pgcrypto (AES-256)
// Clients read-only. Admin sends personal + broadcast.

function MessagesPage({ user, isAdmin }) {
  const [messages, setMessages] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [form, setForm] = useState({ client_id: '', subject: '', body: '', message_type: 'personal' })
  const [sending, setSending] = useState(false)
  const [sendMsg, setSendMsg] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const isDemoMode = isDemo || (!isAdmin && user.clientId === 'demo')

  // ── Demo data ──
  const DEMO_MSGS = [
    { id:'dm1', subject:'Welcome to LevelUp! 🎉', body:'Hey Rohan! Welcome aboard. Your program starts this week. Stay consistent and trust the process.', message_type:'personal', is_read:true,  sent_at:'2026-03-28T10:00:00Z', client_name:'ROHAN CHOUBEY' },
    { id:'dm2', subject:'Weekly check-in — Week 2', body:'Great work this week! Your weights are trending down well. Make sure you\'re hitting 8k steps daily.', message_type:'personal', is_read:true,  sent_at:'2026-04-06T09:00:00Z', client_name:'ROHAN CHOUBEY' },
    { id:'dm3', subject:'📢 April Tips — All Clients', body:'Reminder to everyone: drink at least 3L of water daily. Hydration is as important as your training!', message_type:'broadcast', is_read:false, sent_at:'2026-04-10T08:00:00Z', client_name:null },
    { id:'dm4', subject:'Fat loss phase starting — Stay focused 🔥', body:'We\'re entering the fat loss phase now. Your calories will drop slightly. Follow the plan and reach out if you feel fatigued.', message_type:'personal', is_read:false, sent_at:'2026-04-14T11:00:00Z', client_name:'ROHAN CHOUBEY' },
  ]
  const DEMO_CLIENTS = [{ id:'1', name:'ROHAN CHOUBEY' }]

  const load = async () => {
    setLoading(true)
    try {
      if (isDemoMode) {
        setMessages(DEMO_MSGS)
        if (isAdmin) setClients(DEMO_CLIENTS)
        setLoading(false)
        return
      }
      if (isAdmin) {
        // Admin sees all messages with decrypted body via RPC
        const { data, error } = await supabase.rpc('get_messages_admin')
        if (error) throw error
        setMessages(data || [])
        const cl = await sbQuery('clients', { order:'name', asc:true, select:'id,name' })
        setClients(cl || [])
      } else {
        // Client: fetch their messages + broadcasts, decrypt body
        const clientId = user.clientId
        const { data, error } = await supabase.rpc('get_messages_client', { p_client_id: clientId })
        if (error) throw error
        setMessages(data || [])
      }
    } catch(e) { console.error('Messages load error:', e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [user])

  // Real-time subscription
  useEffect(() => {
    if (isDemoMode) return
    const filter = isAdmin ? undefined : `client_id=eq.${user.clientId}`
    const sub = supabase.channel('messages-rt')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', ...(filter?{filter}:{}) }, () => load())
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [user])

  const markRead = async (msg) => {
    if (msg.is_read || isAdmin || isDemoMode) return
    try {
      await supabase.from('messages').update({ is_read:true, read_at:new Date().toISOString() }).eq('id', msg.id)
      setMessages(prev => prev.map(m => m.id===msg.id ? {...m, is_read:true} : m))
    } catch(e) { console.error(e) }
  }

  const sendMessage = async () => {
    if (!form.subject || !form.body) { setSendMsg('Error: Subject and message required'); return }
    if (form.message_type==='personal' && !form.client_id) { setSendMsg('Error: Select a client'); return }
    setSending(true); setSendMsg('')
    try {
      if (isDemoMode) {
        const newMsg = { id:'dm'+Date.now(), ...form, is_read:false, sent_at:new Date().toISOString(), client_name: clients.find(c=>c.id===form.client_id)?.name || null }
        setMessages(prev => [newMsg, ...prev])
        setForm({ client_id:'', subject:'', body:'', message_type:'personal' })
        setShowCompose(false)
        setSendMsg('✓ Message sent (demo)')
      } else {
        // Call RPC that encrypts body server-side before storing
        const { error } = await supabase.rpc('send_message_encrypted', {
          p_client_id:    form.message_type==='broadcast' ? null : form.client_id,
          p_subject:      form.subject,
          p_body:         form.body,
          p_message_type: form.message_type
        })
        if (error) throw error
        setForm({ client_id:'', subject:'', body:'', message_type:'personal' })
        setShowCompose(false)
        setSendMsg('✓ Message sent and encrypted')
        await load()
      }
    } catch(e) { setSendMsg(`Error: ${e.message}`) }
    finally { setSending(false) }
  }

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return
    if (isDemoMode) { setMessages(prev => prev.filter(m => m.id!==id)); return }
    try { await supabase.from('messages').delete().eq('id', id); await load() } catch(e) { alert(e.message) }
  }

  const unread = messages.filter(m => !m.is_read).length

  const ComposeModal = () => (
    <Modal title="Send message" onClose={() => { setShowCompose(false); setSendMsg('') }}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {/* Type toggle */}
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:T.inkLight, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:8, display:'block' }}>Message type</label>
          <div style={{ display:'flex', gap:8 }}>
            {[['personal','👤 Personal'],['broadcast','📢 Broadcast (all)']].map(([v,lbl])=>(
              <button key={v} onClick={()=>setForm(p=>({...p,message_type:v,client_id:v==='broadcast'?'':p.client_id}))}
                style={{ flex:1, padding:'9px 12px', borderRadius:10, border:`1.5px solid ${form.message_type===v?T.orange:T.border}`, background:form.message_type===v?T.orangeL:T.surface, color:form.message_type===v?T.orangeD:T.ink, fontWeight:600, fontSize:13, cursor:'pointer' }}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {form.message_type==='personal' && (
          <Sel label="Send to client" value={form.client_id} onChange={e=>setForm(p=>({...p,client_id:e.target.value}))}>
            <option value="">— Select client —</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </Sel>
        )}
        {form.message_type==='broadcast' && (
          <div style={{ padding:'10px 14px', background:T.amberL, borderRadius:10, fontSize:12, color:T.amber, border:`1px solid rgba(180,83,9,0.2)` }}>
            📢 This message will be visible to ALL clients
          </div>
        )}
        <Inp label="Subject" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} placeholder="Weekly check-in, Program update…"/>
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:T.inkLight, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:6, display:'block' }}>Message</label>
          <textarea value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} rows={5}
            placeholder="Write your message here…"
            style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:`1.5px solid ${T.border}`, fontSize:15, outline:'none', resize:'vertical', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box', lineHeight:1.6 }}
            onFocus={e=>e.target.style.borderColor=T.orange} onBlur={e=>e.target.style.borderColor=T.border}
          />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#F0FDF4', borderRadius:10, fontSize:12, color:T.green, border:`1px solid rgba(26,122,74,0.15)` }}>
          🔒 Message encrypted with AES-256 before storage
        </div>
        <MsgBox msg={sendMsg}/>
        <div style={{ display:'flex', gap:9 }}>
          <Btn onClick={sendMessage} disabled={sending} full>{sending?'Sending…':'Send message 🔒'}</Btn>
          <Btn variant="ghost" onClick={()=>setShowCompose(false)} full>Cancel</Btn>
        </div>
      </div>
    </Modal>
  )

  return (
    <div style={{ padding:'20px 16px 24px', maxWidth:1080, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700 }}>Messages</h2>
            {unread>0 && <span style={{ background:T.orange, color:T.ink, fontSize:11, fontWeight:800, padding:'2px 8px', borderRadius:99, minWidth:20, textAlign:'center' }}>{unread}</span>}
          </div>
          <p style={{ fontSize:13, color:T.inkLight, marginTop:3 }}>
            {isAdmin ? 'Send encrypted messages to your clients' : 'Messages from your coach — read only'}
          </p>
        </div>
        {isAdmin && <Btn onClick={()=>setShowCompose(true)} variant="primary">✉ Compose</Btn>}
      </div>

      {showCompose && <ComposeModal/>}
      {sendMsg && !showCompose && <MsgBox msg={sendMsg}/>}

      {loading ? (
        <div style={{ textAlign:'center', padding:60, color:T.inkLight }}>Loading messages…</div>
      ) : messages.length===0 ? (
        <Card style={{ textAlign:'center', padding:'50px 24px' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>✉️</div>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, marginBottom:8 }}>No messages yet</h3>
          <p style={{ color:T.inkLight, fontSize:14 }}>{isAdmin ? 'Compose a message to get started' : 'Your coach will send you messages here'}</p>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {messages.map(msg => {
            const isExpanded = expandedId === msg.id
            const isPersonal = msg.message_type === 'personal'
            const date = new Date(msg.sent_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
            const time = new Date(msg.sent_at).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })
            return (
              <div key={msg.id} onClick={() => { setExpandedId(isExpanded?null:msg.id); markRead(msg) }}
                style={{ background:T.surface, borderRadius:16, border:`1.5px solid ${!msg.is_read&&!isAdmin ? T.orange : T.border}`, padding:0, cursor:'pointer', transition:'all .2s', overflow:'hidden', boxShadow:!msg.is_read&&!isAdmin?`0 0 0 1px ${T.orangeL}`:'none' }}>
                {/* Header */}
                <div style={{ padding:'16px 18px', display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background: isPersonal?T.orangeL:'#EDE9FE', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                    {isPersonal ? '💬' : '📢'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, flexWrap:'wrap' }}>
                      <h4 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:T.ink }}>{msg.subject}</h4>
                      <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
                        {!msg.is_read && !isAdmin && <div style={{ width:8, height:8, borderRadius:'50%', background:T.orange }}/>}
                        <span style={{ fontSize:11, color:T.inkLight, whiteSpace:'nowrap' }}>{date} {time}</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, marginTop:5, alignItems:'center' }}>
                      {isAdmin && msg.client_name && <Badge color="blue">{msg.client_name}</Badge>}
                      {!isPersonal && <Badge color="purple">Broadcast</Badge>}
                      {!isAdmin && <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:T.green }}><span>🔒</span> Encrypted</div>}
                      {msg.is_read && !isAdmin && <Badge color="gray">Read</Badge>}
                    </div>
                    {!isExpanded && <p style={{ fontSize:13, color:T.inkLight, marginTop:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.body}</p>}
                  </div>
                </div>
                {/* Expanded body */}
                {isExpanded && (
                  <div style={{ padding:'0 18px 18px 18px', borderTop:`1px solid ${T.border}`, paddingTop:16 }}>
                    <p style={{ fontSize:14, color:T.inkMid, lineHeight:1.75, whiteSpace:'pre-wrap' }}>{msg.body}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:16, flexWrap:'wrap', gap:8 }}>
                      <div style={{ fontSize:11, color:T.inkLight, display:'flex', alignItems:'center', gap:5 }}>
                        🔒 AES-256 encrypted · {date} at {time}
                      </div>
                      {isAdmin && (
                        <Btn variant="danger" small onClick={e=>{ e.stopPropagation(); deleteMessage(msg.id) }}>Delete</Btn>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── PROGRESS PICS ────────────────────────────────────────────────────────────
function ProgressPicsPage({ user, isAdmin }) {
  const { clients, selClientId, setSelClientId, clientId } = useAdminClient(user, isAdmin)
  const [pics, setPics] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [compareA, setCompareA] = useState(null)
  const [compareB, setCompareB] = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [caption, setCaption] = useState('')
  const [selectedWeight, setSelectedWeight] = useState('')
  const fileInputRef = useRef(null)
  const isDemoMode = isDemo || clientId === 'demo' || !clientId

  // Demo pics
  const DEMO_PICS = [
    { id:'p1', week_number:1, pic_date:'2026-03-30', url:'https://via.placeholder.com/400x500/1a1a1a/f1c232?text=Week+1', caption:'Day 1 — Starting point', weight_kg:93 },
    { id:'p2', week_number:4, pic_date:'2026-04-20', url:'https://via.placeholder.com/400x500/1a1a1a/f1c232?text=Week+4', caption:'Week 4 progress', weight_kg:91.5 },
    { id:'p3', week_number:8, pic_date:'2026-05-18', url:'https://via.placeholder.com/400x500/1a1a1a/f1c232?text=Week+8', caption:'Week 8 — Visible changes', weight_kg:90 },
  ]

  const load = async () => {
    setLoading(true)
    try {
      if (isDemoMode) { setPics(DEMO_PICS); setLoading(false); return }
      const data = await sbQuery('progress_pics', { eq:{ client_id: clientId }, order:'pic_date', asc:false })
      if (!data) { setPics([]); setLoading(false); return }
      // Get signed URLs for each pic (private bucket — must use signed URL)
      const withUrls = await Promise.all((data||[]).map(async pic => {
        const { data: urlData } = await supabase.storage.from('progress-pics').createSignedUrl(pic.storage_path, 3600)
        return { ...pic, url: urlData?.signedUrl || '' }
      }))
      setPics(withUrls)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (clientId || isDemoMode) load() }, [clientId])

  const upload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5*1024*1024) { setUploadMsg('Error: File must be under 5MB'); return }
    setUploading(true); setUploadMsg('')
    try {
      if (isDemoMode) {
        const url = URL.createObjectURL(file)
        const weekNum = pics.length > 0 ? Math.max(...pics.map(p=>p.week_number)) + 1 : 1
        setPics(prev => [{ id:'p'+Date.now(), week_number:weekNum, pic_date:new Date().toISOString().split('T')[0], url, caption, weight_kg:parseFloat(selectedWeight)||null }, ...prev])
        setCaption(''); setSelectedWeight(''); setUploadMsg('✓ Added (demo mode)')
        return
      }
      const weekNum = pics.length > 0 ? Math.max(...pics.map(p=>p.week_number)) + 1 : 1
      const ext = file.name.split('.').pop()
      const path = `${clientId}/${Date.now()}.${ext}`
      // Upload to private Supabase Storage bucket
      const { error: storageErr } = await supabase.storage.from('progress-pics').upload(path, file, { cacheControl:'3600', upsert:false })
      if (storageErr) throw storageErr
      // Save metadata
      await sbInsert('progress_pics', {
        client_id: clientId,
        week_number: weekNum,
        pic_date: new Date().toISOString().split('T')[0],
        storage_path: path,
        caption: caption || null,
        weight_kg: parseFloat(selectedWeight) || null,
      })
      setCaption(''); setSelectedWeight('')
      setUploadMsg('✓ Progress pic uploaded securely')
      await load()
    } catch(e) { setUploadMsg(`Error: ${e.message}`) }
    finally { setUploading(false) }
  }

  const deletePic = async (pic) => {
    if (!window.confirm('Delete this progress pic?')) return
    if (isDemoMode) { setPics(prev=>prev.filter(p=>p.id!==pic.id)); if(compareA?.id===pic.id)setCompareA(null); if(compareB?.id===pic.id)setCompareB(null); return }
    try {
      await supabase.storage.from('progress-pics').remove([pic.storage_path])
      await sbDelete('progress_pics', pic.id)
      if (compareA?.id===pic.id) setCompareA(null)
      if (compareB?.id===pic.id) setCompareB(null)
      await load()
    } catch(e) { alert(e.message) }
  }

  const selectForCompare = (pic) => {
    if (!compareMode) return
    if (compareA?.id===pic.id) { setCompareA(null); return }
    if (compareB?.id===pic.id) { setCompareB(null); return }
    if (!compareA) { setCompareA(pic); return }
    if (!compareB) { setCompareB(pic); return }
    // Both set — replace the older one
    setCompareA(compareB); setCompareB(pic)
  }

  const isSelectedForCompare = (pic) => compareA?.id===pic.id || compareB?.id===pic.id

  return (
    <div style={{ padding:'20px 16px 24px', maxWidth:1080, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700 }}>Progress pics 📸</h2>
          <p style={{ fontSize:13, color:T.inkLight, marginTop:3 }}>Stored privately · End-to-end secured</p>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {isAdmin && <ClientSelector clients={clients} selClientId={selClientId} setSelClientId={setSelClientId}/>}
          <Btn variant={compareMode?'primary':'secondary'} onClick={()=>{ setCompareMode(!compareMode); setCompareA(null); setCompareB(null) }}>
            {compareMode ? '✕ Exit compare' : '⚖ Compare'}
          </Btn>
          {!isAdmin && (
            <Btn onClick={()=>fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? 'Uploading…' : '+ Add pic'}
            </Btn>
          )}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" onChange={upload} style={{ display:'none' }}/>
        </div>
      </div>

      {/* Upload form (client only) */}
      {!isAdmin && (
        <Card style={{ marginBottom:16 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, marginBottom:14 }}>Add this week's progress pic</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 120px', gap:12, marginBottom:12 }}>
            <Inp label="Caption (optional)" value={caption} onChange={e=>setCaption(e.target.value)} placeholder="e.g. Week 8 — feeling stronger"/>
            <Inp label="Weight (kg)" type="number" value={selectedWeight} onChange={e=>setSelectedWeight(e.target.value)} placeholder="90.5" inputMode="decimal" step=".1"/>
          </div>
          <Btn onClick={()=>fileInputRef.current?.click()} disabled={uploading} full style={{ padding:'12px' }}>
            {uploading ? 'Uploading securely…' : '📸 Choose photo & upload'}
          </Btn>
          <MsgBox msg={uploadMsg}/>
          <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:6, fontSize:11, color:T.inkLight }}>
            🔒 Photos stored in private encrypted storage. Only you and your coach can access them.
          </div>
        </Card>
      )}

      {/* Compare mode banner */}
      {compareMode && (
        <div style={{ padding:'12px 16px', background:T.orangeL, borderRadius:12, marginBottom:16, border:`1px solid rgba(241,194,50,0.4)`, fontSize:13, color:T.inkMid, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span>⚖️</span>
          <span>Select <strong>2 photos</strong> to compare side by side · {compareA?1:0}/2 selected</span>
          {compareA && compareB && <Btn small variant="primary" onClick={()=>{}}>View comparison ↓</Btn>}
        </div>
      )}

      {/* Side-by-side comparison */}
      {compareMode && compareA && compareB && (
        <Card style={{ marginBottom:20 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, marginBottom:16, textAlign:'center' }}>Progress comparison</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[compareA, compareB].map((pic, i) => (
              <div key={pic.id} style={{ textAlign:'center' }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.inkLight, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:8 }}>{i===0?'Before':'After'}</div>
                <img src={pic.url} alt={`Week ${pic.week_number}`}
                  style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', borderRadius:14, border:`3px solid ${i===0?T.blue:T.green}`, display:'block' }}/>
                <div style={{ marginTop:8 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14 }}>Week {pic.week_number}</div>
                  <div style={{ fontSize:12, color:T.inkLight }}>{new Date(pic.pic_date+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
                  {pic.weight_kg && <div style={{ fontSize:12, fontWeight:600, color:i===0?T.blue:T.green, marginTop:3 }}>{pic.weight_kg} kg</div>}
                  {pic.caption && <div style={{ fontSize:11, color:T.inkLight, fontStyle:'italic', marginTop:3 }}>"{pic.caption}"</div>}
                </div>
              </div>
            ))}
          </div>
          {compareA.weight_kg && compareB.weight_kg && (
            <div style={{ marginTop:16, padding:'12px 16px', background:T.greenL, borderRadius:12, textAlign:'center', border:`1px solid rgba(26,122,74,0.15)` }}>
              <span style={{ fontSize:15, fontWeight:700, color:T.green }}>
                {(compareA.weight_kg - compareB.weight_kg).toFixed(1)} kg lost between Week {compareA.week_number} → Week {compareB.week_number} 🔥
              </span>
            </div>
          )}
        </Card>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign:'center', padding:60, color:T.inkLight }}>Loading your progress pics…</div>
      ) : pics.length===0 ? (
        <Card style={{ textAlign:'center', padding:'50px 24px' }}>
          <div style={{ fontSize:52, marginBottom:12 }}>📸</div>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, marginBottom:8 }}>No progress pics yet</h3>
          <p style={{ color:T.inkLight, fontSize:14 }}>{isAdmin ? 'Client hasn\'t added any pics yet' : 'Add your first progress pic to start tracking your transformation'}</p>
        </Card>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
          {pics.map(pic => {
            const isSel = isSelectedForCompare(pic)
            return (
              <div key={pic.id} onClick={() => selectForCompare(pic)}
                style={{ position:'relative', borderRadius:16, overflow:'hidden', cursor:compareMode?'pointer':'default', border:`3px solid ${isSel?T.orange:T.border}`, transition:'all .2s', boxShadow:isSel?`0 0 0 2px ${T.orange}`:undefined }}>
                <img src={pic.url} alt={`Week ${pic.week_number}`}
                  style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block' }}/>
                {/* Overlay */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(0deg,rgba(0,0,0,0.8) 0%,transparent 100%)', padding:'20px 12px 12px' }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", color:'#fff', fontWeight:700, fontSize:14 }}>Week {pic.week_number}</div>
                  {pic.weight_kg && <div style={{ color:T.orange, fontSize:12, fontWeight:600 }}>{pic.weight_kg} kg</div>}
                  <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11 }}>{new Date(pic.pic_date+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</div>
                  {pic.caption && <div style={{ color:'rgba(255,255,255,0.7)', fontSize:11, fontStyle:'italic', marginTop:2 }}>"{pic.caption}"</div>}
                </div>
                {/* Compare check */}
                {compareMode && (
                  <div style={{ position:'absolute', top:8, right:8, width:26, height:26, borderRadius:'50%', background:isSel?T.orange:'rgba(0,0,0,0.4)', border:`2px solid ${isSel?T.orange:'rgba(255,255,255,0.4)'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {isSel && <span style={{ color:T.ink, fontSize:14, fontWeight:800 }}>✓</span>}
                  </div>
                )}
                {/* Delete */}
                {!compareMode && (
                  <button onClick={e=>{ e.stopPropagation(); deletePic(pic) }}
                    style={{ position:'absolute', top:8, right:8, width:26, height:26, borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'none', color:'#fff', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', WebkitTapHighlightColor:'transparent' }}>✕</button>
                )}
                {/* Lock icon */}
                <div style={{ position:'absolute', top:8, left:8, fontSize:12, opacity:0.7 }}>🔒</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ user }) {
  const [clients,setClients]=useState([])
  const [sel,setSel]=useState(null)
  const [tab,setTab]=useState('clients')
  const [editForm,setEditForm]=useState({})
  const [newForm,setNewForm]=useState({name:'',email:'',age:'',gender:'MALE',height_cm:'',start_weight:'',goal_weight:'',start_date:'',end_date:''})
  const [msg,setMsg]=useState('')
  const [saving,setSaving]=useState(false)
  const isMobile=useIsMobile()

  const loadClients=async()=>{
    if(isDemo){setClients(DEMO.adminClients);return}
    const data=await sbQuery('clients',{order:'created_at',asc:false})
    setClients(data||[])
  }
  useEffect(()=>{ loadClients() },[])
  useEffect(()=>{
    if(isDemo) return
    const sub=supabase.channel('admin-c').on('postgres_changes',{event:'*',schema:'public',table:'clients'},()=>loadClients()).subscribe()
    return ()=>supabase.removeChannel(sub)
  },[])

  const openEdit=async(c)=>{
    setSel(c)
    const form={current_weight:c.current_weight||'',goal_weight:c.goal_weight||'',start_weight:c.start_weight||'',calories:'',protein_g:'',carbs_g:'',fats_g:'',fibre_g:'',daily_steps:'',cardio:''}
    if(!isDemo){
      try{ const t=await sbQuery('weekly_targets',{eq:{client_id:c.id},order:'created_at',asc:false,single:true}); if(t) Object.assign(form,{calories:t.calories||'',protein_g:t.protein_g||'',carbs_g:t.carbs_g||'',fats_g:t.fats_g||'',fibre_g:t.fibre_g||'',daily_steps:t.daily_steps||'',cardio:t.cardio||''}) }catch(e){}
    }
    setEditForm(form)
  }
  const saveEdit=async()=>{
    if(!sel) return; setSaving(true)
    try {
      if(!isDemo){
        await supabase.from('clients').update({current_weight:parseFloat(editForm.current_weight)||sel.current_weight,goal_weight:parseFloat(editForm.goal_weight)||sel.goal_weight,start_weight:parseFloat(editForm.start_weight)||sel.start_weight}).eq('id',sel.id)
        if(editForm.calories||editForm.protein_g){
          const {data:ex}=await supabase.from('weekly_targets').select('id').eq('client_id',sel.id).single()
          const td={client_id:sel.id,diet_type:'veg',calories:parseFloat(editForm.calories)||0,protein_g:parseFloat(editForm.protein_g)||0,carbs_g:parseFloat(editForm.carbs_g)||0,fats_g:parseFloat(editForm.fats_g)||0,fibre_g:parseFloat(editForm.fibre_g)||0,daily_steps:editForm.daily_steps||'8k',cardio:editForm.cardio||'Daily: 20min'}
          if(ex) await supabase.from('weekly_targets').update(td).eq('id',ex.id)
          else await supabase.from('weekly_targets').insert([td])
        }
      }
      await loadClients(); setMsg('✓ Changes saved'); setSel(null); setTimeout(()=>setMsg(''),3000)
    } catch(e){setMsg(`Error: ${e.message}`)} finally{setSaving(false)}
  }
  const createClient=async()=>{
    setSaving(true)
    try {
      if(!isDemo) await sbInsert('clients',{name:newForm.name.toUpperCase(),email:newForm.email,age:parseInt(newForm.age)||null,gender:newForm.gender,height_cm:parseFloat(newForm.height_cm)||null,start_weight:parseFloat(newForm.start_weight)||null,goal_weight:parseFloat(newForm.goal_weight)||null,current_weight:parseFloat(newForm.start_weight)||null,start_date:newForm.start_date||null,end_date:newForm.end_date||null})
      else setClients(prev=>[...prev,{id:Date.now().toString(),...newForm,is_active:true}])
      await loadClients(); setMsg('✓ Client created! Now create their auth user in Supabase.')
      setTab('clients'); setNewForm({name:'',email:'',age:'',gender:'MALE',height_cm:'',start_weight:'',goal_weight:'',start_date:'',end_date:''})
      setTimeout(()=>setMsg(''),8000)
    } catch(e){setMsg(`Error: ${e.message}`)} finally{setSaving(false)}
  }

  return (
    <div style={{padding:'20px 16px 24px',maxWidth:1080,margin:'0 auto'}}>
      <SectionHeader title="Admin" sub={`Manage clients · ${isDemo?'Demo mode':'Live — real-time ✓'}`}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:18}}>
        <KpiCard label="Total clients" value={clients.length} color="blue" icon="👥"/>
        <KpiCard label="Active" value={clients.filter(c=>c.is_active).length} color="green" icon="✅"/>
      </div>
      <MsgBox msg={msg}/>
      <div style={{display:'flex',gap:8,margin:'16px 0',background:T.surfaceAlt,padding:4,borderRadius:12,border:`1px solid ${T.border}`}}>
        {['clients','add client'].map(t=>(
          <button key={t} onClick={()=>{setTab(t);setSel(null)}} style={{flex:1,padding:'9px 16px',borderRadius:9,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:"'DM Sans',sans-serif",textTransform:'capitalize',background:tab===t?T.surface:'transparent',color:tab===t?T.ink:T.inkLight,boxShadow:tab===t?'0 1px 4px rgba(0,0,0,0.08)':undefined,transition:'all .2s'}}>
            {t}
          </button>
        ))}
      </div>

      {tab==='clients'&&clients.map(c=>(
        <Card key={c.id} style={{marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14,gap:10}}>
            <div>
              <h4 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,marginBottom:3}}>{c.name}</h4>
              <p style={{fontSize:13,color:T.inkLight}}>{c.email}</p>
            </div>
            <Badge color={c.is_active?'green':'red'} dot>{c.is_active?'Active':'Inactive'}</Badge>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
            {[['Age',c.age||'—'],['Current',`${c.current_weight||'—'} kg`],['Goal',`${c.goal_weight||'—'} kg`]].map(([lbl,val])=>(
              <div key={lbl} style={{background:T.surfaceAlt,borderRadius:10,padding:'10px 12px'}}>
                <div style={{fontSize:10,color:T.inkLight,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4}}>{lbl}</div>
                <div style={{fontWeight:700,fontSize:15,fontFamily:"'Syne',sans-serif"}}>{val}</div>
              </div>
            ))}
          </div>
          <Btn variant={sel?.id===c.id?'danger':'secondary'} onClick={()=>sel?.id===c.id?setSel(null):openEdit(c)} full>
            {sel?.id===c.id?'Cancel editing':'Edit client targets'}
          </Btn>
          {sel?.id===c.id&&(
            <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
              <div style={{fontSize:12,fontWeight:700,color:T.inkLight,textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:12}}>Body stats</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
                {[['Current weight (kg)','current_weight'],['Goal weight (kg)','goal_weight'],['Start weight (kg)','start_weight']].map(([lbl,k])=>(
                  <Inp key={k} label={lbl} value={editForm[k]||''} onChange={e=>setEditForm(p=>({...p,[k]:e.target.value}))} inputMode="decimal" placeholder={String(sel?.[k]||'')}/>
                ))}
              </div>
              <div style={{fontSize:12,fontWeight:700,color:T.inkLight,textTransform:'uppercase',letterSpacing:'0.6px',marginBottom:12}}>Nutrition targets</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                {[['Calories','calories'],['Protein (g)','protein_g'],['Carbs (g)','carbs_g'],['Fats (g)','fats_g'],['Fibre (g)','fibre_g'],['Steps goal','daily_steps']].map(([lbl,k])=>(
                  <Inp key={k} label={lbl} value={editForm[k]||''} onChange={e=>setEditForm(p=>({...p,[k]:e.target.value}))} inputMode="decimal" placeholder={lbl}/>
                ))}
              </div>
              <div style={{marginBottom:14}}>
                <Inp label="Cardio target" value={editForm.cardio||''} onChange={e=>setEditForm(p=>({...p,cardio:e.target.value}))} placeholder="Daily: 20min"/>
              </div>
              <div style={{display:'flex',gap:9}}>
                <Btn onClick={saveEdit} disabled={saving} full>{saving?'Saving…':'Save all changes'}</Btn>
                <Btn variant="ghost" onClick={()=>setSel(null)} full>Cancel</Btn>
              </div>
            </div>
          )}
        </Card>
      ))}

      {tab==='add client'&&(
        <Card>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,marginBottom:18}}>Add new client</h3>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:12}}>
            {[['Full name','text','name','JOHN DOE'],['Email','email','email','john@email.com'],['Age','number','age','28'],['Height (cm)','number','height_cm','175'],['Start weight (kg)','number','start_weight','85'],['Goal weight (kg)','number','goal_weight','75'],['Start date','date','start_date',''],['End date','date','end_date','']].map(([lbl,type,key,ph])=>(
              <Inp key={key} label={lbl} type={type} value={newForm[key]} onChange={e=>setNewForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}/>
            ))}
          </div>
          <div style={{marginTop:12}}>
            <Sel label="Gender" value={newForm.gender} onChange={e=>setNewForm(p=>({...p,gender:e.target.value}))} style={{maxWidth:180}}>
              {['MALE','FEMALE','OTHER'].map(g=><option key={g}>{g}</option>)}
            </Sel>
          </div>
          <div style={{marginTop:18,display:'flex',gap:10}}>
            <Btn onClick={createClient} disabled={saving} full>{saving?'Creating…':'Create client'}</Btn>
            <Btn variant="ghost" onClick={()=>setTab('clients')} full>Cancel</Btn>
          </div>
          <div style={{marginTop:14,padding:'14px 16px',background:T.blueL,borderRadius:12,fontSize:12,color:T.blue,lineHeight:1.8,border:`1px solid rgba(26,95,212,0.15)`}}>
            <strong>Next step:</strong> Supabase → Authentication → Users → Create user (their email) → Copy UUID → Run:<br/>
            <code style={{fontSize:11,fontFamily:'monospace'}}>UPDATE clients SET auth_user_id='&lt;uuid&gt;' WHERE email='their@email.com';</code>
          </div>
        </Card>
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
    if(isDemo){setBooting(false);return}
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session){
        try{
          const userId=session.user.id
          const {data:adminRow}=await supabase.from('admins').select('id').eq('auth_user_id',userId).single()
          if(adminRow) setUser({role:'admin',name:'Admin',email:session.user.email,userId})
          else{
            const {data:profile}=await supabase.from('clients').select('*').eq('auth_user_id',userId).single()
            if(profile) setUser({role:'client',name:profile.name,email:profile.email,userId,clientId:profile.id})
          }
        }catch(e){console.error(e)}
      }
      setBooting(false)
    })
    const {data:{subscription}}=supabase.auth.onAuthStateChange(event=>{ if(event==='SIGNED_OUT') setUser(null) })
    return ()=>subscription.unsubscribe()
  },[])

  if(booting) return (
    <div style={{minHeight:'100vh',background:'#080808',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <div><img src="/logo.jpeg" alt="LevelUp Coaching" style={{ height:36, width:"auto", objectFit:"contain", display:"block" }}/></div>
      <div style={{width:40,height:3,background:`linear-gradient(90deg,${T.orange},#FFD84D)`,borderRadius:99,animation:'none'}}/>
    </div>
  )
  if(!user) return <><StyleInjector/><Login onLogin={u=>{setUser(u);setTab('dashboard')}}/></>

  const isAdmin=user.role==='admin'
  const tabs=isAdmin
    ?[['dashboard','Clients','👥'],['workout','Workouts','🏋️'],['nutrition','Nutrition','🥗'],['roadmap','Roadmap','🗺️'],['messages','Messages','💬'],['progress','Progress','📸']]
    :[['dashboard','Home','🏠'],['weight','Weight','⚖️'],['workout','Workout','🏋️'],['nutrition','Nutrition','🥗'],['roadmap','Roadmap','🗺️'],['messages','Messages','💬'],['progress','Progress','📸']]

  const logout=async()=>{ if(!isDemo) await supabase.auth.signOut(); setUser(null) }

  const Page=()=>{
    if(tab==='dashboard') return isAdmin?<AdminPanel user={user}/>:<Dashboard user={user}/>
    if(tab==='weight'&&!isAdmin) return <WeightLogger user={user}/>
    if(tab==='workout') return <WorkoutPage user={user} isAdmin={isAdmin}/>
    if(tab==='nutrition') return <NutritionPage user={user} isAdmin={isAdmin}/>
    if(tab==='roadmap') return <RoadmapPage user={user} isAdmin={isAdmin}/>
    if(tab==='messages') return <MessagesPage user={user} isAdmin={isAdmin}/>
    if(tab==='progress') return <ProgressPicsPage user={user} isAdmin={isAdmin}/>
    return null
  }

  const NavBar=()=>(
    <nav style={{background:T.navBg,padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:58,position:'sticky',top:0,zIndex:100,borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:'#fff',letterSpacing:'-0.5px',flexShrink:0}}>
        <img src="/logo.jpeg" alt="LevelUp Coaching" style={{ height:36, width:"auto", objectFit:"contain", display:"block" }}/>
        {isAdmin&&<span style={{fontSize:10,fontWeight:600,color:'rgba(255,255,255,0.5)',marginLeft:8,padding:'2px 7px',background:'rgba(241,194,50,0.15)',borderRadius:4,verticalAlign:'middle',letterSpacing:'0.5px'}}>ADMIN</span>}
      </div>
      <div style={{display:'flex',gap:2}}>
        {tabs.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:'7px 14px',borderRadius:8,border:'none',cursor:'pointer',fontSize:13,fontFamily:"'DM Sans',sans-serif",background:tab===id?T.orange:'transparent',color:tab===id?T.ink:'rgba(255,255,255,0.45)',fontWeight:tab===id?700:500,transition:'all .2s',WebkitTapHighlightColor:'transparent'}}>{label}</button>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
        <span style={{fontSize:11,color:'rgba(255,255,255,0.25)'}}>{user.email}</span>
        <button onClick={logout} style={{padding:'6px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:12,fontFamily:"'DM Sans',sans-serif",transition:'all .2s'}}>Sign out</button>
      </div>
    </nav>
  )

  return (
    <>
      <StyleInjector/>
      <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:T.bg,minHeight:'100vh',color:T.ink}}>
        {isMobile?(
          <>
            <div style={{background:T.navBg,padding:'0 16px',display:'flex',alignItems:'center',justifyContent:'space-between',height:52,position:'sticky',top:0,zIndex:100,borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <div><img src="/logo.jpeg" alt="LevelUp Coaching" style={{ height:28, width:"auto", objectFit:"contain", display:"block" }}/></div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{isAdmin?'Admin':user.name?.split(' ')[0]}</span>
                <button onClick={logout} style={{padding:'5px 10px',borderRadius:7,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>Out</button>
              </div>
            </div>
            <div style={{paddingBottom:76}}><Page/></div>
            <BottomNav tabs={tabs} tab={tab} setTab={setTab}/>
          </>
        ):(
          <>
            <NavBar/>
            <div style={{maxWidth:1080,margin:'0 auto'}}><Page/></div>
          </>
        )}
      </div>
    </>
  )
}