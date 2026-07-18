/* ============================================
   THE ROYAL ORDER OF THE DARK FORCE OF MATTER
   Universe Engine — Shared JS
   ============================================ */

(function(UNIVERSE) {

  // 🌍 REPLACE THIS LINK WITH YOUR LIVE RAILWAY BACKEND LINK (No trailing slash)
  var BACKEND_URL = "https://trotdfm-backend-production.up.railway.app"; 

  /* ---------- DATA ---------- */
  UNIVERSE.MEMBERS = [
    { id:"m1", name:"Archon",  role:"Founder",    color:"#a06de0", initials:"AR" },
    { id:"m2", name:"Valen",   role:"Researcher", color:"#4fa8e0", initials:"VL" },
    { id:"m3", name:"Sera",    role:"Builder",    color:"#e06d8a", initials:"SR" },
    { id:"m4", name:"Oryn",    role:"Archivist",  color:"#4de0b0", initials:"OY" }
  ];

  // This will get overwritten automatically when data arrives from Supabase!
  UNIVERSE.PLANETS = []; 

  function daysAgo(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  }

  /* ---------- REAL DATABASE API CALLS ---------- */
  
  // 1. Fetch live planets data from your backend
UNIVERSE.loadPlanetsFromServer = function(callback) {
    fetch(BACKEND_URL + '/api/planets')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var list = Array.isArray(data) ? data : (data.planets || []);
        UNIVERSE.PLANETS = list.map(function(p) {
          p.lastActivity = p.lastActivity ? new Date(p.lastActivity) : new Date(Date.now() - 1000*60*60*24*120);
          return p;
        });
        if (callback) callback(UNIVERSE.PLANETS);
      })
      .catch(function(err) { console.error("Error loading planets:", err); });
  };
  // 2. Fetch live comets currently in orbit
  UNIVERSE.getApprovedComets = function() {
    return fetch(BACKEND_URL + '/api/comets/approved')
      .then(function(res) { return res.json(); })
      .catch(function(err) { 
        console.error("Error loading comets:", err); 
        return [];
      });
  };

  // 3. Submit a new join application
  UNIVERSE.addPendingMember = function(member) {
    return fetch(BACKEND_URL + '/api/members/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    })
    .then(function(res) {
      if (!res.ok) throw new Error("Registration submission failed");
      return res.json();
    });
  };

  // 4. Submit a new world comet proposal
  UNIVERSE.addComet = function(comet) {
    return fetch(BACKEND_URL + '/api/comets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comet)
    })
    .then(function(res) {
      if (!res.ok) throw new Error("Comet submission failed");
      return res.json();
    });
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
/* ---- START ---- */
  UNIVERSE._STATIC_PLANETS = [];
  loadLiveData();
  window.addEventListener("resize", resize);
  raf = requestAnimationFrame(tick);
