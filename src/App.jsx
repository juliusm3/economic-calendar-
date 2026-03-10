import { useState, useMemo } from "react";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, "0"); }
function toISO(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

function getFridaysOfMonth(year, month) {
  const fridays = [];
  const d = new Date(year, month - 1, 1);
  while (d.getMonth() === month - 1) {
    if (d.getDay() === 5) fridays.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return fridays;
}

function buildEquityOptions() {
  const events = [];
  const quadMonths = [3, 6, 9, 12];
  let id = 2000;
  for (let month = 3; month <= 6; month++) {
    const fridays = getFridaysOfMonth(2026, month);
    const thirdFri = fridays[2];
    const isQuad = quadMonths.includes(month);
    fridays.forEach((fri, i) => {
      const iso = toISO(fri);
      const isMonthly = i === 2;
      if (isMonthly) {
        events.push({ id: id++, date: iso, time: "4:00 PM ET", name: isQuad ? "Equity Quad Witching" : "Monthly Equity Options Expiry", category: "Equity Options", impact: isQuad ? "high" : "med", actual: null, forecast: null, previous: null, flag: "🇺🇸", subtype: isQuad ? "eq-quad" : "eq-monthly", note: isQuad ? "Stocks + Index Options + Index Futures + Single Stock Futures all expire" : "Standard monthly equity & ETF options expiration" });
      } else {
        events.push({ id: id++, date: iso, time: "4:00 PM ET", name: "Weekly Equity Options Expiry", category: "Equity Options", impact: "low", actual: null, forecast: null, previous: null, flag: "🇺🇸", subtype: "eq-weekly", note: "Weekly equity & ETF options expiration (0DTE)" });
      }
    });
    const vixDate = new Date(thirdFri);
    vixDate.setDate(vixDate.getDate() - 2);
    events.push({ id: id++, date: toISO(vixDate), time: "9:30 AM ET", name: "VIX Options Expiry", category: "Equity Options", impact: "med", actual: null, forecast: null, previous: null, flag: "🇺🇸", subtype: "eq-vix", note: "CBOE VIX options & futures expiration (AM settled at open)" });
  }
  return events;
}

function buildCryptoOptions() {
  const events = [];
  const cryptoQuarterMonths = [3, 6, 9, 12];
  let id = 3000;
  for (let month = 3; month <= 6; month++) {
    const fridays = getFridaysOfMonth(2026, month);
    const lastFri = fridays[fridays.length - 1];
    const isQuarterly = cryptoQuarterMonths.includes(month);
    const lastFriISO = toISO(lastFri);
    fridays.forEach((fri, i) => {
      const iso = toISO(fri);
      const isMonthlyOrQuarterly = iso === lastFriISO;
      if (isMonthlyOrQuarterly) {
        events.push({ id: id++, date: iso, time: "8:00 AM UTC", name: isQuarterly ? "BTC + ETH Quarterly Expiry" : "BTC + ETH Monthly Expiry", category: "Crypto Options", impact: isQuarterly ? "high" : "med", actual: null, forecast: null, previous: null, flag: "₿", subtype: isQuarterly ? "crypto-quarterly" : "crypto-monthly", note: isQuarterly ? "Deribit quarterly expiry — largest notional of the quarter, major volatility event" : "Deribit monthly BTC & ETH options expiry at 08:00 UTC", exchange: "Deribit" });
      } else {
        events.push({ id: id++, date: iso, time: "8:00 AM UTC", name: "BTC + ETH Weekly Expiry", category: "Crypto Options", impact: "low", actual: null, forecast: null, previous: null, flag: "₿", subtype: "crypto-weekly", note: "Deribit weekly BTC & ETH options expiry at 08:00 UTC", exchange: "Deribit" });
      }
    });
  }
  return events;
}

const ECON_EVENTS = [
  { id:1,  date:"2026-03-06", time:"8:30 AM ET",  name:"Nonfarm Payrolls",        category:"Employment", impact:"high", actual:"151K",  forecast:"160K",  previous:"125K",  flag:"🇺🇸" },
  { id:2,  date:"2026-03-06", time:"8:30 AM ET",  name:"Unemployment Rate",       category:"Employment", impact:"med",  actual:"4.1%",  forecast:"4.0%",  previous:"4.0%",  flag:"🇺🇸" },
  { id:3,  date:"2026-03-06", time:"8:30 AM ET",  name:"Avg Hourly Earnings MoM", category:"Employment", impact:"med",  actual:"0.3%",  forecast:"0.3%",  previous:"0.4%",  flag:"🇺🇸" },
  { id:4,  date:"2026-03-12", time:"8:30 AM ET",  name:"CPI MoM",                 category:"Inflation",  impact:"high", actual:null,    forecast:"0.3%",  previous:"0.5%",  flag:"🇺🇸" },
  { id:5,  date:"2026-03-12", time:"8:30 AM ET",  name:"CPI YoY",                 category:"Inflation",  impact:"high", actual:null,    forecast:"2.9%",  previous:"3.0%",  flag:"🇺🇸" },
  { id:6,  date:"2026-03-12", time:"8:30 AM ET",  name:"Core CPI MoM",            category:"Inflation",  impact:"high", actual:null,    forecast:"0.3%",  previous:"0.4%",  flag:"🇺🇸" },
  { id:7,  date:"2026-03-13", time:"8:30 AM ET",  name:"PPI MoM",                 category:"Inflation",  impact:"med",  actual:null,    forecast:"0.3%",  previous:"0.4%",  flag:"🇺🇸" },
  { id:8,  date:"2026-03-13", time:"8:30 AM ET",  name:"Core PPI MoM",            category:"Inflation",  impact:"med",  actual:null,    forecast:"0.3%",  previous:"0.3%",  flag:"🇺🇸" },
  { id:9,  date:"2026-03-17", time:"8:30 AM ET",  name:"Retail Sales MoM",        category:"Consumer",   impact:"med",  actual:null,    forecast:"0.4%",  previous:"-0.9%", flag:"🇺🇸" },
  { id:10, date:"2026-03-18", time:"8:30 AM ET",  name:"Housing Starts",          category:"Housing",    impact:"low",  actual:null,    forecast:"1.42M", previous:"1.37M", flag:"🇺🇸" },
  { id:11, date:"2026-03-18", time:"9:15 AM ET",  name:"Industrial Production",   category:"Business",   impact:"med",  actual:null,    forecast:"0.3%",  previous:"0.5%",  flag:"🇺🇸" },
  { id:12, date:"2026-03-19", time:"2:00 PM ET",  name:"FOMC Rate Decision",      category:"Fed",        impact:"high", actual:null,    forecast:"4.50%", previous:"4.50%", flag:"🇺🇸" },
  { id:13, date:"2026-03-19", time:"2:30 PM ET",  name:"Fed Press Conference",    category:"Fed",        impact:"high", actual:null,    forecast:null,    previous:null,    flag:"🇺🇸" },
  { id:14, date:"2026-03-20", time:"8:30 AM ET",  name:"Initial Jobless Claims",  category:"Employment", impact:"med",  actual:null,    forecast:"225K",  previous:"221K",  flag:"🇺🇸" },
  { id:15, date:"2026-03-26", time:"8:30 AM ET",  name:"GDP Q4 Final QoQ",        category:"GDP",        impact:"med",  actual:null,    forecast:"2.3%",  previous:"2.3%",  flag:"🇺🇸" },
  { id:16, date:"2026-03-27", time:"8:30 AM ET",  name:"PCE Price Index YoY",     category:"Inflation",  impact:"high", actual:null,    forecast:"2.5%",  previous:"2.5%",  flag:"🇺🇸" },
  { id:17, date:"2026-03-27", time:"8:30 AM ET",  name:"Core PCE MoM",            category:"Inflation",  impact:"high", actual:null,    forecast:"0.3%",  previous:"0.3%",  flag:"🇺🇸" },
  { id:18, date:"2026-03-28", time:"10:00 AM ET", name:"Consumer Sentiment",      category:"Consumer",   impact:"low",  actual:null,    forecast:"64.7",  previous:"64.7",  flag:"🇺🇸" },
  { id:19, date:"2026-04-03", time:"8:30 AM ET",  name:"Nonfarm Payrolls",        category:"Employment", impact:"high", actual:null,    forecast:"155K",  previous:"151K",  flag:"🇺🇸" },
  { id:20, date:"2026-04-03", time:"8:30 AM ET",  name:"Unemployment Rate",       category:"Employment", impact:"med",  actual:null,    forecast:"4.1%",  previous:"4.1%",  flag:"🇺🇸" },
  { id:21, date:"2026-04-10", time:"8:30 AM ET",  name:"CPI MoM",                 category:"Inflation",  impact:"high", actual:null,    forecast:"0.2%",  previous:"0.2%",  flag:"🇺🇸" },
  { id:22, date:"2026-04-10", time:"8:30 AM ET",  name:"Core CPI MoM",            category:"Inflation",  impact:"high", actual:null,    forecast:"0.3%",  previous:"0.3%",  flag:"🇺🇸" },
  { id:23, date:"2026-04-11", time:"8:30 AM ET",  name:"PPI MoM",                 category:"Inflation",  impact:"med",  actual:null,    forecast:"0.2%",  previous:"0.3%",  flag:"🇺🇸" },
  { id:24, date:"2026-04-16", time:"8:30 AM ET",  name:"Retail Sales MoM",        category:"Consumer",   impact:"med",  actual:null,    forecast:"0.4%",  previous:"0.2%",  flag:"🇺🇸" },
  { id:25, date:"2026-04-17", time:"8:30 AM ET",  name:"Initial Jobless Claims",  category:"Employment", impact:"med",  actual:null,    forecast:"220K",  previous:"223K",  flag:"🇺🇸" },
  { id:26, date:"2026-04-29", time:"8:30 AM ET",  name:"GDP Q1 Advance QoQ",      category:"GDP",        impact:"high", actual:null,    forecast:"2.1%",  previous:"2.3%",  flag:"🇺🇸" },
  { id:27, date:"2026-04-30", time:"8:30 AM ET",  name:"PCE Price Index YoY",     category:"Inflation",  impact:"high", actual:null,    forecast:"2.4%",  previous:"2.5%",  flag:"🇺🇸" },
  { id:28, date:"2026-04-30", time:"2:00 PM ET",  name:"FOMC Rate Decision",      category:"Fed",        impact:"high", actual:null,    forecast:"4.50%", previous:"4.50%", flag:"🇺🇸" },
  { id:29, date:"2026-05-08", time:"8:30 AM ET",  name:"Nonfarm Payrolls",        category:"Employment", impact:"high", actual:null,    forecast:"155K",  previous:null,    flag:"🇺🇸" },
  { id:30, date:"2026-05-13", time:"8:30 AM ET",  name:"CPI MoM",                 category:"Inflation",  impact:"high", actual:null,    forecast:null,    previous:null,    flag:"🇺🇸" },
  { id:31, date:"2026-05-14", time:"8:30 AM ET",  name:"PPI MoM",                 category:"Inflation",  impact:"med",  actual:null,    forecast:null,    previous:null,    flag:"🇺🇸" },
  { id:32, date:"2026-05-29", time:"8:30 AM ET",  name:"PCE Price Index YoY",     category:"Inflation",  impact:"high", actual:null,    forecast:null,    previous:null,    flag:"🇺🇸" },
  { id:33, date:"2026-06-05", time:"8:30 AM ET",  name:"Nonfarm Payrolls",        category:"Employment", impact:"high", actual:null,    forecast:null,    previous:null,    flag:"🇺🇸" },
  { id:34, date:"2026-06-11", time:"8:30 AM ET",  name:"CPI MoM",                 category:"Inflation",  impact:"high", actual:null,    forecast:null,    previous:null,    flag:"🇺🇸" },
  { id:35, date:"2026-06-17", time:"2:00 PM ET",  name:"FOMC Rate Decision",      category:"Fed",        impact:"high", actual:null,    forecast:null,    previous:"4.50%", flag:"🇺🇸" },
];

const EQUITY_OPTIONS = buildEquityOptions();
const CRYPTO_OPTIONS = buildCryptoOptions();
const ALL_EVENTS = [...ECON_EVENTS, ...EQUITY_OPTIONS, ...CRYPTO_OPTIONS];
const TODAY = "2026-03-10";

const IMPACT_CONFIG = { high:{label:"High",color:"#FF3B30",bg:"rgba(255,59,48,0.10)"}, med:{label:"Medium",color:"#FF9500",bg:"rgba(255,149,0,0.10)"}, low:{label:"Low",color:"#34C759",bg:"rgba(52,199,89,0.10)"} };
const CATEGORY_CONFIG = { Inflation:{color:"#FF3B30",icon:"📊"}, Employment:{color:"#007AFF",icon:"👥"}, Fed:{color:"#5856D6",icon:"🏛️"}, GDP:{color:"#34C759",icon:"📈"}, Consumer:{color:"#FF9500",icon:"🛍️"}, Housing:{color:"#00C7BE",icon:"🏠"}, Business:{color:"#AF52DE",icon:"🏭"}, "Equity Options":{color:"#FF2D55",icon:"📋"}, "Crypto Options":{color:"#F7931A",icon:"₿"} };
const SUBTYPE_CONFIG = { "eq-quad":{label:"Quad Witching",color:"#FF2D55",bg:"rgba(255,45,85,0.12)"}, "eq-monthly":{label:"Monthly Expiry",color:"#FF9500",bg:"rgba(255,149,0,0.10)"}, "eq-vix":{label:"VIX Expiry",color:"#AF52DE",bg:"rgba(175,82,222,0.10)"}, "eq-weekly":{label:"Weekly 0DTE",color:"#34C759",bg:"rgba(52,199,89,0.10)"}, "crypto-quarterly":{label:"BTC/ETH Quarterly",color:"#F7931A",bg:"rgba(247,147,26,0.14)"}, "crypto-monthly":{label:"BTC/ETH Monthly",color:"#FFB300",bg:"rgba(255,179,0,0.12)"}, "crypto-weekly":{label:"BTC/ETH Weekly",color:"#34C759",bg:"rgba(52,199,89,0.10)"} };
const MONTHS=["2026-03","2026-04","2026-05","2026-06"];
const FILTERS=["All","Inflation","Employment","Fed","GDP","Consumer","Equity Options","Crypto Options"];

function fmtDate(s){const d=new Date(s+"T12:00:00");return{weekday:d.toLocaleDateString("en-US",{weekday:"short"}),month:d.toLocaleDateString("en-US",{month:"short"}),day:d.getDate()};}
function beatsMiss(a,f){if(!a||!f)return null;const av=parseFloat(a.replace(/[^0-9.-]/g,"")),fv=parseFloat(f.replace(/[^0-9.-]/g,""));if(isNaN(av)||isNaN(fv))return null;return av>=fv?"beat":"miss";}

export default function EconomicCalendar(){
  const[activeMonth,setActiveMonth]=useState("2026-03");
  const[activeFilter,setActiveFilter]=useState("All");
  const[search,setSearch]=useState("");
  const[showEquity,setShowEquity]=useState(true);
  const[showCrypto,setShowCrypto]=useState(true);
  const filtered=useMemo(()=>ALL_EVENTS.filter(e=>{
    if(!e.date.startsWith(activeMonth))return false;
    if(!showEquity&&e.category==="Equity Options")return false;
    if(!showCrypto&&e.category==="Crypto Options")return false;
    if(activeFilter!=="All"&&e.category!==activeFilter)return false;
    if(search&&!e.name.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  }),[activeMonth,activeFilter,search,showEquity,showCrypto]);
  const grouped=useMemo(()=>{const g={};filtered.forEach(e=>{if(!g[e.date])g[e.date]=[];g[e.date].push(e);});Object.keys(g).forEach(k=>g[k].sort((a,b)=>{const o={Employment:0,Inflation:1,Fed:2,GDP:3,Consumer:4,Housing:5,Business:6,"Equity Options":7,"Crypto Options":8};return(o[a.category]??9)-(o[b.category]??9);}));return g;},[filtered]);
  const sortedDates=Object.keys(grouped).sort();
  const highCount=filtered.filter(e=>e.impact==="high").length;
  const eqCount=filtered.filter(e=>e.category==="Equity Options").length;
  const cryptoCount=filtered.filter(e=>e.category==="Crypto Options").length;
  const nextEvent=ALL_EVENTS.find(e=>e.date>=TODAY&&!e.actual&&!["Equity Options","Crypto Options"].includes(e.category));
  const nextCrypto=CRYPTO_OPTIONS.find(e=>e.date>=TODAY&&(e.subtype==="crypto-quarterly"||e.subtype==="crypto-monthly"));
  return(
    <div style={{minHeight:"100vh",background:"#F2F2F7",fontFamily:"-apple-system,'SF Pro Display',BlinkMacSystemFont,sans-serif"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}.mtab,.chip,.tbtn{cursor:pointer;border:none;transition:all .18s;}.erow:hover{background:rgba(0,0,0,.022)!important;}@keyframes fadeUp{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}.fu{animation:fadeUp .25s ease forwards;}@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.35;}}.blink{animation:pulse 2s ease-in-out infinite;}input:focus{outline:none;border-color:#007AFF!important;box-shadow:0 0 0 3px rgba(0,122,255,.15)!important;}`}</style>
      <div style={{background:"rgba(242,242,247,.9)",backdropFilter:"blur(24px)",borderBottom:"0.5px solid rgba(0,0,0,.11)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#007AFF,#5856D6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>📅</div>
            <span style={{fontSize:17,fontWeight:600,color:"#1C1C1E"}}>Economic Calendar</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button className="tbtn" onClick={()=>setShowEquity(v=>!v)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:20,background:showEquity?"rgba(255,45,85,.1)":"rgba(0,0,0,.06)",color:showEquity?"#FF2D55":"#8E8E93",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>📋 Equity {showEquity?"On":"Off"}</button>
            <button className="tbtn" onClick={()=>setShowCrypto(v=>!v)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:20,background:showCrypto?"rgba(247,147,26,.12)":"rgba(0,0,0,.06)",color:showCrypto?"#F7931A":"#8E8E93",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>₿ Crypto {showCrypto?"On":"Off"}</button>
            <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:4}}><div className="blink" style={{width:7,height:7,borderRadius:"50%",background:"#FF3B30"}}/><span style={{fontSize:12,color:"#8E8E93",fontWeight:500}}>US Markets</span></div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1160,margin:"0 auto",padding:"24px 24px 48px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:20}}>
          {[{label:"Fed Funds Rate",value:"4.25–4.50%",icon:"🏛️",sub:"No change expected"},{label:"Next Key Release",value:nextEvent?.name||"—",icon:"⚡",sub:nextEvent?`${new Date(nextEvent.date+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})} · ${nextEvent.time}`:""},{label:"High Impact Events",value:`${highCount} total`,icon:"📊",sub:`${filtered.length} releases this month`},{label:"Equity Expiries",value:`${eqCount} dates`,icon:"📋",sub:"Incl. VIX & Quad Witching"},{label:"Crypto Expiries",value:`${cryptoCount} dates`,icon:"₿",sub:nextCrypto?`Next: ${new Date(nextCrypto.date+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})} ${nextCrypto.subtype==="crypto-quarterly"?"(Quarterly)":"(Monthly)"}`:"Deribit BTC + ETH"}].map((s,i)=>(
            <div key={i} className="fu" style={{background:"#FFF",borderRadius:16,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,.06)",animationDelay:`${i*.05}s`}}>
              <div style={{fontSize:18,marginBottom:5}}>{s.icon}</div>
              <div style={{fontSize:10,color:"#8E8E93",fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:2}}>{s.label}</div>
              <div style={{fontSize:15,fontWeight:700,color:"#1C1C1E",marginBottom:1}}>{s.value}</div>
              <div style={{fontSize:10,color:"#8E8E93"}}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(247,147,26,.07),rgba(247,147,26,.03))",border:"0.5px solid rgba(247,147,26,.25)",borderRadius:12,padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:16}}>₿</span>
          <div><span style={{fontSize:12,fontWeight:600,color:"#F7931A"}}>Crypto Options (Deribit)</span><span style={{fontSize:12,color:"#8E8E93",marginLeft:8}}>Expire every <strong>Friday at 08:00 UTC</strong> — Last Friday = Monthly · Last Fri of Mar/Jun/Sep/Dec = Quarterly · Others = Weekly</span></div>
          <div style={{marginLeft:"auto",fontSize:11,color:"#8E8E93",whiteSpace:"nowrap"}}>≠ Equity 3rd-Friday rule</div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",background:"#FFF",borderRadius:12,padding:3,boxShadow:"0 1px 4px rgba(0,0,0,.08)",gap:2}}>
            {MONTHS.map(m=>(<button key={m} className="mtab" onClick={()=>setActiveMonth(m)} style={{padding:"7px 15px",borderRadius:9,fontSize:13,fontWeight:activeMonth===m?600:400,color:activeMonth===m?"#FFF":"#8E8E93",background:activeMonth===m?"#007AFF":"transparent",boxShadow:activeMonth===m?"0 2px 8px rgba(0,122,255,.32)":"none",fontFamily:"inherit"}}>{new Date(m+"-15").toLocaleDateString("en-US",{month:"short"})} {m.slice(0,4)}</button>))}
          </div>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#8E8E93"}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events" style={{paddingLeft:34,paddingRight:14,paddingTop:8,paddingBottom:8,background:"#FFF",border:"1px solid rgba(0,0,0,.1)",borderRadius:12,fontSize:13,color:"#1C1C1E",width:190,fontFamily:"inherit"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
          {FILTERS.map(f=>{const active=activeFilter===f;const cfg=CATEGORY_CONFIG[f];return(<button key={f} className="chip" onClick={()=>setActiveFilter(f)} style={{padding:"5px 13px",borderRadius:20,border:active?"none":"1px solid rgba(0,0,0,.09)",fontSize:12,fontWeight:active?600:400,color:active?"#FFF":"#3C3C43",background:active?(cfg?.color||"#007AFF"):"#FFF",boxShadow:active?`0 2px 8px ${cfg?.color||"#007AFF"}40`:"0 1px 3px rgba(0,0,0,.05)",fontFamily:"inherit"}}>{f!=="All"&&cfg?.icon&&<span style={{marginRight:4}}>{cfg.icon}</span>}{f}</button>);})}
        </div>
        <div style={{background:"#FFF",borderRadius:20,boxShadow:"0 4px 24px rgba(0,0,0,.06)",overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"88px 90px 28px 1fr 150px 88px 88px 88px",padding:"10px 20px",background:"#F9F9FB",borderBottom:"0.5px solid rgba(0,0,0,.07)"}}>
            {["Date","Time","","Event","Impact / Type","Actual","Forecast","Previous"].map((h,i)=>(<div key={i} style={{fontSize:11,fontWeight:600,color:"#8E8E93",letterSpacing:".05em",textTransform:"uppercase",textAlign:i>=5?"right":"left",paddingRight:i>=5?8:0}}>{h}</div>))}
          </div>
          {sortedDates.length===0?<div style={{padding:48,textAlign:"center",color:"#8E8E93"}}>No events found</div>:sortedDates.map((date,di)=>{
            const events=grouped[date];const{weekday,month,day}=fmtDate(date);const isPast=date<TODAY;const isToday=date===TODAY;
            return(<div key={date} className="fu" style={{animationDelay:`${di*.02}s`}}>
              {events.some(e=>e.subtype==="eq-quad")&&<div style={{background:"linear-gradient(90deg,rgba(255,45,85,.08),rgba(255,45,85,.01))",borderLeft:"3px solid #FF2D55",padding:"7px 20px",display:"flex",alignItems:"center",gap:8}}><span>⚠️</span><span style={{fontSize:12,fontWeight:600,color:"#FF2D55"}}>Equity Quadruple Witching</span><span style={{fontSize:11,color:"#8E8E93"}}>— SPX, SPY, QQQ & futures expire · Expect elevated volume</span></div>}
              {events.some(e=>e.subtype==="crypto-quarterly")&&<div style={{background:"linear-gradient(90deg,rgba(247,147,26,.08),rgba(247,147,26,.01))",borderLeft:"3px solid #F7931A",padding:"7px 20px",display:"flex",alignItems:"center",gap:8}}><span>₿</span><span style={{fontSize:12,fontWeight:600,color:"#F7931A"}}>Crypto Quarterly Expiry (Deribit)</span><span style={{fontSize:11,color:"#8E8E93"}}>— Largest BTC + ETH options expiry of the quarter · 08:00 UTC</span></div>}
              {events.map((ev,ei)=>{
                const imp=IMPACT_CONFIG[ev.impact];const catCfg=CATEGORY_CONFIG[ev.category]||{color:"#007AFF",icon:"📌"};
                const bm=beatsMiss(ev.actual,ev.forecast);const isOpts=ev.category==="Equity Options"||ev.category==="Crypto Options";
                const isCrypto=ev.category==="Crypto Options";const stCfg=isOpts?SUBTYPE_CONFIG[ev.subtype]:null;
                const rowBg=isToday&&ei===0?"rgba(0,122,255,.02)":isCrypto?"rgba(247,147,26,.012)":isOpts?"rgba(255,45,85,.012)":"transparent";
                const rowBorder=isToday&&ei===0?"3px solid #007AFF":isCrypto?`3px solid ${stCfg?.color||"#F7931A"}44`:isOpts?`3px solid ${stCfg?.color||"#FF2D55"}44`:"3px solid transparent";
                return(<div key={ev.id} className="erow" style={{display:"grid",gridTemplateColumns:"88px 90px 28px 1fr 150px 88px 88px 88px",padding:"10px 20px",borderBottom:(ei<events.length-1||di<sortedDates.length-1)?"0.5px solid rgba(0,0,0,.05)":"none",background:rowBg,opacity:isPast?.52:1,alignItems:"center",borderLeft:rowBorder}}>
                  <div>{ei===0&&<div><div style={{fontWeight:600,fontSize:13,color:isToday?"#007AFF":"#1C1C1E"}}>{month} {day}</div><div style={{fontSize:11,color:"#8E8E93"}}>{isToday?<span style={{color:"#007AFF",fontWeight:600}}>Today</span>:weekday}</div></div>}</div>
                  <div style={{fontSize:11,color:"#8E8E93"}}>{ev.time}</div>
                  <div style={{fontSize:ev.flag==="₿"?13:15}}>{ev.flag}</div>
                  <div><div style={{fontSize:14,fontWeight:500,color:"#1C1C1E"}}>{ev.name}</div><div style={{display:"flex",alignItems:"center",gap:5,marginTop:2,flexWrap:"wrap"}}><span style={{fontSize:10,fontWeight:600,color:catCfg.color,background:catCfg.color+"14",padding:"1px 7px",borderRadius:6}}>{ev.category}</span>{ev.exchange&&<span style={{fontSize:10,color:"#8E8E93",background:"rgba(0,0,0,.04)",padding:"1px 6px",borderRadius:5}}>{ev.exchange}</span>}{isOpts&&ev.note&&<span style={{fontSize:10,color:"#8E8E93",fontStyle:"italic",maxWidth:260,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{ev.note}</span>}</div></div>
                  <div style={{display:"flex",alignItems:"center"}}>{isOpts&&stCfg?(<div style={{display:"flex",alignItems:"center",gap:5,background:stCfg.bg,borderRadius:20,padding:"3px 10px"}}><div style={{width:6,height:6,borderRadius:"50%",background:stCfg.color}}/><span style={{fontSize:11,fontWeight:600,color:stCfg.color}}>{stCfg.label}</span></div>):(<div style={{display:"flex",alignItems:"center",gap:5,background:imp.bg,borderRadius:20,padding:"3px 10px"}}><div style={{width:6,height:6,borderRadius:"50%",background:imp.color}}/><span style={{fontSize:11,fontWeight:600,color:imp.color}}>{imp.label}</span></div>)}</div>
                  <div style={{textAlign:"right",paddingRight:8}}>{ev.actual?<span style={{fontSize:14,fontWeight:700,color:bm==="beat"?"#34C759":bm==="miss"?"#FF3B30":"#1C1C1E"}}>{ev.actual}</span>:<span style={{fontSize:13,color:"#C7C7CC"}}>—</span>}</div>
                  <div style={{textAlign:"right",paddingRight:8}}><span style={{fontSize:13,color:ev.forecast?"#3C3C43":"#C7C7CC"}}>{ev.forecast||"—"}</span></div>
                  <div style={{textAlign:"right",paddingRight:8}}><span style={{fontSize:13,color:ev.previous?"#8E8E93":"#C7C7CC"}}>{ev.previous||"—"}</span></div>
                </div>);
              })}
            </div>);
          })}
        </div>
        <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,color:"#8E8E93",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Econ Impact:</span>
            {Object.entries(IMPACT_CONFIG).map(([k,v])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:4,marginRight:6}}><div style={{width:7,height:7,borderRadius:"50%",background:v.color}}/><span style={{fontSize:11,color:"#8E8E93"}}>{v.label}</span></div>))}
            <span style={{fontSize:11,color:"#8E8E93",marginLeft:10}}>Actual:</span>
            <span style={{fontSize:11,color:"#34C759",fontWeight:600,marginLeft:4}}>↑ Beat</span>
            <span style={{fontSize:11,color:"#FF3B30",fontWeight:600,marginLeft:6}}>↓ Miss</span>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,color:"#8E8E93",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Options:</span>
            {Object.entries(SUBTYPE_CONFIG).map(([k,v])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:4,marginRight:8}}><div style={{width:7,height:7,borderRadius:"50%",background:v.color}}/><span style={{fontSize:11,color:"#8E8E93"}}>{v.label}</span></div>))}
          </div>
        </div>
      </div>
    </div>
  );
}
