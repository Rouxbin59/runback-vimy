import { useState, useEffect, useCallback, useMemo, useRef } from "react";

const START=new Date(2026,2,23), RACE=new Date(2026,5,27);

// ─── BADGES ───
const BADGES=[
  {id:"first_step",name:"Premier Pas",desc:"1ère séance",icon:"🥾",xp:50,check:(c)=>Object.keys(c).length>=1},
  {id:"week1",name:"Semaine 1",desc:"Toutes les séances S1",icon:"📅",xp:100,check:(c,p)=>p.filter(s=>s.week===1).every(s=>c[s.id])},
  {id:"streak3",name:"Régulier",desc:"3 séances faites",icon:"🔥",xp:75,check:(c)=>Object.keys(c).length>=3},
  {id:"streak7",name:"Machine",desc:"7 séances",icon:"⚡",xp:150,check:(c)=>Object.keys(c).length>=7},
  {id:"streak15",name:"Inarrêtable",desc:"15 séances",icon:"💎",xp:300,check:(c)=>Object.keys(c).length>=15},
  {id:"first_run",name:"Coureur",desc:"1ère course",icon:"🏃",xp:50,check:(c,p)=>p.filter(s=>s.type==="run"&&c[s.id]).length>=1},
  {id:"continuous",name:"Sans Pause",desc:"1ère course continue (sans marche)",icon:"🎯",xp:150,check:(c)=>!!c["extra_tue_noon"]},
  {id:"ten_min",name:"10 Minutes",desc:"10+ min de course continue",icon:"⏱️",xp:100,check:(c)=>!!c["extra_tue_noon"]||!!c["w5d1"]},
  {id:"twenty_min",name:"20 Minutes",desc:"20 min continues",icon:"🕐",xp:200,check:(c)=>!!c["w7d1"]},
  {id:"thirty_min",name:"30 Minutes",desc:"30 min continues",icon:"🎯",xp:300,check:(c)=>!!c["w9d1"]},
  {id:"two_a_day",name:"Biquotidien",desc:"2 courses le même jour",icon:"💥",xp:100,check:(c)=>!!c["extra_tue_noon"]&&!!c["extra_tue_eve"]},
  {id:"first_hill",name:"Grimpeur",desc:"1ère côtes",icon:"⛰️",xp:100,check:(c)=>!!c["w6d3"]},
  {id:"half_way",name:"Mi-Parcours",desc:"50% du plan",icon:"🏔️",xp:200,check:(c,p)=>Object.keys(c).length>=p.length/2},
  {id:"vimy_sim",name:"Simulation Vimy",desc:"Répétition 5.5 km",icon:"🗺️",xp:400,check:(c)=>!!c["w10d5"]},
  {id:"phase_adapt",name:"Adapté",desc:"Phase Adaptation",icon:"🌱",xp:150,check:(c,p)=>p.filter(s=>s.week<=4).every(s=>c[s.id])},
  {id:"phase_build",name:"Bâtisseur",desc:"Phase Construction",icon:"🏗️",xp:250,check:(c,p)=>p.filter(s=>s.week>=5&&s.week<=8).every(s=>c[s.id])},
  {id:"weight_first",name:"Sur la Balance",desc:"1er poids noté",icon:"⚖️",xp:25,check:(c,p,w)=>w.length>=1},
  {id:"weight_5",name:"-5 kg",desc:"Perdu 5 kg",icon:"📉",xp:300,check:(c,p,w)=>w.length>=2&&(w[0].weight-w[w.length-1].weight)>=5},
  {id:"weight_10",name:"-10 kg !",desc:"Objectif !",icon:"🏆",xp:500,check:(c,p,w)=>w.length>=2&&(w[0].weight-w[w.length-1].weight)>=10},
  {id:"finisher",name:"FINISHER",desc:"Canadian Race terminée",icon:"🎗️",xp:1000,check:(c)=>!!c["w14d5"]},
];

const LEVELS=[{lv:1,name:"Recrue",xp:0,c:"#8B9D77"},{lv:2,name:"Soldat",xp:100,c:"#A3956A"},{lv:3,name:"Caporal",xp:300,c:"#C9A96E"},{lv:4,name:"Sergent",xp:600,c:"#D4A853"},{lv:5,name:"Adjudant",xp:1000,c:"#E8C547"},{lv:6,name:"Lieutenant",xp:1500,c:"#DAA520"},{lv:7,name:"Capitaine",xp:2200,c:"#CD7F32"},{lv:8,name:"Commandant",xp:3000,c:"#C0C0C0"},{lv:9,name:"Colonel",xp:4000,c:"#FFD700"},{lv:10,name:"Général",xp:5000,c:"#E5E4E2"}];
const getLv=(xp)=>{let l=LEVELS[0];for(const x of LEVELS)if(xp>=x.xp)l=x;return l;};
const getNext=(xp)=>{for(const l of LEVELS)if(xp<l.xp)return l;return null;};

// ─── REAL SESSION DATA (4 sessions) ───
const RD={
  "w1d1":{date:"2026-03-24",dist:3.95,time:37,type:"fractionné",
    intervals:[{t:"run",d:0.32,p:"6:14"},{t:"walk",d:0.17,p:"11:27"},{t:"run",d:0.31,p:"6:32"},{t:"walk",d:0.14,p:"13:55"},{t:"run",d:0.30,p:"6:35"},{t:"walk",d:0.16,p:"12:33"},{t:"run",d:0.29,p:"6:59"},{t:"walk",d:0.16,p:"12:38"},{t:"run",d:0.29,p:"6:47"},{t:"walk",d:0.15,p:"13:09"},{t:"run",d:0.27,p:"7:30"},{t:"walk",d:0.15,p:"13:20"},{t:"run",d:0.31,p:"6:32"},{t:"run",d:0.29,p:"6:47"}],
    avgPace:"6:45",note:"8×2'/2' — Fatigue visible intervalle 6 (7:30), remontée 7-8."},
  "w1d5":{date:"2026-03-29",dist:4.38,time:42.7,type:"fractionné",
    intervals:[{t:"walk",d:0.537,p:"10:48"},{t:"run",d:0.305,p:"6:25"},{t:"walk",d:0.175,p:"11:22"},{t:"run",d:0.305,p:"6:57"},{t:"walk",d:0.173,p:"11:36"},{t:"run",d:0.299,p:"6:49"},{t:"walk",d:0.173,p:"11:36"},{t:"run",d:0.311,p:"6:43"},{t:"walk",d:0.166,p:"12:03"},{t:"run",d:0.304,p:"6:50"},{t:"walk",d:0.158,p:"12:27"},{t:"run",d:0.312,p:"6:44"},{t:"walk",d:0.156,p:"12:45"},{t:"run",d:0.295,p:"6:58"},{t:"walk",d:0.176,p:"11:36"},{t:"run",d:0.307,p:"6:46"},{t:"walk",d:0.429,p:"12:22"}],
    avgPace:"6:46",note:"8×2'/2' — Beaucoup plus régulier ! Plage 6:25-6:58. Plus de trou à 7:30. Progression nette."},
  "extra_tue_noon":{date:"2026-03-31",dist:1.74,time:12.37,type:"continu",
    splits:[{km:1,pace:"7:09"},{km:0.74,pace:"7:02"}],
    avgPace:"7:06",dplus:15,note:"1ère course continue ! 12 min à 7:06/km. Allure très stable. Gros cap mental."},
  "extra_tue_eve":{date:"2026-03-31",dist:2.02,time:14.67,type:"continu",
    splits:[{km:1,pace:"6:57"},{km:1.02,pace:"7:27"}],
    avgPace:"7:15",dplus:15,note:"2ème course du jour. 14min40 à 7:15/km. Fatigue visible sur km2 (6:57→7:27). Normal après le midi."}
};

// ─── COACH ANALYSIS ───
const COACH_ANALYSIS = {
  title: "📊 Bilan de ta semaine",
  date: "24-31 mars 2026",
  sections: [
    {emoji:"✅",title:"Fractionné S2 (dimanche)",text:"Excellente régularité ! Allures entre 6:25 et 6:58/km — fini le trou à 7:30 de la S1. Tu maîtrises le 2'/2'."},
    {emoji:"🚀",title:"Course continue (mardi midi)",text:"1.74 km en 12 min à 7:06/km — ta première course SANS marche ! Allure ultra-stable (7:09 → 7:02). Cap mental énorme."},
    {emoji:"💪",title:"Course continue (mardi soir)",text:"2.02 km en 14:40 à 7:15/km avec 15m D+. Fatigue normale sur le km2 après avoir couru le midi. Belle perf quand même."},
    {emoji:"⚠️",title:"Point de vigilance",text:"2 courses le même jour c'est risqué pour tes genoux et ta cheville. On garde MAX 1 séance/jour. Le repos est aussi de l'entraînement."},
    {emoji:"📈",title:"Adaptation du plan",text:"Tu es en avance ! Le plan est recalibré : on saute les intervalles basiques pour aller directement vers des blocs de 5-8 min. L'objectif 35 min à Vimy est très réaliste."}
  ]
};

// ─── PLAN (adapted after 4 sessions) ───
const genPlan=()=>{
  const P=[
    {ph:"Adaptation",cl:"#8B9D77",wks:[
      {w:1,lb:"✅ Baseline",ss:[
        {d:1,t:"8×2'/2' ✅",tp:"run",du:37,it:2,ds:"Séance 1 : 8×2'/2'. Moyenne 6:45/km.",st:["5 min marche","8× (2 min course + 2 min marche)","5 min retour"],ti:"✅ FAIT — Plan accéléré grâce à cette perf.",rd:true},
        {d:3,t:"Renfo & mobilité",tp:"strength",du:30,it:1,ds:"Renforcement articulaire genoux/chevilles.",st:["Équilibre unipodal 3×30s","Squats partiels 3×10","Mollets 3×12","Pont fessier 3×12","Étirements 8 min"],ti:"Protège tes articulations."},
        {d:5,t:"8×2'/2' régulier ✅",tp:"run",du:43,it:2,ds:"Séance 2 : 8×2'/2' — beaucoup plus régulier ! 6:25-6:58/km.",st:["5 min 47 marche échauffement","8× (2 min course + 2 min marche)","5 min 21 marche retour"],ti:"✅ FAIT — Régularité nettement améliorée."}
      ]},
      {w:2,lb:"Course continue !",ss:[
        {d:1,t:"12 min continu ✅",tp:"run",du:12,it:3,ds:"BONUS : 1ère course continue ! 1.74 km en 12:22 à 7:06/km.",st:["Course continue 12 min","Allure cible 7:00-7:15/km"],ti:"✅ FAIT — Cap mental énorme !"},
        {d:2,t:"14 min continu ✅",tp:"run",du:15,it:3,ds:"BONUS : 2ème course du jour. 2.02 km en 14:40 à 7:15/km.",st:["Course continue 14 min 40","15m D+"],ti:"✅ FAIT — Mais attention : 2 courses/jour = risque articulaire."},
        {d:4,t:"Renfo genoux/cheville",tp:"strength",du:30,it:1,ds:"IMPORTANT après 2 courses en 1 jour. Renforcement + récup.",st:["Automassage mollets/quadriceps 10 min","Équilibre unipodal 3×30s","Squats partiels 3×12","Pont fessier 3×15","Mobilité cheville complète","Étirements 10 min"],ti:"Après le double de mardi, tes articulations ont BESOIN de ça."},
        {d:6,t:"15 min continu",tp:"run",du:25,it:3,ds:"On capitalise : 15 min continues à allure confortable (7:00-7:15/km).",st:["5 min marche échauffement","15 min course continue","5 min marche retour + étirements"],ti:"15 min = étape clé. Pas plus vite que 7:00/km !"}
      ]},
      {w:3,lb:"Blocs longs",ss:[
        {d:1,t:"18 min continu",tp:"run",du:30,it:3,ds:"On pousse à 18 minutes. Tu en es capable.",st:["5 min marche","18 min course continue à 7:00-7:15/km","5 min retour + étirements"],ti:"18 min ≈ 2.5 km. Tu as déjà fait 14:40, +3 min c'est faisable."},
        {d:3,t:"Renfo trail",tp:"strength",du:30,it:2,ds:"Renforcement orienté dénivelé.",st:["Fentes marchées 3×8/côté","Montées de marche 3×10/côté","Squats complets 3×12","Gainage planche+latéral 3×30s","Étirements"],ti:"Prépare les montées de Vimy-Lorette."},
        {d:5,t:"20 min sortie longue",tp:"run",du:35,it:4,ds:"Le cap des 20 minutes ! Terrain varié si possible.",st:["5 min marche","20 min course continue","5 min retour au calme + étirements"],ti:"20 min ≈ 2.8 km. Plus de la moitié de la Canadian Race !"}
      ]},
      {w:4,lb:"Décharge",ss:[
        {d:1,t:"15 min souple",tp:"run",du:25,it:2,ds:"Volume réduit. Course plaisir.",st:["5 min marche","15 min course très souple","5 min retour"],ti:"Ton corps s'adapte au repos. Semaine légère."},
        {d:4,t:"Mobilité complète",tp:"strength",du:25,it:1,ds:"Décharge articulaire.",st:["Automassage 10 min","Mobilité cheville + genou","Étirements profonds 10 min"],ti:"4 semaines de reprise. Tu as changé."}
      ]}
    ]},
    {ph:"Construction",cl:"#C9A96E",wks:[
      {w:5,lb:"Endurance",ss:[
        {d:1,t:"25 min continu",tp:"run",du:35,it:4,ds:"25 minutes continues.",st:["5 min marche","25 min course à 6:50-7:10/km","5 min retour"],ti:"25 min ≈ 3.5 km."},
        {d:3,t:"Renfo côtes",tp:"strength",du:35,it:2,ds:"Spécifique D+.",st:["Squats sautés 3×8","Fentes arrière 3×10","Montées dynamiques 3×12","Gainage 3×40s","Étirements"],ti:"Les 100m D+ de Vimy se préparent ici."},
        {d:5,t:"2×12 min",tp:"run",du:35,it:3,ds:"Deux blocs de 12 min avec 2 min marche entre.",st:["5 min marche","12 min course + 2 min marche + 12 min course","5 min retour"],ti:"24 min de course ≈ 3.4 km."}
      ]},
      {w:6,lb:"Les côtes",ss:[
        {d:1,t:"28 min continu",tp:"run",du:38,it:4,ds:"28 minutes. On approche des 30.",st:["5 min marche","28 min course continue","5 min retour"],ti:"≈ 4 km. La Canadian Race fait 5.5."},
        {d:3,t:"Côtes découverte",tp:"run",du:30,it:3,ds:"Première séance côtes.",st:["10 min trot plat","6× (40s montée + descente marche)","8 min trot retour"],ti:"En côte : petits pas, fréquence élevée."},
        {d:5,t:"30 min !",tp:"run",du:40,it:4,ds:"CAP DES 30 MINUTES !",st:["5 min marche","30 min course continue","5 min retour + étirements"],ti:"30 min à 7:00 = 4.3 km. Tu y es presque !"}
      ]},
      {w:7,lb:"Volume",ss:[
        {d:1,t:"30 min + côtes",tp:"run",du:40,it:4,ds:"30 min avec passages en côte.",st:["5 min marche","30 min course avec 2-3 côtes","5 min retour"],ti:"Intègre les côtes naturellement."},
        {d:3,t:"Fartlek",tp:"run",du:35,it:4,ds:"Jeu d'allure pour varier.",st:["10 min trot","8× (30s accélération + 1min30 trot)","10 min retour"],ti:"Le fartlek c'est du jeu. Au feeling."},
        {d:6,t:"35 min sortie longue",tp:"run",du:45,it:5,ds:"35 minutes sur terrain vallonné !",st:["5 min marche","35 min course","5 min retour + étirements"],ti:"35 min = le temps objectif de la Canadian Race !"}
      ]},
      {w:8,lb:"Décharge",ss:[
        {d:1,t:"20 min souple",tp:"run",du:30,it:3,ds:"Allégé.",st:["5 min marche","20 min souple","5 min retour"],ti:"Absorption du travail."},
        {d:4,t:"Mobilité",tp:"strength",du:25,it:1,ds:"Récup.",st:["Automassage 10 min","Mobilité complète","Yoga 10 min"],ti:"Mi-parcours du plan !"}
      ]}
    ]},
    {ph:"Spécifique",cl:"#D4A853",wks:[
      {w:9,lb:"Allure Vimy",ss:[
        {d:1,t:"35 min continu",tp:"run",du:45,it:5,ds:"35 minutes — le temps cible.",st:["5 min marche","35 min à 6:30-6:50/km","5 min retour"],ti:"35 min à 6:40 = 5.2 km. Presque Vimy !"},
        {d:3,t:"Allure 6:20",tp:"run",du:35,it:4,ds:"Travail d'allure cible.",st:["10 min trot","3× (5 min à 6:20/km + 2 min trot)","5 min retour"],ti:"6:20/km = allure pour finir en 35 min."},
        {d:5,t:"35 min vallonné",tp:"run",du:45,it:5,ds:"35 min avec du relief.",st:["5 min marche","35 min vallonné","5 min retour"],ti:"Simule les conditions de Vimy-Lorette."}
      ]},
      {w:10,lb:"Simulation",ss:[
        {d:1,t:"38 min allure",tp:"run",du:48,it:5,ds:"38 min à allure de course.",st:["5 min marche","38 min à 6:20-6:30/km","5 min retour"],ti:"38 min = marge de sécurité."},
        {d:3,t:"Côtes Vimy",tp:"run",du:35,it:5,ds:"Profil de course.",st:["10 min trot","5× (1 min côte + descente)","10 min plat allure cible","5 min retour"],ti:"Monte à ton rythme, récupère en descente."},
        {d:5,t:"5.5 km !",tp:"run",du:50,it:5,ds:"LA DISTANCE ! Simulation complète.",st:["5 min marche","~35-40 min pour 5.5 km","5 min récup"],ti:"1ère rép à distance. Juste FINIR."}
      ]},
      {w:11,lb:"Confiance max",ss:[
        {d:1,t:"35 min allure course",tp:"run",du:45,it:5,ds:"35 min à allure cible.",st:["5 min marche","35 min à 6:20/km","5 min retour"],ti:"Si tu fais ça, Vimy est dans la poche."},
        {d:3,t:"Fartlek vallonné",tp:"run",du:35,it:5,ds:"Dernière grosse séance.",st:["10 min trot","6× (45s accél + 1min30 récup)","10 min retour"],ti:"Après, c'est récup."},
        {d:5,t:"5.5 km chrono",tp:"run",du:50,it:5,ds:"Répétition générale.",st:["8 min échauffement","5.5 km objectif < 37 min","5 min récup"],ti:"Pas tout donner."}
      ]}
    ]},
    {ph:"Affûtage",cl:"#A08060",wks:[
      {w:12,lb:"Repos actif",ss:[
        {d:1,t:"25 min souple",tp:"run",du:35,it:3,ds:"Réduit.",st:["5 min marche","25 min souple","5 min retour"],ti:"Plaisir."},
        {d:3,t:"Fartlek court",tp:"run",du:25,it:3,ds:"Dynamique.",st:["8 min trot","5× (20s vite + 1min40 trot)","7 min retour"],ti:"Peps."},
        {d:5,t:"20 min vallonné",tp:"run",du:30,it:3,ds:"Dernière relief.",st:["5 min marche","20 min course","5 min retour"],ti:"Visualise Vimy-Lorette."}
      ]},
      {w:13,lb:"Sharpening",ss:[
        {d:1,t:"20 min souple",tp:"run",du:28,it:2,ds:"Facile.",st:["5 min marche","20 min souple","3 min retour"],ti:"Trop frais = bon signe."},
        {d:4,t:"15 min + gammes",tp:"run",du:22,it:2,ds:"Trot + éducatifs.",st:["5 min marche","10 min trot","Gammes","5 min retour"],ti:"Coordination."}
      ]},
      {w:14,lb:"🎗️ Jour J",ss:[
        {d:1,t:"Dernier trot",tp:"run",du:18,it:1,ds:"12 min trot.",st:["3 min marche","12 min trot","3 min étirements"],ti:"Savoure le chemin."},
        {d:3,t:"Activation",tp:"strength",du:15,it:1,ds:"Mobilité.",st:["10 min marche","Mobilité 5 min"],ti:"Prépare ton sac !"},
        {d:5,t:"🎗️ CANADIAN RACE",tp:"race",du:35,it:5,ds:"5.5 km — Champs de bataille de Vimy-Lorette. 100m D+. 35 min.",st:["Arriver 45 min avant","Échauffement 10 min + gammes","Km1-2 calme → Km3-4 régulier → Km5+ ENVOIE","CÉLÉBRER"],ti:"Honore chaque mètre de ce parcours historique."}
      ]}
    ]}
  ];
  const plan=[];
  P.forEach(p=>p.wks.forEach(wk=>wk.ss.forEach(s=>{const date=new Date(START);date.setDate(date.getDate()+(wk.w-1)*7+s.d);plan.push({title:s.t,type:s.tp,dur:s.du,int:s.it,desc:s.ds,steps:s.st,tip:s.ti,week:wk.w,weekLabel:wk.lb,phase:p.ph,phaseColor:p.cl,date,dateStr:date.toISOString().split("T")[0],id:`w${wk.w}d${s.d}`,rd:s.rd});})));
  // Add extra sessions (mardi midi + soir)
  plan.push({title:"12 min continu ✅",type:"run",dur:12,int:3,desc:"Course continue 1.74 km à 7:06/km.",steps:["12 min course continue"],tip:"✅ FAIT",week:2,weekLabel:"Course continue !",phase:"Adaptation",phaseColor:"#8B9D77",date:new Date(2026,2,31),dateStr:"2026-03-31",id:"extra_tue_noon"});
  plan.push({title:"14 min continu ✅",type:"run",dur:15,int:3,desc:"Course continue 2.02 km à 7:15/km.",steps:["14 min 40 course continue"],tip:"✅ FAIT",week:2,weekLabel:"Course continue !",phase:"Adaptation",phaseColor:"#8B9D77",date:new Date(2026,2,31),dateStr:"2026-03-31",id:"extra_tue_eve"});
  return plan.sort((a,b)=>a.date-b.date);
};

const NUT=[
  {wk:"1-2",ph:"Mise en place",cl:"#8B9D77",cal:1950,pr:130,ca:180,fa:70,ms:[{t:"🍽 12h",it:["150g poulet/poisson","200g légumes","150g riz complet","Huile d'olive"],cal:750},{t:"🍎 16h",it:["1 fruit","30g amandes","Yaourt 0%"],cal:300},{t:"🍽 20h",it:["150g viande/saumon","Salade composée","100g lentilles"],cal:700}],tp:["2L d'eau/jour","0 sucre & alcool","Cuisiner maison"]},
  {wk:"3-4",ph:"Adaptation",cl:"#8B9D77",cal:1900,pr:135,ca:170,fa:68,ms:[{t:"🍽 12h",it:["2 œufs + jambon dinde","200g légumes sautés","120g quinoa"],cal:720},{t:"🍎 16h",it:["Fromage blanc 0%","Fruits rouges","Chia"],cal:250},{t:"🍽 20h",it:["150g poisson","Ratatouille","100g pâtes complètes"],cal:680}],tp:["Meal prep dimanche","Manger lentement","Vinaigre de cidre"]},
  {wk:"5-6",ph:"Accélération",cl:"#C9A96E",cal:1850,pr:140,ca:160,fa:65,ms:[{t:"🍽 12h",it:["150g dinde","250g légumes vapeur","130g riz"],cal:700},{t:"🍎 16h",it:["Shake whey + banane","OU 2 œufs durs"],cal:280},{t:"🍽 20h",it:["130g saumon","Soupe légumes","Pain complet"],cal:650}],tp:["+prot jours training","7-8h sommeil","Peser portions"]},
  {wk:"7-8",ph:"Croisière",cl:"#C9A96E",cal:1850,pr:140,ca:155,fa:65,ms:[{t:"🍽 12h",it:["150g poulet","200g wok légumes","120g soba"],cal:700},{t:"🍎 16h",it:["Pain complet + beurre cacahuète"],cal:280},{t:"🍽 20h",it:["Omelette 3 œufs","Salade","Fromage"],cal:650}],tp:["~-5 kg attendu","Varier protéines"]},
  {wk:"9-10",ph:"Push",cl:"#D4A853",cal:1800,pr:145,ca:145,fa:62,ms:[{t:"🍽 12h",it:["170g poisson blanc","200g légumes rôtis","Légumineuses"],cal:680},{t:"🍎 16h",it:["Skyr","Amandes","Cannelle"],cal:260},{t:"🍽 20h",it:["150g viande maigre","Salade XL","Pain"],cal:620}],tp:["Hydratation ++","Magnésium + vit D"]},
  {wk:"11-12",ph:"Affinage",cl:"#A08060",cal:1850,pr:140,ca:160,fa:65,ms:[{t:"🍽 12h",it:["150g protéine choix","200g légumes","Féculent complet"],cal:720},{t:"🍎 16h",it:["Fruit + protéine","Chocolat noir"],cal:280},{t:"🍽 20h",it:["130g protéine","Légumes volonté"],cal:640}],tp:["En forme, pas affamé","-10 kg quasi !"]},
  {wk:"13-14",ph:"Pré-course",cl:"#A08060",cal:1900,pr:135,ca:180,fa:65,ms:[{t:"🍽 12h",it:["Protéine légère","Féculents ++","Légumes cuits"],cal:750},{t:"🍎 16h",it:["Banane + barre","Fromage blanc"],cal:300},{t:"🍽 20h",it:["Repas équilibré","J-1: pâtes + poulet"],cal:650}],tp:["Carbo-loading 3j","0 aliment nouveau"]}
];

const Ic={run:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="4" r="2"/><path d="M6 9l3 1 2-3 4 2v4l-3 3-2 5"/><path d="M9 10l-3 8"/></svg>,str:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11M6 12h12M6.5 17.5h11M3 12h2M19 12h2"/></svg>,bell:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,chk:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,bk:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,rt:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,x:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,star:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,flag:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>};
const gI=(t)=>t==="strength"?<Ic.str/>:t==="race"?<Ic.flag/>:<Ic.run/>;
const fD=(d)=>`${["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"][d.getDay()]} ${d.getDate()} ${["jan","fév","mar","avr","mai","juin","juil"][d.getMonth()]}`;
const fDL=(d)=>`${["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"][d.getDay()]} ${d.getDate()} ${["janvier","février","mars","avril","mai","juin"][d.getMonth()]}`;
const iB=(n,c)=><div style={{display:"flex",gap:"2px"}}>{[1,2,3,4,5].map(i=><div key={i} style={{width:"12px",height:"3px",borderRadius:"1.5px",background:i<=n?c:"rgba(255,255,255,0.1)"}}/>)}</div>;

const INIT_COMP={"w1d1":1,"w1d5":1,"extra_tue_noon":1,"extra_tue_eve":1};

export default function App(){
  const plan=useMemo(()=>genPlan(),[]);
  const [comp,setComp]=useState(INIT_COMP);
  const [fb,setFb]=useState({});const [sel,setSel]=useState(null);const [view,setView]=useState("today");
  const [expW,setExpW]=useState(null);const [nutI,setNutI]=useState(0);
  const [wLog,setWLog]=useState([]);const [showWI,setShowWI]=useState(false);const [wiV,setWiV]=useState("");
  const [nOn,setNOn]=useState(false);const [nM,setNM]=useState(true);const [nB,setNB]=useState(true);const [nE,setNE]=useState(true);
  const [nMH,setNMH]=useState(7);const [nSH,setNSH]=useState(18);const [nEH,setNEH]=useState(21);
  const [showN,setShowN]=useState(false);const [toast,setToast]=useState(null);const [nLog,setNLog]=useState([]);
  const [newBadge,setNewBadge]=useState(null);const [ub,setUb]=useState(["first_step","first_run","streak3","continuous","two_a_day"]);
  const sent=useRef(new Set());

  useEffect(()=>{try{const r=localStorage.getItem("rb6");if(r){const d=JSON.parse(r);setComp(d.c||INIT_COMP);setFb(d.f||{});setWLog(d.w||[]);setNOn(d.no||false);setUb(d.ub||["first_step","first_run","streak3","continuous","two_a_day"]);setNLog(d.nl||[]);}}catch(e){}},[]);
  const save=useCallback((c,f,w,no,ubx,nl)=>{try{localStorage.setItem("rb6",JSON.stringify({c,f,w,no,ub:ubx,nl}));}catch(e){}},[]);

  const checkB=useCallback((c,w)=>{const nu=[...ub];let nw=null;BADGES.forEach(b=>{if(!nu.includes(b.id)&&b.check(c,plan,w)){nu.push(b.id);nw=b;}});if(nw){setUb(nu);setNewBadge(nw);setTimeout(()=>setNewBadge(null),4000);}return nu;},[ub,plan]);
  const toggle=useCallback((id)=>{setComp(p=>{const n={...p};if(n[id])delete n[id];else n[id]=Date.now();const u=checkB(n,wLog);save(n,fb,wLog,nOn,u,nLog);return n;});},[fb,wLog,nOn,nLog,save,checkB]);
  const setFbk=useCallback((id,d)=>{setFb(p=>{const n={...p,[id]:{difficulty:d}};save(comp,n,wLog,nOn,ub,nLog);return n;});},[comp,wLog,nOn,ub,nLog,save]);
  const addW=useCallback(()=>{const v=parseFloat(wiV);if(!v||v<50||v>200)return;const n=[...wLog,{date:new Date().toISOString().split("T")[0],weight:v}];setWLog(n);setWiV("");setShowWI(false);const u=checkB(comp,n);save(comp,fb,n,nOn,u,nLog);},[wiV,wLog,comp,fb,nOn,nLog,save,checkB]);

  const showT=useCallback((msg,cl,emoji)=>{setToast({msg,cl,emoji});setTimeout(()=>setToast(null),5000);},[]);
  const sendN=useCallback((ti,body,cl,emoji)=>{if("Notification"in window&&Notification.permission==="granted")try{new Notification(ti,{body});}catch(e){}showT(body,cl,emoji);setNLog(p=>[...p,{time:new Date().toISOString(),body}].slice(-20));},[showT]);

  useEffect(()=>{if(!nOn)return;const ck=()=>{const now=new Date(),h=now.getHours(),m=now.getMinutes(),ds=now.toISOString().split("T")[0];const s=plan.find(x=>x.dateStr===ds);if(!s)return;const k=t=>`${ds}-${t}`;
    if(nM&&h===nMH&&m===0&&!sent.current.has(k("m"))){sent.current.add(k("m"));sendN("☀️",`${s.title} — ${s.dur}min`,s.phaseColor,"☀️");}
    if(nB&&h===(nSH-1)&&m===0&&!sent.current.has(k("b"))&&!comp[s.id]){sent.current.add(k("b"));sendN("⏰",`${s.title}`,s.phaseColor,"⏰");}
    if(nE&&h===nEH&&m===0&&!sent.current.has(k("e"))&&!comp[s.id]){sent.current.add(k("e"));sendN("🌙",`"${s.title}"!`,"#C9A96E","🌙");}
  };ck();const iv=setInterval(ck,30000);return()=>clearInterval(iv);},[nOn,nM,nB,nE,nMH,nSH,nEH,plan,comp,sendN]);

  const today=new Date().toISOString().split("T")[0];
  const nextS=plan.find(s=>s.dateStr>=today&&!comp[s.id]);
  const cc=Object.keys(comp).length,tot=plan.length,pct=Math.round((cc/tot)*100);
  const dtr=Math.max(0,Math.ceil((RACE-new Date())/864e5));
  const totMin=plan.filter(s=>comp[s.id]).reduce((a,s)=>a+s.dur,0);
  const totDist=(1.74+2.02+3.95+4.38).toFixed(1); // real measured distance
  const totalXP=BADGES.filter(b=>ub.includes(b.id)).reduce((a,b)=>a+b.xp,0);
  const level=getLv(totalXP),nextLv=getNext(totalXP);
  const lvPct=nextLv?Math.round(((totalXP-level.xp)/(nextLv.xp-level.xp))*100):100;
  const wl=wLog.length>=2?(wLog[0].weight-wLog[wLog.length-1].weight).toFixed(1):0;

  const T={bg:"#1a1810",cd:"#242218",cd2:"#2e2a1f",bd:"rgba(180,160,120,0.12)",tx:"#e8e0d0",sf:"#b0a890",dm:"#706850",ac:"#C9A96E",ac2:"#8B9D77",rd:"#C45B4A",f:"'Source Sans 3',sans-serif",fh:"'Bebas Neue',sans-serif"};

  const XP=()=>(<div style={{marginBottom:"14px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}><div style={{display:"flex",alignItems:"center",gap:"5px"}}><div style={{background:`${level.c}25`,borderRadius:"5px",padding:"1px 7px",display:"flex",alignItems:"center",gap:"3px"}}><Ic.star/><span style={{fontFamily:T.fh,fontSize:"13px",color:level.c,letterSpacing:"1px"}}>Niv.{level.lv}</span></div><span style={{fontFamily:T.fh,fontSize:"12px",color:T.sf,letterSpacing:"0.5px"}}>{level.name}</span></div><span style={{fontFamily:T.f,fontSize:"9px",color:T.dm}}>{totalXP} XP</span></div><div style={{height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.05)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"2px",background:`linear-gradient(90deg,${level.c},${T.ac})`,width:`${lvPct}%`,transition:"width .5s"}}/></div></div>);

  // ─── REAL DATA CARD ───
  const RDCard=({sid})=>{const d=RD[sid];if(!d)return null;const runs=d.intervals?d.intervals.filter(x=>x.t==="run"):null;return(
    <div style={{background:`${T.ac2}08`,border:`1px solid ${T.ac2}20`,borderRadius:"12px",padding:"14px",marginBottom:"10px"}}>
      <div style={{fontFamily:T.fh,fontSize:"12px",color:T.tx,letterSpacing:"1px",marginBottom:"8px"}}>📊 DONNÉES RÉELLES — {d.type.toUpperCase()}</div>
      <div style={{display:"grid",gridTemplateColumns:runs?"1fr 1fr 1fr":"1fr 1fr 1fr 1fr",gap:"6px",marginBottom:"8px"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:"15px",fontWeight:800,fontFamily:T.fh,color:T.ac2}}>{d.avgPace}</div><div style={{fontSize:"7px",color:T.dm}}>ALLURE</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:"15px",fontWeight:800,fontFamily:T.fh,color:T.tx}}>{d.dist}km</div><div style={{fontSize:"7px",color:T.dm}}>DIST</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:"15px",fontWeight:800,fontFamily:T.fh,color:T.tx}}>{typeof d.time==="number"?d.time.toFixed(0)+"'":d.time}</div><div style={{fontSize:"7px",color:T.dm}}>DURÉE</div></div>
        {d.dplus&&<div style={{textAlign:"center"}}><div style={{fontSize:"15px",fontWeight:800,fontFamily:T.fh,color:T.tx}}>{d.dplus}m</div><div style={{fontSize:"7px",color:T.dm}}>D+</div></div>}
      </div>
      {runs&&<div style={{display:"flex",alignItems:"flex-end",gap:"2px",height:"45px",marginBottom:"4px"}}>{runs.map((iv,i)=>{const mx=Math.max(...runs.map(x=>x.d));const h=(iv.d/mx)*35+8;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"1px"}}><span style={{fontSize:"6px",color:T.dm}}>{iv.p}</span><div style={{width:"100%",height:`${h}px`,borderRadius:"2px 2px 0 0",background:`${T.ac2}50`}}/></div>);})}</div>}
      {d.splits&&<div style={{display:"flex",gap:"6px"}}>{d.splits.map((sp,i)=>(<div key={i} style={{flex:1,background:"rgba(255,255,255,0.03)",borderRadius:"6px",padding:"6px",textAlign:"center"}}><div style={{fontFamily:T.fh,fontSize:"13px",color:T.ac2}}>{sp.pace}/km</div><div style={{fontSize:"8px",color:T.dm}}>{sp.km<1?`${(sp.km*1000).toFixed(0)}m`:`Km ${i+1}`}</div></div>))}</div>}
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:"6px",padding:"6px 8px",marginTop:"6px"}}><p style={{margin:0,fontSize:"10px",color:T.sf,lineHeight:1.3,fontFamily:T.f,fontStyle:"italic"}}>{d.note}</p></div>
    </div>
  );};

  // ─── COACH CARD ───
  const CoachCard=()=>(<div style={{background:`linear-gradient(160deg,${T.ac}08,transparent)`,border:`1px solid ${T.ac}15`,borderRadius:"14px",padding:"16px",marginBottom:"14px"}}>
    <div style={{fontFamily:T.fh,fontSize:"14px",color:T.ac,letterSpacing:"1.5px",marginBottom:"4px"}}>{COACH_ANALYSIS.title}</div>
    <div style={{fontSize:"9px",color:T.dm,fontFamily:T.f,marginBottom:"10px"}}>{COACH_ANALYSIS.date}</div>
    {COACH_ANALYSIS.sections.map((s,i)=>(<div key={i} style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
      <span style={{fontSize:"14px",flexShrink:0}}>{s.emoji}</span>
      <div><div style={{fontFamily:T.fh,fontSize:"11px",color:T.tx,letterSpacing:"0.5px"}}>{s.title}</div><p style={{margin:"2px 0 0",fontSize:"10.5px",color:T.sf,lineHeight:1.35,fontFamily:T.f}}>{s.text}</p></div>
    </div>))}
  </div>);

  const Toast2=()=>toast?(<div style={{position:"fixed",top:"10px",left:"10px",right:"10px",zIndex:200,animation:"sd .3s ease"}}><div style={{background:T.cd2,border:`1px solid ${toast.cl}40`,borderRadius:"10px",padding:"10px 12px",display:"flex",alignItems:"center",gap:"8px",boxShadow:"0 6px 20px rgba(0,0,0,.5)"}}><span style={{fontSize:"18px"}}>{toast.emoji}</span><span style={{fontFamily:T.f,fontSize:"11px",fontWeight:600,color:T.tx,flex:1}}>{toast.msg}</span><button onClick={()=>setToast(null)} style={{background:"none",border:"none",color:T.dm,cursor:"pointer"}}><Ic.x/></button></div></div>):null;

  const BadgePopup2=()=>newBadge?(<div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.7)",backdropFilter:"blur(8px)",animation:"fi .3s ease"}}><div style={{background:T.cd,border:`2px solid ${T.ac}`,borderRadius:"18px",padding:"28px 24px",textAlign:"center",maxWidth:"280px",animation:"pop .4s cubic-bezier(.16,1,.3,1)"}}>
    <div style={{fontSize:"44px",marginBottom:"10px",animation:"bounce 1s ease infinite"}}>{newBadge.icon}</div>
    <div style={{fontFamily:T.fh,fontSize:"11px",color:T.ac,letterSpacing:"3px"}}>BADGE DÉBLOQUÉ</div>
    <div style={{fontFamily:T.fh,fontSize:"26px",color:T.tx,letterSpacing:"1px"}}>{newBadge.name}</div>
    <p style={{color:T.sf,fontSize:"12px",fontFamily:T.f,margin:"6px 0 14px"}}>{newBadge.desc}</p>
    <div style={{display:"inline-flex",background:`${T.ac}20`,borderRadius:"6px",padding:"4px 12px",color:T.ac,fontFamily:T.fh,fontSize:"16px",letterSpacing:"1px"}}>+{newBadge.xp} XP</div>
    <button onClick={()=>setNewBadge(null)} style={{display:"block",width:"100%",marginTop:"14px",padding:"8px",borderRadius:"8px",border:`1px solid ${T.bd}`,background:"transparent",color:T.dm,fontFamily:T.f,fontSize:"11px",cursor:"pointer"}}>Fermer</button>
  </div></div>):null;

  // ─── TODAY ───
  const TodayV=()=>{const s=nextS;return(<div>
    <div style={{background:`linear-gradient(180deg,${T.ac}08,transparent)`,border:`1px solid ${T.ac}10`,borderRadius:"14px",padding:"18px",marginBottom:"12px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,opacity:.02,backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.05) 10px,rgba(255,255,255,.05) 11px)",pointerEvents:"none"}}/>
      <div style={{fontFamily:T.fh,fontSize:"11px",color:T.ac,letterSpacing:"4px"}}>CANADIAN RACE</div>
      <div style={{fontFamily:T.fh,fontSize:"9px",color:T.dm,letterSpacing:"2px",marginTop:"1px"}}>VIMY-LORETTE</div>
      <div style={{fontFamily:T.fh,fontSize:"44px",color:T.tx,lineHeight:1,marginTop:"4px",letterSpacing:"2px"}}>J-{dtr}</div>
      <div style={{color:T.dm,fontSize:"10px",fontFamily:T.f}}>5.5 km · 100m D+ · 35 min</div>
    </div>
    <XP/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"5px",marginBottom:"12px"}}>
      {[{l:"Séances",v:cc,s:`/${tot}`},{l:"Distance",v:totDist,s:"km"},{l:"Minutes",v:totMin,s:""},{l:"Badges",v:ub.length,s:`/${BADGES.length}`}].map((x,i)=>(<div key={i} style={{background:T.cd,borderRadius:"8px",padding:"8px 4px",textAlign:"center",border:`1px solid ${T.bd}`}}>
        <div style={{fontSize:"16px",fontWeight:800,fontFamily:T.fh,color:T.tx,letterSpacing:"0.5px"}}>{x.v}<span style={{fontSize:"8px",color:T.dm,fontFamily:T.f}}> {x.s}</span></div>
        <div style={{fontSize:"7px",color:T.dm,textTransform:"uppercase",letterSpacing:".8px",fontFamily:T.f}}>{x.l}</div>
      </div>))}
    </div>
    {ub.length>0&&<div style={{display:"flex",gap:"5px",marginBottom:"12px",overflowX:"auto",paddingBottom:"2px"}}>{BADGES.filter(b=>ub.includes(b.id)).slice(-6).reverse().map(b=>(<div key={b.id} style={{minWidth:"44px",textAlign:"center",padding:"6px 2px",background:`${T.ac}06`,borderRadius:"8px",border:`1px solid ${T.ac}12`}}><div style={{fontSize:"20px"}}>{b.icon}</div><div style={{fontSize:"6px",color:T.dm,fontFamily:T.f,marginTop:"1px"}}>{b.name}</div></div>))}</div>}
    <CoachCard/>
    {s&&(<><div style={{fontSize:"9px",color:T.dm,textTransform:"uppercase",letterSpacing:"2px",fontWeight:600,marginBottom:"6px",fontFamily:T.f}}>📅 Prochaine · {fD(s.date)}</div>
      <div onClick={()=>setSel(s)} style={{background:`linear-gradient(160deg,${s.phaseColor}0C,${s.phaseColor}03)`,border:`1px solid ${s.phaseColor}18`,borderRadius:"14px",padding:"16px",cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
          <div style={{width:"34px",height:"34px",borderRadius:"9px",background:`${s.phaseColor}10`,color:s.phaseColor,display:"flex",alignItems:"center",justifyContent:"center"}}>{gI(s.type)}</div>
          <div><div style={{fontFamily:T.fh,fontSize:"15px",color:T.tx,letterSpacing:"0.5px"}}>{s.title}</div><div style={{color:T.dm,fontSize:"9px",fontFamily:T.f}}>{s.dur} min · S{s.week}</div></div>
        </div>
        <p style={{color:T.sf,fontSize:"11px",lineHeight:1.3,margin:"0 0 6px",fontFamily:T.f}}>{s.desc}</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>{iB(s.int,s.phaseColor)}<span style={{color:s.phaseColor,fontSize:"9px",fontWeight:600,fontFamily:T.f}}>Détail →</span></div>
      </div>
      {!comp[s.id]&&<button onClick={e=>{e.stopPropagation();toggle(s.id);}} style={{width:"100%",padding:"11px",borderRadius:"9px",border:"none",marginTop:"6px",background:`linear-gradient(135deg,${s.phaseColor},${s.phaseColor}BB)`,color:T.bg,fontFamily:T.fh,fontSize:"13px",letterSpacing:"1px",cursor:"pointer"}}>✓ TERMINÉE</button>}
    </>)}
  </div>);};

  // ─── PLAN ───
  const PlanV=()=>{const g={};plan.forEach(s=>{const k=s.week;if(!g[k])g[k]={ss:[],ph:s.phase,cl:s.phaseColor,lb:s.weekLabel};g[k].ss.push(s);});return(<div><XP/>{Object.entries(g).map(([wk,{ss,ph,cl,lb}])=>{const open=expW===+wk;const allD=ss.every(s=>comp[s.id]);const someD=ss.some(s=>comp[s.id]);return(<div key={wk} style={{marginBottom:"4px"}}>
    <div onClick={()=>setExpW(open?null:+wk)} style={{background:allD?`${cl}08`:T.cd,border:`1px solid ${allD?cl+"20":T.bd}`,borderRadius:open?"9px 9px 0 0":"9px",padding:"10px 12px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:"8px"}}><div style={{width:"26px",height:"26px",borderRadius:"6px",background:allD?`${cl}20`:someD?`${cl}0C`:"rgba(255,255,255,0.03)",color:allD?cl:someD?cl:T.dm,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontFamily:T.fh}}>{allD?<Ic.chk/>:wk}</div>
        <div><div style={{fontFamily:T.fh,fontSize:"12px",color:T.tx,letterSpacing:"0.5px"}}>SEM. {wk} — {lb}</div><div style={{fontSize:"8px",color:cl,fontFamily:T.f}}>{ph} · {ss.length}</div></div></div>
      <div style={{transform:open?"rotate(90deg)":"",transition:"transform .2s",color:T.dm}}><Ic.rt/></div>
    </div>
    {open&&<div style={{background:T.cd,border:`1px solid ${T.bd}`,borderTop:"none",borderRadius:"0 0 9px 9px",padding:"4px"}}>{ss.map(s=>(<div key={s.id} onClick={()=>setSel(s)} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px",borderRadius:"6px",cursor:"pointer",background:comp[s.id]?`${cl}04`:"transparent"}}>
      <div style={{width:"28px",height:"28px",borderRadius:"7px",background:comp[s.id]?`${cl}16`:"rgba(255,255,255,0.03)",color:comp[s.id]?cl:T.dm,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{comp[s.id]?<Ic.chk/>:gI(s.type)}</div>
      <div style={{flex:1}}><div style={{fontFamily:T.fh,fontSize:"11px",color:T.tx,opacity:comp[s.id]?.5:1,letterSpacing:"0.3px"}}>{s.title}</div><div style={{fontSize:"8px",color:T.dm,fontFamily:T.f}}>{fD(s.date)} · {s.dur}min</div></div>
      {RD[s.id]&&<span style={{fontSize:"7px",color:T.ac2,background:`${T.ac2}15`,padding:"1px 5px",borderRadius:"3px",fontFamily:T.f}}>DATA</span>}
      {iB(s.int,cl)}
    </div>))}</div>}
  </div>);})}</div>);};

  // ─── DETAIL ───
  const Detail=({s})=>{const done=comp[s.id];const f=fb[s.id];return(<div style={{animation:"fu .3s ease"}}>
    <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:T.dm,cursor:"pointer",display:"flex",alignItems:"center",gap:"4px",padding:0,marginBottom:"14px",fontFamily:T.f,fontSize:"12px"}}><Ic.bk/> Retour</button>
    <div style={{background:`linear-gradient(160deg,${s.phaseColor}0C,${s.phaseColor}03)`,border:`1px solid ${s.phaseColor}18`,borderRadius:"14px",padding:"18px",marginBottom:"10px"}}>
      <div style={{fontFamily:T.fh,fontSize:"10px",color:s.phaseColor,letterSpacing:"2px"}}>S{s.week} · {s.phase}</div>
      <h2 style={{margin:"4px 0 0",fontFamily:T.fh,fontSize:"20px",color:T.tx,letterSpacing:"1px"}}>{s.title}</h2>
      <div style={{display:"flex",gap:"10px",margin:"6px 0",color:T.sf,fontSize:"10px",fontFamily:T.f}}><span>{fDL(s.date)}</span><span>{s.dur} min</span></div>
      {iB(s.int,s.phaseColor)}
      <p style={{color:T.sf,lineHeight:1.45,margin:"8px 0 0",fontFamily:T.f,fontSize:"12px"}}>{s.desc}</p>
    </div>
    {RD[s.id]&&<RDCard sid={s.id}/>}
    <div style={{background:T.cd,borderRadius:"10px",padding:"16px",border:`1px solid ${T.bd}`,marginBottom:"8px"}}>
      <div style={{fontFamily:T.fh,fontSize:"12px",color:T.tx,letterSpacing:"1px",marginBottom:"8px"}}>PROGRAMME</div>
      {s.steps.map((st,i)=>(<div key={i} style={{display:"flex",gap:"7px",marginBottom:"7px"}}><div style={{minWidth:"20px",height:"20px",borderRadius:"5px",background:`${s.phaseColor}10`,color:s.phaseColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",fontFamily:T.fh}}>{i+1}</div><p style={{margin:0,color:T.sf,lineHeight:1.35,fontFamily:T.f,fontSize:"11px",paddingTop:"2px"}}>{st}</p></div>))}
    </div>
    {s.tip&&<div style={{background:"rgba(180,160,120,0.03)",border:`1px solid ${T.bd}`,borderRadius:"9px",padding:"10px",display:"flex",gap:"7px",marginBottom:"8px"}}><span style={{fontSize:"13px"}}>💡</span><p style={{margin:0,color:T.sf,lineHeight:1.35,fontFamily:T.f,fontSize:"10.5px"}}>{s.tip}</p></div>}
    {done&&<div style={{background:T.cd,borderRadius:"9px",padding:"12px",border:`1px solid ${T.bd}`,marginBottom:"8px"}}><div style={{fontFamily:T.fh,fontSize:"10px",color:T.tx,letterSpacing:"1px",marginBottom:"6px"}}>RESSENTI</div>
      <div style={{display:"flex",gap:"4px"}}>{[{v:1,l:"😎"},{v:2,l:"👍"},{v:3,l:"💪"},{v:4,l:"😤"},{v:5,l:"🥵"}].map(o=>(<button key={o.v} onClick={()=>setFbk(s.id,o.v)} style={{flex:1,padding:"7px",borderRadius:"6px",border:`1px solid ${f?.difficulty===o.v?s.phaseColor:T.bd}`,background:f?.difficulty===o.v?`${s.phaseColor}12`:"transparent",fontSize:"15px",cursor:"pointer"}}>{o.l}</button>))}</div></div>}
    <button onClick={()=>toggle(s.id)} style={{width:"100%",padding:"11px",borderRadius:"9px",border:done?`1px solid ${T.bd}`:"none",background:done?T.cd:`linear-gradient(135deg,${s.phaseColor},${s.phaseColor}BB)`,color:done?T.dm:T.bg,fontFamily:T.fh,fontSize:"13px",letterSpacing:"1px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}>{done?<><Ic.chk/> COMPLÉTÉE</>:"✓ TERMINÉE"}</button>
  </div>);};

  // ─── STATS ───
  const StatsV=()=>{const phs=[{n:"Adaptation",c:"#8B9D77",w:[1,2,3,4]},{n:"Construction",c:"#C9A96E",w:[5,6,7,8]},{n:"Spécifique",c:"#D4A853",w:[9,10,11]},{n:"Affûtage",c:"#A08060",w:[12,13,14]}];return(<div><XP/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"5px",marginBottom:"12px"}}>{[{l:"Séances",v:`${cc}/${tot}`,c:T.ac},{l:"Distance",v:`${totDist} km`,c:T.ac2},{l:"Minutes",v:totMin,c:"#C9A96E"},{l:"Progression",v:`${pct}%`,c:T.ac},{l:"Poids perdu",v:wl>0?`-${wl}kg`:"—",c:"#A08060"},{l:"Allure moy.",v:"6:55/km",c:"#D4A853"}].map((x,i)=>(<div key={i} style={{background:T.cd,borderRadius:"8px",padding:"10px 6px",border:`1px solid ${T.bd}`,textAlign:"center"}}><div style={{fontFamily:T.fh,fontSize:"17px",color:x.c,letterSpacing:"0.5px"}}>{x.v}</div><div style={{fontSize:"7px",color:T.dm,fontFamily:T.f,textTransform:"uppercase"}}>{x.l}</div></div>))}</div>
    {/* Pace evolution */}
    <div style={{background:T.cd,borderRadius:"10px",padding:"14px",border:`1px solid ${T.bd}`,marginBottom:"10px"}}>
      <div style={{fontFamily:T.fh,fontSize:"11px",color:T.tx,letterSpacing:"1px",marginBottom:"8px"}}>ÉVOLUTION DE L'ALLURE</div>
      <div style={{display:"flex",gap:"4px",alignItems:"flex-end"}}>
        {[{l:"S1 frac.",v:"6:45",pct:85},{l:"S2 frac.",v:"6:46",pct:84},{l:"Mar midi",v:"7:06",pct:75},{l:"Mar soir",v:"7:15",pct:72}].map((x,i)=>(<div key={i} style={{flex:1,textAlign:"center"}}><div style={{fontSize:"9px",color:T.ac,fontFamily:T.fh}}>{x.v}</div><div style={{height:`${x.pct*.5+10}px`,background:i<2?`${T.ac2}50`:`${T.ac}40`,borderRadius:"3px 3px 0 0",marginTop:"2px"}}/><div style={{fontSize:"6px",color:T.dm,fontFamily:T.f,marginTop:"2px"}}>{x.l}</div></div>))}
      </div>
      <p style={{margin:"8px 0 0",fontSize:"9px",color:T.sf,fontFamily:T.f,fontStyle:"italic"}}>Fractionné : 6:45/km → Continu : 7:06-7:15/km. Normal : l'allure continue est toujours plus lente que le fractionné.</p>
    </div>
    {phs.map(ph=>{const ps=plan.filter(s=>ph.w.includes(s.week));const pc=ps.filter(s=>comp[s.id]).length;const pp=ps.length>0?Math.round((pc/ps.length)*100):0;return(<div key={ph.n} style={{background:T.cd,borderRadius:"8px",padding:"12px",border:`1px solid ${T.bd}`,marginBottom:"4px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}><div style={{display:"flex",alignItems:"center",gap:"5px"}}><div style={{width:"5px",height:"5px",borderRadius:"50%",background:ph.c}}/><span style={{fontFamily:T.fh,fontSize:"11px",color:T.tx}}>{ph.n}</span></div><span style={{fontFamily:T.fh,fontSize:"11px",color:ph.c}}>{pp}%</span></div><div style={{height:"3px",borderRadius:"2px",background:"rgba(255,255,255,0.04)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"2px",background:ph.c,width:`${pp}%`}}/></div></div>);})}
    {/* Badges */}
    <div style={{fontFamily:T.fh,fontSize:"13px",color:T.tx,letterSpacing:"1px",margin:"12px 0 8px"}}>BADGES ({ub.length}/{BADGES.length})</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"4px"}}>{BADGES.map(b=>{const u=ub.includes(b.id);return(<div key={b.id} style={{background:u?`${T.ac}08`:T.cd,border:`1px solid ${u?T.ac+"20":T.bd}`,borderRadius:"10px",padding:"10px 6px",textAlign:"center",opacity:u?1:.35}}><div style={{fontSize:"24px",filter:u?"none":"grayscale(1)"}}>{b.icon}</div><div style={{fontFamily:T.fh,fontSize:"9px",color:u?T.tx:T.dm,marginTop:"2px"}}>{b.name}</div><div style={{fontSize:"7px",color:T.dm,fontFamily:T.f,lineHeight:1.2}}>{b.desc}</div>{u&&<div style={{fontSize:"8px",color:T.ac,fontFamily:T.fh,marginTop:"2px"}}>+{b.xp}XP</div>}</div>);})}</div>
  </div>);};

  // ─── NUTRITION ───
  const NutV=()=>{const nw=NUT[nutI];return(<div>
    <div style={{background:T.cd,borderRadius:"12px",padding:"14px",border:`1px solid ${T.bd}`,marginBottom:"10px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}><div><div style={{fontFamily:T.fh,fontSize:"13px",color:T.tx,letterSpacing:"1px"}}>SUIVI DU POIDS</div></div>
        <button onClick={()=>setShowWI(!showWI)} style={{background:`${T.ac2}12`,border:`1px solid ${T.ac2}25`,borderRadius:"6px",padding:"5px 8px",color:T.ac2,fontFamily:T.f,fontSize:"9px",fontWeight:600,cursor:"pointer"}}>+ Peser</button></div>
      {showWI&&<div style={{display:"flex",gap:"5px",marginBottom:"8px"}}><input type="number" step="0.1" value={wiV} onChange={e=>setWiV(e.target.value)} placeholder="112.5" style={{flex:1,background:"rgba(255,255,255,0.03)",border:`1px solid ${T.bd}`,borderRadius:"6px",padding:"7px 8px",color:T.tx,fontFamily:T.f,fontSize:"12px",outline:"none"}}/><button onClick={addW} style={{background:T.ac,border:"none",borderRadius:"6px",padding:"7px 12px",color:T.bg,fontFamily:T.fh,fontSize:"12px",cursor:"pointer"}}>OK</button></div>}
      {wLog.length>0?(<div><div style={{height:"55px",display:"flex",alignItems:"flex-end",gap:"2px"}}>{wLog.slice(-12).map((w,i,a)=>{const mn=Math.min(...a.map(x=>x.weight))-2;const mx=Math.max(...a.map(x=>x.weight))+2;const h=((w.weight-mn)/(mx-mn))*45+8;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"1px"}}><span style={{fontSize:"7px",color:T.dm}}>{w.weight}</span><div style={{width:"100%",height:`${h}px`,borderRadius:"2px 2px 0 0",background:i===a.length-1?T.ac2:`${T.ac2}35`}}/></div>);})}</div></div>):(<p style={{color:T.dm,fontSize:"10px",fontFamily:T.f,textAlign:"center"}}>Note ton poids !</p>)}
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px"}}><button onClick={()=>setNutI(Math.max(0,nutI-1))} disabled={nutI===0} style={{background:"none",border:"none",color:nutI===0?T.dm:T.sf,cursor:"pointer"}}><Ic.bk/></button><div style={{textAlign:"center"}}><div style={{fontFamily:T.fh,fontSize:"14px",color:T.tx,letterSpacing:"1px"}}>SEM. {nw.wk}</div><div style={{fontSize:"8px",color:nw.cl,fontFamily:T.f}}>{nw.ph}</div></div><button onClick={()=>setNutI(Math.min(NUT.length-1,nutI+1))} disabled={nutI===NUT.length-1} style={{background:"none",border:"none",color:nutI===NUT.length-1?T.dm:T.sf,cursor:"pointer"}}><Ic.rt/></button></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"4px",marginBottom:"8px"}}>{[{l:"Cal",v:nw.cal,c:nw.cl},{l:"Prot",v:nw.pr,c:"#C45B4A"},{l:"Gluc",v:nw.ca,c:"#D4A853"},{l:"Lip",v:nw.fa,c:"#8B9D77"}].map((m,i)=>(<div key={i} style={{background:`${m.c}06`,borderRadius:"7px",padding:"7px 3px",textAlign:"center",border:`1px solid ${m.c}10`}}><div style={{fontSize:"14px",fontFamily:T.fh,color:m.c}}>{m.v}</div><div style={{fontSize:"7px",color:T.dm,fontFamily:T.f}}>{m.l}</div></div>))}</div>
    {nw.ms.map((m,i)=>(<div key={i} style={{background:T.cd,borderRadius:"9px",padding:"12px",border:`1px solid ${T.bd}`,marginBottom:"4px"}}><div style={{fontFamily:T.fh,fontSize:"11px",color:T.tx,letterSpacing:"0.5px",marginBottom:"4px"}}>{m.t} <span style={{color:nw.cl,fontSize:"9px"}}>{m.cal}kcal</span></div>{m.it.map((it,j)=>(<div key={j} style={{display:"flex",gap:"5px",marginBottom:"2px"}}><div style={{width:"3px",height:"3px",borderRadius:"50%",background:nw.cl,marginTop:"5px",opacity:.3}}/><span style={{color:T.sf,fontSize:"10.5px",lineHeight:1.35,fontFamily:T.f}}>{it}</span></div>))}</div>))}
    <div style={{background:"rgba(180,160,120,0.03)",border:`1px solid ${T.bd}`,borderRadius:"8px",padding:"10px",marginTop:"3px"}}>{nw.tp.map((t,i)=>(<div key={i} style={{display:"flex",gap:"4px",marginBottom:"2px"}}><span style={{color:T.ac,fontSize:"8px"}}>•</span><span style={{color:T.sf,fontSize:"10px",lineHeight:1.3,fontFamily:T.f}}>{t}</span></div>))}</div>
  </div>);};

  return(<div style={{background:T.bg,color:T.tx,fontFamily:T.f,minHeight:"100vh",maxWidth:"480px",margin:"0 auto",padding:"0 12px 84px",position:"relative"}}>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
    <style>{`@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes sd{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes pop{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}select option{background:#242218;color:#e8e0d0}input::placeholder{color:#706850}::-webkit-scrollbar{width:0}`}</style>
    <div style={{position:"fixed",inset:0,pointerEvents:"none",opacity:.02,backgroundImage:"url(data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E)",backgroundSize:"150px",zIndex:0}}/>
    <BadgePopup2/><Toast2/>
    <div style={{position:"relative",zIndex:1}}>
      <div style={{padding:"14px 0 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h1 style={{margin:0,fontFamily:T.fh,fontSize:"20px",letterSpacing:"2px",color:T.tx}}>RUN<span style={{color:T.ac}}>BACK</span></h1><p style={{margin:0,fontFamily:T.fh,fontSize:"8px",color:T.dm,letterSpacing:"3px"}}>CANADIAN RACE · VIMY-LORETTE</p></div>
        <div style={{display:"flex",gap:"4px",alignItems:"center"}}>{nOn&&<div style={{width:"5px",height:"5px",borderRadius:"50%",background:T.ac2,animation:"pulse 2s infinite"}}/>}<button onClick={()=>setShowN(true)} style={{background:nOn?`${T.ac2}10`:T.cd,border:`1px solid ${nOn?T.ac2+"28":T.bd}`,borderRadius:"7px",padding:"6px",color:nOn?T.ac2:T.dm,cursor:"pointer"}}><Ic.bell/></button></div></div>
      <div style={{animation:"fu .3s ease"}}>{sel?<Detail s={sel}/>:view==="today"?<TodayV/>:view==="plan"?<PlanV/>:view==="nutrition"?<NutV/>:<StatsV/>}</div>
    </div>
    {!sel&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(26,24,16,.94)",backdropFilter:"blur(12px)",borderTop:`1px solid ${T.bd}`,display:"flex",justifyContent:"center",padding:"3px 0 12px",zIndex:50}}>{[{id:"today",l:"Aujourd'hui",e:"🎗️"},{id:"plan",l:"Plan",e:"📋"},{id:"nutrition",l:"Nutrition",e:"🥗"},{id:"stats",l:"Stats",e:"📊"}].map(t=>(<button key={t.id} onClick={()=>setView(t.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"1px",padding:"4px 14px",color:view===t.id?T.ac:T.dm}}><span style={{fontSize:"15px"}}>{t.e}</span><span style={{fontSize:"8px",fontWeight:view===t.id?700:400,fontFamily:T.f}}>{t.l}</span></button>))}</div>}
    {showN&&<><div onClick={()=>setShowN(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:99}}/><div style={{position:"fixed",bottom:0,left:0,right:0,maxHeight:"70vh",overflowY:"auto",background:T.bg,borderTop:`1px solid ${T.bd}`,borderRadius:"14px 14px 0 0",padding:"16px",zIndex:100,animation:"fu .25s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}><span style={{fontFamily:T.fh,color:T.tx,fontSize:"14px",letterSpacing:"1px"}}>🔔 NOTIFICATIONS</span><button onClick={()=>setShowN(false)} style={{background:"none",border:"none",color:T.dm,cursor:"pointer"}}><Ic.x/></button></div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:nOn?`${T.ac2}08`:T.cd,borderRadius:"9px",padding:"10px 12px",border:`1px solid ${nOn?T.ac2+"20":T.bd}`,marginBottom:"10px"}}><div style={{fontFamily:T.fh,fontSize:"11px",color:T.tx,letterSpacing:"1px"}}>ACTIVER</div><div onClick={async()=>{if(!nOn&&"Notification"in window){const p=await Notification.requestPermission();if(p!=="granted")return;}setNOn(!nOn);}} style={{width:"40px",height:"22px",borderRadius:"11px",background:nOn?T.ac2:"rgba(255,255,255,0.08)",cursor:"pointer",position:"relative"}}><div style={{width:"16px",height:"16px",borderRadius:"50%",background:"#fff",position:"absolute",top:"3px",left:nOn?"21px":"3px",transition:"left .2s"}}/></div></div>
      {nOn&&<>{[{l:"☀️ Matin",on:nM,set:setNM},{l:"⏰ 1h avant",on:nB,set:setNB},{l:"🌙 Soir",on:nE,set:setNE}].map((x,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.cd,borderRadius:"7px",padding:"8px 10px",border:`1px solid ${T.bd}`,marginBottom:"4px"}}><span style={{fontFamily:T.f,fontSize:"11px",color:T.tx}}>{x.l}</span><div onClick={()=>x.set(!x.on)} style={{width:"36px",height:"18px",borderRadius:"9px",background:x.on?T.ac2:"rgba(255,255,255,0.08)",cursor:"pointer",position:"relative"}}><div style={{width:"12px",height:"12px",borderRadius:"50%",background:"#fff",position:"absolute",top:"3px",left:x.on?"21px":"3px",transition:"left .2s"}}/></div></div>))}
        <button onClick={()=>sendN("🔔","Notifications OK !",T.ac,"✅")} style={{width:"100%",padding:"9px",borderRadius:"7px",border:`1px solid ${T.ac}20`,background:`${T.ac}06`,color:T.ac,fontFamily:T.fh,fontSize:"11px",letterSpacing:"1px",cursor:"pointer",marginTop:"6px"}}>TESTER</button>
      </>}
    </div></>}
  </div>);
}
