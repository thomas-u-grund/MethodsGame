// Anonymous play statistics (STATS.md). Records which rooms are visited, which flags are set, which things are
// clicked, which dialogue choices are taken and when hints are asked for. No names, no emails, no student numbers.
// The session id lives only in memory (nothing is written to the device except the player's yes/no choice).
(function(){
  var CFG = window.CB_STATS || {}, LS = null;
  try { LS = window.localStorage; } catch(e){}
  window.CODEBOOK_LOG = function(){};
  window.CODEBOOK_STATS = null;   // set below when statistics are enabled; the Settings panel shows its switch only then
  if (!CFG.enabled || !window.fetch) return;
  function pref(){ try { return LS.getItem('cb_stats'); } catch(e){ return null; } }
  var optin = CFG.consent === 'optin';
  var browserSaysNo = navigator.doNotTrack === '1' || !!navigator.globalPrivacyControl;
  var on = !browserSaysNo && pref() !== '0' && (optin ? pref() === '1' : true);
  window.CODEBOOK_STATS = {
    get: function(){ return on; },
    browserSaysNo: browserSaysNo,
    set: function(yes){
      if (browserSaysNo) return;
      try { LS.setItem('cb_stats', yes ? '1' : '0'); LS.setItem('cb_stats_seen', '1'); } catch(e){}
      var was = on; on = !!yes;
      if (!on) queue.length = 0; else if (!was) startAll();
      var n = document.querySelector('[data-stats-notice]'); if (n) n.remove();
    }
  };
  if (browserSaysNo) return;
  addEventListener('storage', function(e){   // the privacy page, or another tab, changed the choice
    if (e.key !== 'cb_stats') return;
    var was = on; on = e.newValue === '1' || (e.newValue == null && !optin);
    if (!on) queue.length = 0; else if (!was) startAll();
  });

  var t0 = Date.now(), queue = [], timer = 0, curRoom = null, roomAt = 0, sid = '';
  (function(){ var b = new Uint8Array(8); crypto.getRandomValues(b); b.forEach(function(x){ sid += ('0' + x.toString(16)).slice(-2); }); })();
  function cut(s, n){ return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/&[a-z]+;|&#\d+;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n || 80); }

  function log(kind, a, b, c){
    if (!on) return;
    queue.push({ t: Date.now() - t0, k: kind, a: cut(a, 60), b: cut(b, 120), c: cut(c, 300) });
    if (queue.length >= 25) flush(); else if (!timer) timer = setTimeout(flush, 15000);
  }
  function flush(final){
    clearTimeout(timer); timer = 0;
    if (!queue.length) return;
    var payload = JSON.stringify({ s: sid, v: 1, e: queue.splice(0, 60) });
    try {
      if (final && navigator.sendBeacon) { navigator.sendBeacon(CFG.api + '/stats', new Blob([payload], { type: 'text/plain' })); return; }
      fetch(CFG.api + '/stats', { method: 'POST', body: payload, keepalive: true, headers: { 'content-type': 'text/plain' } }).catch(function(){});
    } catch(e){}
    if (queue.length) timer = setTimeout(flush, 1000);
  }
  function leaveRoom(){
    if (curRoom){ log('map', curRoom, Math.round((Date.now() - roomAt) / 1000)); curRoom = null; }
  }

  // called from the game's own code (enterRoom, showMap, setFlag, the hotspot handler)
  window.CODEBOOK_LOG = function(kind, a, b, c){
    try {
      if (kind === 'enter'){ leaveRoom(); curRoom = a; roomAt = Date.now(); }
      else if (kind === 'map'){ leaveRoom(); return; }
      log(kind, a, b, c);
    } catch(e){}
  };

  function start(){
    var save = null, flags = 0;
    try { save = JSON.parse(LS.getItem('codebook_save_v1') || 'null'); flags = save && save.flags ? Object.keys(save.flags).length : 0; } catch(e){}
    log('start', '', '', JSON.stringify({
      w: Math.round(innerWidth / 100) * 100, h: Math.round(innerHeight / 100) * 100,
      touch: ('ontouchstart' in window) ? 1 : 0,
      ctl: (function(){ try { return LS.getItem('cb_controls') || 'default'; } catch(e){ return ''; } })(),
      vo: (function(){ try { return LS.getItem('cb_voiceonly') || '0'; } catch(e){ return ''; } })(),
      resumed: flags > 1 ? 1 : 0, flags: flags,
      course: (function(){ try { return LS.getItem('cb_course') ? 1 : 0; } catch(e){ return 0; } })()   // 1 = opened through a course link; the code itself is not recorded
    }));
  }
  function startAll(){ start(); if (window.CODEBOOK_CUR_ROOM) window.CODEBOOK_LOG('enter', window.CODEBOOK_CUR_ROOM); }

  // dialogue choices: one delegated listener, so no room needs to know about it
  document.addEventListener('click', function(ev){
    var b = ev.target && ev.target.closest && ev.target.closest('button.choice');
    if (b) log('choice', window.CODEBOOK_CUR_ROOM || '', b.textContent);
  }, true);

  // hints: the two levels of "What should I do next?"
  if (typeof window.CODEBOOK_NEXT_HINT === 'function'){
    var hint = window.CODEBOOK_NEXT_HINT;
    window.CODEBOOK_NEXT_HINT = function(level){ log('hint', level, window.CODEBOOK_CUR_ROOM || 'map'); return hint.apply(this, arguments); };
  }

  // recap slides and the ending appear as elements; watch for them
  new MutationObserver(function(muts){
    muts.forEach(function(m){ m.addedNodes.forEach(function(n){
      if (n.nodeType !== 1) return;
      var r = n.classList && n.classList.contains('il-recap') ? n : n.querySelector && n.querySelector('.il-recap');
      if (r) log('recap', r.firstElementChild ? r.firstElementChild.textContent : '');
      if (n.id === 'cbTheEnd') log('end');
    }); });
  }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'hidden'){ log('hide', curRoom || 'map'); flush(true); } else log('show', curRoom || 'map');
  });
  addEventListener('pagehide', function(){ leaveRoom(); flush(true); });

  // the notice: once, small, never over the play area for long
  function notice(){
    var seen = null; try { seen = LS.getItem('cb_stats_seen'); } catch(e){}
    if (seen || pref() !== null) return;
    var d = document.createElement('div'); d.setAttribute('data-stats-notice', '1');
    d.style.cssText = 'position:fixed;left:12px;bottom:12px;max-width:min(360px,calc(100vw - 24px));z-index:99999;background:rgba(14,10,5,.94);' +
      'color:#F0E4C8;border:1px solid #c9a34a;border-radius:6px;padding:10px 12px;font:13px/1.4 Fraunces,Georgia,serif;box-shadow:0 8px 24px rgba(0,0,0,.5)';
    d.innerHTML = (optin ? 'May this game record anonymous play statistics (which rooms you visit and where you get stuck)? ' :
      'This game records anonymous play statistics (which rooms you visit and where you get stuck). ') +
      'No name, email or IP address is kept. <a href="privacy.html" target="_blank" rel="noopener" style="color:#e0b458">Details</a><br>' +
      '<button data-y style="margin:8px 8px 0 0;padding:3px 10px;cursor:pointer">' + (optin ? 'Yes, record' : 'OK') + '</button>' +
      '<button data-n style="padding:3px 10px;cursor:pointer">' + (optin ? 'No thanks' : 'No thanks') + '</button>';
    function done(yes){ window.CODEBOOK_STATS.set(yes); try { LS.setItem('cb_stats_seen', '1'); } catch(e){} d.remove(); }
    d.querySelector('[data-y]').onclick = function(){ done(true); };
    d.querySelector('[data-n]').onclick = function(){ done(false); };
    document.body.appendChild(d);
  }
  // no notice box when the config says notice:false (author, 2026-10-05: "remove the notice about data collection");
  // the Settings switch and privacy.html still let players turn it off
  if (CFG.notice !== false){ if (document.body) notice(); else addEventListener('DOMContentLoaded', notice); }
  if (on) startAll();
})();
