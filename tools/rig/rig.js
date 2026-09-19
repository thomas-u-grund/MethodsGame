/* Minimal 2D cut-out rig for The Secret of the Lost Codebook.
 *
 * A rig is a tree of parts. Each part is one image with a pivot (the joint it rotates around,
 * in the part image's own pixels) and an attach point on its parent (in the parent's pixels).
 * Joint angles are set every frame by a pose function, e.g. the procedural walk cycle below,
 * so the character never drifts the way per-frame image generation does.
 *
 *   var rig = CodebookRig.build(container, RIG_DEF, { height: 400 });
 *   rig.play(CodebookRig.walk, { speed: 1 });   // or rig.pose({hipL: 20, ...}); rig.stop();
 */
(function(){
  function el(tag, css){ var e = document.createElement(tag); e.style.cssText = css || ''; return e; }

  function build(container, def, opts){
    opts = opts || {};
    var scale = (opts.height || def.height) / def.height;
    var root = el('div', 'position:absolute;left:0;top:0;width:0;height:0;');
    var joints = {};
    function add(part, parentEl, parentDef){
      var j = el('div', 'position:absolute;width:0;height:0;');
      var ax = parentDef ? part.attach[0] - parentDef.pivot[0] : 0;
      var ay = parentDef ? part.attach[1] - parentDef.pivot[1] : 0;
      j.style.left = (ax * scale) + 'px';
      j.style.top = (ay * scale) + 'px';
      j.style.zIndex = part.z || 0;
      var img = el('img', 'position:absolute;display:block;pointer-events:none;');
      img.src = part.src;
      img.style.width = (part.size[0] * scale) + 'px';
      img.style.height = (part.size[1] * scale) + 'px';
      img.style.left = (-part.pivot[0] * scale) + 'px';
      img.style.top = (-part.pivot[1] * scale) + 'px';
      if (part.flip) img.style.transform = 'scaleX(-1)';
      if (part.tint) img.style.filter = part.tint;
      j.appendChild(img);
      parentEl.appendChild(j);
      joints[part.id] = j;
      (part.children || []).forEach(function(c){ add(c, j, part); });
    }
    add(def.root, root, null);
    container.appendChild(root);

    var raf = null, t0 = 0, poseFn = null, poseOpts = null;
    function pose(angles, offset){
      Object.keys(angles).forEach(function(k){ if (joints[k]) joints[k].style.transform = 'rotate(' + angles[k] + 'deg)'; });
      offset = offset || { x: 0, y: 0 };
      root.style.transform = 'translate(' + (offset.x * scale) + 'px,' + (offset.y * scale) + 'px)';
    }
    function frame(now){
      var t = ((now - t0) / 1000) * (poseOpts.speed || 1) / (poseFn.period || 1);
      var p = poseFn(t % 1, poseOpts);
      pose(p.angles, p.offset);
      raf = requestAnimationFrame(frame);
    }
    return {
      root: root, joints: joints, scale: scale, pose: pose,
      play: function(fn, o){ poseFn = fn; poseOpts = o || {}; if (raf) cancelAnimationFrame(raf); t0 = performance.now(); raf = requestAnimationFrame(frame); },
      stop: function(){ if (raf) cancelAnimationFrame(raf); raf = null; }
    };
  }

  var S = function(t, ph){ return Math.sin(2 * Math.PI * (t + (ph || 0))); };
  // Side-view walk cycle, facing right, t in [0,1). Angles in degrees (positive = clockwise,
  // i.e. a thigh swinging forward is negative when the figure faces right).
  function walk(t, o){
    var stride = (o && o.stride) || 1;
    // Thigh angle follows a sine; the swing phase is where the thigh moves forward (cos > 0).
    // Knee flexion peaks mid-swing (leg passing under the body) and is ~straight at heel strike.
    function leg(tt){
      var sw = S(tt), c = Math.cos(2 * Math.PI * tt);
      var cs = Math.cos(2 * Math.PI * (tt + 0.07));
      var knee = 5 + 46 * Math.pow(Math.max(0, cs), 1.3) + 9 * Math.max(0, -c) * Math.max(0, S(tt, 0.5));
      return { hip: -26 * stride * sw, knee: knee * stride, sw: sw };
    }
    var L = leg(t), R = leg(t + 0.5);
    return {
      angles: {
        hipL: L.hip, kneeL: L.knee, hipR: R.hip, kneeR: R.knee,
        shoulderL: 24 * stride * L.sw, elbowL: -14 - 16 * Math.max(0, -L.sw),
        shoulderR: 24 * stride * R.sw, elbowR: -14 - 16 * Math.max(0, -R.sw),
        torso: 1.5, neck: -1.5 + 1.5 * S(t * 2, 0.25)
      },
      offset: { x: 0, y: -12 * Math.abs(S(t * 2, 0.25)) }
    };
  }
  walk.period = 1.05; // seconds per full cycle (two steps)

  function idle(t){
    return { angles: { hipL: 2, kneeL: 2, hipR: -2, kneeR: 2, shoulderL: 4, elbowL: -6, shoulderR: -3, elbowR: -8,
                       torso: 1 + 0.6 * S(t), neck: -1 + 1.2 * S(t, 0.2) }, offset: { x: 0, y: 1.5 * S(t) } };
  }
  idle.period = 3.6;

  window.CodebookRig = { build: build, walk: walk, idle: idle };
})();
