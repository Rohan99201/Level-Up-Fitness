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
  // Brand
  orange:    '#FF5C00',
  orangeD:   '#E05000',
  orangeL:   '#FFF3ED',
  // Neutrals
  bg:        '#F7F5F2',
  surface:   '#FFFFFF',
  surfaceAlt:'#FAFAF8',
  border:    'rgba(0,0,0,0.08)',
  borderMid: 'rgba(0,0,0,0.14)',
  ink:       '#0F0F0F',
  inkMid:    '#4A4A4A',
  inkLight:  '#8A8A8A',
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
  // Dark nav
  navBg:     '#0C0C0C',
}

// Global font injection
const STYLE_TAG = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.ink}; font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  input, select, textarea, button { font-family: inherit; }
  input[type=text], input[type=number], input[type=email], input[type=date], input[type=password], select, textarea { font-size: 16px !important; }
  ::selection { background: ${T.orange}; color: #fff; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 2px; }
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
    primary:   { background: T.orange,   color:'#fff',    boxShadow:'0 2px 8px rgba(255,92,0,0.35)' },
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
    <div>
      {label && <label style={{ fontSize:11, fontWeight:600, color:T.inkLight, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:6, display:'block' }}>{label}</label>}
      <input {...props} style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:15, outline:'none', boxSizing:'border-box', background:T.surface, color:T.ink, transition:'border-color .15s', fontFamily:"'DM Sans',sans-serif", ...(props.style||{}) }}
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
        <div style={{ fontSize:28, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", letterSpacing:'-1px' }}>LEVELUP📈</div>
        <div>
          <div style={{ fontSize:48, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", lineHeight:1.1, letterSpacing:'-2px', marginBottom:20 }}>
            Train smarter.<br/><span style={{ color:T.orange }}>Level up.</span>
          </div>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>
            Your personalised coaching portal — workouts, nutrition, and progress tracking in one place.
          </p>
        </div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>© 2026 LevelUp Coaching</div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', minWidth:0 }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          {/* Logo (mobile) */}
          <div style={{ fontSize:24, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", letterSpacing:'-0.5px', marginBottom:36, textAlign:'center' }}>
            LEVELUP📈
          </div>

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
              <button type="submit" disabled={loading} style={{ padding:'13px', borderRadius:12, border:'none', cursor:loading?'wait':'pointer', fontWeight:700, fontSize:15, background: loading?'rgba(255,92,0,0.5)':T.orange, color:'#fff', fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 16px rgba(255,92,0,0.4)', transition:'all .2s', marginTop:4 }}>
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
      <div style={{ background:`linear-gradient(135deg, ${T.ink} 0%, #2a1a10 100%)`, borderRadius:20, padding: isMobile?'20px':'28px 32px', marginBottom:20, position:'relative', overflow:'hidden' }}>
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
              <div style={{ height:6, width:`${pct}%`, background:`linear-gradient(90deg,${T.orange},#FF8C00)`, borderRadius:99, transition:'width 1s cubic-bezier(.4,0,.2,1)', boxShadow:'0 0 12px rgba(255,92,0,0.5)' }}/>
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
          <Inp label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
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

// ─── WORKOUT PAGE ─────────────────────────────────────────────────────────────
function WorkoutPage({ user, isAdmin }) {
  const { clients, selClientId, setSelClientId, clientId }=useAdminClient(user, isAdmin)
  const [program,setProgram]=useState([])
  const [logs,setLogs]=useState([])
  const [dayIdx,setDayIdx]=useState(0)
  const [week,setWeek]=useState(1)
  const [inputs,setInputs]=useState({})
  const [saving,setSaving]=useState('')
  const [showDayPicker,setShowDayPicker]=useState(false)
  const [showAddModal,setShowAddModal]=useState(false)
  const [editEx,setEditEx]=useState(null)
  const [exForm,setExForm]=useState({day_number:1,workout_type:'Legs',exercise_name:'',set_rep:'',tempo:'3010',rest_seconds:120,sets:3,video_url:''})
  const [formMsg,setFormMsg]=useState('')
  const isMobile=useIsMobile()
  const isDemoMode=isDemo||clientId==='demo'||!clientId

  const load=async()=>{
    if (isDemoMode){setProgram(DEMO.workoutProgram);return}
    const d=await sbQuery('workout_programs',{eq:{client_id:clientId},order:'day_number',asc:true})
    setProgram(d||[])
  }
  const loadLogs=async()=>{
    if (isDemoMode) return
    const d=await sbQuery('workout_logs',{eq:{client_id:clientId,week},order:'logged_at',asc:false})
    setLogs(d||[])
  }
  useEffect(()=>{ if(clientId) load() },[clientId])
  useEffect(()=>{ if(clientId) loadLogs() },[clientId,week])

  const days=[...new Set(program.map(p=>p.day_number))].sort((a,b)=>a-b)
  const selDay=days[dayIdx]||1
  const dayExs=program.filter(p=>p.day_number===selDay)
  const dayType=dayExs[0]?.workout_type||''

  const logSet=async(exName,setNum)=>{
    const key=`${exName}_${setNum}`,inp=inputs[key]||{}
    if (!inp.reps&&!inp.weight) return; setSaving(key)
    try {
      const entry={client_id:clientId,week,day_number:selDay,exercise_name:exName,set_number:setNum,reps:parseInt(inp.reps)||0,weight_kg:parseFloat(inp.weight)||0}
      if (isDemoMode) setLogs(prev=>[...prev,{id:Date.now(),...entry}])
      else { const saved=await sbInsert('workout_logs',entry); setLogs(prev=>[...prev,saved]) }
      setInputs(prev=>({...prev,[key]:{reps:'',weight:''}}))
    } catch(e){console.error(e)} finally{setSaving('')}
  }
  const getLog=(exName,setNum)=>logs.find(l=>l.exercise_name===exName&&l.set_number===setNum&&l.day_number===selDay)

  const saveExercise=async()=>{
    setFormMsg(''); if(!exForm.exercise_name){setFormMsg('Error: Name required');return}
    try {
      if (isDemoMode){
        if(editEx) setProgram(prev=>prev.map(p=>p.id===editEx.id?{...p,...exForm}:p))
        else setProgram(prev=>[...prev,{id:'w'+Date.now(),...exForm,client_id:clientId}])
      } else {
        if(editEx) await sbUpdate('workout_programs',editEx.id,exForm)
        else await sbInsert('workout_programs',{...exForm,client_id:clientId})
        await load()
      }
      setFormMsg('✓ Saved'); setTimeout(()=>{setShowAddModal(false);setEditEx(null);setFormMsg('')},700)
      setExForm({day_number:1,workout_type:'Legs',exercise_name:'',set_rep:'',tempo:'3010',rest_seconds:120,sets:3,video_url:''})
    } catch(e){setFormMsg(`Error: ${e.message}`)}
  }
  const deleteExercise=async(ex)=>{
    if(!window.confirm(`Delete "${ex.exercise_name}"?`)) return
    if(isDemoMode){setProgram(prev=>prev.filter(p=>p.id!==ex.id));return}
    try{ await sbDelete('workout_programs',ex.id); await load() }catch(e){alert(e.message)}
  }
  const openEditEx=(ex)=>{ setEditEx(ex); setExForm({day_number:ex.day_number,workout_type:ex.workout_type,exercise_name:ex.exercise_name,set_rep:ex.set_rep||'',tempo:ex.tempo||'3010',rest_seconds:ex.rest_seconds||120,sets:ex.sets||3,video_url:ex.video_url||''}); setShowAddModal(true) }

  const ExForm=(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Inp label="Day number" type="number" value={exForm.day_number} onChange={e=>setExForm(p=>({...p,day_number:parseInt(e.target.value)||1}))} min="1" max="7"/>
        <Inp label="Workout type" value={exForm.workout_type} onChange={e=>setExForm(p=>({...p,workout_type:e.target.value}))} placeholder="Legs, Push…"/>
      </div>
      <Inp label="Exercise name *" value={exForm.exercise_name} onChange={e=>setExForm(p=>({...p,exercise_name:e.target.value}))} placeholder="Incline Db press"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Inp label="Set & Rep" value={exForm.set_rep} onChange={e=>setExForm(p=>({...p,set_rep:e.target.value}))} placeholder="3x9-11"/>
        <Inp label="Tempo" value={exForm.tempo} onChange={e=>setExForm(p=>({...p,tempo:e.target.value}))} placeholder="3010"/>
        <Inp label="Rest (sec)" type="number" value={exForm.rest_seconds} onChange={e=>setExForm(p=>({...p,rest_seconds:parseInt(e.target.value)||120}))}/>
        <Inp label="Sets" type="number" value={exForm.sets} onChange={e=>setExForm(p=>({...p,sets:parseInt(e.target.value)||3}))}/>
      </div>
      <Inp label="Video URL" value={exForm.video_url} onChange={e=>setExForm(p=>({...p,video_url:e.target.value}))} placeholder="https://youtu.be/…"/>
      <MsgBox msg={formMsg}/>
      <div style={{display:'flex',gap:9,marginTop:4}}>
        <Btn onClick={saveExercise} full>{editEx?'Save changes':'Add exercise'}</Btn>
        <Btn variant="ghost" onClick={()=>{setShowAddModal(false);setEditEx(null)}} full>Cancel</Btn>
      </div>
    </div>
  )

  return (
    <div style={{padding:'20px 16px 24px',maxWidth:1080,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <SectionHeader title="Workout" sub="Track your sets & progress" action={null}/>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          {isAdmin&&<ClientSelector clients={clients} selClientId={selClientId} setSelClientId={setSelClientId}/>}
          {isAdmin&&<Btn variant="green" small onClick={()=>{setEditEx(null);setShowAddModal(true)}}>+ Add</Btn>}
          <div style={{display:'flex',alignItems:'center',gap:6,background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:'4px 4px 4px 12px'}}>
            <span style={{fontSize:12,color:T.inkLight,fontWeight:600}}>Week</span>
            <select value={week} onChange={e=>setWeek(Number(e.target.value))} style={{border:'none',background:'transparent',fontSize:14,fontWeight:600,color:T.ink,outline:'none',fontFamily:"'DM Sans',sans-serif",padding:'4px 8px',cursor:'pointer'}}>
              {Array.from({length:48},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Day tabs */}
      {isMobile?(
        <div style={{marginBottom:16}}>
          <button onClick={()=>setShowDayPicker(!showDayPicker)} style={{width:'100%',padding:'12px 16px',background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:12,display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>
            <span>Day {selDay} — {dayType}</span><span style={{color:T.orange}}>{showDayPicker?'▲':'▼'}</span>
          </button>
          {showDayPicker&&(
            <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,marginTop:6,overflow:'hidden',boxShadow:'0 8px 24px rgba(0,0,0,0.1)'}}>
              {days.map((d,i)=>{ const t=program.find(p=>p.day_number===d)?.workout_type||''; return (
                <button key={d} onClick={()=>{setDayIdx(i);setShowDayPicker(false)}} style={{width:'100%',padding:'13px 16px',background:dayIdx===i?T.orangeL:T.surface,border:'none',borderBottom:`1px solid ${T.border}`,textAlign:'left',cursor:'pointer',fontSize:14,color:dayIdx===i?T.orange:T.ink,fontWeight:dayIdx===i?700:400,fontFamily:"'DM Sans',sans-serif"}}>Day {d} — {t}</button>
              )})}
            </div>
          )}
        </div>
      ):(
        <div style={{display:'flex',gap:6,marginBottom:18,flexWrap:'wrap'}}>
          {days.map((d,i)=>{ const t=program.find(p=>p.day_number===d)?.workout_type||''; return (
            <button key={d} onClick={()=>setDayIdx(i)} style={{padding:'8px 16px',borderRadius:20,border:`1.5px solid ${dayIdx===i?T.orange:T.border}`,background:dayIdx===i?T.orange:T.surface,color:dayIdx===i?'#fff':T.inkMid,fontWeight:600,fontSize:13,cursor:'pointer',transition:'all .2s',fontFamily:"'DM Sans',sans-serif"}}>Day {d} · {t}</button>
          )})}
        </div>
      )}

      {showAddModal&&<Modal title={editEx?`Edit: ${editEx.exercise_name}`:'Add exercise'} onClose={()=>{setShowAddModal(false);setEditEx(null)}}>{ExForm}</Modal>}

      {dayType==='Rest'?(
        <Card style={{textAlign:'center',padding:'60px 24px',background:`linear-gradient(135deg,${T.surfaceAlt},${T.surface})`}}>
          <div style={{fontSize:52,marginBottom:12}}>😴</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,marginBottom:8}}>Rest & Recovery</h2>
          <p style={{color:T.inkLight,fontSize:14}}>Sleep well, hydrate, light stretching only</p>
        </Card>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {dayExs.map((ex,i)=>(
            <Card key={ex.id||i} style={{padding:'18px 20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12,gap:10}}>
                <div style={{flex:1}}>
                  <h4 style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,marginBottom:6}}>{ex.exercise_name}</h4>
                  <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                    <Badge color="blue">{ex.set_rep}</Badge>
                    <Badge color="amber">{ex.tempo}</Badge>
                    {ex.rest_seconds&&<Badge color="gray">Rest {ex.rest_seconds}s</Badge>}
                    {ex.video_url&&<a href={ex.video_url} target="_blank" rel="noreferrer" style={{fontSize:11,color:T.orange,textDecoration:'none',fontWeight:600,padding:'3px 9px',background:T.orangeL,borderRadius:20}}>▶ Watch</a>}
                  </div>
                </div>
                {isAdmin&&(
                  <div style={{display:'flex',gap:6,flexShrink:0}}>
                    <Btn variant="ghost" small onClick={()=>openEditEx(ex)}>Edit</Btn>
                    <Btn variant="danger" small onClick={()=>deleteExercise(ex)}>✕</Btn>
                  </div>
                )}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {Array.from({length:ex.sets||2},(_,si)=>{
                  const setNum=si+1,key=`${ex.exercise_name}_${setNum}`,done=getLog(ex.exercise_name,setNum)
                  return (
                    <div key={si} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:done?T.greenL:T.surfaceAlt,borderRadius:10,border:`1px solid ${done?'rgba(26,122,74,0.15)':T.border}`}}>
                      <div style={{width:26,height:26,borderRadius:'50%',background:done?T.green:T.border,color:done?'#fff':T.inkLight,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{setNum}</div>
                      {done?(
                        <span style={{fontSize:13,fontWeight:600,color:T.green}}>✓ {done.reps} reps @ {done.weight_kg} kg</span>
                      ):(
                        <div style={{display:'flex',gap:8,flex:1,flexWrap:'wrap'}}>
                          <input value={inputs[key]?.reps||''} onChange={e=>setInputs(p=>({...p,[key]:{...p[key],reps:e.target.value}}))} placeholder="Reps" inputMode="numeric" style={{flex:1,minWidth:70,padding:'7px 10px',borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:15,outline:'none',fontFamily:"'DM Sans',sans-serif"}}/>
                          <input value={inputs[key]?.weight||''} onChange={e=>setInputs(p=>({...p,[key]:{...p[key],weight:e.target.value}}))} placeholder="kg" inputMode="decimal" style={{flex:1,minWidth:70,padding:'7px 10px',borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:15,outline:'none',fontFamily:"'DM Sans',sans-serif"}}/>
                          <Btn small onClick={()=>logSet(ex.exercise_name,setNum)} disabled={saving===key} style={{flexShrink:0}}>{saving===key?'…':'Log'}</Btn>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
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
              <button key={dt} onClick={()=>setDietType(dt)} style={{padding:'7px 16px',borderRadius:20,border:`1.5px solid ${dietType===dt?T.orange:T.border}`,background:dietType===dt?T.orange:T.surface,color:dietType===dt?'#fff':T.inkMid,fontWeight:600,fontSize:13,cursor:'pointer',transition:'all .2s',fontFamily:"'DM Sans',sans-serif"}}>{dt}</button>
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
          <button key={t} onClick={()=>{setTab(t);setSel(null)}} style={{flex:1,padding:'9px 16px',borderRadius:9,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:"'DM Sans',sans-serif",textTransform:'capitalize',background:tab===t?T.surface:T.transparent,color:tab===t?T.ink:T.inkLight,boxShadow:tab===t?'0 1px 4px rgba(0,0,0,0.08)':undefined,transition:'all .2s'}}>
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
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:'#fff',letterSpacing:'-1px'}}>LEVELUP📈</div>
      <div style={{width:40,height:3,background:`linear-gradient(90deg,${T.orange},#FF8C00)`,borderRadius:99,animation:'none'}}/>
    </div>
  )
  if(!user) return <><StyleInjector/><Login onLogin={u=>{setUser(u);setTab('dashboard')}}/></>

  const isAdmin=user.role==='admin'
  const tabs=isAdmin
    ?[['dashboard','Clients','👥'],['workout','Workouts','🏋️'],['nutrition','Nutrition','🥗'],['roadmap','Roadmap','🗺️']]
    :[['dashboard','Home','🏠'],['weight','Weight','⚖️'],['workout','Workout','🏋️'],['nutrition','Nutrition','🥗'],['roadmap','Roadmap','🗺️']]

  const logout=async()=>{ if(!isDemo) await supabase.auth.signOut(); setUser(null) }

  const Page=()=>{
    if(tab==='dashboard') return isAdmin?<AdminPanel user={user}/>:<Dashboard user={user}/>
    if(tab==='weight'&&!isAdmin) return <WeightLogger user={user}/>
    if(tab==='workout') return <WorkoutPage user={user} isAdmin={isAdmin}/>
    if(tab==='nutrition') return <NutritionPage user={user} isAdmin={isAdmin}/>
    if(tab==='roadmap') return <RoadmapPage user={user} isAdmin={isAdmin}/>
    return null
  }

  const NavBar=()=>(
    <nav style={{background:T.navBg,padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:58,position:'sticky',top:0,zIndex:100,borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:'#fff',letterSpacing:'-0.5px',flexShrink:0}}>
        LEVELUP<span style={{color:T.orange}}>📈</span>
        {isAdmin&&<span style={{fontSize:10,fontWeight:400,color:'rgba(255,255,255,0.25)',marginLeft:8,verticalAlign:'middle'}}>admin</span>}
      </div>
      <div style={{display:'flex',gap:2}}>
        {tabs.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:'7px 14px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:tab===id?T.orange:'transparent',color:tab===id?'#fff':'rgba(255,255,255,0.4)',transition:'all .2s',WebkitTapHighlightColor:'transparent'}}>{label}</button>
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
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:'#fff',letterSpacing:'-0.3px'}}>LEVELUP<span style={{color:T.orange}}>📈</span></div>
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