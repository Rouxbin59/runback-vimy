import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  T, START, RACE, BADGES, LEVELS, getLv, getNext, RD, COACH_ANALYSIS,
  NUT, genPlan, CHAT_RESPONSES, CHAT_DEFAULT_RESPONSE, MEAL_PRESETS,
  CONNECTORS, INIT_COMP
} from "./data.js";

// ─── ICONS ───
const Ic = {
  run: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="4" r="2" /><path d="M6 9l3 1 2-3 4 2v4l-3 3-2 5" /><path d="M9 10l-3 8" /></svg>,
  str: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11M6 12h12M6.5 17.5h11M3 12h2M19 12h2" /></svg>,
  bell: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  chk: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>,
  bk: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>,
  rt: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>,
  x: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>,
  star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  flag: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>,
  plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>,
  send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>,
  chat: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  link: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
  settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
};
const gI = (t) => t === "strength" ? <Ic.str /> : t === "race" ? <Ic.flag /> : <Ic.run />;
const fD = (d) => `${["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][d.getDay()]} ${d.getDate()} ${["jan", "fév", "mar", "avr", "mai", "juin", "juil"][d.getMonth()]}`;
const fDL = (d) => `${["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][d.getDay()]} ${d.getDate()} ${["janvier", "février", "mars", "avril", "mai", "juin"][d.getMonth()]}`;
const iB = (n, c) => <div style={{ display: "flex", gap: "2px" }}>{[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: "12px", height: "3px", borderRadius: "1.5px", background: i <= n ? c : "rgba(255,255,255,0.1)" }} />)}</div>;

// ─── RESPONSIVE HOOK ───
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handle = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return size;
}

export default function App() {
  const plan = useMemo(() => genPlan(), []);
  const { w: winW } = useWindowSize();
  const isDesktop = winW >= 768;
  const isWide = winW >= 1024;

  // ─── STATE ───
  const [comp, setComp] = useState(INIT_COMP);
  const [fb, setFb] = useState({});
  const [sel, setSel] = useState(null);
  const [view, setView] = useState("today");
  const [expW, setExpW] = useState(null);
  const [nutI, setNutI] = useState(0);
  const [wLog, setWLog] = useState([]);
  const [showWI, setShowWI] = useState(false);
  const [wiV, setWiV] = useState("");
  const [goalW, setGoalW] = useState("");
  const [nOn, setNOn] = useState(false);
  const [nM, setNM] = useState(true);
  const [nB, setNB] = useState(true);
  const [nE, setNE] = useState(true);
  const [nMH, setNMH] = useState(7);
  const [nSH, setNSH] = useState(18);
  const [nEH, setNEH] = useState(21);
  const [showN, setShowN] = useState(false);
  const [toast, setToast] = useState(null);
  const [nLog, setNLog] = useState([]);
  const [newBadge, setNewBadge] = useState(null);
  const [ub, setUb] = useState(["first_step", "first_run", "streak3", "continuous", "two_a_day"]);
  const sent = useRef(new Set());

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  // Custom sessions
  const [customSessions, setCustomSessions] = useState([]);
  const [showAddSession, setShowAddSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({ date: new Date().toISOString().split("T")[0], type: "run", distance: "", duration: "", notes: "", difficulty: 3 });

  // Connectors
  const [connectors, setConnectors] = useState({});
  const [showConnector, setShowConnector] = useState(null);

  // Meal tracker
  const [meals, setMeals] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealForm, setMealForm] = useState({ name: "", cal: "", prot: "", carbs: "", fat: "", date: new Date().toISOString().split("T")[0] });
  const [showPresets, setShowPresets] = useState(false);

  // ─── LOAD / SAVE ───
  useEffect(() => {
    try {
      const r = localStorage.getItem("rb6");
      if (r) {
        const d = JSON.parse(r);
        setComp(d.c || INIT_COMP);
        setFb(d.f || {});
        setWLog(d.w || []);
        setNOn(d.no || false);
        setUb(d.ub || ["first_step", "first_run", "streak3", "continuous", "two_a_day"]);
        setNLog(d.nl || []);
        setChatHistory(d.ch || []);
        setCustomSessions(d.cs || []);
        setConnectors(d.cn || {});
        setMeals(d.ml || []);
        setGoalW(d.gw || "");
      }
    } catch (e) { }
  }, []);

  const save = useCallback((c, f, w, no, ubx, nl, ch, cs, cn, ml, gw) => {
    try {
      localStorage.setItem("rb6", JSON.stringify({ c, f, w, no, ub: ubx, nl, ch, cs, cn, ml, gw }));
    } catch (e) { }
  }, []);

  const saveAll = useCallback((overrides = {}) => {
    const c = overrides.comp !== undefined ? overrides.comp : comp;
    const f = overrides.fb !== undefined ? overrides.fb : fb;
    const w = overrides.wLog !== undefined ? overrides.wLog : wLog;
    const no = overrides.nOn !== undefined ? overrides.nOn : nOn;
    const u = overrides.ub !== undefined ? overrides.ub : ub;
    const nl = overrides.nLog !== undefined ? overrides.nLog : nLog;
    const ch = overrides.chatHistory !== undefined ? overrides.chatHistory : chatHistory;
    const cs = overrides.customSessions !== undefined ? overrides.customSessions : customSessions;
    const cn = overrides.connectors !== undefined ? overrides.connectors : connectors;
    const ml = overrides.meals !== undefined ? overrides.meals : meals;
    const gw = overrides.goalW !== undefined ? overrides.goalW : goalW;
    save(c, f, w, no, u, nl, ch, cs, cn, ml, gw);
  }, [comp, fb, wLog, nOn, ub, nLog, chatHistory, customSessions, connectors, meals, goalW, save]);

  // ─── BADGES ───
  const checkB = useCallback((c, w, ml, cs, cn, ch) => {
    const nu = [...ub];
    let nw = null;
    BADGES.forEach(b => {
      if (!nu.includes(b.id) && b.check(c, plan, w, ml, cs, cn, ch)) {
        nu.push(b.id);
        nw = b;
      }
    });
    if (nw) {
      setUb(nu);
      setNewBadge(nw);
      setTimeout(() => setNewBadge(null), 4000);
    }
    return nu;
  }, [ub, plan]);

  const toggle = useCallback((id) => {
    setComp(p => {
      const n = { ...p };
      if (n[id]) delete n[id]; else n[id] = Date.now();
      const u = checkB(n, wLog, meals, customSessions, connectors, chatHistory);
      save(n, fb, wLog, nOn, u, nLog, chatHistory, customSessions, connectors, meals, goalW);
      return n;
    });
  }, [fb, wLog, nOn, nLog, chatHistory, customSessions, connectors, meals, goalW, save, checkB]);

  const setFbk = useCallback((id, d) => {
    setFb(p => {
      const n = { ...p, [id]: { difficulty: d } };
      save(comp, n, wLog, nOn, ub, nLog, chatHistory, customSessions, connectors, meals, goalW);
      return n;
    });
  }, [comp, wLog, nOn, ub, nLog, chatHistory, customSessions, connectors, meals, goalW, save]);

  const addW = useCallback(() => {
    const v = parseFloat(wiV);
    if (!v || v < 50 || v > 200) return;
    const n = [...wLog, { date: new Date().toISOString().split("T")[0], weight: v }];
    setWLog(n);
    setWiV("");
    setShowWI(false);
    const u = checkB(comp, n, meals, customSessions, connectors, chatHistory);
    save(comp, fb, n, nOn, u, nLog, chatHistory, customSessions, connectors, meals, goalW);
  }, [wiV, wLog, comp, fb, nOn, nLog, chatHistory, customSessions, connectors, meals, goalW, save, checkB]);

  // ─── TOAST / NOTIF ───
  const showT = useCallback((msg, cl, emoji) => { setToast({ msg, cl, emoji }); setTimeout(() => setToast(null), 5000); }, []);
  const sendN = useCallback((ti, body, cl, emoji) => {
    if ("Notification" in window && Notification.permission === "granted") try { new Notification(ti, { body }); } catch (e) { }
    showT(body, cl, emoji);
    setNLog(p => [...p, { time: new Date().toISOString(), body }].slice(-20));
  }, [showT]);

  useEffect(() => {
    if (!nOn) return;
    const ck = () => {
      const now = new Date(), h = now.getHours(), m = now.getMinutes(), ds = now.toISOString().split("T")[0];
      const s = plan.find(x => x.dateStr === ds);
      if (!s) return;
      const k = t => `${ds}-${t}`;
      if (nM && h === nMH && m === 0 && !sent.current.has(k("m"))) { sent.current.add(k("m")); sendN("☀️", `${s.title} — ${s.dur}min`, s.phaseColor, "☀️"); }
      if (nB && h === (nSH - 1) && m === 0 && !sent.current.has(k("b")) && !comp[s.id]) { sent.current.add(k("b")); sendN("⏰", `${s.title}`, s.phaseColor, "⏰"); }
      if (nE && h === nEH && m === 0 && !sent.current.has(k("e")) && !comp[s.id]) { sent.current.add(k("e")); sendN("🌙", `"${s.title}"!`, "#C9A96E", "🌙"); }
    };
    ck();
    const iv = setInterval(ck, 30000);
    return () => clearInterval(iv);
  }, [nOn, nM, nB, nE, nMH, nSH, nEH, plan, comp, sendN]);

  // ─── CHAT ───
  const getChatResponse = useCallback((msg) => {
    const lower = msg.toLowerCase();
    for (const r of CHAT_RESPONSES) {
      if (r.keywords.some(kw => lower.includes(kw))) return r.response;
    }
    return CHAT_DEFAULT_RESPONSE;
  }, []);

  const sendChat = useCallback(() => {
    if (!chatMsg.trim()) return;
    const userMsg = { role: "user", text: chatMsg.trim(), time: new Date().toISOString() };
    const aiResponse = getChatResponse(chatMsg);
    const aiMsg = { role: "ai", text: aiResponse, time: new Date().toISOString() };
    const newHistory = [...chatHistory, userMsg, aiMsg];
    setChatHistory(newHistory);
    setChatMsg("");
    const u = checkB(comp, wLog, meals, customSessions, connectors, newHistory);
    save(comp, fb, wLog, nOn, u, nLog, newHistory, customSessions, connectors, meals, goalW);
  }, [chatMsg, chatHistory, comp, fb, wLog, nOn, ub, nLog, customSessions, connectors, meals, goalW, save, checkB, getChatResponse]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatOpen]);

  // ─── CUSTOM SESSIONS ───
  const addCustomSession = useCallback(() => {
    const { date, type, distance, duration, notes, difficulty } = sessionForm;
    if (!distance || !duration) return;
    const newSession = {
      id: `custom_${Date.now()}`,
      date,
      type,
      distance: parseFloat(distance),
      duration: parseFloat(duration),
      notes,
      difficulty,
      createdAt: new Date().toISOString()
    };
    const newSessions = [...customSessions, newSession];
    setCustomSessions(newSessions);
    setShowAddSession(false);
    setSessionForm({ date: new Date().toISOString().split("T")[0], type: "run", distance: "", duration: "", notes: "", difficulty: 3 });
    const u = checkB(comp, wLog, meals, newSessions, connectors, chatHistory);
    save(comp, fb, wLog, nOn, u, nLog, chatHistory, newSessions, connectors, meals, goalW);
  }, [sessionForm, customSessions, comp, fb, wLog, nOn, ub, nLog, chatHistory, connectors, meals, goalW, save, checkB]);

  // ─── CONNECTORS ───
  const connectService = useCallback((id) => {
    const newConn = { ...connectors, [id]: { connected: true, lastSync: new Date().toISOString(), syncCount: Math.floor(Math.random() * 10) + 1 } };
    setConnectors(newConn);
    setShowConnector(null);
    const u = checkB(comp, wLog, meals, customSessions, newConn, chatHistory);
    save(comp, fb, wLog, nOn, u, nLog, chatHistory, customSessions, newConn, meals, goalW);
    showT(`Connecté à ${CONNECTORS.find(c => c.id === id)?.name}`, T.ac2, "🔗");
  }, [connectors, comp, fb, wLog, nOn, ub, nLog, chatHistory, customSessions, meals, goalW, save, checkB, showT]);

  const disconnectService = useCallback((id) => {
    const newConn = { ...connectors };
    delete newConn[id];
    setConnectors(newConn);
    save(comp, fb, wLog, nOn, ub, nLog, chatHistory, customSessions, newConn, meals, goalW);
  }, [connectors, comp, fb, wLog, nOn, ub, nLog, chatHistory, customSessions, meals, goalW, save]);

  // ─── MEALS ───
  const addMeal = useCallback(() => {
    const { name, cal, prot, carbs, fat, date } = mealForm;
    if (!name || !cal) return;
    const newMeal = {
      id: `meal_${Date.now()}`,
      name,
      cal: parseInt(cal),
      prot: parseInt(prot) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      date,
      createdAt: new Date().toISOString()
    };
    const newMeals = [...meals, newMeal];
    setMeals(newMeals);
    setShowAddMeal(false);
    setMealForm({ name: "", cal: "", prot: "", carbs: "", fat: "", date: new Date().toISOString().split("T")[0] });
    const u = checkB(comp, wLog, newMeals, customSessions, connectors, chatHistory);
    save(comp, fb, wLog, nOn, u, nLog, chatHistory, customSessions, connectors, newMeals, goalW);
  }, [mealForm, meals, comp, fb, wLog, nOn, ub, nLog, chatHistory, customSessions, connectors, goalW, save, checkB]);

  const addPresetMeal = useCallback((preset) => {
    const today = new Date().toISOString().split("T")[0];
    const newMeal = { id: `meal_${Date.now()}`, ...preset, date: today, createdAt: new Date().toISOString() };
    const newMeals = [...meals, newMeal];
    setMeals(newMeals);
    setShowPresets(false);
    const u = checkB(comp, wLog, newMeals, customSessions, connectors, chatHistory);
    save(comp, fb, wLog, nOn, u, nLog, chatHistory, customSessions, connectors, newMeals, goalW);
    showT(`${preset.name} ajouté`, T.ac2, "✅");
  }, [meals, comp, fb, wLog, nOn, ub, nLog, chatHistory, customSessions, connectors, goalW, save, checkB, showT]);

  const deleteMeal = useCallback((id) => {
    const newMeals = meals.filter(m => m.id !== id);
    setMeals(newMeals);
    save(comp, fb, wLog, nOn, ub, nLog, chatHistory, customSessions, connectors, newMeals, goalW);
  }, [meals, comp, fb, wLog, nOn, ub, nLog, chatHistory, customSessions, connectors, goalW, save]);

  // ─── COMPUTED ───
  const today = new Date().toISOString().split("T")[0];
  const nextS = plan.find(s => s.dateStr >= today && !comp[s.id]);
  const cc = Object.keys(comp).length, tot = plan.length, pct = Math.round((cc / tot) * 100);
  const dtr = Math.max(0, Math.ceil((RACE - new Date()) / 864e5));
  const totMin = plan.filter(s => comp[s.id]).reduce((a, s) => a + s.dur, 0);
  const customDist = customSessions.reduce((a, s) => a + (s.distance || 0), 0);
  const totDist = (1.74 + 2.02 + 3.95 + 4.38 + customDist).toFixed(1);
  const totalXP = BADGES.filter(b => ub.includes(b.id)).reduce((a, b) => a + b.xp, 0);
  const level = getLv(totalXP), nextLv = getNext(totalXP);
  const lvPct = nextLv ? Math.round(((totalXP - level.xp) / (nextLv.xp - level.xp)) * 100) : 100;
  const wl = wLog.length >= 2 ? (wLog[0].weight - wLog[wLog.length - 1].weight).toFixed(1) : 0;

  // Today's meals
  const todayMeals = meals.filter(m => m.date === today);
  const todayCal = todayMeals.reduce((a, m) => a + m.cal, 0);
  const todayProt = todayMeals.reduce((a, m) => a + (m.prot || 0), 0);
  const todayCarbs = todayMeals.reduce((a, m) => a + (m.carbs || 0), 0);
  const todayFat = todayMeals.reduce((a, m) => a + (m.fat || 0), 0);

  // Current nutrition target
  const currentWeek = Math.max(1, Math.min(14, Math.ceil((new Date() - START) / (7 * 864e5))));
  const currentNutTarget = NUT.find((n, i) => {
    const [s, e] = n.wk.split("-").map(Number);
    return currentWeek >= s && currentWeek <= e;
  }) || NUT[0];

  // ─── XP BAR COMPONENT ───
  const XP = () => (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ background: `${level.c}25`, borderRadius: "5px", padding: "1px 7px", display: "flex", alignItems: "center", gap: "3px" }}>
            <Ic.star />
            <span style={{ fontFamily: T.fh, fontSize: "13px", color: level.c, letterSpacing: "1px" }}>Niv.{level.lv}</span>
          </div>
          <span style={{ fontFamily: T.fh, fontSize: "12px", color: T.sf, letterSpacing: "0.5px" }}>{level.name}</span>
        </div>
        <span style={{ fontFamily: T.f, fontSize: "9px", color: T.dm }}>{totalXP} XP</span>
      </div>
      <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: "2px", background: `linear-gradient(90deg,${level.c},${T.ac})`, width: `${lvPct}%`, transition: "width .5s" }} />
      </div>
    </div>
  );

  // ─── SVG WEIGHT LINE CHART ───
  const WeightChart = () => {
    if (wLog.length < 1) return <p style={{ color: T.dm, fontSize: "10px", fontFamily: T.f, textAlign: "center" }}>Note ton poids pour voir le graphique !</p>;
    const data = wLog.slice(-20);
    const gw = goalW ? parseFloat(goalW) : null;
    const allVals = data.map(d => d.weight);
    if (gw) allVals.push(gw);
    const mn = Math.min(...allVals) - 2;
    const mx = Math.max(...allVals) + 2;
    const W = 300, H = 100, padL = 35, padR = 10, padT = 10, padB = 20;
    const chartW = W - padL - padR, chartH = H - padT - padB;
    const getX = (i) => padL + (i / Math.max(1, data.length - 1)) * chartW;
    const getY = (v) => padT + ((mx - v) / (mx - mn)) * chartH;
    const points = data.map((d, i) => `${getX(i)},${getY(d.weight)}`).join(" ");
    const areaPoints = `${getX(0)},${padT + chartH} ${points} ${getX(data.length - 1)},${padT + chartH}`;

    // Trend line (simple linear regression)
    let trendLine = null;
    if (data.length >= 2) {
      const n = data.length;
      const sumX = data.reduce((a, _, i) => a + i, 0);
      const sumY = data.reduce((a, d) => a + d.weight, 0);
      const sumXY = data.reduce((a, d, i) => a + i * d.weight, 0);
      const sumX2 = data.reduce((a, _, i) => a + i * i, 0);
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      const y1 = intercept;
      const y2 = intercept + slope * (n - 1);
      trendLine = { x1: getX(0), y1: getY(y1), x2: getX(n - 1), y2: getY(y2) };
    }

    const minW = Math.min(...data.map(d => d.weight));
    const maxW = Math.max(...data.map(d => d.weight));
    const curW = data[data.length - 1].weight;
    const changeW = data.length >= 2 ? (data[0].weight - curW).toFixed(1) : 0;

    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px", marginBottom: "8px" }}>
          {[
            { l: "Actuel", v: `${curW}`, c: T.ac },
            { l: "Min", v: `${minW}`, c: T.ac2 },
            { l: "Max", v: `${maxW}`, c: T.rd },
            { l: "Perdu", v: changeW > 0 ? `-${changeW}` : `+${Math.abs(changeW)}`, c: changeW > 0 ? T.ac2 : T.rd }
          ].map((x, i) => (
            <div key={i} style={{ textAlign: "center", background: `${x.c}08`, borderRadius: "6px", padding: "4px" }}>
              <div style={{ fontFamily: T.fh, fontSize: "14px", color: x.c }}>{x.v}</div>
              <div style={{ fontSize: "7px", color: T.dm }}>{x.l}</div>
            </div>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
            const val = mn + f * (mx - mn);
            const y = getY(val);
            return <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              <text x={padL - 4} y={y + 3} textAnchor="end" fill={T.dm} fontSize="7" fontFamily={T.f}>{val.toFixed(0)}</text>
            </g>;
          })}
          {/* Goal weight line */}
          {gw && <line x1={padL} y1={getY(gw)} x2={W - padR} y2={getY(gw)} stroke={T.ac2} strokeWidth="0.8" strokeDasharray="4,3" />}
          {gw && <text x={W - padR + 2} y={getY(gw) + 3} fill={T.ac2} fontSize="7" fontFamily={T.f}>obj</text>}
          {/* Area fill */}
          <polygon points={areaPoints} fill={`${T.ac}10`} />
          {/* Trend line */}
          {trendLine && <line x1={trendLine.x1} y1={trendLine.y1} x2={trendLine.x2} y2={trendLine.y2} stroke={T.rd} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.6" />}
          {/* Main line */}
          <polyline points={points} fill="none" stroke={T.ac} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Data points */}
          {data.map((d, i) => (
            <circle key={i} cx={getX(i)} cy={getY(d.weight)} r={i === data.length - 1 ? "3" : "2"} fill={i === data.length - 1 ? T.ac : `${T.ac}80`} stroke={T.bg} strokeWidth="0.5" />
          ))}
          {/* Date labels */}
          {data.length <= 10 && data.map((d, i) => (
            <text key={i} x={getX(i)} y={H - 4} textAnchor="middle" fill={T.dm} fontSize="5" fontFamily={T.f}>
              {d.date.slice(5)}
            </text>
          ))}
          {data.length > 10 && [0, Math.floor(data.length / 2), data.length - 1].map(i => (
            <text key={i} x={getX(i)} y={H - 4} textAnchor="middle" fill={T.dm} fontSize="5" fontFamily={T.f}>
              {data[i].date.slice(5)}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  // ─── WEEKLY CALORIE CHART (SVG) ───
  const WeeklyCalChart = () => {
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const dayMeals = meals.filter(m => m.date === ds);
      const totalCal = dayMeals.reduce((a, m) => a + m.cal, 0);
      last7.push({ date: ds, cal: totalCal, day: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][d.getDay()] });
    }
    const maxCal = Math.max(currentNutTarget.cal, ...last7.map(d => d.cal), 500);
    const W = 280, H = 80, barW = 28, gap = 12;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {/* Target line */}
        <line x1="0" y1={H - 18 - (currentNutTarget.cal / maxCal) * (H - 28)} x2={W} y2={H - 18 - (currentNutTarget.cal / maxCal) * (H - 28)} stroke={T.ac} strokeWidth="0.5" strokeDasharray="3,2" opacity="0.5" />
        {last7.map((d, i) => {
          const x = i * (barW + gap) + gap;
          const h = d.cal > 0 ? (d.cal / maxCal) * (H - 28) : 0;
          const y = H - 18 - h;
          const overTarget = d.cal > currentNutTarget.cal;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} rx="3" ry="3" fill={d.cal === 0 ? "rgba(255,255,255,0.03)" : overTarget ? `${T.rd}60` : `${T.ac2}50`} />
              {d.cal > 0 && <text x={x + barW / 2} y={y - 3} textAnchor="middle" fill={T.sf} fontSize="6" fontFamily={T.f}>{d.cal}</text>}
              <text x={x + barW / 2} y={H - 6} textAnchor="middle" fill={i === 6 ? T.ac : T.dm} fontSize="6" fontFamily={T.f}>{d.day}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  // ─── REAL DATA CARD ───
  const RDCard = ({ sid }) => {
    const d = RD[sid];
    if (!d) return null;
    const runs = d.intervals ? d.intervals.filter(x => x.t === "run") : null;
    return (
      <div style={{ background: `${T.ac2}08`, border: `1px solid ${T.ac2}20`, borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
        <div style={{ fontFamily: T.fh, fontSize: "12px", color: T.tx, letterSpacing: "1px", marginBottom: "8px" }}>{"📊"} DONNÉES RÉELLES — {d.type.toUpperCase()}</div>
        <div style={{ display: "grid", gridTemplateColumns: runs ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr", gap: "6px", marginBottom: "8px" }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: "15px", fontWeight: 800, fontFamily: T.fh, color: T.ac2 }}>{d.avgPace}</div><div style={{ fontSize: "7px", color: T.dm }}>ALLURE</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: "15px", fontWeight: 800, fontFamily: T.fh, color: T.tx }}>{d.dist}km</div><div style={{ fontSize: "7px", color: T.dm }}>DIST</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: "15px", fontWeight: 800, fontFamily: T.fh, color: T.tx }}>{typeof d.time === "number" ? d.time.toFixed(0) + "'" : d.time}</div><div style={{ fontSize: "7px", color: T.dm }}>DURÉE</div></div>
          {d.dplus && <div style={{ textAlign: "center" }}><div style={{ fontSize: "15px", fontWeight: 800, fontFamily: T.fh, color: T.tx }}>{d.dplus}m</div><div style={{ fontSize: "7px", color: T.dm }}>D+</div></div>}
        </div>
        {runs && <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "45px", marginBottom: "4px" }}>{runs.map((iv, i) => { const mx = Math.max(...runs.map(x => x.d)); const h = (iv.d / mx) * 35 + 8; return (<div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}><span style={{ fontSize: "6px", color: T.dm }}>{iv.p}</span><div style={{ width: "100%", height: `${h}px`, borderRadius: "2px 2px 0 0", background: `${T.ac2}50` }} /></div>); })}</div>}
        {d.splits && <div style={{ display: "flex", gap: "6px" }}>{d.splits.map((sp, i) => (<div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "6px", textAlign: "center" }}><div style={{ fontFamily: T.fh, fontSize: "13px", color: T.ac2 }}>{sp.pace}/km</div><div style={{ fontSize: "8px", color: T.dm }}>{sp.km < 1 ? `${(sp.km * 1000).toFixed(0)}m` : `Km ${i + 1}`}</div></div>))}</div>}
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "6px", padding: "6px 8px", marginTop: "6px" }}><p style={{ margin: 0, fontSize: "10px", color: T.sf, lineHeight: 1.3, fontFamily: T.f, fontStyle: "italic" }}>{d.note}</p></div>
      </div>
    );
  };

  // ─── COACH CARD ───
  const CoachCard = () => (
    <div style={{ background: `linear-gradient(160deg,${T.ac}08,transparent)`, border: `1px solid ${T.ac}15`, borderRadius: "14px", padding: "16px", marginBottom: "14px" }}>
      <div style={{ fontFamily: T.fh, fontSize: "14px", color: T.ac, letterSpacing: "1.5px", marginBottom: "4px" }}>{COACH_ANALYSIS.title}</div>
      <div style={{ fontSize: "9px", color: T.dm, fontFamily: T.f, marginBottom: "10px" }}>{COACH_ANALYSIS.date}</div>
      {COACH_ANALYSIS.sections.map((s, i) => (<div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "14px", flexShrink: 0 }}>{s.emoji}</span>
        <div><div style={{ fontFamily: T.fh, fontSize: "11px", color: T.tx, letterSpacing: "0.5px" }}>{s.title}</div><p style={{ margin: "2px 0 0", fontSize: "10.5px", color: T.sf, lineHeight: 1.35, fontFamily: T.f }}>{s.text}</p></div>
      </div>))}
    </div>
  );

  const Toast2 = () => toast ? (<div style={{ position: "fixed", top: "10px", left: isDesktop ? "auto" : "10px", right: "10px", zIndex: 200, animation: "sd .3s ease", maxWidth: isDesktop ? "400px" : "none" }}><div style={{ background: T.cd2, border: `1px solid ${toast.cl}40`, borderRadius: "10px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 6px 20px rgba(0,0,0,.5)" }}><span style={{ fontSize: "18px" }}>{toast.emoji}</span><span style={{ fontFamily: T.f, fontSize: "11px", fontWeight: 600, color: T.tx, flex: 1 }}>{toast.msg}</span><button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: T.dm, cursor: "pointer" }}><Ic.x /></button></div></div>) : null;

  const BadgePopup2 = () => newBadge ? (<div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", animation: "fi .3s ease" }}><div style={{ background: T.cd, border: `2px solid ${T.ac}`, borderRadius: "18px", padding: "28px 24px", textAlign: "center", maxWidth: "280px", animation: "pop .4s cubic-bezier(.16,1,.3,1)" }}>
    <div style={{ fontSize: "44px", marginBottom: "10px", animation: "bounce 1s ease infinite" }}>{newBadge.icon}</div>
    <div style={{ fontFamily: T.fh, fontSize: "11px", color: T.ac, letterSpacing: "3px" }}>BADGE DÉBLOQUÉ</div>
    <div style={{ fontFamily: T.fh, fontSize: "26px", color: T.tx, letterSpacing: "1px" }}>{newBadge.name}</div>
    <p style={{ color: T.sf, fontSize: "12px", fontFamily: T.f, margin: "6px 0 14px" }}>{newBadge.desc}</p>
    <div style={{ display: "inline-flex", background: `${T.ac}20`, borderRadius: "6px", padding: "4px 12px", color: T.ac, fontFamily: T.fh, fontSize: "16px", letterSpacing: "1px" }}>+{newBadge.xp} XP</div>
    <button onClick={() => setNewBadge(null)} style={{ display: "block", width: "100%", marginTop: "14px", padding: "8px", borderRadius: "8px", border: `1px solid ${T.bd}`, background: "transparent", color: T.dm, fontFamily: T.f, fontSize: "11px", cursor: "pointer" }}>Fermer</button>
  </div></div>) : null;

  // ─── TODAY VIEW ───
  const TodayV = () => {
    const s = nextS;
    const countdown = (
      <div style={{ background: `linear-gradient(180deg,${T.ac}08,transparent)`, border: `1px solid ${T.ac}10`, borderRadius: "14px", padding: isWide ? "24px" : "18px", marginBottom: "12px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: .02, backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.05) 10px,rgba(255,255,255,.05) 11px)", pointerEvents: "none" }} />
        <div style={{ fontFamily: T.fh, fontSize: isWide ? "13px" : "11px", color: T.ac, letterSpacing: "4px" }}>CANADIAN RACE</div>
        <div style={{ fontFamily: T.fh, fontSize: "9px", color: T.dm, letterSpacing: "2px", marginTop: "1px" }}>VIMY-LORETTE</div>
        <div style={{ fontFamily: T.fh, fontSize: isWide ? "56px" : "44px", color: T.tx, lineHeight: 1, marginTop: "4px", letterSpacing: "2px" }}>J-{dtr}</div>
        <div style={{ color: T.dm, fontSize: "10px", fontFamily: T.f }}>5.5 km {"·"} 100m D+ {"·"} 35 min</div>
      </div>
    );
    const statsGrid = (
      <div style={{ display: "grid", gridTemplateColumns: isWide ? "1fr 1fr 1fr 1fr 1fr" : "1fr 1fr 1fr 1fr", gap: "5px", marginBottom: "12px" }}>
        {[{ l: "Séances", v: cc, s: `/${tot}` }, { l: "Distance", v: totDist, s: "km" }, { l: "Minutes", v: totMin, s: "" }, { l: "Badges", v: ub.length, s: `/${BADGES.length}` }, ...(isWide ? [{ l: "Perso", v: customSessions.length, s: "" }] : [])].map((x, i) => (<div key={i} style={{ background: T.cd, borderRadius: "8px", padding: isWide ? "12px 6px" : "8px 4px", textAlign: "center", border: `1px solid ${T.bd}` }}>
          <div style={{ fontSize: isWide ? "20px" : "16px", fontWeight: 800, fontFamily: T.fh, color: T.tx, letterSpacing: "0.5px" }}>{x.v}<span style={{ fontSize: "8px", color: T.dm, fontFamily: T.f }}> {x.s}</span></div>
          <div style={{ fontSize: "7px", color: T.dm, textTransform: "uppercase", letterSpacing: ".8px", fontFamily: T.f }}>{x.l}</div>
        </div>))}
      </div>
    );
    const badgesRow = ub.length > 0 ? (
      <div style={{ display: "flex", gap: "5px", marginBottom: "12px", overflowX: "auto", paddingBottom: "2px", flexWrap: isWide ? "wrap" : "nowrap" }}>{BADGES.filter(b => ub.includes(b.id)).slice(isWide ? -10 : -6).reverse().map(b => (<div key={b.id} style={{ minWidth: isWide ? "52px" : "44px", textAlign: "center", padding: "6px 2px", background: `${T.ac}06`, borderRadius: "8px", border: `1px solid ${T.ac}12` }}><div style={{ fontSize: isWide ? "24px" : "20px" }}>{b.icon}</div><div style={{ fontSize: "6px", color: T.dm, fontFamily: T.f, marginTop: "1px" }}>{b.name}</div></div>))}</div>
    ) : null;
    const nextSession = s ? (
      <div>
        <div style={{ fontSize: "9px", color: T.dm, textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, marginBottom: "6px", fontFamily: T.f }}>{"📅"} Prochaine {"·"} {fD(s.date)}</div>
        <div onClick={() => setSel(s)} style={{ background: `linear-gradient(160deg,${s.phaseColor}0C,${s.phaseColor}03)`, border: `1px solid ${s.phaseColor}18`, borderRadius: "14px", padding: "16px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: `${s.phaseColor}10`, color: s.phaseColor, display: "flex", alignItems: "center", justifyContent: "center" }}>{gI(s.type)}</div>
            <div><div style={{ fontFamily: T.fh, fontSize: "15px", color: T.tx, letterSpacing: "0.5px" }}>{s.title}</div><div style={{ color: T.dm, fontSize: "9px", fontFamily: T.f }}>{s.dur} min {"·"} S{s.week}</div></div>
          </div>
          <p style={{ color: T.sf, fontSize: "11px", lineHeight: 1.3, margin: "0 0 6px", fontFamily: T.f }}>{s.desc}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>{iB(s.int, s.phaseColor)}<span style={{ color: s.phaseColor, fontSize: "9px", fontWeight: 600, fontFamily: T.f }}>Détail {"→"}</span></div>
        </div>
        {!comp[s.id] && <button onClick={e => { e.stopPropagation(); toggle(s.id); }} style={{ width: "100%", padding: "11px", borderRadius: "9px", border: "none", marginTop: "6px", background: `linear-gradient(135deg,${s.phaseColor},${s.phaseColor}BB)`, color: T.bg, fontFamily: T.fh, fontSize: "13px", letterSpacing: "1px", cursor: "pointer" }}>{"✓"} TERMINÉE</button>}
      </div>
    ) : null;

    if (isWide) {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "start" }}>
          <div>
            {countdown}
            <XP />
            {statsGrid}
            {badgesRow}
          </div>
          <div>
            <CoachCard />
            {nextSession}
          </div>
        </div>
      );
    }

    return (<div>
      {countdown}
      <XP />
      {statsGrid}
      {badgesRow}
      <CoachCard />
      {nextSession}
    </div>);
  };

  // ─── PLAN VIEW ───
  const PlanV = () => {
    const g = {};
    plan.forEach(s => { const k = s.week; if (!g[k]) g[k] = { ss: [], ph: s.phase, cl: s.phaseColor, lb: s.weekLabel }; g[k].ss.push(s); });
    return (<div>
      <XP />
      {/* Custom sessions section */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <div style={{ fontFamily: T.fh, fontSize: "13px", color: T.tx, letterSpacing: "1px" }}>SÉANCES PERSO</div>
          <button onClick={() => setShowAddSession(true)} style={{ background: `${T.ac2}12`, border: `1px solid ${T.ac2}25`, borderRadius: "6px", padding: "4px 8px", color: T.ac2, fontFamily: T.f, fontSize: "9px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}><Ic.plus /> Ajouter</button>
        </div>
        {customSessions.length === 0 && <p style={{ color: T.dm, fontSize: "10px", fontFamily: T.f, textAlign: "center", padding: "8px" }}>Aucune séance perso. Ajoute ta première !</p>}
        {customSessions.slice(-5).reverse().map(s => (
          <div key={s.id} style={{ background: T.cd, border: `1px solid ${T.bd}`, borderRadius: "8px", padding: "10px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: `${T.ac}10`, color: T.ac, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{gI(s.type)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.fh, fontSize: "11px", color: T.tx }}>{s.distance} km {"·"} {s.duration} min</div>
              <div style={{ fontSize: "8px", color: T.dm, fontFamily: T.f }}>{s.date} {s.notes && `— ${s.notes}`}</div>
            </div>
            <div style={{ display: "flex", gap: "1px" }}>{[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: "4px", height: "10px", borderRadius: "1px", background: i <= s.difficulty ? T.ac : "rgba(255,255,255,0.06)" }} />)}</div>
          </div>
        ))}
      </div>
      {Object.entries(g).map(([wk, { ss, ph, cl, lb }]) => {
        const open = expW === +wk;
        const allD = ss.every(s => comp[s.id]);
        const someD = ss.some(s => comp[s.id]);
        return (<div key={wk} style={{ marginBottom: "4px" }}>
          <div onClick={() => setExpW(open ? null : +wk)} style={{ background: allD ? `${cl}08` : T.cd, border: `1px solid ${allD ? cl + "20" : T.bd}`, borderRadius: open ? "9px 9px 0 0" : "9px", padding: "10px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><div style={{ width: "26px", height: "26px", borderRadius: "6px", background: allD ? `${cl}20` : someD ? `${cl}0C` : "rgba(255,255,255,0.03)", color: allD ? cl : someD ? cl : T.dm, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontFamily: T.fh }}>{allD ? <Ic.chk /> : wk}</div>
              <div><div style={{ fontFamily: T.fh, fontSize: "12px", color: T.tx, letterSpacing: "0.5px" }}>SEM. {wk} — {lb}</div><div style={{ fontSize: "8px", color: cl, fontFamily: T.f }}>{ph} {"·"} {ss.length}</div></div></div>
            <div style={{ transform: open ? "rotate(90deg)" : "", transition: "transform .2s", color: T.dm }}><Ic.rt /></div>
          </div>
          {open && <div style={{ background: T.cd, border: `1px solid ${T.bd}`, borderTop: "none", borderRadius: "0 0 9px 9px", padding: "4px" }}>{ss.map(s => (<div key={s.id} onClick={() => setSel(s)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px", borderRadius: "6px", cursor: "pointer", background: comp[s.id] ? `${cl}04` : "transparent" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: comp[s.id] ? `${cl}16` : "rgba(255,255,255,0.03)", color: comp[s.id] ? cl : T.dm, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{comp[s.id] ? <Ic.chk /> : gI(s.type)}</div>
            <div style={{ flex: 1 }}><div style={{ fontFamily: T.fh, fontSize: "11px", color: T.tx, opacity: comp[s.id] ? .5 : 1, letterSpacing: "0.3px" }}>{s.title}</div><div style={{ fontSize: "8px", color: T.dm, fontFamily: T.f }}>{fD(s.date)} {"·"} {s.dur}min</div></div>
            {RD[s.id] && <span style={{ fontSize: "7px", color: T.ac2, background: `${T.ac2}15`, padding: "1px 5px", borderRadius: "3px", fontFamily: T.f }}>DATA</span>}
            {iB(s.int, cl)}
          </div>))}</div>}
        </div>);
      })}
    </div>);
  };

  // ─── DETAIL VIEW ───
  const Detail = ({ s }) => {
    const done = comp[s.id];
    const f = fb[s.id];
    return (<div style={{ animation: "fu .3s ease" }}>
      <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: T.dm, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", padding: 0, marginBottom: "14px", fontFamily: T.f, fontSize: "12px" }}><Ic.bk /> Retour</button>
      <div style={{ background: `linear-gradient(160deg,${s.phaseColor}0C,${s.phaseColor}03)`, border: `1px solid ${s.phaseColor}18`, borderRadius: "14px", padding: "18px", marginBottom: "10px" }}>
        <div style={{ fontFamily: T.fh, fontSize: "10px", color: s.phaseColor, letterSpacing: "2px" }}>S{s.week} {"·"} {s.phase}</div>
        <h2 style={{ margin: "4px 0 0", fontFamily: T.fh, fontSize: "20px", color: T.tx, letterSpacing: "1px" }}>{s.title}</h2>
        <div style={{ display: "flex", gap: "10px", margin: "6px 0", color: T.sf, fontSize: "10px", fontFamily: T.f }}><span>{fDL(s.date)}</span><span>{s.dur} min</span></div>
        {iB(s.int, s.phaseColor)}
        <p style={{ color: T.sf, lineHeight: 1.45, margin: "8px 0 0", fontFamily: T.f, fontSize: "12px" }}>{s.desc}</p>
      </div>
      {RD[s.id] && <RDCard sid={s.id} />}
      <div style={{ background: T.cd, borderRadius: "10px", padding: "16px", border: `1px solid ${T.bd}`, marginBottom: "8px" }}>
        <div style={{ fontFamily: T.fh, fontSize: "12px", color: T.tx, letterSpacing: "1px", marginBottom: "8px" }}>PROGRAMME</div>
        {s.steps.map((st, i) => (<div key={i} style={{ display: "flex", gap: "7px", marginBottom: "7px" }}><div style={{ minWidth: "20px", height: "20px", borderRadius: "5px", background: `${s.phaseColor}10`, color: s.phaseColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontFamily: T.fh }}>{i + 1}</div><p style={{ margin: 0, color: T.sf, lineHeight: 1.35, fontFamily: T.f, fontSize: "11px", paddingTop: "2px" }}>{st}</p></div>))}
      </div>
      {s.tip && <div style={{ background: "rgba(180,160,120,0.03)", border: `1px solid ${T.bd}`, borderRadius: "9px", padding: "10px", display: "flex", gap: "7px", marginBottom: "8px" }}><span style={{ fontSize: "13px" }}>{"💡"}</span><p style={{ margin: 0, color: T.sf, lineHeight: 1.35, fontFamily: T.f, fontSize: "10.5px" }}>{s.tip}</p></div>}
      {done && <div style={{ background: T.cd, borderRadius: "9px", padding: "12px", border: `1px solid ${T.bd}`, marginBottom: "8px" }}><div style={{ fontFamily: T.fh, fontSize: "10px", color: T.tx, letterSpacing: "1px", marginBottom: "6px" }}>RESSENTI</div>
        <div style={{ display: "flex", gap: "4px" }}>{[{ v: 1, l: "😎" }, { v: 2, l: "👍" }, { v: 3, l: "💪" }, { v: 4, l: "😤" }, { v: 5, l: "🥵" }].map(o => (<button key={o.v} onClick={() => setFbk(s.id, o.v)} style={{ flex: 1, padding: "7px", borderRadius: "6px", border: `1px solid ${f?.difficulty === o.v ? s.phaseColor : T.bd}`, background: f?.difficulty === o.v ? `${s.phaseColor}12` : "transparent", fontSize: "15px", cursor: "pointer" }}>{o.l}</button>))}</div></div>}
      <button onClick={() => toggle(s.id)} style={{ width: "100%", padding: "11px", borderRadius: "9px", border: done ? `1px solid ${T.bd}` : "none", background: done ? T.cd : `linear-gradient(135deg,${s.phaseColor},${s.phaseColor}BB)`, color: done ? T.dm : T.bg, fontFamily: T.fh, fontSize: "13px", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>{done ? <><Ic.chk /> COMPLÉTÉE</> : "✓ TERMINÉE"}</button>
    </div>);
  };

  // ─── STATS VIEW ───
  const StatsV = () => {
    const phs = [{ n: "Adaptation", c: "#8B9D77", w: [1, 2, 3, 4] }, { n: "Construction", c: "#C9A96E", w: [5, 6, 7, 8] }, { n: "Spécifique", c: "#D4A853", w: [9, 10, 11] }, { n: "Affûtage", c: "#A08060", w: [12, 13, 14] }];
    return (<div>
      <XP />
      <div style={{ display: "grid", gridTemplateColumns: isWide ? "1fr 1fr 1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: "5px", marginBottom: "12px" }}>{[{ l: "Séances", v: `${cc}/${tot}`, c: T.ac }, { l: "Distance", v: `${totDist} km`, c: T.ac2 }, { l: "Minutes", v: totMin, c: "#C9A96E" }, { l: "Progression", v: `${pct}%`, c: T.ac }, { l: "Poids perdu", v: wl > 0 ? `-${wl}kg` : "—", c: "#A08060" }, { l: "Allure moy.", v: "6:55/km", c: "#D4A853" }].map((x, i) => (<div key={i} style={{ background: T.cd, borderRadius: "8px", padding: "10px 6px", border: `1px solid ${T.bd}`, textAlign: "center" }}><div style={{ fontFamily: T.fh, fontSize: "17px", color: x.c, letterSpacing: "0.5px" }}>{x.v}</div><div style={{ fontSize: "7px", color: T.dm, fontFamily: T.f, textTransform: "uppercase" }}>{x.l}</div></div>))}</div>
      {/* Pace evolution */}
      <div style={{ background: T.cd, borderRadius: "10px", padding: "14px", border: `1px solid ${T.bd}`, marginBottom: "10px" }}>
        <div style={{ fontFamily: T.fh, fontSize: "11px", color: T.tx, letterSpacing: "1px", marginBottom: "8px" }}>ÉVOLUTION DE L'ALLURE</div>
        <div style={{ display: "flex", gap: "4px", alignItems: "flex-end" }}>
          {[{ l: "S1 frac.", v: "6:45", pct: 85 }, { l: "S2 frac.", v: "6:46", pct: 84 }, { l: "Mar midi", v: "7:06", pct: 75 }, { l: "Mar soir", v: "7:15", pct: 72 }].map((x, i) => (<div key={i} style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: "9px", color: T.ac, fontFamily: T.fh }}>{x.v}</div><div style={{ height: `${x.pct * .5 + 10}px`, background: i < 2 ? `${T.ac2}50` : `${T.ac}40`, borderRadius: "3px 3px 0 0", marginTop: "2px" }} /><div style={{ fontSize: "6px", color: T.dm, fontFamily: T.f, marginTop: "2px" }}>{x.l}</div></div>))}
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "9px", color: T.sf, fontFamily: T.f, fontStyle: "italic" }}>Fractionné : 6:45/km {"→"} Continu : 7:06-7:15/km. Normal : l'allure continue est toujours plus lente que le fractionné.</p>
      </div>
      {phs.map(ph => { const ps = plan.filter(s => ph.w.includes(s.week)); const pc = ps.filter(s => comp[s.id]).length; const pp = ps.length > 0 ? Math.round((pc / ps.length) * 100) : 0; return (<div key={ph.n} style={{ background: T.cd, borderRadius: "8px", padding: "12px", border: `1px solid ${T.bd}`, marginBottom: "4px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}><div style={{ display: "flex", alignItems: "center", gap: "5px" }}><div style={{ width: "5px", height: "5px", borderRadius: "50%", background: ph.c }} /><span style={{ fontFamily: T.fh, fontSize: "11px", color: T.tx }}>{ph.n}</span></div><span style={{ fontFamily: T.fh, fontSize: "11px", color: ph.c }}>{pp}%</span></div><div style={{ height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.04)", overflow: "hidden" }}><div style={{ height: "100%", borderRadius: "2px", background: ph.c, width: `${pp}%` }} /></div></div>); })}

      {/* Connectors section */}
      <div style={{ fontFamily: T.fh, fontSize: "13px", color: T.tx, letterSpacing: "1px", margin: "12px 0 8px" }}>CONNECTEURS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px", marginBottom: "12px" }}>
        {CONNECTORS.map(c => {
          const isConn = connectors[c.id]?.connected;
          return (
            <div key={c.id} onClick={() => setShowConnector(c.id)} style={{ background: isConn ? `${c.color}10` : T.cd, border: `1px solid ${isConn ? c.color + "30" : T.bd}`, borderRadius: "10px", padding: "10px 6px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: "20px", marginBottom: "2px" }}>{c.icon}</div>
              <div style={{ fontFamily: T.fh, fontSize: "9px", color: T.tx, letterSpacing: "0.3px" }}>{c.name}</div>
              <div style={{ fontSize: "7px", color: isConn ? T.ac2 : T.dm, fontFamily: T.f, marginTop: "2px" }}>{isConn ? "Connecté" : "Non connecté"}</div>
              {isConn && <div style={{ fontSize: "6px", color: T.dm, fontFamily: T.f }}>{connectors[c.id].syncCount} syncs</div>}
            </div>
          );
        })}
      </div>

      {/* Badges */}
      <div style={{ fontFamily: T.fh, fontSize: "13px", color: T.tx, letterSpacing: "1px", margin: "12px 0 8px" }}>BADGES ({ub.length}/{BADGES.length})</div>
      <div style={{ display: "grid", gridTemplateColumns: isWide ? "1fr 1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: "4px" }}>{BADGES.map(b => { const u = ub.includes(b.id); return (<div key={b.id} style={{ background: u ? `${T.ac}08` : T.cd, border: `1px solid ${u ? T.ac + "20" : T.bd}`, borderRadius: "10px", padding: "10px 6px", textAlign: "center", opacity: u ? 1 : .35 }}><div style={{ fontSize: "24px", filter: u ? "none" : "grayscale(1)" }}>{b.icon}</div><div style={{ fontFamily: T.fh, fontSize: "9px", color: u ? T.tx : T.dm, marginTop: "2px" }}>{b.name}</div><div style={{ fontSize: "7px", color: T.dm, fontFamily: T.f, lineHeight: 1.2 }}>{b.desc}</div>{u && <div style={{ fontSize: "8px", color: T.ac, fontFamily: T.fh, marginTop: "2px" }}>+{b.xp}XP</div>}</div>); })}</div>
    </div>);
  };

  // ─── NUTRITION VIEW ───
  const NutV = () => {
    const nw = NUT[nutI];
    return (<div>
      {/* Weight tracking with SVG chart */}
      <div style={{ background: T.cd, borderRadius: "12px", padding: "14px", border: `1px solid ${T.bd}`, marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div><div style={{ fontFamily: T.fh, fontSize: "13px", color: T.tx, letterSpacing: "1px" }}>SUIVI DU POIDS</div></div>
          <button onClick={() => setShowWI(!showWI)} style={{ background: `${T.ac2}12`, border: `1px solid ${T.ac2}25`, borderRadius: "6px", padding: "5px 8px", color: T.ac2, fontFamily: T.f, fontSize: "9px", fontWeight: 600, cursor: "pointer" }}>+ Peser</button>
        </div>
        {showWI && <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", gap: "5px", marginBottom: "4px" }}>
            <input type="number" step="0.1" value={wiV} onChange={e => setWiV(e.target.value)} placeholder="112.5" style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "7px 8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
            <button onClick={addW} style={{ background: T.ac, border: "none", borderRadius: "6px", padding: "7px 12px", color: T.bg, fontFamily: T.fh, fontSize: "12px", cursor: "pointer" }}>OK</button>
          </div>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Objectif :</span>
            <input type="number" step="0.1" value={goalW} onChange={e => { setGoalW(e.target.value); saveAll({ goalW: e.target.value }); }} placeholder="95" style={{ width: "60px", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.bd}`, borderRadius: "4px", padding: "4px 6px", color: T.ac2, fontFamily: T.f, fontSize: "10px", outline: "none" }} />
            <span style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>kg</span>
          </div>
        </div>}
        <WeightChart />
      </div>

      {/* Meal Tracker */}
      <div style={{ background: T.cd, borderRadius: "12px", padding: "14px", border: `1px solid ${T.bd}`, marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ fontFamily: T.fh, fontSize: "13px", color: T.tx, letterSpacing: "1px" }}>MES REPAS — {today.slice(5)}</div>
          <div style={{ display: "flex", gap: "4px" }}>
            <button onClick={() => setShowPresets(true)} style={{ background: `${T.ac}08`, border: `1px solid ${T.ac}20`, borderRadius: "6px", padding: "4px 6px", color: T.ac, fontFamily: T.f, fontSize: "8px", fontWeight: 600, cursor: "pointer" }}>Rapide</button>
            <button onClick={() => setShowAddMeal(true)} style={{ background: `${T.ac2}12`, border: `1px solid ${T.ac2}25`, borderRadius: "6px", padding: "4px 8px", color: T.ac2, fontFamily: T.f, fontSize: "8px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}><Ic.plus /> Repas</button>
          </div>
        </div>

        {/* Daily summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px", marginBottom: "8px" }}>
          {[
            { l: "Cal", v: todayCal, target: currentNutTarget.cal, c: todayCal > currentNutTarget.cal ? T.rd : T.ac },
            { l: "Prot", v: todayProt, target: currentNutTarget.pr, c: T.rd },
            { l: "Gluc", v: todayCarbs, target: currentNutTarget.ca, c: "#D4A853" },
            { l: "Lip", v: todayFat, target: currentNutTarget.fa, c: T.ac2 }
          ].map((x, i) => (
            <div key={i} style={{ background: `${x.c}06`, borderRadius: "7px", padding: "6px 3px", textAlign: "center", border: `1px solid ${x.c}10` }}>
              <div style={{ fontSize: "14px", fontFamily: T.fh, color: x.c }}>{x.v}</div>
              <div style={{ fontSize: "7px", color: T.dm, fontFamily: T.f }}>{x.l} /{x.target}</div>
              <div style={{ height: "2px", borderRadius: "1px", background: "rgba(255,255,255,0.05)", marginTop: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "1px", background: x.c, width: `${Math.min(100, (x.v / x.target) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Today's meals list */}
        {todayMeals.length === 0 && <p style={{ color: T.dm, fontSize: "10px", fontFamily: T.f, textAlign: "center", padding: "6px" }}>Aucun repas logé aujourd'hui</p>}
        {todayMeals.map(m => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 0", borderBottom: `1px solid ${T.bd}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.f, fontSize: "11px", color: T.tx, fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontSize: "8px", color: T.dm, fontFamily: T.f }}>P:{m.prot||0}g G:{m.carbs||0}g L:{m.fat||0}g</div>
            </div>
            <span style={{ fontFamily: T.fh, fontSize: "12px", color: T.ac }}>{m.cal}</span>
            <span style={{ fontSize: "7px", color: T.dm }}>kcal</span>
            <button onClick={() => deleteMeal(m.id)} style={{ background: "none", border: "none", color: T.dm, cursor: "pointer", padding: "2px" }}><Ic.x /></button>
          </div>
        ))}

        {/* Weekly calorie chart */}
        {meals.length > 0 && <div style={{ marginTop: "10px" }}>
          <div style={{ fontFamily: T.fh, fontSize: "10px", color: T.tx, letterSpacing: "0.5px", marginBottom: "4px" }}>CALORIES — 7 DERNIERS JOURS</div>
          <WeeklyCalChart />
        </div>}
      </div>

      {/* Existing nutrition plan */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}><button onClick={() => setNutI(Math.max(0, nutI - 1))} disabled={nutI === 0} style={{ background: "none", border: "none", color: nutI === 0 ? T.dm : T.sf, cursor: "pointer" }}><Ic.bk /></button><div style={{ textAlign: "center" }}><div style={{ fontFamily: T.fh, fontSize: "14px", color: T.tx, letterSpacing: "1px" }}>SEM. {nw.wk}</div><div style={{ fontSize: "8px", color: nw.cl, fontFamily: T.f }}>{nw.ph}</div></div><button onClick={() => setNutI(Math.min(NUT.length - 1, nutI + 1))} disabled={nutI === NUT.length - 1} style={{ background: "none", border: "none", color: nutI === NUT.length - 1 ? T.dm : T.sf, cursor: "pointer" }}><Ic.rt /></button></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px", marginBottom: "8px" }}>{[{ l: "Cal", v: nw.cal, c: nw.cl }, { l: "Prot", v: nw.pr, c: "#C45B4A" }, { l: "Gluc", v: nw.ca, c: "#D4A853" }, { l: "Lip", v: nw.fa, c: "#8B9D77" }].map((m, i) => (<div key={i} style={{ background: `${m.c}06`, borderRadius: "7px", padding: "7px 3px", textAlign: "center", border: `1px solid ${m.c}10` }}><div style={{ fontSize: "14px", fontFamily: T.fh, color: m.c }}>{m.v}</div><div style={{ fontSize: "7px", color: T.dm, fontFamily: T.f }}>{m.l}</div></div>))}</div>
      {nw.ms.map((m, i) => (<div key={i} style={{ background: T.cd, borderRadius: "9px", padding: "12px", border: `1px solid ${T.bd}`, marginBottom: "4px" }}><div style={{ fontFamily: T.fh, fontSize: "11px", color: T.tx, letterSpacing: "0.5px", marginBottom: "4px" }}>{m.t} <span style={{ color: nw.cl, fontSize: "9px" }}>{m.cal}kcal</span></div>{m.it.map((it, j) => (<div key={j} style={{ display: "flex", gap: "5px", marginBottom: "2px" }}><div style={{ width: "3px", height: "3px", borderRadius: "50%", background: nw.cl, marginTop: "5px", opacity: .3 }} /><span style={{ color: T.sf, fontSize: "10.5px", lineHeight: 1.35, fontFamily: T.f }}>{it}</span></div>))}</div>))}
      <div style={{ background: "rgba(180,160,120,0.03)", border: `1px solid ${T.bd}`, borderRadius: "8px", padding: "10px", marginTop: "3px" }}>{nw.tp.map((t, i) => (<div key={i} style={{ display: "flex", gap: "4px", marginBottom: "2px" }}><span style={{ color: T.ac, fontSize: "8px" }}>{"•"}</span><span style={{ color: T.sf, fontSize: "10px", lineHeight: 1.3, fontFamily: T.f }}>{t}</span></div>))}</div>
    </div>);
  };

  // ─── CHAT PANEL ───
  const ChatPanel = () => {
    const panelStyle = isDesktop ? {
      position: "fixed", right: 0, top: 0, bottom: 0, width: "380px", background: T.bg,
      borderLeft: `1px solid ${T.bd}`, zIndex: 150, display: "flex", flexDirection: "column",
      animation: "slideInRight .3s ease"
    } : {
      position: "fixed", inset: 0, background: T.bg, zIndex: 150, display: "flex", flexDirection: "column",
      animation: "fu .3s ease"
    };

    return (
      <div style={panelStyle}>
        {/* Header */}
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.bd}`, display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `linear-gradient(135deg, #7C5CFC, #5436DA)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: 700 }}>C</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.fh, fontSize: "14px", color: T.tx, letterSpacing: "1px" }}>COACH CLAUDE</div>
            <div style={{ fontSize: "8px", color: T.ac2, fontFamily: T.f }}>En ligne {"•"} Coach IA RunBack</div>
          </div>
          <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: T.dm, cursor: "pointer", padding: "4px" }}><Ic.x /></button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {chatHistory.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{"🎗️"}</div>
              <div style={{ fontFamily: T.fh, fontSize: "14px", color: T.tx, letterSpacing: "1px" }}>COACH CLAUDE</div>
              <p style={{ color: T.sf, fontSize: "11px", fontFamily: T.f, lineHeight: 1.4, marginTop: "6px" }}>
                Pose-moi tes questions sur l'entraînement, la nutrition, la récupération, le parcours de Vimy...
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center", marginTop: "10px" }}>
                {["Quelle allure viser ?", "Conseils nutrition", "J'ai mal au genou", "Parle-moi de Vimy"].map(q => (
                  <button key={q} onClick={() => { setChatMsg(q); }} style={{ background: `${T.ac}08`, border: `1px solid ${T.ac}18`, borderRadius: "12px", padding: "5px 10px", color: T.ac, fontFamily: T.f, fontSize: "9px", cursor: "pointer" }}>{q}</button>
                ))}
              </div>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "6px" }}>
              {msg.role === "ai" && <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: `linear-gradient(135deg, #7C5CFC, #5436DA)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", fontWeight: 700, flexShrink: 0 }}>C</div>}
              <div style={{
                maxWidth: "75%",
                padding: "8px 12px",
                borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: msg.role === "user" ? `linear-gradient(135deg, ${T.ac}, ${T.ac}CC)` : T.cd2,
                color: msg.role === "user" ? T.bg : T.sf,
                fontFamily: T.f,
                fontSize: "11px",
                lineHeight: 1.4,
              }}>
                {msg.text}
                <div style={{ fontSize: "7px", color: msg.role === "user" ? "rgba(26,24,16,0.5)" : T.dm, marginTop: "3px", textAlign: "right" }}>
                  {new Date(msg.time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${T.bd}`, display: "flex", gap: "8px", flexShrink: 0 }}>
          <input
            type="text"
            value={chatMsg}
            onChange={e => setChatMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendChat()}
            placeholder="Pose ta question..."
            style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "20px", padding: "8px 14px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }}
          />
          <button onClick={sendChat} style={{ width: "36px", height: "36px", borderRadius: "50%", background: chatMsg.trim() ? T.ac : T.cd, border: "none", color: chatMsg.trim() ? T.bg : T.dm, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic.send /></button>
        </div>
      </div>
    );
  };

  // ─── ADD SESSION MODAL ───
  const AddSessionModal = () => (
    <>
      <div onClick={() => setShowAddSession(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 99 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "80vh", overflowY: "auto", background: T.bg, borderTop: `1px solid ${T.bd}`, borderRadius: "14px 14px 0 0", padding: "16px", zIndex: 100, animation: "fu .25s ease", ...(isDesktop ? { left: "50%", transform: "translateX(-50%)", maxWidth: "500px", bottom: "auto", top: "50%", borderRadius: "14px", transform: "translate(-50%, -50%)" } : {}) }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontFamily: T.fh, color: T.tx, fontSize: "14px", letterSpacing: "1px" }}>{"🏃"} NOUVELLE SÉANCE</span>
          <button onClick={() => setShowAddSession(false)} style={{ background: "none", border: "none", color: T.dm, cursor: "pointer" }}><Ic.x /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Date</label>
              <input type="date" value={sessionForm.date} onChange={e => setSessionForm({ ...sessionForm, date: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Type</label>
              <select value={sessionForm.type} onChange={e => setSessionForm({ ...sessionForm, type: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }}>
                <option value="run">Course</option>
                <option value="strength">Renforcement</option>
                <option value="walk">Marche</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Distance (km)</label>
              <input type="number" step="0.1" value={sessionForm.distance} onChange={e => setSessionForm({ ...sessionForm, distance: e.target.value })} placeholder="3.5" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Durée (min)</label>
              <input type="number" value={sessionForm.duration} onChange={e => setSessionForm({ ...sessionForm, duration: e.target.value })} placeholder="30" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Notes</label>
            <input type="text" value={sessionForm.notes} onChange={e => setSessionForm({ ...sessionForm, notes: e.target.value })} placeholder="Comment ça s'est passé..." style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Difficulté ressentie</label>
            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
              {[{ v: 1, l: "😎" }, { v: 2, l: "👍" }, { v: 3, l: "💪" }, { v: 4, l: "😤" }, { v: 5, l: "🥵" }].map(o => (
                <button key={o.v} onClick={() => setSessionForm({ ...sessionForm, difficulty: o.v })} style={{ flex: 1, padding: "7px", borderRadius: "6px", border: `1px solid ${sessionForm.difficulty === o.v ? T.ac : T.bd}`, background: sessionForm.difficulty === o.v ? `${T.ac}12` : "transparent", fontSize: "15px", cursor: "pointer" }}>{o.l}</button>
              ))}
            </div>
          </div>
          <button onClick={addCustomSession} style={{ width: "100%", padding: "11px", borderRadius: "9px", border: "none", background: `linear-gradient(135deg,${T.ac2},${T.ac2}BB)`, color: T.bg, fontFamily: T.fh, fontSize: "13px", letterSpacing: "1px", cursor: "pointer", marginTop: "4px" }}>ENREGISTRER</button>
        </div>
      </div>
    </>
  );

  // ─── CONNECTOR MODAL ───
  const ConnectorModal = () => {
    const c = CONNECTORS.find(x => x.id === showConnector);
    if (!c) return null;
    const isConn = connectors[c.id]?.connected;
    return (
      <>
        <div onClick={() => setShowConnector(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 99 }} />
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "70vh", overflowY: "auto", background: T.bg, borderTop: `1px solid ${T.bd}`, borderRadius: "14px 14px 0 0", padding: "16px", zIndex: 100, animation: "fu .25s ease", ...(isDesktop ? { left: "50%", maxWidth: "450px", bottom: "auto", top: "50%", borderRadius: "14px", transform: "translate(-50%, -50%)" } : {}) }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontFamily: T.fh, color: T.tx, fontSize: "14px", letterSpacing: "1px" }}>{c.icon} {c.name.toUpperCase()}</span>
            <button onClick={() => setShowConnector(null)} style={{ background: "none", border: "none", color: T.dm, cursor: "pointer" }}><Ic.x /></button>
          </div>
          <p style={{ color: T.sf, fontSize: "11px", fontFamily: T.f, marginBottom: "12px" }}>{c.desc}</p>
          {isConn ? (
            <div>
              <div style={{ background: `${T.ac2}08`, border: `1px solid ${T.ac2}20`, borderRadius: "10px", padding: "12px", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.ac2 }} />
                  <span style={{ fontFamily: T.fh, fontSize: "11px", color: T.ac2 }}>CONNECTÉ</span>
                </div>
                <div style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Dernière sync : {new Date(connectors[c.id].lastSync).toLocaleString("fr-FR")}</div>
                <div style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>{connectors[c.id].syncCount} activités sync.</div>
              </div>
              <button onClick={() => disconnectService(c.id)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${T.rd}30`, background: `${T.rd}08`, color: T.rd, fontFamily: T.fh, fontSize: "12px", letterSpacing: "1px", cursor: "pointer" }}>DÉCONNECTER</button>
            </div>
          ) : (
            <div>
              <div style={{ background: T.cd, borderRadius: "10px", padding: "12px", border: `1px solid ${T.bd}`, marginBottom: "10px" }}>
                <div style={{ fontFamily: T.fh, fontSize: "10px", color: T.tx, letterSpacing: "1px", marginBottom: "8px" }}>ÉTAPES DE CONNEXION</div>
                {c.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "7px", marginBottom: "6px" }}>
                    <div style={{ minWidth: "20px", height: "20px", borderRadius: "5px", background: `${c.color}15`, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontFamily: T.fh }}>{i + 1}</div>
                    <p style={{ margin: 0, color: T.sf, lineHeight: 1.35, fontFamily: T.f, fontSize: "11px", paddingTop: "2px" }}>{step}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => connectService(c.id)} style={{ width: "100%", padding: "11px", borderRadius: "9px", border: "none", background: c.color, color: "#fff", fontFamily: T.fh, fontSize: "13px", letterSpacing: "1px", cursor: "pointer" }}>CONNECTER {c.name.toUpperCase()}</button>
            </div>
          )}
        </div>
      </>
    );
  };

  // ─── ADD MEAL MODAL ───
  const AddMealModal = () => (
    <>
      <div onClick={() => setShowAddMeal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 99 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "80vh", overflowY: "auto", background: T.bg, borderTop: `1px solid ${T.bd}`, borderRadius: "14px 14px 0 0", padding: "16px", zIndex: 100, animation: "fu .25s ease", ...(isDesktop ? { left: "50%", maxWidth: "450px", bottom: "auto", top: "50%", borderRadius: "14px", transform: "translate(-50%, -50%)" } : {}) }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontFamily: T.fh, color: T.tx, fontSize: "14px", letterSpacing: "1px" }}>{"🍽"} AJOUTER UN REPAS</span>
          <button onClick={() => setShowAddMeal(false)} style={{ background: "none", border: "none", color: T.dm, cursor: "pointer" }}><Ic.x /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div>
            <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Nom du repas</label>
            <input type="text" value={mealForm.name} onChange={e => setMealForm({ ...mealForm, name: e.target.value })} placeholder="Ex: Poulet grillé + riz" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Calories</label>
              <input type="number" value={mealForm.cal} onChange={e => setMealForm({ ...mealForm, cal: e.target.value })} placeholder="650" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Date</label>
              <input type="date" value={mealForm.date} onChange={e => setMealForm({ ...mealForm, date: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Prot (g)</label>
              <input type="number" value={mealForm.prot} onChange={e => setMealForm({ ...mealForm, prot: e.target.value })} placeholder="35" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Gluc (g)</label>
              <input type="number" value={mealForm.carbs} onChange={e => setMealForm({ ...mealForm, carbs: e.target.value })} placeholder="50" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "9px", color: T.dm, fontFamily: T.f }}>Lip (g)</label>
              <input type="number" value={mealForm.fat} onChange={e => setMealForm({ ...mealForm, fat: e.target.value })} placeholder="15" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bd}`, borderRadius: "6px", padding: "8px", color: T.tx, fontFamily: T.f, fontSize: "12px", outline: "none" }} />
            </div>
          </div>
          <button onClick={addMeal} style={{ width: "100%", padding: "11px", borderRadius: "9px", border: "none", background: `linear-gradient(135deg,${T.ac2},${T.ac2}BB)`, color: T.bg, fontFamily: T.fh, fontSize: "13px", letterSpacing: "1px", cursor: "pointer", marginTop: "4px" }}>AJOUTER</button>
        </div>
      </div>
    </>
  );

  // ─── PRESETS MODAL ───
  const PresetsModal = () => (
    <>
      <div onClick={() => setShowPresets(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 99 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "70vh", overflowY: "auto", background: T.bg, borderTop: `1px solid ${T.bd}`, borderRadius: "14px 14px 0 0", padding: "16px", zIndex: 100, animation: "fu .25s ease", ...(isDesktop ? { left: "50%", maxWidth: "450px", bottom: "auto", top: "50%", borderRadius: "14px", transform: "translate(-50%, -50%)" } : {}) }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontFamily: T.fh, color: T.tx, fontSize: "14px", letterSpacing: "1px" }}>{"⚡"} AJOUT RAPIDE</span>
          <button onClick={() => setShowPresets(false)} style={{ background: "none", border: "none", color: T.dm, cursor: "pointer" }}><Ic.x /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {MEAL_PRESETS.map((p, i) => (
            <div key={i} onClick={() => addPresetMeal(p)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px", borderRadius: "8px", background: T.cd, border: `1px solid ${T.bd}`, cursor: "pointer" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.f, fontSize: "11px", color: T.tx, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: "8px", color: T.dm, fontFamily: T.f }}>P:{p.prot}g G:{p.carbs}g L:{p.fat}g</div>
              </div>
              <span style={{ fontFamily: T.fh, fontSize: "13px", color: T.ac }}>{p.cal}</span>
              <span style={{ fontSize: "8px", color: T.dm }}>kcal</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // ─── NOTIFICATIONS MODAL ───
  const NotifModal = () => (
    <>
      <div onClick={() => setShowN(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 99 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "70vh", overflowY: "auto", background: T.bg, borderTop: `1px solid ${T.bd}`, borderRadius: "14px 14px 0 0", padding: "16px", zIndex: 100, animation: "fu .25s ease", ...(isDesktop ? { left: "50%", maxWidth: "450px", bottom: "auto", top: "50%", borderRadius: "14px", transform: "translate(-50%, -50%)" } : {}) }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontFamily: T.fh, color: T.tx, fontSize: "14px", letterSpacing: "1px" }}>{"🔔"} NOTIFICATIONS</span>
          <button onClick={() => setShowN(false)} style={{ background: "none", border: "none", color: T.dm, cursor: "pointer" }}><Ic.x /></button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: nOn ? `${T.ac2}08` : T.cd, borderRadius: "9px", padding: "10px 12px", border: `1px solid ${nOn ? T.ac2 + "20" : T.bd}`, marginBottom: "10px" }}>
          <div style={{ fontFamily: T.fh, fontSize: "11px", color: T.tx, letterSpacing: "1px" }}>ACTIVER</div>
          <div onClick={async () => { if (!nOn && "Notification" in window) { const p = await Notification.requestPermission(); if (p !== "granted") return; } setNOn(!nOn); }} style={{ width: "40px", height: "22px", borderRadius: "11px", background: nOn ? T.ac2 : "rgba(255,255,255,0.08)", cursor: "pointer", position: "relative" }}><div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: nOn ? "21px" : "3px", transition: "left .2s" }} /></div>
        </div>
        {nOn && <>
          {[{ l: "☀️ Matin", on: nM, set: setNM }, { l: "⏰ 1h avant", on: nB, set: setNB }, { l: "🌙 Soir", on: nE, set: setNE }].map((x, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.cd, borderRadius: "7px", padding: "8px 10px", border: `1px solid ${T.bd}`, marginBottom: "4px" }}><span style={{ fontFamily: T.f, fontSize: "11px", color: T.tx }}>{x.l}</span><div onClick={() => x.set(!x.on)} style={{ width: "36px", height: "18px", borderRadius: "9px", background: x.on ? T.ac2 : "rgba(255,255,255,0.08)", cursor: "pointer", position: "relative" }}><div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: x.on ? "21px" : "3px", transition: "left .2s" }} /></div></div>))}
          <button onClick={() => sendN("🔔", "Notifications OK !", T.ac, "✅")} style={{ width: "100%", padding: "9px", borderRadius: "7px", border: `1px solid ${T.ac}20`, background: `${T.ac}06`, color: T.ac, fontFamily: T.fh, fontSize: "11px", letterSpacing: "1px", cursor: "pointer", marginTop: "6px" }}>TESTER</button>
        </>}
      </div>
    </>
  );

  // ─── SIDEBAR (Desktop) ───
  const Sidebar = () => {
    const navItems = [
      { id: "today", l: "Aujourd'hui", e: "🎗️" },
      { id: "plan", l: "Plan", e: "📋" },
      { id: "nutrition", l: "Nutrition", e: "🥗" },
      { id: "stats", l: "Stats", e: "📊" }
    ];
    return (
      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: "220px",
        background: T.cd, borderRight: `1px solid ${T.bd}`, padding: "20px 12px",
        display: "flex", flexDirection: "column", zIndex: 50, overflowY: "auto"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontFamily: T.fh, fontSize: "24px", letterSpacing: "2px", color: T.tx }}>RUN<span style={{ color: T.ac }}>BACK</span></h1>
          <p style={{ margin: 0, fontFamily: T.fh, fontSize: "8px", color: T.dm, letterSpacing: "3px" }}>CANADIAN RACE {"·"} VIMY-LORETTE</p>
        </div>

        {/* Level / XP */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
            <div style={{ background: `${level.c}25`, borderRadius: "5px", padding: "2px 8px", display: "flex", alignItems: "center", gap: "3px" }}>
              <Ic.star />
              <span style={{ fontFamily: T.fh, fontSize: "13px", color: level.c }}>{level.name}</span>
            </div>
          </div>
          <div style={{ fontSize: "9px", color: T.dm, fontFamily: T.f, marginBottom: "3px" }}>Niv.{level.lv} {"•"} {totalXP} XP</div>
          <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: "2px", background: `linear-gradient(90deg,${level.c},${T.ac})`, width: `${lvPct}%`, transition: "width .5s" }} />
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map(t => (
            <button key={t.id} onClick={() => { setView(t.id); setSel(null); }} style={{
              background: view === t.id ? `${T.ac}10` : "transparent",
              border: view === t.id ? `1px solid ${T.ac}20` : "1px solid transparent",
              borderRadius: "8px", padding: "10px 12px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "10px", textAlign: "left", width: "100%"
            }}>
              <span style={{ fontSize: "16px" }}>{t.e}</span>
              <span style={{ fontFamily: T.fh, fontSize: "13px", color: view === t.id ? T.ac : T.sf, letterSpacing: "0.5px" }}>{t.l}</span>
            </button>
          ))}
        </div>

        {/* Countdown */}
        <div style={{ textAlign: "center", padding: "12px 0", borderTop: `1px solid ${T.bd}`, marginTop: "10px" }}>
          <div style={{ fontFamily: T.fh, fontSize: "28px", color: T.ac, letterSpacing: "1px" }}>J-{dtr}</div>
          <div style={{ fontSize: "8px", color: T.dm, fontFamily: T.f }}>5.5 km {"·"} Vimy-Lorette</div>
        </div>

        <button onClick={() => setShowN(true)} style={{ display: "flex", alignItems: "center", gap: "8px", background: nOn ? `${T.ac2}08` : T.cd, border: `1px solid ${nOn ? T.ac2 + "20" : T.bd}`, borderRadius: "8px", padding: "8px 12px", cursor: "pointer", width: "100%", marginTop: "4px" }}>
          <Ic.bell />
          <span style={{ fontFamily: T.f, fontSize: "10px", color: nOn ? T.ac2 : T.dm }}>{nOn ? "Notifs actives" : "Notifications"}</span>
          {nOn && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.ac2, animation: "pulse 2s infinite", marginLeft: "auto" }} />}
        </button>
      </div>
    );
  };

  // ─── MAIN LAYOUT ───
  const mainPadding = isDesktop ? "0 24px 24px" : "0 12px 84px";
  const mainMarginLeft = isDesktop ? "220px" : "0";
  const mainMaxWidth = isWide ? "1100px" : isDesktop ? "700px" : "480px";
  const mainMargin = isDesktop ? `0 0 0 ${mainMarginLeft}` : "0 auto";

  return (
    <div style={{ background: T.bg, color: T.tx, fontFamily: T.f, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sd{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        @keyframes pop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        select option{background:#242218;color:#e8e0d0}
        input::placeholder{color:#706850}
        ::-webkit-scrollbar{width:0}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}
      `}</style>

      {/* Noise overlay */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: .02, backgroundImage: "url(data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E)", backgroundSize: "150px", zIndex: 0 }} />

      {/* Popups */}
      <BadgePopup2 />
      <Toast2 />

      {/* Desktop sidebar */}
      {isDesktop && <Sidebar />}

      {/* Main content area */}
      <div style={{ maxWidth: mainMaxWidth, margin: mainMargin, padding: mainPadding, position: "relative", zIndex: 1, marginLeft: isDesktop ? "220px" : "auto" }}>
        {/* Mobile header */}
        {!isDesktop && (
          <div style={{ padding: "14px 0 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: T.fh, fontSize: "20px", letterSpacing: "2px", color: T.tx }}>RUN<span style={{ color: T.ac }}>BACK</span></h1>
              <p style={{ margin: 0, fontFamily: T.fh, fontSize: "8px", color: T.dm, letterSpacing: "3px" }}>CANADIAN RACE {"·"} VIMY-LORETTE</p>
            </div>
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {nOn && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.ac2, animation: "pulse 2s infinite" }} />}
              <button onClick={() => setShowN(true)} style={{ background: nOn ? `${T.ac2}10` : T.cd, border: `1px solid ${nOn ? T.ac2 + "28" : T.bd}`, borderRadius: "7px", padding: "6px", color: nOn ? T.ac2 : T.dm, cursor: "pointer" }}><Ic.bell /></button>
            </div>
          </div>
        )}

        {/* Desktop header */}
        {isDesktop && (
          <div style={{ padding: "20px 0 14px" }}>
            <div style={{ fontFamily: T.fh, fontSize: "9px", color: T.dm, letterSpacing: "3px" }}>
              {view === "today" && "TABLEAU DE BORD"}
              {view === "plan" && "PLAN D'ENTRAÎNEMENT"}
              {view === "nutrition" && "NUTRITION & SUIVI"}
              {view === "stats" && "STATISTIQUES & BADGES"}
            </div>
          </div>
        )}

        {/* Content with optional multi-column layout on wide screens */}
        <div style={{ animation: "fu .3s ease" }}>
          {sel ? <Detail s={sel} /> : view === "today" ? <TodayV /> : view === "plan" ? <PlanV /> : view === "nutrition" ? <NutV /> : <StatsV />}
        </div>
      </div>

      {/* Mobile bottom tabs */}
      {!sel && !isDesktop && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(26,24,16,.94)", backdropFilter: "blur(12px)", borderTop: `1px solid ${T.bd}`, display: "flex", justifyContent: "center", padding: "3px 0 12px", zIndex: 50 }}>
          {[{ id: "today", l: "Aujourd'hui", e: "🎗️" }, { id: "plan", l: "Plan", e: "📋" }, { id: "nutrition", l: "Nutrition", e: "🥗" }, { id: "stats", l: "Stats", e: "📊" }].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", padding: "4px 14px", color: view === t.id ? T.ac : T.dm }}>
              <span style={{ fontSize: "15px" }}>{t.e}</span>
              <span style={{ fontSize: "8px", fontWeight: view === t.id ? 700 : 400, fontFamily: T.f }}>{t.l}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chat FAB */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{
          position: "fixed",
          bottom: isDesktop ? "20px" : "72px",
          right: "16px",
          width: "48px", height: "48px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, #7C5CFC, #5436DA)`,
          border: "none",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(92,60,252,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 60
        }}>
          <Ic.chat />
        </button>
      )}

      {/* Chat panel */}
      {chatOpen && <ChatPanel />}

      {/* Modals */}
      {showAddSession && <AddSessionModal />}
      {showConnector && <ConnectorModal />}
      {showAddMeal && <AddMealModal />}
      {showPresets && <PresetsModal />}
      {showN && <NotifModal />}
    </div>
  );
}
