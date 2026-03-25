// ─── RUNBACK DATA ───
// All static data for the RunBack Canadian Race training app

export const START = new Date(2026, 2, 23);
export const RACE = new Date(2026, 5, 27);

// ─── THEME ───
export const T = {
  bg: "#1a1810", cd: "#242218", cd2: "#2e2a1f", bd: "rgba(180,160,120,0.12)",
  tx: "#e8e0d0", sf: "#b0a890", dm: "#706850", ac: "#C9A96E", ac2: "#8B9D77",
  rd: "#C45B4A", f: "'Source Sans 3',sans-serif", fh: "'Bebas Neue',sans-serif"
};

// ─── BADGES ───
export const BADGES = [
  { id: "first_step", name: "Premier Pas", desc: "1ère séance", icon: "🥾", xp: 50, check: (c) => Object.keys(c).length >= 1 },
  { id: "week1", name: "Semaine 1", desc: "Toutes les séances S1", icon: "📅", xp: 100, check: (c, p) => p.filter(s => s.week === 1).every(s => c[s.id]) },
  { id: "streak3", name: "Régulier", desc: "3 séances faites", icon: "🔥", xp: 75, check: (c) => Object.keys(c).length >= 3 },
  { id: "streak7", name: "Machine", desc: "7 séances", icon: "⚡", xp: 150, check: (c) => Object.keys(c).length >= 7 },
  { id: "streak15", name: "Inarrêtable", desc: "15 séances", icon: "💎", xp: 300, check: (c) => Object.keys(c).length >= 15 },
  { id: "first_run", name: "Coureur", desc: "1ère course", icon: "🏃", xp: 50, check: (c, p) => p.filter(s => s.type === "run" && c[s.id]).length >= 1 },
  { id: "continuous", name: "Sans Pause", desc: "1ère course continue (sans marche)", icon: "🎯", xp: 150, check: (c) => !!c["extra_tue_noon"] },
  { id: "ten_min", name: "10 Minutes", desc: "10+ min de course continue", icon: "⏱️", xp: 100, check: (c) => !!c["extra_tue_noon"] || !!c["w5d1"] },
  { id: "twenty_min", name: "20 Minutes", desc: "20 min continues", icon: "🕐", xp: 200, check: (c) => !!c["w7d1"] },
  { id: "thirty_min", name: "30 Minutes", desc: "30 min continues", icon: "🎯", xp: 300, check: (c) => !!c["w9d1"] },
  { id: "two_a_day", name: "Biquotidien", desc: "2 courses le même jour", icon: "💥", xp: 100, check: (c) => !!c["extra_tue_noon"] && !!c["extra_tue_eve"] },
  { id: "first_hill", name: "Grimpeur", desc: "1ère côtes", icon: "⛰️", xp: 100, check: (c) => !!c["w6d3"] },
  { id: "half_way", name: "Mi-Parcours", desc: "50% du plan", icon: "🏔️", xp: 200, check: (c, p) => Object.keys(c).length >= p.length / 2 },
  { id: "vimy_sim", name: "Simulation Vimy", desc: "Répétition 5.5 km", icon: "🗺️", xp: 400, check: (c) => !!c["w10d5"] },
  { id: "phase_adapt", name: "Adapté", desc: "Phase Adaptation", icon: "🌱", xp: 150, check: (c, p) => p.filter(s => s.week <= 4).every(s => c[s.id]) },
  { id: "phase_build", name: "Bâtisseur", desc: "Phase Construction", icon: "🏗️", xp: 250, check: (c, p) => p.filter(s => s.week >= 5 && s.week <= 8).every(s => c[s.id]) },
  { id: "weight_first", name: "Sur la Balance", desc: "1er poids noté", icon: "⚖️", xp: 25, check: (c, p, w) => w.length >= 1 },
  { id: "weight_5", name: "-5 kg", desc: "Perdu 5 kg", icon: "📉", xp: 300, check: (c, p, w) => w.length >= 2 && (w[0].weight - w[w.length - 1].weight) >= 5 },
  { id: "weight_10", name: "-10 kg !", desc: "Objectif !", icon: "🏆", xp: 500, check: (c, p, w) => w.length >= 2 && (w[0].weight - w[w.length - 1].weight) >= 10 },
  { id: "finisher", name: "FINISHER", desc: "Canadian Race terminée", icon: "🎗️", xp: 1000, check: (c) => !!c["w14d5"] },
  { id: "meal_log5", name: "Nutritionniste", desc: "5 repas logés", icon: "🥗", xp: 75, check: (c, p, w, ml) => (ml || []).length >= 5 },
  { id: "meal_log20", name: "Chef Militaire", desc: "20 repas logés", icon: "👨‍🍳", xp: 200, check: (c, p, w, ml) => (ml || []).length >= 20 },
  { id: "custom_session", name: "Éclaireur", desc: "1ère séance perso", icon: "🧭", xp: 50, check: (c, p, w, ml, cs) => (cs || []).length >= 1 },
  { id: "connector", name: "Connecté", desc: "1er connecteur activé", icon: "🔗", xp: 75, check: (c, p, w, ml, cs, cn) => cn && Object.values(cn).some(v => v.connected) },
  { id: "chat_first", name: "Demandeur", desc: "1ère question au coach IA", icon: "🤖", xp: 25, check: (c, p, w, ml, cs, cn, ch) => (ch || []).length >= 2 },
];

export const LEVELS = [
  { lv: 1, name: "Recrue", xp: 0, c: "#8B9D77" },
  { lv: 2, name: "Soldat", xp: 100, c: "#A3956A" },
  { lv: 3, name: "Caporal", xp: 300, c: "#C9A96E" },
  { lv: 4, name: "Sergent", xp: 600, c: "#D4A853" },
  { lv: 5, name: "Adjudant", xp: 1000, c: "#E8C547" },
  { lv: 6, name: "Lieutenant", xp: 1500, c: "#DAA520" },
  { lv: 7, name: "Capitaine", xp: 2200, c: "#CD7F32" },
  { lv: 8, name: "Commandant", xp: 3000, c: "#C0C0C0" },
  { lv: 9, name: "Colonel", xp: 4000, c: "#FFD700" },
  { lv: 10, name: "Général", xp: 5000, c: "#E5E4E2" }
];

export const getLv = (xp) => { let l = LEVELS[0]; for (const x of LEVELS) if (xp >= x.xp) l = x; return l; };
export const getNext = (xp) => { for (const l of LEVELS) if (xp < l.xp) return l; return null; };

// ─── REAL SESSION DATA (4 sessions) ───
export const RD = {
  "w1d1": {
    date: "2026-03-24", dist: 3.95, time: 37, type: "fractionné",
    intervals: [
      { t: "run", d: 0.32, p: "6:14" }, { t: "walk", d: 0.17, p: "11:27" },
      { t: "run", d: 0.31, p: "6:32" }, { t: "walk", d: 0.14, p: "13:55" },
      { t: "run", d: 0.30, p: "6:35" }, { t: "walk", d: 0.16, p: "12:33" },
      { t: "run", d: 0.29, p: "6:59" }, { t: "walk", d: 0.16, p: "12:38" },
      { t: "run", d: 0.29, p: "6:47" }, { t: "walk", d: 0.15, p: "13:09" },
      { t: "run", d: 0.27, p: "7:30" }, { t: "walk", d: 0.15, p: "13:20" },
      { t: "run", d: 0.31, p: "6:32" }, { t: "run", d: 0.29, p: "6:47" }
    ],
    avgPace: "6:45", note: "8×2'/2' — Fatigue visible intervalle 6 (7:30), remontée 7-8."
  },
  "w1d5": {
    date: "2026-03-29", dist: 4.38, time: 42.7, type: "fractionné",
    intervals: [
      { t: "walk", d: 0.537, p: "10:48" }, { t: "run", d: 0.305, p: "6:25" },
      { t: "walk", d: 0.175, p: "11:22" }, { t: "run", d: 0.305, p: "6:57" },
      { t: "walk", d: 0.173, p: "11:36" }, { t: "run", d: 0.299, p: "6:49" },
      { t: "walk", d: 0.173, p: "11:36" }, { t: "run", d: 0.311, p: "6:43" },
      { t: "walk", d: 0.166, p: "12:03" }, { t: "run", d: 0.304, p: "6:50" },
      { t: "walk", d: 0.158, p: "12:27" }, { t: "run", d: 0.312, p: "6:44" },
      { t: "walk", d: 0.156, p: "12:45" }, { t: "run", d: 0.295, p: "6:58" },
      { t: "walk", d: 0.176, p: "11:36" }, { t: "run", d: 0.307, p: "6:46" },
      { t: "walk", d: 0.429, p: "12:22" }
    ],
    avgPace: "6:46", note: "8×2'/2' — Beaucoup plus régulier ! Plage 6:25-6:58. Plus de trou à 7:30. Progression nette."
  },
  "extra_tue_noon": {
    date: "2026-03-31", dist: 1.74, time: 12.37, type: "continu",
    splits: [{ km: 1, pace: "7:09" }, { km: 0.74, pace: "7:02" }],
    avgPace: "7:06", dplus: 15, note: "1ère course continue ! 12 min à 7:06/km. Allure très stable. Gros cap mental."
  },
  "extra_tue_eve": {
    date: "2026-03-31", dist: 2.02, time: 14.67, type: "continu",
    splits: [{ km: 1, pace: "6:57" }, { km: 1.02, pace: "7:27" }],
    avgPace: "7:15", dplus: 15, note: "2ème course du jour. 14min40 à 7:15/km. Fatigue visible sur km2 (6:57→7:27). Normal après le midi."
  }
};

// ─── COACH ANALYSIS ───
export const COACH_ANALYSIS = {
  title: "📊 Bilan de ta semaine",
  date: "24-31 mars 2026",
  sections: [
    { emoji: "✅", title: "Fractionné S2 (dimanche)", text: "Excellente régularité ! Allures entre 6:25 et 6:58/km — fini le trou à 7:30 de la S1. Tu maîtrises le 2'/2'." },
    { emoji: "🚀", title: "Course continue (mardi midi)", text: "1.74 km en 12 min à 7:06/km — ta première course SANS marche ! Allure ultra-stable (7:09 → 7:02). Cap mental énorme." },
    { emoji: "💪", title: "Course continue (mardi soir)", text: "2.02 km en 14:40 à 7:15/km avec 15m D+. Fatigue normale sur le km2 après avoir couru le midi. Belle perf quand même." },
    { emoji: "⚠️", title: "Point de vigilance", text: "2 courses le même jour c'est risqué pour tes genoux et ta cheville. On garde MAX 1 séance/jour. Le repos est aussi de l'entraînement." },
    { emoji: "📈", title: "Adaptation du plan", text: "Tu es en avance ! Le plan est recalibré : on saute les intervalles basiques pour aller directement vers des blocs de 5-8 min. L'objectif 35 min à Vimy est très réaliste." }
  ]
};

// ─── PLAN (adapted after 4 sessions) ───
export const genPlan = () => {
  const P = [
    { ph: "Adaptation", cl: "#8B9D77", wks: [
      { w: 1, lb: "✅ Baseline", ss: [
        { d: 1, t: "8×2'/2' ✅", tp: "run", du: 37, it: 2, ds: "Séance 1 : 8×2'/2'. Moyenne 6:45/km.", st: ["5 min marche", "8× (2 min course + 2 min marche)", "5 min retour"], ti: "✅ FAIT — Plan accéléré grâce à cette perf.", rd: true },
        { d: 3, t: "Renfo & mobilité", tp: "strength", du: 30, it: 1, ds: "Renforcement articulaire genoux/chevilles.", st: ["Équilibre unipodal 3×30s", "Squats partiels 3×10", "Mollets 3×12", "Pont fessier 3×12", "Étirements 8 min"], ti: "Protège tes articulations." },
        { d: 5, t: "8×2'/2' régulier ✅", tp: "run", du: 43, it: 2, ds: "Séance 2 : 8×2'/2' — beaucoup plus régulier ! 6:25-6:58/km.", st: ["5 min 47 marche échauffement", "8× (2 min course + 2 min marche)", "5 min 21 marche retour"], ti: "✅ FAIT — Régularité nettement améliorée." }
      ]},
      { w: 2, lb: "Course continue !", ss: [
        { d: 1, t: "12 min continu ✅", tp: "run", du: 12, it: 3, ds: "BONUS : 1ère course continue ! 1.74 km en 12:22 à 7:06/km.", st: ["Course continue 12 min", "Allure cible 7:00-7:15/km"], ti: "✅ FAIT — Cap mental énorme !" },
        { d: 2, t: "14 min continu ✅", tp: "run", du: 15, it: 3, ds: "BONUS : 2ème course du jour. 2.02 km en 14:40 à 7:15/km.", st: ["Course continue 14 min 40", "15m D+"], ti: "✅ FAIT — Mais attention : 2 courses/jour = risque articulaire." },
        { d: 4, t: "Renfo genoux/cheville", tp: "strength", du: 30, it: 1, ds: "IMPORTANT après 2 courses en 1 jour. Renforcement + récup.", st: ["Automassage mollets/quadriceps 10 min", "Équilibre unipodal 3×30s", "Squats partiels 3×12", "Pont fessier 3×15", "Mobilité cheville complète", "Étirements 10 min"], ti: "Après le double de mardi, tes articulations ont BESOIN de ça." },
        { d: 6, t: "15 min continu", tp: "run", du: 25, it: 3, ds: "On capitalise : 15 min continues à allure confortable (7:00-7:15/km).", st: ["5 min marche échauffement", "15 min course continue", "5 min marche retour + étirements"], ti: "15 min = étape clé. Pas plus vite que 7:00/km !" }
      ]},
      { w: 3, lb: "Blocs longs", ss: [
        { d: 1, t: "18 min continu", tp: "run", du: 30, it: 3, ds: "On pousse à 18 minutes. Tu en es capable.", st: ["5 min marche", "18 min course continue à 7:00-7:15/km", "5 min retour + étirements"], ti: "18 min ≈ 2.5 km. Tu as déjà fait 14:40, +3 min c'est faisable." },
        { d: 3, t: "Renfo trail", tp: "strength", du: 30, it: 2, ds: "Renforcement orienté dénivelé.", st: ["Fentes marchées 3×8/côté", "Montées de marche 3×10/côté", "Squats complets 3×12", "Gainage planche+latéral 3×30s", "Étirements"], ti: "Prépare les montées de Vimy-Lorette." },
        { d: 5, t: "20 min sortie longue", tp: "run", du: 35, it: 4, ds: "Le cap des 20 minutes ! Terrain varié si possible.", st: ["5 min marche", "20 min course continue", "5 min retour au calme + étirements"], ti: "20 min ≈ 2.8 km. Plus de la moitié de la Canadian Race !" }
      ]},
      { w: 4, lb: "Décharge", ss: [
        { d: 1, t: "15 min souple", tp: "run", du: 25, it: 2, ds: "Volume réduit. Course plaisir.", st: ["5 min marche", "15 min course très souple", "5 min retour"], ti: "Ton corps s'adapte au repos. Semaine légère." },
        { d: 4, t: "Mobilité complète", tp: "strength", du: 25, it: 1, ds: "Décharge articulaire.", st: ["Automassage 10 min", "Mobilité cheville + genou", "Étirements profonds 10 min"], ti: "4 semaines de reprise. Tu as changé." }
      ]}
    ]},
    { ph: "Construction", cl: "#C9A96E", wks: [
      { w: 5, lb: "Endurance", ss: [
        { d: 1, t: "25 min continu", tp: "run", du: 35, it: 4, ds: "25 minutes continues.", st: ["5 min marche", "25 min course à 6:50-7:10/km", "5 min retour"], ti: "25 min ≈ 3.5 km." },
        { d: 3, t: "Renfo côtes", tp: "strength", du: 35, it: 2, ds: "Spécifique D+.", st: ["Squats sautés 3×8", "Fentes arrière 3×10", "Montées dynamiques 3×12", "Gainage 3×40s", "Étirements"], ti: "Les 100m D+ de Vimy se préparent ici." },
        { d: 5, t: "2×12 min", tp: "run", du: 35, it: 3, ds: "Deux blocs de 12 min avec 2 min marche entre.", st: ["5 min marche", "12 min course + 2 min marche + 12 min course", "5 min retour"], ti: "24 min de course ≈ 3.4 km." }
      ]},
      { w: 6, lb: "Les côtes", ss: [
        { d: 1, t: "28 min continu", tp: "run", du: 38, it: 4, ds: "28 minutes. On approche des 30.", st: ["5 min marche", "28 min course continue", "5 min retour"], ti: "≈ 4 km. La Canadian Race fait 5.5." },
        { d: 3, t: "Côtes découverte", tp: "run", du: 30, it: 3, ds: "Première séance côtes.", st: ["10 min trot plat", "6× (40s montée + descente marche)", "8 min trot retour"], ti: "En côte : petits pas, fréquence élevée." },
        { d: 5, t: "30 min !", tp: "run", du: 40, it: 4, ds: "CAP DES 30 MINUTES !", st: ["5 min marche", "30 min course continue", "5 min retour + étirements"], ti: "30 min à 7:00 = 4.3 km. Tu y es presque !" }
      ]},
      { w: 7, lb: "Volume", ss: [
        { d: 1, t: "30 min + côtes", tp: "run", du: 40, it: 4, ds: "30 min avec passages en côte.", st: ["5 min marche", "30 min course avec 2-3 côtes", "5 min retour"], ti: "Intègre les côtes naturellement." },
        { d: 3, t: "Fartlek", tp: "run", du: 35, it: 4, ds: "Jeu d'allure pour varier.", st: ["10 min trot", "8× (30s accélération + 1min30 trot)", "10 min retour"], ti: "Le fartlek c'est du jeu. Au feeling." },
        { d: 6, t: "35 min sortie longue", tp: "run", du: 45, it: 5, ds: "35 minutes sur terrain vallonné !", st: ["5 min marche", "35 min course", "5 min retour + étirements"], ti: "35 min = le temps objectif de la Canadian Race !" }
      ]},
      { w: 8, lb: "Décharge", ss: [
        { d: 1, t: "20 min souple", tp: "run", du: 30, it: 3, ds: "Allégé.", st: ["5 min marche", "20 min souple", "5 min retour"], ti: "Absorption du travail." },
        { d: 4, t: "Mobilité", tp: "strength", du: 25, it: 1, ds: "Récup.", st: ["Automassage 10 min", "Mobilité complète", "Yoga 10 min"], ti: "Mi-parcours du plan !" }
      ]}
    ]},
    { ph: "Spécifique", cl: "#D4A853", wks: [
      { w: 9, lb: "Allure Vimy", ss: [
        { d: 1, t: "35 min continu", tp: "run", du: 45, it: 5, ds: "35 minutes — le temps cible.", st: ["5 min marche", "35 min à 6:30-6:50/km", "5 min retour"], ti: "35 min à 6:40 = 5.2 km. Presque Vimy !" },
        { d: 3, t: "Allure 6:20", tp: "run", du: 35, it: 4, ds: "Travail d'allure cible.", st: ["10 min trot", "3× (5 min à 6:20/km + 2 min trot)", "5 min retour"], ti: "6:20/km = allure pour finir en 35 min." },
        { d: 5, t: "35 min vallonné", tp: "run", du: 45, it: 5, ds: "35 min avec du relief.", st: ["5 min marche", "35 min vallonné", "5 min retour"], ti: "Simule les conditions de Vimy-Lorette." }
      ]},
      { w: 10, lb: "Simulation", ss: [
        { d: 1, t: "38 min allure", tp: "run", du: 48, it: 5, ds: "38 min à allure de course.", st: ["5 min marche", "38 min à 6:20-6:30/km", "5 min retour"], ti: "38 min = marge de sécurité." },
        { d: 3, t: "Côtes Vimy", tp: "run", du: 35, it: 5, ds: "Profil de course.", st: ["10 min trot", "5× (1 min côte + descente)", "10 min plat allure cible", "5 min retour"], ti: "Monte à ton rythme, récupère en descente." },
        { d: 5, t: "5.5 km !", tp: "run", du: 50, it: 5, ds: "LA DISTANCE ! Simulation complète.", st: ["5 min marche", "~35-40 min pour 5.5 km", "5 min récup"], ti: "1ère rép à distance. Juste FINIR." }
      ]},
      { w: 11, lb: "Confiance max", ss: [
        { d: 1, t: "35 min allure course", tp: "run", du: 45, it: 5, ds: "35 min à allure cible.", st: ["5 min marche", "35 min à 6:20/km", "5 min retour"], ti: "Si tu fais ça, Vimy est dans la poche." },
        { d: 3, t: "Fartlek vallonné", tp: "run", du: 35, it: 5, ds: "Dernière grosse séance.", st: ["10 min trot", "6× (45s accél + 1min30 récup)", "10 min retour"], ti: "Après, c'est récup." },
        { d: 5, t: "5.5 km chrono", tp: "run", du: 50, it: 5, ds: "Répétition générale.", st: ["8 min échauffement", "5.5 km objectif < 37 min", "5 min récup"], ti: "Pas tout donner." }
      ]}
    ]},
    { ph: "Affûtage", cl: "#A08060", wks: [
      { w: 12, lb: "Repos actif", ss: [
        { d: 1, t: "25 min souple", tp: "run", du: 35, it: 3, ds: "Réduit.", st: ["5 min marche", "25 min souple", "5 min retour"], ti: "Plaisir." },
        { d: 3, t: "Fartlek court", tp: "run", du: 25, it: 3, ds: "Dynamique.", st: ["8 min trot", "5× (20s vite + 1min40 trot)", "7 min retour"], ti: "Peps." },
        { d: 5, t: "20 min vallonné", tp: "run", du: 30, it: 3, ds: "Dernière relief.", st: ["5 min marche", "20 min course", "5 min retour"], ti: "Visualise Vimy-Lorette." }
      ]},
      { w: 13, lb: "Sharpening", ss: [
        { d: 1, t: "20 min souple", tp: "run", du: 28, it: 2, ds: "Facile.", st: ["5 min marche", "20 min souple", "3 min retour"], ti: "Trop frais = bon signe." },
        { d: 4, t: "15 min + gammes", tp: "run", du: 22, it: 2, ds: "Trot + éducatifs.", st: ["5 min marche", "10 min trot", "Gammes", "5 min retour"], ti: "Coordination." }
      ]},
      { w: 14, lb: "🎗️ Jour J", ss: [
        { d: 1, t: "Dernier trot", tp: "run", du: 18, it: 1, ds: "12 min trot.", st: ["3 min marche", "12 min trot", "3 min étirements"], ti: "Savoure le chemin." },
        { d: 3, t: "Activation", tp: "strength", du: 15, it: 1, ds: "Mobilité.", st: ["10 min marche", "Mobilité 5 min"], ti: "Prépare ton sac !" },
        { d: 5, t: "🎗️ CANADIAN RACE", tp: "race", du: 35, it: 5, ds: "5.5 km — Champs de bataille de Vimy-Lorette. 100m D+. 35 min.", st: ["Arriver 45 min avant", "Échauffement 10 min + gammes", "Km1-2 calme → Km3-4 régulier → Km5+ ENVOIE", "CÉLÉBRER"], ti: "Honore chaque mètre de ce parcours historique." }
      ]}
    ]}
  ];
  const plan = [];
  P.forEach(p => p.wks.forEach(wk => wk.ss.forEach(s => {
    const date = new Date(START);
    date.setDate(date.getDate() + (wk.w - 1) * 7 + s.d);
    plan.push({ title: s.t, type: s.tp, dur: s.du, int: s.it, desc: s.ds, steps: s.st, tip: s.ti, week: wk.w, weekLabel: wk.lb, phase: p.ph, phaseColor: p.cl, date, dateStr: date.toISOString().split("T")[0], id: `w${wk.w}d${s.d}`, rd: s.rd });
  })));
  plan.push({ title: "12 min continu ✅", type: "run", dur: 12, int: 3, desc: "Course continue 1.74 km à 7:06/km.", steps: ["12 min course continue"], tip: "✅ FAIT", week: 2, weekLabel: "Course continue !", phase: "Adaptation", phaseColor: "#8B9D77", date: new Date(2026, 2, 31), dateStr: "2026-03-31", id: "extra_tue_noon" });
  plan.push({ title: "14 min continu ✅", type: "run", dur: 15, int: 3, desc: "Course continue 2.02 km à 7:15/km.", steps: ["14 min 40 course continue"], tip: "✅ FAIT", week: 2, weekLabel: "Course continue !", phase: "Adaptation", phaseColor: "#8B9D77", date: new Date(2026, 2, 31), dateStr: "2026-03-31", id: "extra_tue_eve" });
  return plan.sort((a, b) => a.date - b.date);
};

// ─── NUTRITION ───
export const NUT = [
  { wk: "1-2", ph: "Mise en place", cl: "#8B9D77", cal: 1950, pr: 130, ca: 180, fa: 70, ms: [{ t: "🍽 12h", it: ["150g poulet/poisson", "200g légumes", "150g riz complet", "Huile d'olive"], cal: 750 }, { t: "🍎 16h", it: ["1 fruit", "30g amandes", "Yaourt 0%"], cal: 300 }, { t: "🍽 20h", it: ["150g viande/saumon", "Salade composée", "100g lentilles"], cal: 700 }], tp: ["2L d'eau/jour", "0 sucre & alcool", "Cuisiner maison"] },
  { wk: "3-4", ph: "Adaptation", cl: "#8B9D77", cal: 1900, pr: 135, ca: 170, fa: 68, ms: [{ t: "🍽 12h", it: ["2 œufs + jambon dinde", "200g légumes sautés", "120g quinoa"], cal: 720 }, { t: "🍎 16h", it: ["Fromage blanc 0%", "Fruits rouges", "Chia"], cal: 250 }, { t: "🍽 20h", it: ["150g poisson", "Ratatouille", "100g pâtes complètes"], cal: 680 }], tp: ["Meal prep dimanche", "Manger lentement", "Vinaigre de cidre"] },
  { wk: "5-6", ph: "Accélération", cl: "#C9A96E", cal: 1850, pr: 140, ca: 160, fa: 65, ms: [{ t: "🍽 12h", it: ["150g dinde", "250g légumes vapeur", "130g riz"], cal: 700 }, { t: "🍎 16h", it: ["Shake whey + banane", "OU 2 œufs durs"], cal: 280 }, { t: "🍽 20h", it: ["130g saumon", "Soupe légumes", "Pain complet"], cal: 650 }], tp: ["+prot jours training", "7-8h sommeil", "Peser portions"] },
  { wk: "7-8", ph: "Croisière", cl: "#C9A96E", cal: 1850, pr: 140, ca: 155, fa: 65, ms: [{ t: "🍽 12h", it: ["150g poulet", "200g wok légumes", "120g soba"], cal: 700 }, { t: "🍎 16h", it: ["Pain complet + beurre cacahuète"], cal: 280 }, { t: "🍽 20h", it: ["Omelette 3 œufs", "Salade", "Fromage"], cal: 650 }], tp: ["~-5 kg attendu", "Varier protéines"] },
  { wk: "9-10", ph: "Push", cl: "#D4A853", cal: 1800, pr: 145, ca: 145, fa: 62, ms: [{ t: "🍽 12h", it: ["170g poisson blanc", "200g légumes rôtis", "Légumineuses"], cal: 680 }, { t: "🍎 16h", it: ["Skyr", "Amandes", "Cannelle"], cal: 260 }, { t: "🍽 20h", it: ["150g viande maigre", "Salade XL", "Pain"], cal: 620 }], tp: ["Hydratation ++", "Magnésium + vit D"] },
  { wk: "11-12", ph: "Affinage", cl: "#A08060", cal: 1850, pr: 140, ca: 160, fa: 65, ms: [{ t: "🍽 12h", it: ["150g protéine choix", "200g légumes", "Féculent complet"], cal: 720 }, { t: "🍎 16h", it: ["Fruit + protéine", "Chocolat noir"], cal: 280 }, { t: "🍽 20h", it: ["130g protéine", "Légumes volonté"], cal: 640 }], tp: ["En forme, pas affamé", "-10 kg quasi !"] },
  { wk: "13-14", ph: "Pré-course", cl: "#A08060", cal: 1900, pr: 135, ca: 180, fa: 65, ms: [{ t: "🍽 12h", it: ["Protéine légère", "Féculents ++", "Légumes cuits"], cal: 750 }, { t: "🍎 16h", it: ["Banane + barre", "Fromage blanc"], cal: 300 }, { t: "🍽 20h", it: ["Repas équilibré", "J-1: pâtes + poulet"], cal: 650 }], tp: ["Carbo-loading 3j", "0 aliment nouveau"] }
];

// ─── MEAL PRESETS ───
export const MEAL_PRESETS = [
  { name: "Poulet + riz + légumes", cal: 750, prot: 45, carbs: 65, fat: 18 },
  { name: "Saumon + salade composée", cal: 680, prot: 40, carbs: 25, fat: 35 },
  { name: "Omelette 3 œufs + pain", cal: 520, prot: 30, carbs: 35, fat: 28 },
  { name: "Yaourt 0% + fruits", cal: 180, prot: 15, carbs: 22, fat: 2 },
  { name: "Shake whey + banane", cal: 280, prot: 30, carbs: 35, fat: 4 },
  { name: "Amandes 30g", cal: 180, prot: 6, carbs: 6, fat: 15 },
  { name: "Fromage blanc 0%", cal: 120, prot: 18, carbs: 8, fat: 0 },
  { name: "Pâtes complètes + sauce", cal: 600, prot: 20, carbs: 80, fat: 12 },
  { name: "Soupe légumes + pain", cal: 350, prot: 10, carbs: 45, fat: 10 },
  { name: "Barre protéinée", cal: 220, prot: 20, carbs: 25, fat: 8 },
];

// ─── CONNECTORS ───
export const CONNECTORS = [
  { id: "garmin", name: "Garmin Connect", icon: "⌚", color: "#007DC3", desc: "Synchronise tes courses Garmin automatiquement." },
  { id: "strava", name: "Strava", icon: "🟧", color: "#FC4C02", desc: "Importe tes activités Strava en un clic." },
  { id: "nrc", name: "Nike Run Club", icon: "✔️", color: "#111", desc: "Connecte Nike Run Club pour suivre tes runs." },
];

// ─── CHAT RESPONSES ───
export const CHAT_RESPONSES = [
  { keywords: ["allure", "pace", "vitesse", "vite", "lent", "rythme"], response: "Pour la Canadian Race (5.5 km), vise une allure entre 6:20 et 7:00/km. En entraînement, reste autour de 7:00-7:15/km pour les sorties longues. Le fractionné peut être plus rapide (6:25-6:58 comme tes dernières séances). L'important c'est la régularité, pas la vitesse !" },
  { keywords: ["nutrition", "manger", "alimentation", "repas", "calorie", "protéine", "régime", "diète"], response: "Pour ta prépa, vise ~1900 kcal/jour avec 130-140g de protéines. Mange 2-3h avant une séance. Après l'effort : protéines + glucides dans les 30 min. Hydrate-toi bien (2L/jour minimum). Évite le sucre raffiné et l'alcool autant que possible." },
  { keywords: ["douleur", "mal", "blessure", "genou", "cheville", "tendon", "mollet", "shin", "tibia"], response: "Si tu ressens une douleur persistante, c'est un signal d'alarme. Applique la règle RICE (Repos, Ice, Compression, Élévation). Ne cours JAMAIS sur une douleur aiguë. Pour les genoux : renforcement quadriceps et ischio-jambiers. Pour les chevilles : exercices de proprioception. Si ça dure plus de 3 jours, consulte un kiné." },
  { keywords: ["motivation", "envie", "flemme", "dur", "difficile", "abandonner", "arrêter"], response: "C'est normal d'avoir des baisses de motivation ! Rappelle-toi pourquoi tu as commencé. Tu as déjà fait 4 séances et tu progresses vite (de 0 à 14 min de course continue !). Chaque séance compte. Même 15 min molles valent mieux que rien. Tu prépares la Canadian Race à Vimy — un lieu chargé d'histoire. Honore ça !" },
  { keywords: ["vimy", "canadian", "race", "course", "parcours", "terrain"], response: "La Canadian Race se déroule sur les champs de bataille de Vimy-Lorette. C'est un parcours de 5.5 km avec 100m de dénivelé positif. Le terrain est vallonné avec des chemins de terre. Temps objectif : 35 minutes. Le parcours rend hommage aux soldats canadiens de la Première Guerre mondiale. C'est une course mémorielle autant que sportive." },
  { keywords: ["poids", "maigrir", "kilos", "balance", "perdre", "gras", "masse"], response: "La perte de poids se fait principalement en cuisine. Avec le plan à 1900 kcal et l'entraînement, tu peux viser -0.5 à -1 kg/semaine de manière saine. Ne te pèse pas tous les jours — le poids fluctue. Une fois par semaine, le matin à jeun, c'est suffisant. Le muscle pèse plus que le gras, donc ne t'inquiète pas si la balance stagne parfois." },
  { keywords: ["repos", "récupération", "récup", "dormir", "sommeil", "fatigue", "fatigué"], response: "Le repos est AUSSI de l'entraînement ! Ton corps se renforce pendant la récupération, pas pendant l'effort. Vise 7-8h de sommeil. Un jour de repos complet entre chaque séance de course. Les étirements et l'automassage aident beaucoup. Si tu te sens très fatigué, prends un jour de plus — mieux vaut être en forme que blessé." },
  { keywords: ["échauffement", "étirement", "stretching", "mobilité", "souplesse"], response: "Avant chaque course : 5 min de marche rapide + mobilité articulaire (chevilles, genoux, hanches). Après : 5-10 min d'étirements statiques (mollets, quadriceps, ischio-jambiers, hanches). Le foam rolling est excellent pour la récupération. Ne fais JAMAIS d'étirements statiques à froid avant de courir." },
  { keywords: ["côte", "montée", "dénivelé", "pente", "d+", "grimpeur"], response: "Pour les côtes de Vimy (100m D+) : raccourcis ta foulée, augmente ta cadence, penche-toi légèrement en avant. En montée, respire profondément et régulièrement. Entraîne-toi sur des escaliers ou des montées locales. En descente, freine avec tes quadriceps, pas avec tes genoux. Le renforcement musculaire est essentiel pour les côtes." },
  { keywords: ["fractionné", "intervalle", "interval", "tempo", "vma", "seuil"], response: "Le fractionné améliore ta VMA et ton économie de course. Tes séances de 2'/2' montrent déjà de gros progrès (6:25-6:58/km, très régulier). On va évoluer vers des blocs plus longs (5-8 min) pour préparer la course continue. Respecte toujours les temps de récupération !" },
  { keywords: ["chaussure", "équipement", "basket", "shoe", "fringue"], response: "Pour la Canadian Race sur chemin : des chaussures de trail ou des running avec bonne accroche. Choisis une pointure au-dessus de ta taille habituelle (le pied gonfle à l'effort). Fais au moins 3-4 sorties avec tes chaussures de course avant le jour J. Pour les vêtements : privilégie le technique respirant, pas de coton !" },
  { keywords: ["hydratation", "eau", "boire", "boisson", "electrolyte"], response: "Bois au moins 2L d'eau par jour, plus les jours de course. Avant une séance : 500ml dans les 2h précédentes. Pendant une course de 35 min, pas forcément besoin de boire en route, mais hydrate-toi bien après. Évite les boissons sucrées. Un verre d'eau avec du citron le matin est parfait." },
  { keywords: ["plan", "programme", "semaine", "planning", "séance", "entraînement"], response: "Ton plan fait 14 semaines : 4 semaines d'adaptation, 4 de construction, 3 spécifiques, et 3 d'affûtage. Tu es actuellement en phase d'adaptation et tu progresses très bien ! Chaque semaine alterne course et renforcement. Les semaines de décharge (S4, S8) sont normales — ton corps a besoin de récupérer pour progresser." },
  { keywords: ["progrès", "progression", "amélioration", "mieux", "résultat", "évoluer"], response: "En 1 semaine, tu es passé de fractionné 2'/2' à 14 min de course continue ! C'est une progression remarquable. Ton allure fractionné est passée de 6:45 avec un trou à 7:30 (S1) à une plage régulière de 6:25-6:58 (S2). Continue comme ça — l'objectif de 35 min à Vimy est très réaliste." },
  { keywords: ["jour j", "avant course", "veille", "matin course", "stratégie course"], response: "La veille : pâtes + poulet, couche-toi tôt, prépare ton sac. Le matin : petit-déj 2-3h avant (pain + confiture + café). Arrive 45 min avant. Échauffement 10 min + gammes. Stratégie : Km1-2 calme (pas d'emballement !), Km3-4 régulier, Km5+ envoie ce qu'il te reste. Et surtout : PROFITE du parcours et de l'ambiance !" },
  { keywords: ["merci", "super", "top", "génial", "parfait", "cool"], response: "De rien ! Continue comme ça, tu es sur la bonne voie pour la Canadian Race. N'hésite pas si tu as d'autres questions. Chaque séance te rapproche de Vimy ! 💪🎗️" },
  { keywords: ["bonjour", "salut", "hello", "coucou", "hey"], response: "Salut ! Je suis ton Coach IA RunBack. Comment je peux t'aider aujourd'hui ? Tu peux me poser des questions sur ton entraînement, la nutrition, la récupération, ou la Canadian Race de Vimy !" },
];

export const CHAT_DEFAULT_RESPONSE = "Bonne question ! Pour tout ce qui concerne ton entraînement pour la Canadian Race, n'hésite pas à me demander des conseils sur : l'allure, la nutrition, la récupération, les blessures, la motivation, le parcours de Vimy, le plan d'entraînement, ou les côtes. Je suis là pour t'accompagner jusqu'au jour J ! 🎗️";

// ─── INITIAL COMPLETED ───
export const INIT_COMP = { "w1d1": 1, "w1d5": 1, "extra_tue_noon": 1, "extra_tue_eve": 1 };
