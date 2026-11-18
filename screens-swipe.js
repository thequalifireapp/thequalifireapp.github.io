/* Phone mockups row (#screens .phrow): scrolls sideways only when a swipe is clearly horizontal.
   - CSS (style.css) sets touch-action:pan-y on the row, so the browser always scrolls the PAGE for vertical or diagonal swipes.
   - This script moves the row by hand only after the finger has travelled >= LOCK px and the move is mostly horizontal (|dx| > RATIO * |dy|).
     A swipe that starts diagonal stays a page scroll (the browser takes it over and sends pointercancel).
   - On release the row glides to the nearest mockup (a quick flick goes to the next one). Snap is switched off only while dragging.
   Phone / tablet only (max-width:899px); on laptop the row is a grid and nothing happens. */
(function(){
  var row=document.querySelector('#screens .phrow');if(!row||!window.PointerEvent)return;
  var mq=matchMedia('(max-width:899px)'),LOCK=10,RATIO=2,FLICK=0.35;
  var id=null,sx=0,sy=0,sl=0,lx=0,lt=0,v=0,drag=false,dead=false;
  function items(){return [].slice.call(row.children)}
  function target(dirHint){
    var c=row.scrollLeft+row.clientWidth/2,best=null,bd=1e9,its=items();
    its.forEach(function(el,i){var m=el.offsetLeft+el.offsetWidth/2,d=Math.abs(m-c);if(d<bd){bd=d;best=i}});
    if(dirHint){var n=Math.max(0,Math.min(its.length-1,best+dirHint));best=n}
    var el=its[best];return Math.max(0,Math.min(row.scrollWidth-row.clientWidth,el.offsetLeft+el.offsetWidth/2-row.clientWidth/2));
  }
  function end(){
    if(id===null)return;id=null;
    if(!drag){dead=false;return}
    drag=false;
    var hint=Math.abs(v)>FLICK?(v<0?1:-1):0; /* v<0: finger moved left, so the next mockup */
    var to=target(hint);
    row.style.scrollSnapType='';
    try{row.scrollTo({left:to,behavior:'smooth'})}catch(e){row.scrollLeft=to}
  }
  row.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse'||!mq.matches)return;
    id=e.pointerId;sx=lx=e.clientX;sy=e.clientY;sl=row.scrollLeft;lt=e.timeStamp;v=0;drag=false;dead=false;
  },{passive:true});
  row.addEventListener('pointermove',function(e){
    if(e.pointerId!==id||dead)return;
    var dx=e.clientX-sx,dy=e.clientY-sy,ax=Math.abs(dx),ay=Math.abs(dy);
    if(!drag){
      if(ax<LOCK&&ay<LOCK)return;
      if(ax>RATIO*ay&&ax>=LOCK){drag=true;row.style.scrollSnapType='none';try{row.setPointerCapture(id)}catch(_){}}
      else if(ay>=LOCK){dead=true;return} /* vertical or diagonal: leave it to the page */
      else return;
    }
    var dt=e.timeStamp-lt;if(dt>0)v=0.8*v+0.2*((e.clientX-lx)/dt);lx=e.clientX;lt=e.timeStamp;
    row.scrollLeft=sl-dx;
  },{passive:true});
  ['pointerup','pointercancel','lostpointercapture'].forEach(function(t){row.addEventListener(t,function(e){if(e.pointerId===id||t==='lostpointercapture')end()})});
})();
