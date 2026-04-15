import { useState, useEffect, useRef } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ═══════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════
const SUPABASE_URL = "https://utdtrhhwcylzokzzomyl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZHRyaGh3Y3lsem9renpvbXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNDMxMzYsImV4cCI6MjA5MTgxOTEzNn0.allG3a-4GGse73DYoMOK5d0w-5KcWdT-KQ64RtFcBTQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ═══════════════════════════════════════
// CURRICULUM DATA
// ═══════════════════════════════════════
const CURRICULUM = {
  s1: [
    { code:"CAF601", titre:"Chimie des aliments fonctionnels et nutraceutiques", prof:"Prof. Dibwe", credits:6, couleur:"#1A3A6B",
      ecs:[{code:"CAF601.1",titre:"Chimie des aliments fonctionnels",prof:"Prof. Dibwe"},{code:"CAF601.2",titre:"Nutraceutiques",prof:"Prof. Dibwe"}]},
    { code:"CAD602", titre:"Chimie des denrées alimentaires et nutrition", prof:"Prof. Mputu / Prof. Kilunga", credits:6, couleur:"#2D6A4F",
      ecs:[{code:"CAD602.1",titre:"Chimie des denrées alimentaires",prof:"Prof. Mputu"},{code:"CAD602.2",titre:"Nutriments alimentaires et diététique",prof:"Prof. Kilunga"}]},
    { code:"TBA603", titre:"Techniques bio-analytiques avancées", prof:"Prof. Nsiama / Prof. Dibwe", credits:6, couleur:"#6B3A1A",
      ecs:[{code:"TBA603.1",titre:"Analyse avancée des biomolécules",prof:"Prof. Nsiama"},{code:"TBA603.2",titre:"Analyse biochimique appliquée aux aliments",prof:"Prof. Dibwe"}]},
    { code:"BMA604", titre:"Biochimie métabolique avancée", prof:"Prof. Kimbadi / Prof. Nsiama / Prof. Dibwe", credits:8, couleur:"#5A1A6B",
      ecs:[{code:"BMA604.1",titre:"Biochimie des protéines",prof:"Prof. Kimbadi"},{code:"BMA604.2",titre:"Biochimie des acides nucléiques",prof:"Prof. Nsiama"},{code:"BMA604.3",titre:"Biochimie des glucides et lipides",prof:"Prof. Dibwe"}]},
    { code:"CAQ605", titre:"Contrôle et assurance qualité des aliments", prof:"Prof. Tuakuila", credits:4, couleur:"#3D1A00",
      ecs:[{code:"CAQ605",titre:"Contrôle et assurance qualité des aliments",prof:"Prof. Tuakuila"}]},
  ],
  s2: [
    { code:"DFP606", titre:"Développement et formulation des produits alimentaires", prof:"Prof. Mputu / Prof. Malumba", credits:6, couleur:"#1A6B5A",
      ecs:[{code:"DFP606.1",titre:"Développement de produits alimentaires",prof:"Prof. Mputu"},{code:"DFP606.2",titre:"Formulation et analyse des produits alimentaires",prof:"Prof. Malumba (Foma)"}]},
    { code:"MAI607", titre:"Microbiologie alimentaire et industrielle", prof:"Prof. Dibwe / Prof. Ntumba", credits:6, couleur:"#003049",
      ecs:[{code:"MAI607.1",titre:"Microbiologie alimentaire",prof:"Prof. Dibwe"},{code:"MAI607.2",titre:"Biotechnologie industrielle",prof:"Prof. Ntumba"}]},
    { code:"IPP608", titre:"Ingénierie des protéines", prof:"Prof. Kimbadi", credits:6, couleur:"#6B1A3A",
      ecs:[{code:"IPP608.1",titre:"Ingénierie des protéines",prof:"Prof. Kimbadi"},{code:"IPP608.2",titre:"Évolution dirigée des protéines et biomodélisation",prof:"Prof. Kimbadi"}]},
    { code:"BTA609", titre:"Biotechnologie alimentaire", prof:"Prof. Mputu / À compléter", credits:8, couleur:"#2D3A6B",
      ecs:[{code:"BTA609.1",titre:"Principes fondamentaux de la biotechnologie alimentaire",prof:"Prof. Mputu"},{code:"BTA609.2",titre:"Avancées technologiques en biotechnologie alimentaire",prof:"Prof. Mputu"},{code:"BTA609.3",titre:"Applications pratiques de la biotechnologie alimentaire",prof:"À compléter"}]},
  ]
};

const ANNOUNCEMENTS = [
  {id:1,date:"10 Avr 2025",titre:"Examen TBA603 reporté au 22 Avril",auteur:"Secrétariat Académique",urgent:true,icon:"⚠️"},
  {id:2,date:"08 Avr 2025",titre:"Supports BMA604.1 disponibles en bibliothèque",auteur:"Prof. Kimbadi",urgent:false,icon:"📥"},
  {id:3,date:"05 Avr 2025",titre:"Inscriptions soutenance de mémoire — limite 30 Avr",auteur:"Administration",urgent:false,icon:"📋"},
  {id:4,date:"01 Avr 2025",titre:"TP CAQ605 : port de la blouse obligatoire",auteur:"Prof. Tuakuila",urgent:false,icon:"🔬"},
];

const SCHEDULE = {
  Lundi:[
    {heure:"08:00–10:00",cours:"CAF601.1",label:"Chimie des aliments fonctionnels",salle:"Amphi A",prof:"Prof. Dibwe",type:"CM"},
    {heure:"10:30–12:30",cours:"BMA604.1",label:"Biochimie des protéines",salle:"Salle 12",prof:"Prof. Kimbadi",type:"TD"},
  ],
  Mardi:[
    {heure:"08:00–10:00",cours:"TBA603.1",label:"Analyse des biomolécules",salle:"Labo Biochimie",prof:"Prof. Nsiama",type:"TP"},
    {heure:"14:00–16:00",cours:"CAD602.1",label:"Chimie des denrées alimentaires",salle:"Amphi B",prof:"Prof. Mputu",type:"CM"},
  ],
  Mercredi:[
    {heure:"08:00–10:00",cours:"BMA604.3",label:"Glucides et lipides",salle:"Salle 08",prof:"Prof. Dibwe",type:"CM"},
    {heure:"10:30–12:30",cours:"CAQ605",label:"Contrôle qualité des aliments",salle:"Salle 15",prof:"Prof. Tuakuila",type:"TD"},
  ],
  Jeudi:[
    {heure:"08:00–10:00",cours:"CAD602.2",label:"Nutriments et diététique",salle:"Amphi A",prof:"Prof. Kilunga",type:"CM"},
    {heure:"10:30–12:30",cours:"BMA604.2",label:"Biochimie des acides nucléiques",salle:"Labo Biochimie",prof:"Prof. Nsiama",type:"TP"},
    {heure:"14:00–16:00",cours:"CAF601.2",label:"Nutraceutiques",salle:"Salle 12",prof:"Prof. Dibwe",type:"CM"},
  ],
  Vendredi:[
    {heure:"08:00–10:00",cours:"TBA603.2",label:"Biochimie appliquée aux aliments",salle:"Labo Chim. Alim.",prof:"Prof. Dibwe",type:"TP"},
    {heure:"10:30–12:30",cours:"CAF601.1",label:"Révisions / Exercices dirigés",salle:"Salle 10",prof:"Prof. Dibwe",type:"TD"},
  ],
};

const LIBRARY = [
  {id:1,titre:"Chimie des aliments fonctionnels — Cours complet S1",cours:"CAF601.1",type:"PDF",size:"4.2 MB",date:"08 Avr",icon:"📄"},
  {id:2,titre:"Nutraceutiques — Introduction et applications cliniques",cours:"CAF601.2",type:"PDF",size:"2.8 MB",date:"08 Avr",icon:"📄"},
  {id:3,titre:"Techniques analytiques avancées — Présentation CM",cours:"TBA603.1",type:"PPT",size:"8.5 MB",date:"03 Avr",icon:"📊"},
  {id:4,titre:"Biochimie des protéines — Manuel de référence",cours:"BMA604.1",type:"PDF",size:"12.1 MB",date:"01 Avr",icon:"📄"},
  {id:5,titre:"Contrôle qualité — Normes ISO & Codex Alimentarius",cours:"CAQ605",type:"PDF",size:"3.7 MB",date:"28 Mar",icon:"📄"},
];

// ═══════════════════════════════════════
// STYLES GLOBAUX
// ═══════════════════════════════════════
const G = {
  navy:"#0B1F4B", gold:"#C8A951", goldLight:"#F0D98C", cream:"#F2EDE2",
  cardBg:"#FFFFFF", cardBorder:"#E8DEC8", textDark:"#0B1F4B", textMid:"#5C5040", textLight:"#9B8B70",
};

// ═══════════════════════════════════════
// AUTH PAGES
// ═══════════════════════════════════════
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | register | reset
  const [form, setForm] = useState({ nom:"", prenom:"", matricule:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text:"", type:"" });

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const showMsg = (text, type="error") => setMsg({ text, type });

  const handleLogin = async () => {
    if (!form.email || !form.password) return showMsg("Veuillez remplir tous les champs.");
    setLoading(true); setMsg({ text:"", type:"" });
    const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) showMsg("Email ou mot de passe incorrect.");
    else onAuth(data.user);
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.nom || !form.prenom || !form.matricule || !form.email || !form.password) return showMsg("Tous les champs sont obligatoires.");
    if (form.password.length < 6) return showMsg("Le mot de passe doit contenir au moins 6 caractères.");
    if (form.password !== form.confirm) return showMsg("Les mots de passe ne correspondent pas.");
    setLoading(true); setMsg({ text:"", type:"" });
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { nom: form.nom, prenom: form.prenom, matricule: form.matricule, filiere: "Master 1 — Chimie Alimentaire & Biochimie" } }
    });
    if (error) showMsg(error.message);
    else showMsg("Compte créé ! Vérifiez votre email pour confirmer votre inscription.", "success");
    setLoading(false);
  };

  const handleReset = async () => {
    if (!form.email) return showMsg("Entrez votre adresse email.");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(form.email);
    if (error) showMsg(error.message);
    else showMsg("Email de réinitialisation envoyé ! Vérifiez votre boîte mail.", "success");
    setLoading(false);
  };

  const inputStyle = { width:"100%", border:`1px solid ${G.cardBorder}`, borderRadius:8, padding:"10px 14px", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:"#FDFAF5", color:G.textDark };
  const btnStyle = (primary) => ({ width:"100%", background: primary ? G.navy : "#EDE7DA", color: primary ? G.goldLight : G.textMid, border:"none", borderRadius:8, padding:"12px", fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily:"inherit" });
  const tabStyle = (active) => ({ flex:1, padding:"10px", border:"none", background: active ? G.navy : "transparent", color: active ? G.goldLight : G.textLight, fontSize:13, fontWeight: active ? 700 : 400, cursor:"pointer", borderRadius:8, fontFamily:"inherit", transition:"all 0.15s" });

  return (
    <div style={{ minHeight:"100vh", background: G.cream, display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"'Source Sans 3', sans-serif" }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>⚗️</div>
          <h1 style={{ fontFamily:"'Playfair Display', serif", color:G.navy, fontSize:22, fontWeight:700, margin:"0 0 6px" }}>Portail Académique UNIKIN</h1>
          <p style={{ color:G.textLight, fontSize:13, margin:0 }}>Master 1 — Chimie Alimentaire & Biochimie · 2024–2025</p>
        </div>

        {/* Card */}
        <div style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:16, padding:"24px 24px 20px", boxShadow:"0 4px 24px rgba(11,31,75,0.08)" }}>
          {/* Tabs */}
          {mode !== "reset" && (
            <div style={{ display:"flex", background:"#F7F3EC", borderRadius:8, padding:3, marginBottom:22, gap:3 }}>
              <button style={tabStyle(mode==="login")} onClick={() => { setMode("login"); setMsg({text:"",type:""}); }}>Se connecter</button>
              <button style={tabStyle(mode==="register")} onClick={() => { setMode("register"); setMsg({text:"",type:""}); }}>Créer un compte</button>
            </div>
          )}

          {/* Reset password */}
          {mode === "reset" && (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
                <button onClick={() => setMode("login")} style={{ border:"none", background:"transparent", cursor:"pointer", color:G.textLight, fontSize:16 }}>←</button>
                <h3 style={{ fontSize:15, fontWeight:700, color:G.navy, margin:0 }}>Mot de passe oublié</h3>
              </div>
              <p style={{ fontSize:13, color:G.textLight, marginBottom:16 }}>Entrez votre email et nous vous enverrons un lien de réinitialisation.</p>
              <input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="Email universitaire" style={{...inputStyle, marginBottom:14}} type="email" />
              {msg.text && <div style={{ padding:"10px 12px", borderRadius:8, background: msg.type==="success" ? "#EBF5ED" : "#FCEAEA", color: msg.type==="success" ? "#1A6B42" : "#9B2226", fontSize:13, marginBottom:14 }}>{msg.text}</div>}
              <button style={btnStyle(true)} onClick={handleReset} disabled={loading}>{loading ? "Envoi..." : "Envoyer le lien"}</button>
            </div>
          )}

          {/* Login */}
          {mode === "login" && (
            <div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, color:G.textLight, display:"block", marginBottom:5 }}>Email universitaire</label>
                <input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="votre@email.com" style={inputStyle} type="email" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={{ fontSize:12, color:G.textLight, display:"block", marginBottom:5 }}>Mot de passe</label>
                <input value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••" style={inputStyle} type="password" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
              </div>
              {msg.text && <div style={{ padding:"10px 12px", borderRadius:8, background: msg.type==="success"?"#EBF5ED":"#FCEAEA", color: msg.type==="success"?"#1A6B42":"#9B2226", fontSize:13, marginBottom:14 }}>{msg.text}</div>}
              <button style={btnStyle(true)} onClick={handleLogin} disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
              <button onClick={()=>{setMode("reset");setMsg({text:"",type:""}); }} style={{ background:"none", border:"none", cursor:"pointer", color:G.textLight, fontSize:12, marginTop:12, width:"100%", textAlign:"center", fontFamily:"inherit" }}>Mot de passe oublié ?</button>
            </div>
          )}

          {/* Register */}
          {mode === "register" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                {[["Nom","nom","Ex: MBEKI"],["Prénom","prenom","Ex: Jean-Paul"]].map(([label,key,ph])=>(
                  <div key={key}>
                    <label style={{ fontSize:12, color:G.textLight, display:"block", marginBottom:5 }}>{label}</label>
                    <input value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={ph} style={inputStyle} />
                  </div>
                ))}
              </div>
              {[["Matricule","matricule","UNIKIN/M1/CAB/2024/..."],["Email universitaire","email","votre@email.com"],["Mot de passe","password","Au moins 6 caractères"],["Confirmer le mot de passe","confirm","Répétez le mot de passe"]].map(([label,key,ph])=>(
                <div key={key} style={{ marginBottom:12 }}>
                  <label style={{ fontSize:12, color:G.textLight, display:"block", marginBottom:5 }}>{label}</label>
                  <input value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={ph} style={inputStyle} type={key.includes("password")||key==="confirm"?"password":"text"} />
                </div>
              ))}
              {msg.text && <div style={{ padding:"10px 12px", borderRadius:8, background: msg.type==="success"?"#EBF5ED":"#FCEAEA", color: msg.type==="success"?"#1A6B42":"#9B2226", fontSize:13, marginBottom:14 }}>{msg.text}</div>}
              <button style={btnStyle(true)} onClick={handleRegister} disabled={loading}>{loading ? "Création du compte..." : "Créer mon compte"}</button>
              <p style={{ fontSize:11, color:G.textLight, textAlign:"center", marginTop:10 }}>En créant un compte, vous acceptez le règlement académique de l'UNIKIN.</p>
            </div>
          )}
        </div>

        <p style={{ textAlign:"center", fontSize:12, color:G.textLight, marginTop:16 }}>Université de Kinshasa · Faculté des Sciences · Département Chimie</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// SIDEBAR NAV
// ═══════════════════════════════════════
const NAV = [
  {id:"dashboard",icon:"⊞",label:"Tableau de bord"},
  {id:"cours",icon:"📚",label:"Mes Cours"},
  {id:"emploi",icon:"📅",label:"Emploi du temps"},
  {id:"notes",icon:"📊",label:"Notes & Résultats"},
  {id:"biblio",icon:"📖",label:"Bibliothèque"},
  {id:"messages",icon:"✉️",label:"Messagerie",badge:2},
  {id:"ai",icon:"✦",label:"Assistant IA"},
];

function Sidebar({ view, setView, user, onLogout }) {
  const meta = user?.user_metadata || {};
  const initials = ((meta.prenom||"?")[0]+(meta.nom||"?")[0]).toUpperCase();
  const nomComplet = `${meta.prenom||""} ${meta.nom||""}`.trim() || user?.email;

  return (
    <div style={{ width:240, background:G.navy, display:"flex", flexDirection:"column", height:"100vh", position:"fixed", left:0, top:0, zIndex:100 }}>
      <div style={{ padding:"24px 20px 20px", borderBottom:`1px solid rgba(200,169,81,0.3)` }}>
        <div style={{ fontSize:22, marginBottom:6 }}>⚗️</div>
        <div style={{ fontFamily:"'Playfair Display', serif", color:G.gold, fontSize:16, fontWeight:700, lineHeight:1.3 }}>UNIKIN — Portail<br/>Académique M1</div>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginTop:4, letterSpacing:1, textTransform:"uppercase" }}>Chimie Alimentaire & Biochimie</div>
      </div>
      <div style={{ flex:1, padding:"14px 12px", overflowY:"auto" }}>
        {NAV.map(item => {
          const active = view === item.id;
          return (
            <div key={item.id} onClick={()=>setView(item.id)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, marginBottom:3, cursor:"pointer", background: active?"rgba(200,169,81,0.2)":"transparent", borderLeft: active?"3px solid #C8A951":"3px solid transparent", color: active?"#F0D98C":"rgba(255,255,255,0.65)", fontSize:13, fontWeight: active?600:400, transition:"all 0.15s" }}
              onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
              onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
              <span style={{ fontSize:15, width:20, textAlign:"center" }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge&&<span style={{ marginLeft:"auto", background:G.gold, color:G.navy, fontSize:10, fontWeight:700, borderRadius:999, padding:"1px 6px" }}>{item.badge}</span>}
            </div>
          );
        })}
      </div>
      <div style={{ padding:"14px 16px 20px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${G.gold},#8B6914)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:G.navy, flexShrink:0 }}>{initials}</div>
          <div>
            <div style={{ color:"rgba(255,255,255,0.9)", fontSize:12, fontWeight:600 }}>{nomComplet}</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10 }}>{meta.matricule || "M1 CAB"}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:7, padding:"7px", color:"rgba(255,255,255,0.6)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
          Déconnexion
        </button>
      </div>
    </div>
  );
}

function MobileNav({ view, setView }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:G.navy, borderTop:`1px solid rgba(200,169,81,0.3)`, display:"flex", zIndex:200, height:60 }}>
      {NAV.slice(0,5).map(item=>(
        <div key={item.id} onClick={()=>setView(item.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, cursor:"pointer", borderBottom: view===item.id?`2px solid ${G.gold}`:"2px solid transparent", color: view===item.id?"#F0D98C":"rgba(255,255,255,0.45)" }}>
          <span style={{ fontSize:18 }}>{item.icon}</span>
          <span style={{ fontSize:9 }}>{item.label.split(" ")[0]}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// PAGE HEADER
// ═══════════════════════════════════════
function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
      <div>
        <h1 style={{ fontFamily:"'Playfair Display', serif", color:G.navy, fontSize:22, fontWeight:700, margin:0 }}>{title}</h1>
        {subtitle&&<p style={{ color:G.textLight, fontSize:13, marginTop:4, margin:"4px 0 0" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ═══════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, padding:"18px 20px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, width:4, height:"100%", background:accent||G.gold, borderRadius:"14px 0 0 14px" }} />
      <div style={{ marginLeft:8 }}>
        <div style={{ fontSize:24, marginBottom:6 }}>{icon}</div>
        <div style={{ fontSize:26, fontWeight:700, color:G.navy, fontFamily:"'Playfair Display', serif" }}>{value}</div>
        <div style={{ fontSize:12, color:G.navy, fontWeight:600, marginTop:2 }}>{label}</div>
        {sub&&<div style={{ fontSize:11, color:G.textLight, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════
function Dashboard({ user, setView }) {
  const meta = user?.user_metadata || {};
  const prenom = meta.prenom || "Étudiant";
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <div style={{ background:`linear-gradient(135deg,${G.navy} 0%,#1A3A6B 100%)`, borderRadius:16, padding:"28px 28px 24px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-20, width:180, height:180, borderRadius:"50%", background:"rgba(200,169,81,0.07)" }} />
        <div style={{ fontSize:12, color:G.gold, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>Bienvenue, {prenom} !</div>
        <h2 style={{ fontFamily:"'Playfair Display', serif", color:"#FFF", fontSize:20, margin:"0 0 6px" }}>{meta.prenom||""} {meta.nom||""}</h2>
        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, margin:0 }}>Master 1 — Chimie Alimentaire & Biochimie · 2024–2025</p>
        <p style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginTop:4 }}>{meta.matricule||"—"}</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14, marginBottom:24 }}>
        <StatCard icon="📚" label="Unités d'Enseignement" value="9" sub="5 S1 · 4 S2" accent={G.navy} />
        <StatCard icon="🏆" label="Crédits totaux" value="60" sub="S1: 30 · S2: 30" accent="#2D6A4F" />
        <StatCard icon="📈" label="Semestre en cours" value="S1" sub="En cours" accent={G.gold} />
        <StatCard icon="✉️" label="Messages non lus" value="2" sub="Voir messagerie" accent="#6B1A3A" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
        <div style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:G.navy, margin:"0 0 16px" }}>📢 Annonces récentes</h3>
          {ANNOUNCEMENTS.map(a=>(
            <div key={a.id} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:`1px solid #F0E8D5` }}>
              <span style={{ fontSize:16 }}>{a.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, color:a.urgent?"#9B2226":G.navy, lineHeight:1.3 }}>{a.titre}</div>
                <div style={{ fontSize:10, color:G.textLight, marginTop:2 }}>{a.auteur} · {a.date}</div>
              </div>
              {a.urgent&&<span style={{ background:"#9B2226", color:"#FFF", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:999, height:"fit-content", whiteSpace:"nowrap" }}>URGENT</span>}
            </div>
          ))}
        </div>

        <div style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:G.navy, margin:"0 0 14px" }}>📅 Programme du Lundi</h3>
          {SCHEDULE["Lundi"].map((s,i)=>{
            const typeColor={CM:"#EBF0FB",TD:"#FEF9EA",TP:"#EBF5ED"}[s.type]||"#F0F0F0";
            return (
              <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:`1px solid #F0E8D5` }}>
                <div style={{ background:typeColor, borderRadius:8, padding:"6px 8px", textAlign:"center", minWidth:40 }}>
                  <div style={{ fontSize:9, fontWeight:700, color:G.navy }}>{s.type}</div>
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:G.navy }}>{s.cours}</div>
                  <div style={{ fontSize:11, color:G.textMid }}>{s.heure} · {s.salle}</div>
                  <div style={{ fontSize:10, color:G.textLight }}>{s.prof}</div>
                </div>
              </div>
            );
          })}
          <div onClick={()=>setView("emploi")} style={{ marginTop:12, fontSize:12, color:G.gold, fontWeight:600, cursor:"pointer", textAlign:"center" }}>Voir l'emploi du temps complet →</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// COURS
// ═══════════════════════════════════════
function Cours() {
  const [sem, setSem] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const ues = sem===1?CURRICULUM.s1:CURRICULUM.s2;
  const Btn=({active,label,onClick})=><button onClick={onClick} style={{ padding:"8px 18px", borderRadius:999, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, background:active?G.navy:"#EDE7DA", color:active?G.goldLight:G.textMid, transition:"all 0.15s", fontFamily:"inherit" }}>{label}</button>;
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHeader title="Mes Cours" subtitle={`Programme Master 1 — Semestre ${sem}`}
        action={<div style={{ display:"flex", gap:8 }}><Btn active={sem===1} label="Semestre 1" onClick={()=>setSem(1)}/><Btn active={sem===2} label="Semestre 2" onClick={()=>setSem(2)}/></div>}/>
      {ues.map(ue=>(
        <div key={ue.code} style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, overflow:"hidden", marginBottom:14 }}>
          <div onClick={()=>setExpanded(expanded===ue.code?null:ue.code)} style={{ padding:"18px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:ue.couleur, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ color:"#FFF", fontWeight:800, fontSize:11 }}>{ue.code.slice(0,3)}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:13, fontWeight:700, color:G.navy }}>{ue.code}</span>
                <span style={{ background:"#EBF0FB", color:G.navy, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:999 }}>{ue.credits} crédits</span>
              </div>
              <div style={{ fontSize:13, color:"#3A3020", marginTop:2 }}>{ue.titre}</div>
              <div style={{ fontSize:11, color:G.textLight, marginTop:2 }}>{ue.prof} · {ue.ecs.length} EC(s)</div>
            </div>
            <span style={{ fontSize:18, color:G.gold, transition:"transform 0.2s", transform:expanded===ue.code?"rotate(180deg)":"none" }}>⌄</span>
          </div>
          {expanded===ue.code&&(
            <div style={{ borderTop:`1px solid #F0E8D5`, background:"#FDFAF5" }}>
              {ue.ecs.map((ec,i)=>(
                <div key={ec.code} style={{ padding:"14px 20px 14px 68px", borderBottom:i<ue.ecs.length-1?`1px solid #F0E8D5`:"none", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#555", fontFamily:"monospace" }}>{ec.code}</div>
                    <div style={{ fontSize:13, color:"#2A2010", fontWeight:500 }}>{ec.titre}</div>
                    <div style={{ fontSize:11, color:G.textLight }}>{ec.prof}</div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {["📄 Cours","📋 TP","✏️ Devoirs","💬 Forum"].map(tag=>(
                      <span key={tag} style={{ fontSize:10, background:"#EDE7DA", color:G.textMid, padding:"3px 8px", borderRadius:6, cursor:"pointer" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// EMPLOI DU TEMPS
// ═══════════════════════════════════════
function EmploiDuTemps() {
  const typeStyle={CM:{bg:"#EBF0FB",text:G.navy,border:"#B8C8EE"},TD:{bg:"#FEF9EA",text:"#7A5A00",border:"#EDD97A"},TP:{bg:"#EBF5ED",text:"#1A4D2E",border:"#8BC4A0"}};
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHeader title="Emploi du temps" subtitle="Semestre 1 — Semaine type · Master 1 CAB" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14 }}>
        {Object.entries(SCHEDULE).map(([jour,seances])=>(
          <div key={jour} style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, overflow:"hidden" }}>
            <div style={{ background:G.navy, padding:"10px 16px" }}>
              <span style={{ color:G.goldLight, fontWeight:700, fontSize:14, fontFamily:"'Playfair Display', serif" }}>{jour}</span>
            </div>
            <div style={{ padding:12 }}>
              {seances.map((s,i)=>{
                const ts=typeStyle[s.type]||typeStyle.CM;
                return (
                  <div key={i} style={{ background:ts.bg, border:`1px solid ${ts.border}`, borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:ts.text, background:"rgba(0,0,0,0.06)", padding:"2px 6px", borderRadius:4 }}>{s.type}</span>
                      <span style={{ fontSize:10, color:ts.text }}>{s.heure}</span>
                    </div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#1A1A2E" }}>{s.cours}</div>
                    <div style={{ fontSize:11, color:G.textMid, marginTop:2 }}>{s.label}</div>
                    <div style={{ fontSize:10, color:G.textLight, marginTop:3 }}>🏫 {s.salle} · {s.prof}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// NOTES
// ═══════════════════════════════════════
function Notes() {
  const [sem, setSem] = useState(1);
  const ues = sem===1?CURRICULUM.s1:CURRICULUM.s2;
  const Btn=({active,label,onClick})=><button onClick={onClick} style={{ padding:"8px 18px", borderRadius:999, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, background:active?G.navy:"#EDE7DA", color:active?G.goldLight:G.textMid, fontFamily:"inherit" }}>{label}</button>;
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHeader title="Notes & Résultats" subtitle={`Relevé de notes — Semestre ${sem}`}
        action={<div style={{ display:"flex", gap:8 }}><Btn active={sem===1} label="Semestre 1" onClick={()=>setSem(1)}/><Btn active={sem===2} label="Semestre 2" onClick={()=>setSem(2)}/></div>}/>
      <div style={{ background:`linear-gradient(135deg,${G.navy},#1A3A6B)`, borderRadius:14, padding:"18px 24px", marginBottom:20, display:"flex", gap:28, flexWrap:"wrap" }}>
        {[["Crédits engagés",ues.reduce((s,u)=>s+u.credits,0)+"","Sur "+ues.reduce((s,u)=>s+u.credits,0)+" cr."],["UEs au programme",ues.length+"","Semestre "+sem],["Semestre",sem===1?"S1":"S2","En cours"]].map(([l,v,s])=>(
          <div key={l}><div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginBottom:4 }}>{l}</div><div style={{ color:G.goldLight, fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:700 }}>{v}</div><div style={{ color:G.gold, fontSize:11 }}>{s}</div></div>
        ))}
      </div>
      {ues.map(ue=>(
        <div key={ue.code} style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, marginBottom:14, overflow:"hidden" }}>
          <div style={{ padding:"12px 18px", background:"#F7F3EC", borderBottom:`1px solid ${G.cardBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <span style={{ fontSize:13, fontWeight:700, color:G.navy }}>{ue.code} — {ue.titre}</span>
            <span style={{ fontSize:11, color:G.textLight, background:"#EDE7DA", padding:"3px 10px", borderRadius:999 }}>{ue.credits} crédits · Notes à venir</span>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:"#FDFAF5" }}>
              {["Code EC","Intitulé","Professeur","Note CC","Examen","Moyenne"].map(h=>(
                <th key={h} style={{ padding:"8px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:G.textLight, borderBottom:`1px solid #F0E8D5` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {ue.ecs.map((ec,i)=>(
                <tr key={ec.code} style={{ borderBottom:i<ue.ecs.length-1?`1px solid #F7F3EC`:"none" }}>
                  <td style={{ padding:"10px 14px", fontSize:11, fontFamily:"monospace", color:"#555", fontWeight:600 }}>{ec.code}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#2A2010" }}>{ec.titre}</td>
                  <td style={{ padding:"10px 14px", fontSize:11, color:G.textMid }}>{ec.prof}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#CCC" }}>—</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#CCC" }}>—</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#CCC" }}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// BIBLIOTHÈQUE
// ═══════════════════════════════════════
function Bibliotheque() {
  const [search, setSearch] = useState("");
  const filtered = LIBRARY.filter(d=>d.titre.toLowerCase().includes(search.toLowerCase())||d.cours.toLowerCase().includes(search.toLowerCase()));
  const typeColor={PDF:{bg:"#FCEAEA",color:"#9B2226"},PPT:{bg:"#FEF9EA",color:"#B5860A"}};
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHeader title="Bibliothèque numérique" subtitle={`${LIBRARY.length} ressources disponibles`} />
      <div style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:10, padding:"10px 14px", marginBottom:18, display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ color:G.gold }}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un document, un cours..." style={{ flex:1, border:"none", outline:"none", fontSize:13, color:"#2A2010", background:"transparent", fontFamily:"inherit" }} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
        {filtered.map(doc=>{
          const tc=typeColor[doc.type]||typeColor.PDF;
          return (
            <div key={doc.id} style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, padding:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontSize:26 }}>{doc.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, background:tc.bg, color:tc.color, padding:"3px 8px", borderRadius:6 }}>{doc.type}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:G.navy, marginBottom:6, lineHeight:1.4 }}>{doc.titre}</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:G.textLight }}>
                <span>{doc.cours}</span><span>{doc.size}</span>
              </div>
              <div style={{ fontSize:10, color:"#B0A090", marginTop:4 }}>Déposé le {doc.date}</div>
              <button style={{ marginTop:12, width:"100%", background:G.navy, color:G.goldLight, border:"none", borderRadius:8, padding:"8px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>⬇ Télécharger</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MESSAGERIE
// ═══════════════════════════════════════
const MESSAGES_DATA=[
  {id:1,from:"Prof. Dibwe",initials:"PD",subject:"Compléments cours CAF601.1",preview:"Cher étudiant, veuillez trouver en pièce jointe le complément sur les polyphénols...",date:"11 Avr",unread:true,content:"Cher étudiant,\n\nVeuillez trouver en pièce jointe le complément de cours sur les polyphénols et flavonoïdes dans les aliments fonctionnels. Ce document sera utile pour la préparation de l'examen.\n\nCordialement,\nProf. Dibwe"},
  {id:2,from:"Prof. Nsiama",initials:"PN",subject:"Rappel — TP TBA603 Vendredi",preview:"Le TP du vendredi 12 avril est maintenu. Préparez les chapitres 3 et 4...",date:"10 Avr",unread:true,content:"Bonjour,\n\nLe TP de vendredi 12 avril est maintenu en Laboratoire de Biochimie. Veuillez préparer les chapitres 3 et 4 du manuel de techniques analytiques.\n\nBonne préparation,\nProf. Nsiama"},
  {id:3,from:"Secrétariat",initials:"SC",subject:"Carte étudiant 2024–2025 disponible",preview:"Vos cartes étudiants sont disponibles au guichet du Secrétariat...",date:"08 Avr",unread:false,content:"Bonjour,\n\nVos cartes étudiants pour l'année académique 2024–2025 sont disponibles au guichet du Secrétariat Académique, du lundi au vendredi de 9h à 13h.\n\nLe Secrétariat"},
];

function Messagerie() {
  const [selected, setSelected] = useState(null);
  const [compose, setCompose] = useState(false);
  const [newMsg, setNewMsg] = useState({ to:"", subject:"", body:"" });
  const msg = MESSAGES_DATA.find(m=>m.id===selected);
  const inputStyle={width:"100%",border:`1px solid ${G.cardBorder}`,borderRadius:6,padding:"7px 10px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"};
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHeader title="Messagerie" subtitle="Boîte de réception · Échanges académiques"
        action={<button onClick={()=>setCompose(true)} style={{ background:G.navy, color:G.goldLight, border:"none", borderRadius:8, padding:"9px 18px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>✏️ Nouveau message</button>}/>
      {compose&&(
        <div style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, padding:20, marginBottom:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:G.navy, margin:0 }}>Nouveau message</h3>
            <button onClick={()=>setCompose(false)} style={{ border:"none", background:"transparent", cursor:"pointer", color:G.textLight, fontSize:16 }}>✕</button>
          </div>
          {[["À","to","Destinataire (prof ou secrétariat)..."],["Sujet","subject","Objet du message..."]].map(([label,key,ph])=>(
            <div key={key} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <span style={{ fontSize:12, color:G.textLight, width:40 }}>{label}</span>
              <input value={newMsg[key]} onChange={e=>setNewMsg({...newMsg,[key]:e.target.value})} placeholder={ph} style={inputStyle} />
            </div>
          ))}
          <textarea value={newMsg.body} onChange={e=>setNewMsg({...newMsg,body:e.target.value})} placeholder="Votre message..." style={{ ...inputStyle, height:90, resize:"none" }} />
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button onClick={()=>setCompose(false)} style={{ background:G.navy, color:G.goldLight, border:"none", borderRadius:8, padding:"8px 20px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Envoyer</button>
            <button onClick={()=>setCompose(false)} style={{ background:"#EDE7DA", color:G.textMid, border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Annuler</button>
          </div>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:selected?"1fr 1.4fr":"1fr", gap:16 }}>
        <div style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", background:"#F7F3EC", borderBottom:`1px solid ${G.cardBorder}`, fontSize:13, fontWeight:700, color:G.navy }}>Boîte de réception ({MESSAGES_DATA.filter(m=>m.unread).length} non lus)</div>
          {MESSAGES_DATA.map(m=>(
            <div key={m.id} onClick={()=>setSelected(m.id)} style={{ padding:"14px 16px", borderBottom:`1px solid #F7F3EC`, cursor:"pointer", background:selected===m.id?"#F7F0E3":m.unread?"#FDFAF5":G.cardBg }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {m.unread&&<span style={{ width:7, height:7, borderRadius:"50%", background:G.gold, display:"inline-block" }} />}
                  <span style={{ fontSize:12, fontWeight:m.unread?700:500, color:G.navy }}>{m.from}</span>
                </div>
                <span style={{ fontSize:11, color:G.textLight }}>{m.date}</span>
              </div>
              <div style={{ fontSize:12, fontWeight:m.unread?600:400, color:"#2A2010" }}>{m.subject}</div>
              <div style={{ fontSize:11, color:G.textLight, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.preview}</div>
            </div>
          ))}
        </div>
        {selected&&msg&&(
          <div style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, padding:20, animation:"fadeIn 0.2s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:G.navy, margin:0 }}>{msg.subject}</h3>
              <button onClick={()=>setSelected(null)} style={{ border:"none", background:"transparent", cursor:"pointer", color:G.textLight, fontSize:18 }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14, paddingBottom:14, borderBottom:`1px solid #F0E8D5` }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:G.navy, display:"flex", alignItems:"center", justifyContent:"center", color:G.goldLight, fontWeight:700, fontSize:12 }}>{msg.initials}</div>
              <div><div style={{ fontSize:13, fontWeight:700, color:G.navy }}>{msg.from}</div><div style={{ fontSize:11, color:G.textLight }}>{msg.date}</div></div>
            </div>
            <p style={{ fontSize:13, color:"#3A3020", lineHeight:1.7, whiteSpace:"pre-line", margin:0 }}>{msg.content}</p>
            <button style={{ marginTop:16, background:"#EDE7DA", color:G.navy, border:"none", borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>↩ Répondre</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ASSISTANT IA
// ═══════════════════════════════════════
function AssistantIA({ user }) {
  const meta = user?.user_metadata || {};
  const [msgs, setMsgs] = useState([
    { role:"assistant", content:`Bonjour ${meta.prenom||""}! Je suis votre assistant académique IA, spécialisé en Chimie Alimentaire & Biochimie pour le Master 1 de l'UNIKIN.\n\nJe peux vous aider à :\n📖 Expliquer des concepts de vos cours (CAF601, BMA604, TBA603...)\n🔁 Résumer des chapitres pour vos révisions\n💡 Proposer des exercices ou QCM\n📝 Clarifier des formules ou réactions\n\nComment puis-je vous aider ?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim()||loading) return;
    const userMsg = { role:"user", content:input };
    setMsgs(prev=>[...prev,userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Tu es un assistant académique expert pour les étudiants de Master 1 en Chimie Alimentaire et Biochimie (CAB) de l'Université de Kinshasa (UNIKIN), en RDC. Tu connais parfaitement le programme : Semestre 1 : CAF601 (Chimie des aliments fonctionnels, Nutraceutiques — Prof. Dibwe), CAD602 (Chimie des denrées alimentaires — Prof. Mputu ; Nutriments et diététique — Prof. Kilunga), TBA603 (Analyse des biomolécules — Prof. Nsiama ; Biochimie analytique — Prof. Dibwe), BMA604 (Biochimie des protéines — Prof. Kimbadi ; Acides nucléiques — Prof. Nsiama ; Glucides et lipides — Prof. Dibwe), CAQ605 (Contrôle qualité — Prof. Tuakuila). Semestre 2 : DFP606, MAI607, IPP608, BTA609. Réponds toujours en français, de façon pédagogique, claire et encourageante, avec des exemples concrets. L'étudiant s'appelle ${meta.prenom||"étudiant"} ${meta.nom||""}.`,
          messages:[...msgs,userMsg].map(m=>({role:m.role,content:m.content}))
        })
      });
      const data = await res.json();
      setMsgs(prev=>[...prev,{ role:"assistant", content:data.content?.[0]?.text||"Désolé, réessayez." }]);
    } catch {
      setMsgs(prev=>[...prev,{ role:"assistant", content:"Erreur de connexion. Vérifiez votre connexion et réessayez." }]);
    }
    setLoading(false);
  };

  const suggestions=["Explique-moi les nutraceutiques (CAF601)","Résume la biochimie des protéines BMA604.1","Qu'est-ce que l'ingénierie des protéines ?","Donne-moi un QCM sur les acides nucléiques"];

  return (
    <div style={{ animation:"fadeIn 0.3s ease", display:"flex", flexDirection:"column", height:"calc(100vh - 100px)" }}>
      <PageHeader title="Assistant IA Académique" subtitle="Spécialisé Master 1 CAB — Université de Kinshasa" />
      <div style={{ background:G.cardBg, border:`1px solid ${G.cardBorder}`, borderRadius:14, flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ flex:1, overflowY:"auto", padding:20 }}>
          {msgs.map((m,i)=>(
            <div key={i} style={{ marginBottom:16, display:"flex", flexDirection:m.role==="user"?"row-reverse":"row", gap:10 }}>
              {m.role==="assistant"&&<div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${G.navy},#1A3A6B)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>✦</div>}
              <div style={{ maxWidth:"80%", background:m.role==="user"?G.navy:"#F7F3EC", color:m.role==="user"?"#FFF":"#2A2010", borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px", padding:"12px 16px", fontSize:13, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{m.content}</div>
            </div>
          ))}
          {loading&&(
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${G.navy},#1A3A6B)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✦</div>
              <div style={{ background:"#F7F3EC", borderRadius:"14px 14px 14px 4px", padding:"12px 16px", display:"flex", gap:4, alignItems:"center" }}>
                {[0,1,2].map(j=><span key={j} style={{ width:7, height:7, borderRadius:"50%", background:G.gold, display:"inline-block", animation:`pulse 1.2s ${j*0.2}s infinite` }}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {msgs.length<2&&(
          <div style={{ padding:"0 16px 12px", display:"flex", gap:8, flexWrap:"wrap" }}>
            {suggestions.map((s,i)=>(
              <button key={i} onClick={()=>setInput(s)} style={{ background:"#EBF0FB", color:G.navy, border:`1px solid #B8C8EE`, borderRadius:999, padding:"6px 12px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>{s}</button>
            ))}
          </div>
        )}
        <div style={{ borderTop:`1px solid ${G.cardBorder}`, padding:"12px 16px", display:"flex", gap:10 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Posez votre question académique..." style={{ flex:1, border:`1px solid ${G.cardBorder}`, borderRadius:10, padding:"10px 14px", fontSize:13, outline:"none", fontFamily:"inherit" }} />
          <button onClick={send} disabled={loading||!input.trim()} style={{ background:input.trim()&&!loading?G.navy:"#CCC", color:G.goldLight, border:"none", borderRadius:10, padding:"10px 18px", fontSize:14, cursor:input.trim()&&!loading?"pointer":"default", fontFamily:"inherit" }}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(()=>{
    const style = document.createElement("style");
    style.textContent=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Source Sans 3',sans-serif;background:#F2EDE2;}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#F2EDE2}::-webkit-scrollbar-thumb{background:#C8A951;border-radius:3px}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}button:focus,input:focus{outline:none}`;
    document.head.appendChild(style);
    supabase.auth.getSession().then(({data:{session}})=>{ setUser(session?.user||null); setLoading(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>setUser(session?.user||null));
    const handleResize=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",handleResize);
    return ()=>{ document.head.removeChild(style); subscription.unsubscribe(); window.removeEventListener("resize",handleResize); };
  },[]);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setView("dashboard"); };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#F2EDE2", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
      <div style={{ fontSize:40 }}>⚗️</div>
      <div style={{ fontFamily:"'Playfair Display', serif", color:G.navy, fontSize:16 }}>Chargement du portail...</div>
    </div>
  );

  if (!user) return <AuthPage onAuth={setUser} />;

  const views={ dashboard:<Dashboard user={user} setView={setView}/>, cours:<Cours/>, emploi:<EmploiDuTemps/>, notes:<Notes/>, biblio:<Bibliotheque/>, messages:<Messagerie/>, ai:<AssistantIA user={user}/> };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'Source Sans 3', sans-serif" }}>
      {!isMobile&&<Sidebar view={view} setView={setView} user={user} onLogout={handleLogout}/>}
      <main style={{ flex:1, marginLeft:isMobile?0:240, padding:isMobile?"16px 14px 80px":"28px 32px", minHeight:"100vh", overflowX:"hidden" }}>
        {isMobile&&(
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20 }}>⚗️</span>
              <span style={{ fontFamily:"'Playfair Display', serif", color:G.navy, fontSize:15, fontWeight:700 }}>Portail UNIKIN M1</span>
            </div>
            <button onClick={handleLogout} style={{ background:"transparent", border:`1px solid ${G.cardBorder}`, borderRadius:6, padding:"5px 10px", fontSize:11, cursor:"pointer", color:G.textLight, fontFamily:"inherit" }}>Déco.</button>
          </div>
        )}
        {views[view]||views["dashboard"]}
      </main>
      {isMobile&&<MobileNav view={view} setView={setView}/>}
    </div>
  );
}
