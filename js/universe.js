/* ============================================
   THE ROYAL ORDER OF THE DARK FORCE OF MATTER
   Universe Engine — Shared JS
   ============================================ */

(function(UNIVERSE) {

  /* ---------- DATA ---------- */
  UNIVERSE.MEMBERS = [
    { id:"m1", name:"Archon",  role:"Founder",    color:"#a06de0", initials:"AR" },
    { id:"m2", name:"Valen",   role:"Researcher", color:"#4fa8e0", initials:"VL" },
    { id:"m3", name:"Sera",    role:"Builder",    color:"#e06d8a", initials:"SR" },
    { id:"m4", name:"Oryn",    role:"Archivist",  color:"#4de0b0", initials:"OY" }
  ];

  UNIVERSE.PLANETS = [
    {
      id:"heritage", name:"Heritage",
      desc:"Genealogy, ancestry & civil records",
      color:"#7b5ea7", glow:"#a07fd0",
      angle:25,  orbitR:115,
      contributors:["m1","m4"],
      lastActivity: daysAgo(3),
      subUrl:"heritage/index.html",
      subProjects: [
        { name: "Inventory HUD", url: "/projects/hud" },
        { name: "Supply Crates", url: "/projects/crates" },      ]
    },
    {
      id:"knowledge", name:"Knowledge",
      desc:"Wiki, library & doctrine",
      color:"#3a7abf", glow:"#5da0e8",
      angle:100, orbitR:152,
      contributors:["m1","m2","m4"],
      lastActivity: daysAgo(1),
      subUrl:"knowledge/index.html",
      subProjects: [
        { name: "Inventory HUD", url: "/projects/hud" },
        { name: "Supply Crates", url: "/projects/crates" }
      ]
    },
    {
      id:"games", name:"Games",
      desc:"ZeroDominus, chess & strategy",
      color:"#bf5a3a", glow:"#e07850",
      angle:185, orbitR:132,
      contributors:["m1","m3"],
      lastActivity: daysAgo(12),
      subUrl:"games/index.html",
      subProjects: [
        { name: "Inventory HUD", url: "/projects/hud" },
        { name: "Supply Crates", url: "/projects/crates" }
      ]
    },
    {
      id:"research", name:"Research",
      desc:"AI, consciousness & philosophy",
      color:"#3a9e7a", glow:"#55c99a",
      angle:265, orbitR:168,
      contributors:["m2","m3"],
      lastActivity: daysAgo(7),
      subUrl:"research/index.html",
      subProjects: [
        { name: "Inventory HUD", url: "/projects/hud" },
        { name: "Supply Crates", url: "/projects/crates" }
      ]
    },
    {
      id:"education", name:"Education",
      desc:"Learning systems & curriculum",
      color:"#888070", glow:"#aaa090",
      angle:335, orbitR:108,
      contributors:["m4"],
      lastActivity: daysAgo(45),
      subUrl:"education/index.html", 
      subProjects: [
        { name: "Inventory HUD", url: "/projects/hud" },
        { name: "Supply Crates", url: "/projects/crates" }
      ]
    }
  ];

  function daysAgo(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  }

  /* ---------- DATA STORE ----------
     Placeholder persistence using localStorage so the site is fully
     functional with no backend. Swap these functions out for real
     API calls (PHP/Node/database) when you add a server.
  ---------------------------------- */
  var STORE_KEYS = {
    MEMBERS: "trotdfm_members",
    COMETS:  "trotdfm_comets"
  };

  function readStore(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }
  function writeStore(key, arr) {
    try { localStorage.setItem(key, JSON.stringify(arr)); } catch(e) {}
  }

  UNIVERSE.getPendingMembers = function() { return readStore(STORE_KEYS.MEMBERS); };
  UNIVERSE.addPendingMember = function(member) {
    var list = readStore(STORE_KEYS.MEMBERS);
    member.id = "applicant_" + Date.now();
    member.status = "pending";
    member.submittedAt = new Date().toISOString();
    list.push(member);
    writeStore(STORE_KEYS.MEMBERS, list);
    return member;
  };
  UNIVERSE.updateMemberStatus = function(id, status) {
    var list = readStore(STORE_KEYS.MEMBERS);
    list = list.map(function(m){ if (m.id === id) m.status = status; return m; });
    writeStore(STORE_KEYS.MEMBERS, list);
  };

  UNIVERSE.getComets = function() { return readStore(STORE_KEYS.COMETS); };
  UNIVERSE.getApprovedComets = function() {
    return readStore(STORE_KEYS.COMETS).filter(function(c){ return c.status === "approved"; });
  };
  UNIVERSE.addComet = function(comet) {
    var list = readStore(STORE_KEYS.COMETS);
    comet.id = "comet_" + Date.now();
    comet.status = "pending";
    comet.submittedAt = new Date().toISOString();
    comet.angle = Math.floor(Math.random() * 360);
    comet.orbitR = 220 + Math.floor(Math.random() * 60);
    list.push(comet);
    writeStore(STORE_KEYS.COMETS, list);
    return comet;
  };
  UNIVERSE.updateCometStatus = function(id, status) {
    var list = readStore(STORE_KEYS.COMETS);
    list = list.map(function(c){ if (c.id === id) c.status = status; return c; });
    writeStore(STORE_KEYS.COMETS, list);
  };

  /* ---------- PLANET SIZE (Eye formula — activity-based) ---------- */
  UNIVERSE.planetRadius = function(planet) {
    var base = 18;
    var days = Math.floor((new Date() - planet.lastActivity) / 86400000);
    var bonus = days < 7  ? 12 :
                days < 30 ? 7  :
                days < 90 ? 3  : 0;
    return base + bonus;
  };

  /* ---------- ACTIVITY COLOR ---------- */
  UNIVERSE.activityColor = function(planet) {
    var days = Math.floor((new Date() - planet.lastActivity) / 86400000);
    return days < 7  ? "#4fc97a" :
           days < 30 ? "#c0a83a" : "#444060";
  };

  /* ---------- STAR FIELD ---------- */
  UNIVERSE.drawStars = function(canvas) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < 260; i++) {
      var x = seeded(i * 7.31 + 1) * canvas.width;
      var y = seeded(i * 3.71 + 2) * canvas.height;
      var r = seeded(i * 1.13) * 1.2 + 0.15;
      var a = seeded(i * 5.93) * 0.55 + 0.08;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + a.toFixed(2) + ")";
      ctx.fill();
    }
    /* faint nebula smear near center */
    var grd = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, 20,
      canvas.width/2, canvas.height/2, canvas.width * 0.38
    );
    grd.addColorStop(0,   "rgba(60,20,100,0.18)");
    grd.addColorStop(0.5, "rgba(30,10,60,0.07)");
    grd.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  function seeded(s) {
    var x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  }

  /* ---------- WORMHOLE DRAW ---------- */
  UNIVERSE.drawWormhole = function(ctx, t) {
    var W = 120, H = 120, cx = 60, cy = 60;
    ctx.clearRect(0, 0, W, H);

    /* outer gravitational pull rings */
    var pulls = [
      {r:56, a:0.04}, {r:50, a:0.06}, {r:44, a:0.09},
      {r:37, a:0.13}, {r:29, a:0.17}, {r:21, a:0.22},
      {r:13, a:0.28}, {r:7,  a:0.35}
    ];
    pulls.forEach(function(p, i) {
      var rot = t * (i % 2 === 0 ? 0.9 : -0.7) + i * 0.4;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.32, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i < 4 ? "#1a0930" : "#110620";
      ctx.lineWidth   = 2.5 - i * 0.15;
      ctx.globalAlpha = p.a;
      ctx.stroke();
      ctx.restore();
    });

    /* inner void */
    var inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
    inner.addColorStop(0,   "#010007");
    inner.addColorStop(0.6, "#04010e");
    inner.addColorStop(1,   "rgba(4,1,14,0)");
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = inner;
    ctx.fill();

    /* deep purple accretion shimmer */
    var shimmer = ctx.createRadialGradient(cx, cy, 5, cx, cy, 40);
    shimmer.addColorStop(0,   "rgba(80,20,140,0.22)");
    shimmer.addColorStop(0.4, "rgba(40,10,80,0.10)");
    shimmer.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = shimmer;
    ctx.fill();
  };

  /* ---------- INIT WORMHOLE CANVAS ---------- */
  UNIVERSE.initWormhole = function(wrapEl) {
    var c = document.createElement("canvas");
    c.width = 120; c.height = 120;
    c.style.cssText = "display:block;transform:translate(-50%,-50%);";
    wrapEl.appendChild(c);
    return c.getContext("2d");
  };

})(window.UNIVERSE = window.UNIVERSE || {});
