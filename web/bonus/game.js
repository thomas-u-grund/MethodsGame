// Course bonus points, the game's side (ROADMAP 8-BONUS). Only active when the game was opened through
// an instructor's course link (?course=CODE) and bonus/config.js points at the service. Then a finished
// act that still has an open deadline gets a "Claim your bonus point" button on the campus map (and at
// the end, in the Office), which opens the claim page with a one-time key made on this device.
(function(){
  var CFG = window.CB_BONUS || {}, LS = window.localStorage;
  window.CODEBOOK_BONUS_BADGE = function(){};
  window.CODEBOOK_BONUS_CLAIMABLE = function(){ return []; };
  if (!CFG.url || !CFG.anonKey) return;
  var code = null;
  try {
    var q = new URLSearchParams(location.search).get('course');
    if (q && /^[A-Za-z0-9]{4,16}$/.test(q)) LS.setItem('cb_course', q.toUpperCase());
    code = LS.getItem('cb_course');
  } catch(e){}
  if (!code) return;
  var course = null;
  try { course = JSON.parse(LS.getItem('cb_course_info') || 'null'); if (course && course.code !== code) course = null; } catch(e){}
  fetch(CFG.url + '/rest/v1/rpc/course_public', { method:'POST',
    headers:{ apikey: CFG.anonKey, Authorization: 'Bearer ' + CFG.anonKey, 'content-type': 'application/json' },
    body: JSON.stringify({ p_code: code }) })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(c){ if (c && c.code){ course = c; try { LS.setItem('cb_course_info', JSON.stringify(c)); } catch(e){} } })
    .catch(function(){});   // offline: the cached course is good enough to show the button

  // when each act counts as finished (the same flags the game's gates use)
  var DONE = { '1':'corridorDone', '2':'slipSealed', '3':'actIIIDone', '4':'actIVDone', '5':'submitted', end:'submitted' };
  var NAME = { '1':'Act I', '2':'Act II', '3':'Act III', '4':'Act IV', '5':'Act V', end:'the game' };
  function flags(){ try { return (JSON.parse(LS.getItem('codebook_save_v1') || '{}').flags) || {}; } catch(e){ return {}; } }
  function claimed(a){ try { return !!LS.getItem('cb_claimed_' + code + '_' + a); } catch(e){ return false; } }
  function key(a){
    var k = 'cb_claimkey_' + code + '_' + a, v = null;
    try { v = LS.getItem(k); } catch(e){}
    if (!v){
      var b = new Uint8Array(16); crypto.getRandomValues(b);
      v = Array.prototype.map.call(b, function(x){ return ('0' + x.toString(16)).slice(-2); }).join('');
      try { LS.setItem(k, v); } catch(e){}
    }
    return v;
  }
  function url(a){ return 'bonus/claim.html?course=' + encodeURIComponent(code) + '&act=' + a + '&key=' + key(a); }
  function claimable(){
    if (!course) return [];
    var f = flags(), today = new Date().toISOString().slice(0, 10);
    return Object.keys(course.deadlines || {}).filter(function(a){
      return DONE[a] && f[DONE[a]] && course.deadlines[a] >= today && !claimed(a); });
  }
  window.CODEBOOK_BONUS_CLAIMABLE = claimable;
  window.CODEBOOK_BONUS_URL = url;
  window.CODEBOOK_BONUS_LABEL = function(a){ return 'Claim your bonus point for ' + NAME[a]; };

  var st = document.createElement('style');
  st.textContent = '.cb-bonus{position:absolute;left:1.6%;bottom:3%;z-index:30;display:flex;flex-direction:column;gap:6px;align-items:flex-start;}' +
    '.cb-bonus a{font:700 clamp(10px,1vw,14px)/1 "JetBrains Mono",monospace;letter-spacing:.06em;text-decoration:none;color:#2a1a08;' +
    'background:linear-gradient(#f5d77a,#d9a441);border:1px solid #8a5a14;border-radius:99px;padding:.7em 1.1em;box-shadow:0 4px 14px rgba(0,0,0,.45);}' +
    '.cb-bonus a:hover{filter:brightness(1.08);} .cb-bonus small{font:600 11px "Source Sans 3",sans-serif;color:#fff;text-shadow:0 1px 3px #000;padding-left:.6em;}';
  document.head.appendChild(st);
  window.CODEBOOK_BONUS_BADGE = function(host){
    var list = claimable(); if (!list.length || !host) return;
    var d = document.createElement('div'); d.className = 'cb-bonus';
    d.innerHTML = list.map(function(a){
      return '<a href="' + url(a) + '" target="_blank" rel="noopener">&#127891; ' + window.CODEBOOK_BONUS_LABEL(a) + '</a>'; }).join('') +
      '<small>' + String(course.course_name).replace(/</g, '&lt;') + ' &middot; by ' + course.deadlines[list[0]] + '</small>';
    host.appendChild(d);
  };
})();
