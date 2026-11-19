/* Phone mockups row (#screens .phrow), v3.
   CSS (style.css) sets touch-action:pan-y on the row: the browser scrolls the PAGE for swipes that are mostly vertical and hands every other
   swipe to this script at full speed (pointer events). This script then decides:
   - clearly horizontal (>= LOCK px and sideways > RATIO x vertical): the row moves with the finger, then glides to the nearest mockup
     (a quick flick goes to the next one); the slide to the mockup is eased (starts fast, slows down at the end, 300-520 ms);
   - anything else (diagonal): the PAGE is scrolled by hand with the finger (with a short glide on release), so no swipe is ever dead.
   Phone / tablet only (max-width:899px). */
(function(){
  var row=document.querySelector('#screens .phrow');if(!row||!window.PointerEvent)return;
  var mq=matchMedia('(max-width:899px)'),LOCK=8,RATIO=2,FLICK=0.35;
  var id=null,mode=0,sx=0,sy=0,sl=0,lx=0,ly=0,lt=0,vx=0,vy=0,raf=0,ax=0,pend=false,RM=matchMedia('(prefers-reduced-motion:reduce)'); /* mode: 0 undecided, 1 row, 2 page by hand */
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
  function anim(to){ /* eased slide: fast start, slows down toward the end */
    var from=row.scrollLeft,dist=to-from;
    if(Math.abs(dist)<1||RM.matches){row.scrollLeft=to;row.style.scrollSnapType='';return}
    var dur=Math.min(520,Math.max(300,Math.abs(dist)*0.9)),t0=null;
    row.style.scrollSnapType='none';
    (function step(now){
      if(t0===null)t0=now;
      var p=Math.min(1,(now-t0)/dur);
      row.scrollLeft=from+dist*(1-Math.pow(1-p,3));
      if(p<1)ax=requestAnimationFrame(step);else{ax=0;row.style.scrollSnapType=''}
    })(performance.now());
  }
  function end(){
    if(id===null)return;id=null;
    if(mode===1){
      pend=false;anim(target(Math.abs(vx)>FLICK?(vx<0?1:-1):0));
    }else{
      if(mode===2&&Math.abs(vy)>0.15)raf=requestAnimationFrame(glide);
      if(pend){pend=false;anim(target(0))} /* a tap stopped a slide in progress: finish it on the nearest mockup */
    }
    mode=0;
  }
  row.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse'||!mq.matches)return;
    if(raf){cancelAnimationFrame(raf);raf=0}
    if(ax){cancelAnimationFrame(ax);ax=0;pend=true;row.style.scrollSnapType='none'}
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
  ['pointerup','pointercancel'].forEach(function(t){row.addEventListener(t,function(e){if(e.pointerId===id)end()})});
  row.addEventListener('lostpointercapture',function(e){if(e.pointerId===id)end()});
})();
