// The completion code (author, 2026-10-07: "the game finishes with some sort of code ... checked when claiming
// ... one-use only"). The server watches a game being played, without knowing whose it is: a random play id
// (cb_run, made by the server), and a checkpoint each time an act is finished. At the end it issues a code
// only to a play id that reached Act V after earlier acts; the claim page accepts each code once.
(function(){
  var CFG = window.CB_BONUS || {}, LS = null;
  try { LS = window.localStorage; } catch(e){}
  window.CODEBOOK_RUN_CODE = function(){ return Promise.reject(new Error('off')); };
  if (!CFG.enabled || !LS || !window.fetch) return;
  // when each act counts as finished (the flags the game's gates use)
  var ACT_FLAGS = { '1': ['corridorDone'], '2': ['slipSealed', 'actIIDone'], '3': ['actIIIDone'], '4': ['actIVDone'], '5': ['submitted', 'actVDone'] };
  function get(k){ try { return LS.getItem(k); } catch(e){ return null; } }
  function set(k, v){ try { LS.setItem(k, v); } catch(e){} }
  function flags(){ try { return (JSON.parse(get('codebook_save_v1') || '{}').flags) || {}; } catch(e){ return {}; } }
  function post(path, data){
    return fetch(CFG.api + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
      .then(function(r){ return r.json(); });
  }
  var runP = null;
  function run(){
    var r = get('cb_run');
    if (r && /^[0-9a-f]{32}$/.test(r)) return Promise.resolve(r);
    if (!runP) runP = post('/run', {}).then(function(d){ if (!d.ok) throw new Error(d.error); set('cb_run', d.run); set('cb_run_acts', '{}'); return d.run; })
      .catch(function(e){ runP = null; throw e; });
    return runP;
  }
  // tell the server about every act finished since the last time (failed sends are tried again later)
  var busy = null;
  function sync(){
    if (busy) return busy;
    var f = flags(), sent = {}; try { sent = JSON.parse(get('cb_run_acts') || '{}'); } catch(e){}
    var todo = Object.keys(ACT_FLAGS).filter(function(a){ return !sent[a] && ACT_FLAGS[a].some(function(k){ return f[k]; }); });
    if (!todo.length) return Promise.resolve();
    busy = run().then(function(r){
      return todo.reduce(function(p, a){
        return p.then(function(){ return post('/run/checkpoint', { run: r, act: a }).then(function(d){
          if (d.ok){ sent[a] = 1; set('cb_run_acts', JSON.stringify(sent)); } }); });
      }, Promise.resolve());
    }).catch(function(){}).then(function(){ busy = null; });
    return busy;
  }
  run().catch(function(){});
  setInterval(sync, 8000);
  addEventListener('pagehide', sync);
  // the end card asks for the code: first the last checkpoints, then the code (the same one every time until used)
  window.CODEBOOK_RUN_CODE = function(){
    return sync().then(sync).then(run).then(function(r){ return post('/run/code', { run: r }); })   // twice: a send already under way may predate Act V
      .then(function(d){ if (!d.ok) throw new Error(d.error); return d; });
  };
})();
