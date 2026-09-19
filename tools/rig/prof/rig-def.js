// Professor cut-out rig (side view, facing right). Coordinates are in each part image's own
// pixels (parts in tools/rig/prof/*.png, figure ~1600 px tall). Near limbs = L, far limbs = R.
window.PROF_RIG = {
  height: 1600,
  root: { id:'torso', src:'prof/torso.png', size:[291,620], pivot:[131,559], z:0, children:[
    { id:'shoulderR', src:'prof/upperarm.png', size:[101,340], attach:[122,75], pivot:[50,45], z:-3, tint:'brightness(.72)', children:[
      { id:'elbowR', src:'prof/forearm.png', size:[126,430], attach:[52,300], pivot:[64,38], z:-1, tint:'brightness(.72)' } ] },
    { id:'hipR', src:'prof/thigh.png', size:[165,440], attach:[131,540], pivot:[82,75], z:-2, tint:'brightness(.72)', children:[
      { id:'kneeR', src:'prof/shin.png', size:[168,470], attach:[82,405], pivot:[70,45], z:-1, tint:'brightness(.72)' } ] },
    { id:'hipL', src:'prof/thigh.png', size:[165,440], attach:[131,540], pivot:[82,75], z:-1, children:[
      { id:'kneeL', src:'prof/shin.png', size:[168,470], attach:[82,405], pivot:[70,45], z:-1 } ] },
    { id:'neck', src:'prof/head.png', size:[245,300], attach:[150,30], pivot:[121,275], z:1 },
    { id:'shoulderL', src:'prof/upperarm.png', size:[101,340], attach:[122,75], pivot:[50,45], z:2, children:[
      { id:'elbowL', src:'prof/forearm.png', size:[126,430], attach:[52,300], pivot:[64,38], z:-1 } ] }
  ]}
};
