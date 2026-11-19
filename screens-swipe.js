/* Phone mockups row (#screens .phrow), v3.
   CSS (style.css) sets touch-action:pan-y on the row: the browser scrolls the PAGE for swipes that are mostly vertical and hands every other
   swipe to this script at full speed (pointer events). This script then decides:
   - clearly horizontal (>= LOCK px and sideways > RATIO x vertical): the row moves with the finger, keeps coasting after release like a
     normal scroll (a hard flick can pass several mockups), then settles smoothly on the nearest mockup;
   - anything else (diagonal): the PAGE is scrolled by hand with the finger (with a short glide on release), so no swipe is ever dead.
   Phone / tablet only (max-width:899px). */
(function(){
  var row=document.querySelector('#screens .phrow');if(!row||!window.PointerEvent)return;
  var mq=matchMedia('(max-width:899px)'),LOCK=8,RATIO=2,FRICTION=0.95,STOP=0.04; /* FRICTION: speed kept per 16 ms while coasting (lower = stops sooner) */
  var id=null,mode=0,sx=0,sy=0,sl=0,lx=0,ly=0,lt=0,vx=0,vy=0,raf=0,rafX=0,pend=false; /* mode: 0 undecided, 1 row, 2 page by hand */
  function items(){return [].slice.call(row.children)}
  function target(hint){
    var c=row.scrollLeft+row.clientWidth/2,best=0,bd=1e9,its=items();
    its.forEach(function(el,i){var d=Math.abs(el.offsetLeft+el.offsetWidth/2-c);if(d<bd){bd=d;best=i}});
    best=Math.max(0,Math.min(its.length-1,best+hint));
    var el=its[best];
    return Math.max(0,Math.min(row.scrollWidth-row.clientWidth,el.offsetLeft+el.offsetWidth/2-row.clientWidth/2));
  }
  function page(dy){try{window.scrollBy({top:dy,left:0,behavior:'instant'})}catch(e){window.scrollBy(0,dy)}}
  function glide(){ /* short inertia for the by-hand page scroll */
    if(Math.abs(vy)<0.03){raf=0;return}
    page(-vy*16);vy*=0.94;raf=requestAnimationFrame(glide);
  }
  function snap(){
    var to=target(0);
    row.style.scrollSnapType='';
    try{row.scrollTo({left:to,behavior:'smooth'})}catch(e){row.scrollLeft=to}
  }
  function coast(){ /* free coasting along the band, then settle on the nearest mockup */
    var last=performance.now();
    (function step(now){
      var dt=Math.min(now-last,40);last=now;
      var max=row.scrollWidth-row.clientWidth,x=row.scrollLeft-vx*dt;
      if(x<0||x>max){x=Math.max(0,Math.min(max,x));vx=0}
      row.scrollLeft=x;vx*=Math.pow(FRICTION,dt/16);
      if(Math.abs(vx)<STOP){rafX=0;snap();return}
      rafX=requestAnimationFrame(step);
    })(last);
  }
  function end(e){
    if(id===null)return;id=null;
    if(mode===1){
      pend=false;
      if(e&&e.timeStamp-lt>80)vx=0; /* finger rested before lifting: no coasting */
      row.style.scrollSnapType='none';coast();
    }else{
      if(mode===2&&Math.abs(vy)>0.15)raf=requestAnimationFrame(glide);
      if(pend){pend=false;snap()} /* a tap or page-scroll stopped a coast: settle the row */
    }
    mode=0;
  }
  row.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse'||!mq.matches)return;
    if(raf){cancelAnimationFrame(raf);raf=0}
    if(rafX){cancelAnimationFrame(rafX);rafX=0;pend=true;row.style.scrollSnapType='none'}
    id=e.pointerId;mode=0;sx=lx=e.clientX;sy=ly=e.clientY;sl=row.scrollLeft;lt=e.timeStamp;vx=vy=0;
  },{passive:true});
  row.addEventListener('pointermove',function(e){
    if(e.pointerId!==id)return;
    var dx=e.clientX-sx,dy=e.clientY-sy,ax=Math.abs(dx),ay=Math.abs(dy);
    if(mode===0){
      if(ax<LOCK&&ay<LOCK)return;
      if(ax>=LOCK&&ax>RATIO*ay){mode=1;row.style.scrollSnapType='none';try{row.setPointerCapture(id)}catch(_){}}
      else{mode=2}
    }
    var dt=e.timeStamp-lt;
    if(dt>0){vx=0.8*vx+0.2*((e.clientX-lx)/dt);vy=0.8*vy+0.2*((e.clientY-ly)/dt)}
    if(mode===1)row.scrollLeft=sl-dx;
    else page(-(e.clientY-ly));
    lx=e.clientX;ly=e.clientY;lt=e.timeStamp;
  },{passive:true});
  ['pointerup','pointercancel'].forEach(function(t){row.addEventListener(t,function(e){if(e.pointerId===id)end(e)})});
  row.addEventListener('lostpointercapture',function(e){if(e.pointerId===id)end(e)});
})();
