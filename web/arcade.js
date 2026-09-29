/* ============================== PAC-SOC (author, 2026-09-29) ==============================
   A 1980s arcade cabinet in the Significance Casino: a little game inside the game, no effect on any puzzle.
   Pac-Man, but the ghosts are the founders -- Marx, Durkheim, Comte and Weber -- their faces cut
   from the Keynote hall's portraits. The power pellets are PEER REVIEW: for a few seconds the
   founders turn blue and can be eaten. Arrows / WASD / swipe to move, Esc to leave.
   window.CODEBOOK_ARCADE(onClose) opens it full screen. */
(function(){
  var MAZE = [
    '#####################',
    '#o........#........o#',
    '#.###.###.#.###.###.#',
    '#...................#',
    '#.###.#.#####.#.###.#',
    '#.....#...#...#.....#',
    '#####.### # ###.#####',
    '    #.#   G   #.#    ',
    '#####.# ##-## #.#####',
    '     .  #GGG#  .     ',
    '#####.# ##### #.#####',
    '    #.#       #.#    ',
    '#####.# ##### #.#####',
    '#.........#.........#',
    '#.###.###.#.###.###.#',
    '#o..#.....P.....#..o#',
    '###.#.#.#####.#.#.###',
    '#.....#...#...#.....#',
    '#.#######.#.#######.#',
    '#...................#',
    '#####################'
  ];
  var W = MAZE[0].length, H = MAZE.length;
  var FOUNDERS = [
    { name:'MARX',     img:'keynote-portrait-1.webp', col:'#e0443a', crop:[.24, .14, .52, .42] },
    { name:'DURKHEIM', img:'keynote-portrait-2.webp', col:'#f28cc4', crop:[.26, .13, .5, .42] },
    { name:'COMTE',    img:'keynote-portrait-3.webp', col:'#45d2e6', crop:[.26, .11, .5, .42] },
    { name:'WEBER',    img:'keynote-portrait-4.webp', col:'#f6a13a', crop:[.27, .12, .48, .42] }
  ];
  var QUIPS = ['&ldquo;Workers of the maze, unite!&rdquo;', '&ldquo;A social fact: you are cornered.&rdquo;',
               '&ldquo;Order and progress. Mostly order.&rdquo;', '&ldquo;An iron cage. With dots in it.&rdquo;'];

  window.CODEBOOK_ARCADE = function(onClose){
    if (document.getElementById('cbArcade')) return;
    var ov = document.createElement('div'); ov.id = 'cbArcade';
    ov.innerHTML = '<div class="ar-bezel"><div class="ar-top">PAC&middot;SOC <small>&copy; 1983 SOCIOLOGY DEPT.</small></div>' +
      '<div class="ar-hud"><span>SCORE <b id="arScore">0</b></span><span>HI <b id="arHi">0</b></span><span id="arLives"></span></div>' +
      '<canvas id="arCv"></canvas><div class="ar-msg" id="arMsg"></div>' +
      '<div class="ar-foot">ARROWS / WASD / SWIPE &middot; ESC TO LEAVE &middot; <b>o</b> = PEER REVIEW</div></div>' +
      '<button class="ar-x" aria-label="Leave the arcade">&times;</button>';
    document.body.appendChild(ov);
    var cv = ov.querySelector('#arCv'), ctx = cv.getContext('2d');
    var faces = FOUNDERS.map(function(f){ var im = new Image(); im.src = f.img; return im; });
    try { window.CODEBOOK_STOP_ROOM_MUSIC && window.CODEBOOK_STOP_ROOM_MUSIC(); } catch(e){}
    var AC = null; try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
    function beep(f, d, type, v){ if (!AC) return; var o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(v || .05, AC.currentTime); g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d); }
    var hi = 0; try { hi = +localStorage.getItem('cb_pacsoc_hi') || 0; } catch(e){}
    var grid, pellets, score = 0, lives = 3, level = 1, pac, ghosts, fright = 0, dead = 0, raf = 0, last = 0, over = false, msgT = 0, waka = 0, ready = 0, eatChain = 0;
    var DIRS = { L:[-1,0], R:[1,0], U:[0,-1], D:[0,1] };
    function cell(x, y){ if (y < 0 || y >= H) return '#'; x = (x + W) % W; return grid[y][x]; }
    function open(x, y, isGhost){ var c = cell(x, y); return c !== '#' && (c !== '-' || isGhost); }
    function reset(full){
      if (full){
        grid = MAZE.map(function(r){ return r.split(''); }); pellets = 0;
        grid.forEach(function(r){ r.forEach(function(c){ if (c === '.' || c === 'o') pellets++; }); });
      }
      var px = 10, py = 15;
      grid.forEach(function(r, y){ r.forEach(function(c, x){ if (c === 'P'){ px = x; py = y; } }); });
      pac = { x:px, y:py, fx:px, fy:py, dir:'L', want:'L', mouth:0 };
      var homes = [[10,7],[9,9],[10,9],[11,9]];
      ghosts = FOUNDERS.map(function(f, i){ return { i:i, x:homes[i][0], y:homes[i][1], fx:homes[i][0], fy:homes[i][1], dir:'U', out:i === 0, delay:i * 90, eaten:false }; });
      fright = 0; ready = 90;
    }
    function say(h, ms){ var m = document.getElementById('arMsg'); if (!m) return; m.innerHTML = h; m.classList.add('on'); clearTimeout(msgT); msgT = setTimeout(function(){ m.classList.remove('on'); }, ms || 1600); }
    function hud(){ document.getElementById('arScore').textContent = score; document.getElementById('arHi').textContent = Math.max(hi, score);
      document.getElementById('arLives').innerHTML = new Array(Math.max(0, lives)).join('&#9679; ') + (lives > 0 ? '&#9679;' : ''); }
    var T = 24;
    function size(){
      var r = ov.querySelector('.ar-bezel').getBoundingClientRect();
      T = Math.max(8, Math.floor(Math.min((r.width - 20) / W, (r.height - 120) / H)));
      cv.width = W * T; cv.height = H * T;
    }
    // movement on a grid with smooth tweening: an actor moves from (x,y) to the next cell at a speed in cells/frame
    function step(a, speed, isGhost){
      var tx = a.x + DIRS[a.dir][0], ty = a.y + DIRS[a.dir][1];
      if (!open(tx, ty, isGhost)){ a.fx = a.x; a.fy = a.y; return false; }
      a.fx += DIRS[a.dir][0] * speed; a.fy += DIRS[a.dir][1] * speed;
      if (Math.abs(a.fx - a.x) >= 1 || Math.abs(a.fy - a.y) >= 1){
        a.x = (tx + W) % W; a.y = ty; a.fx = a.x; a.fy = a.y; return true;
      }
      return false;
    }
    function ghostChoose(g){
      var p = pac, opts = [];
      Object.keys(DIRS).forEach(function(d){
        var back = { L:'R', R:'L', U:'D', D:'U' }[g.dir];
        if (d === back) return;
        var nx = g.x + DIRS[d][0], ny = g.y + DIRS[d][1];
        if (!open(nx, ny, true)) return;
        if (g.out && cell(nx, ny) === '-' && !g.eaten) return;           // once out, stay out
        opts.push(d);
      });
      if (!opts.length){ g.dir = { L:'R', R:'L', U:'D', D:'U' }[g.dir]; return; }
      var tx, ty;
      if (g.eaten){ tx = 10; ty = 9; }
      else if (!g.out){ tx = 10; ty = 6; }
      else if (fright){ g.dir = opts[Math.floor(Math.random() * opts.length)]; return; }
      else {
        // four personalities: Marx chases, Durkheim heads you off, Comte keeps order at a distance, Weber wanders rationally
        var ahead = DIRS[p.dir];
        if (g.i === 0){ tx = p.x; ty = p.y; }
        else if (g.i === 1){ tx = p.x + ahead[0] * 4; ty = p.y + ahead[1] * 4; }
        else if (g.i === 2){ var d = Math.abs(g.x - p.x) + Math.abs(g.y - p.y); tx = d > 7 ? p.x : 1; ty = d > 7 ? p.y : 19; }
        else { tx = Math.random() < .6 ? p.x : Math.floor(Math.random() * W); ty = Math.random() < .6 ? p.y : Math.floor(Math.random() * H); }
      }
      opts.sort(function(a, b){ return dist(g, a, tx, ty) - dist(g, b, tx, ty); });
      g.dir = opts[0];
    }
    function dist(g, d, tx, ty){ var nx = g.x + DIRS[d][0], ny = g.y + DIRS[d][1]; return (nx - tx) * (nx - tx) + (ny - ty) * (ny - ty); }
    function tick(){
      if (ready > 0){ ready--; return; }
      if (dead > 0){ dead--; if (dead === 0){ if (lives <= 0) return gameOver(); reset(false); } return; }
      // pac
      var sp = .13 + level * .006;
      var fx = pac.x + DIRS[pac.want][0], fy = pac.y + DIRS[pac.want][1];
      if (pac.fx === pac.x && pac.fy === pac.y && open(fx, fy, false)) pac.dir = pac.want;
      if (pac.want !== pac.dir && DIRS[pac.want][0] === -DIRS[pac.dir][0] && DIRS[pac.want][1] === -DIRS[pac.dir][1]) pac.dir = pac.want;
      if (step(pac, sp, false)){
        var c = grid[pac.y][pac.x];
        if (c === '.' || c === 'o'){
          grid[pac.y][pac.x] = ' '; pellets--; score += c === 'o' ? 50 : 10;
          waka = !waka; beep(waka ? 440 : 330, .06, 'square', .03);
          if (c === 'o'){ fright = 420 - Math.min(240, level * 40); eatChain = 0; say('PEER REVIEW!', 1200); beep(180, .35, 'sawtooth', .05); }
          if (pellets <= 0){ level++; say('LEVEL ' + level + '<br><small>the founders revise their theory</small>', 2200); reset(true); }
        }
      }
      pac.mouth = (pac.mouth + .25) % 6.28;
      if (fright > 0) fright--;
      // ghosts
      ghosts.forEach(function(g){
        if (g.delay > 0){ g.delay--; return; }
        if (!g.out && g.y <= 6) g.out = true;
        if (g.eaten && g.x === 10 && g.y === 9){ g.eaten = false; g.out = false; }
        var gs = g.eaten ? .3 : fright && !g.eaten ? .07 : .105 + level * .006;
        if (g.fx === g.x && g.fy === g.y) ghostChoose(g);
        if (step(g, gs, true)) ghostChoose(g);
        // collisions
        if (Math.abs(g.fx - pac.fx) < .6 && Math.abs(g.fy - pac.fy) < .6 && !g.eaten){
          if (fright){ g.eaten = true; eatChain++; score += 200 * eatChain; beep(880, .2, 'triangle', .06); say(FOUNDERS[g.i].name + ' REFUTED<br><small>+' + (200 * eatChain) + '</small>', 1100); }
          else { lives--; dead = 70; beep(120, .6, 'sawtooth', .07); say(QUIPS[g.i], 1600); }
        }
      });
      hud();
    }
    function draw(){
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++){
        var c = grid[y][x];
        if (c === '#'){
          // classic corridors: fill the wall, and draw a bright edge only where it faces an open cell
          ctx.fillStyle = '#0a0f4a'; ctx.fillRect(x * T, y * T, T, T);
          ctx.strokeStyle = '#3a5cff'; ctx.lineWidth = Math.max(2, T / 7); ctx.beginPath();
          var o = T * .12;
          if (y > 0 && MAZE[y - 1][x] !== '#'){ ctx.moveTo(x * T, y * T + o); ctx.lineTo(x * T + T, y * T + o); }
          if (y < H - 1 && MAZE[y + 1][x] !== '#'){ ctx.moveTo(x * T, y * T + T - o); ctx.lineTo(x * T + T, y * T + T - o); }
          if (x > 0 && MAZE[y][x - 1] !== '#'){ ctx.moveTo(x * T + o, y * T); ctx.lineTo(x * T + o, y * T + T); }
          if (x < W - 1 && MAZE[y][x + 1] !== '#'){ ctx.moveTo(x * T + T - o, y * T); ctx.lineTo(x * T + T - o, y * T + T); }
          ctx.stroke();
        }
        else if (c === '-'){ ctx.fillStyle = '#ffb8de'; ctx.fillRect(x * T, y * T + T * .44, T, T * .12); }
        else if (c === '.'){ ctx.fillStyle = '#ffd8a0'; ctx.fillRect(x * T + T * .44, y * T + T * .44, T * .12, T * .12); }
        else if (c === 'o' && (Date.now() / 250 | 0) % 2){ ctx.fillStyle = '#ffd8a0'; ctx.beginPath(); ctx.arc(x * T + T / 2, y * T + T / 2, T * .3, 0, 6.28); ctx.fill(); }
      }
      // pac
      var pa = { R:0, D:1.57, L:3.14, U:4.71 }[pac.dir], m = dead ? Math.min(3.1, (70 - dead) * .05) : Math.abs(Math.sin(pac.mouth)) * .7;
      ctx.fillStyle = '#ffe600'; ctx.beginPath(); ctx.moveTo(pac.fx * T + T / 2, pac.fy * T + T / 2);
      ctx.arc(pac.fx * T + T / 2, pac.fy * T + T / 2, T * .45, pa + m, pa + 6.28 - m); ctx.fill();
      // founders
      ghosts.forEach(function(g){
        var f = FOUNDERS[g.i], cx = g.fx * T + T / 2, cy = g.fy * T + T / 2, r = T * .62;
        if (g.eaten){ ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx - r * .3, cy, r * .18, 0, 6.28); ctx.arc(cx + r * .3, cy, r * .18, 0, 6.28); ctx.fill(); return; }
        var blue = fright > 0, blink = blue && fright < 90 && (fright / 10 | 0) % 2;
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy - r * .1, r, Math.PI, 0);
        ctx.lineTo(cx + r, cy + r * .8);
        for (var k = 0; k < 4; k++) ctx.lineTo(cx + r - (k + .5) * r / 2, cy + r * (k % 2 ? .8 : .5));
        ctx.lineTo(cx - r, cy + r * .8); ctx.closePath();
        ctx.fillStyle = blue ? (blink ? '#fff' : '#2233ff') : f.col; ctx.fill();
        ctx.clip();
        var im = faces[g.i];
        if (im.complete && im.naturalWidth){
          ctx.globalAlpha = blue ? .45 : 1;
          ctx.drawImage(im, f.crop[0] * im.naturalWidth, f.crop[1] * im.naturalHeight, f.crop[2] * im.naturalWidth, f.crop[3] * im.naturalHeight, cx - r, cy - r * 1.15, r * 2, r * 1.85);
        }
        ctx.restore();
      });
    }
    function frame(now){
      if (!document.getElementById('cbArcade')) return;
      if (!over){ var n = Math.min(4, Math.round((now - last) / 16.7) || 1); for (var i = 0; i < n; i++) tick(); }
      last = now; draw(); raf = requestAnimationFrame(frame);
    }
    function gameOver(){
      over = true;
      if (score > hi){ hi = score; try { localStorage.setItem('cb_pacsoc_hi', hi); } catch(e){} }
      hud();
      say('GAME OVER<br><small>the founders have eaten you. Press SPACE or tap to play again</small>', 99999);
    }
    function restart(){ score = 0; lives = 3; level = 1; over = false; dead = 0; reset(true); hud(); say('READY!', 1400); }
    function key(e){
      var k = { ArrowLeft:'L', ArrowRight:'R', ArrowUp:'U', ArrowDown:'D', a:'L', d:'R', w:'U', s:'D', A:'L', D:'R', W:'U', S:'D' }[e.key];
      if (k){ pac.want = k; e.preventDefault(); e.stopPropagation(); return; }
      if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(); return; }
      if ((e.key === ' ' || e.key === 'Enter') && over){ e.preventDefault(); restart(); }
    }
    var tsx = 0, tsy = 0;
    ov.addEventListener('touchstart', function(e){ tsx = e.touches[0].clientX; tsy = e.touches[0].clientY; }, { passive:true });
    ov.addEventListener('touchend', function(e){ var dx = e.changedTouches[0].clientX - tsx, dy = e.changedTouches[0].clientY - tsy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20){ if (over) restart(); return; }
      pac.want = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : (dy > 0 ? 'D' : 'U'); });
    ov.addEventListener('click', function(e){ if (e.target.closest('.ar-x')) close(); else if (over) restart(); });
    function close(){ cancelAnimationFrame(raf); document.removeEventListener('keydown', key, true); window.removeEventListener('resize', size); ov.remove(); try { AC && AC.close(); } catch(e){} if (onClose) onClose(); }
    document.addEventListener('keydown', key, true);
    window.addEventListener('resize', size);
    size(); reset(true); hud(); say('READY!', 1400);
    window.CODEBOOK_ARCADE_TEST = { state:function(){ return { score:score, lives:lives, pellets:pellets, level:level, over:over }; }, eatAll:function(){ grid.forEach(function(r){ r.forEach(function(c, x){ if (c === '.' || c === 'o') r[x] = ' '; }); }); pellets = 1; } };
    last = performance.now(); raf = requestAnimationFrame(frame);
  };

  var st = document.createElement('style'); st.textContent =
    '#cbArcade{position:fixed;inset:0;z-index:9800;background:radial-gradient(ellipse at 50% 40%,#1a1030,#05030a 75%);display:flex;align-items:center;justify-content:center;font-family:"Press Start 2P","JetBrains Mono",monospace;}' +
    '#cbArcade .ar-bezel{position:relative;height:96vh;width:min(96vw,calc(96vh * 0.95));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:12px;box-sizing:border-box;' +
      'background:linear-gradient(#2b1b4a,#150c26);border:6px solid #111;border-radius:22px;box-shadow:0 0 0 3px #6a3bd1,0 0 60px rgba(120,80,255,.45),inset 0 0 30px rgba(0,0,0,.8);}' +
    '#cbArcade .ar-top{font-weight:900;font-size:clamp(18px,3.2vh,34px);letter-spacing:.2em;color:#ffe600;text-shadow:3px 3px 0 #e0443a,0 0 18px rgba(255,230,0,.6);text-align:center;line-height:1;}' +
    '#cbArcade .ar-top small{display:block;font-size:.32em;letter-spacing:.3em;color:#9fb0ff;text-shadow:none;margin-top:.5em;}' +
    '#cbArcade .ar-hud{display:flex;gap:2.5em;color:#fff;font:700 clamp(11px,1.6vh,16px) "JetBrains Mono",monospace;letter-spacing:.12em;}' +
    '#cbArcade .ar-hud b{color:#ffe600;} #cbArcade #arLives{color:#ffe600;letter-spacing:.3em;}' +
    '#cbArcade canvas{image-rendering:pixelated;border:3px solid #111;border-radius:6px;box-shadow:0 0 0 2px #2440ff,inset 0 0 20px #000;}' +
    '#cbArcade .ar-msg{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%) scale(.8);opacity:0;transition:.25s;text-align:center;color:#ffe600;font:900 clamp(16px,3vh,30px) "JetBrains Mono",monospace;letter-spacing:.12em;text-shadow:0 0 12px #000,0 0 4px #000;pointer-events:none;}' +
    '#cbArcade .ar-msg small{display:block;font-size:.45em;color:#fff;letter-spacing:.05em;margin-top:.4em;}' +
    '#cbArcade .ar-msg.on{opacity:1;transform:translate(-50%,-50%) scale(1);}' +
    '#cbArcade .ar-foot{color:#9fb0ff;font:700 clamp(9px,1.2vh,12px) "JetBrains Mono",monospace;letter-spacing:.14em;}' +
    '#cbArcade .ar-foot b{color:#ffd8a0;}' +
    '#cbArcade .ar-x{position:absolute;right:18px;top:14px;width:44px;height:44px;border-radius:50%;border:2px solid #9fb0ff;background:rgba(0,0,0,.5);color:#fff;font-size:26px;cursor:pointer;}';
  document.head.appendChild(st);
})();
