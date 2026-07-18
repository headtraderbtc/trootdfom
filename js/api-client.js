/* ============================================================
   THE ORDER — API CLIENT
   Talks to the Railway backend. Set API_BASE to your deployed
   backend URL before going live.
   ============================================================ */

(function(UNIVERSE) {

  UNIVERSE.API_BASE = "https://trotdfm-backend-production.up.railway.app"; // <-- set this after deploying

  async function apiRequest(path, options) {
    options = options || {};
    options.credentials = "include"; // sends/receives the session cookie
    options.headers = Object.assign(
      { "Content-Type": "application/json" },
      options.headers || {}
    );
    if (options.body && typeof options.body !== "string") {
      options.body = JSON.stringify(options.body);
    }
    var res = await fetch(UNIVERSE.API_BASE + path, options);
    var data = null;
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) {
      var err = new Error((data && data.error) || ("Request failed: " + res.status));
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  UNIVERSE.api = {
    /* ---- members ---- */
    applyForMembership: function(payload) {
      return apiRequest("/api/members/apply", { method: "POST", body: payload });
    },
    login: function(email, password) {
      return apiRequest("/api/members/login", { method: "POST", body: { email: email, password: password } });
    },
    logout: function() {
      return apiRequest("/api/members/logout", { method: "POST" });
    },
    me: function() {
      return apiRequest("/api/members/me");
    },
    pendingMembers: function() {
      return apiRequest("/api/members/pending");
    },
    memberDecision: function(id, approved) {
      return apiRequest("/api/members/" + id + "/decision", { method: "POST", body: { approved: approved } });
    },
    leaderboard: function() {
      return apiRequest("/api/members/leaderboard");
    },
    myContributions: function(id) {
      return apiRequest("/api/members/" + id + "/contributions");
    },

    /* ---- comets ---- */
    proposeComet: function(payload) {
      return apiRequest("/api/comets", { method: "POST", body: payload });
    },
    approvedComets: function() {
      return apiRequest("/api/comets/approved");
    },
    allComets: function() {
      return apiRequest("/api/comets");
    },
    cometDecision: function(id, approved) {
      return apiRequest("/api/comets/" + id + "/decision", { method: "POST", body: { approved: approved } });
    },

    /* ---- planets ---- */
    planets: function() {
      return apiRequest("/api/planets");
    }
  };

})(window.UNIVERSE = window.UNIVERSE || {});
