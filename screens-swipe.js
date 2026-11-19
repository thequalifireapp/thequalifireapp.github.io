/* Phone mockups row (#screens .phrow): sideways only when a swipe is clearly horizontal, otherwise the page scrolls.
   How it works (v2): the row is NOT scrollable by the browser (style.css: overflow:hidden on phone/tablet) and has no touch-action rule,
   so the browser scrolls the PAGE for any finger movement, whatever the angle, and nothing can get stuck.
   This script reads the touch (passive listeners, never blocks scrolling) and moves the row by hand only when the swipe is clearly
   horizontal: >= LOCK px and sideways movement more than RATIO times the vertical movement. On release the row glides to the nearest
   mockup (a quick flick goes to the next one). Phone / tablet only (max-width:899px). */
(function(){
  var row=document.querySelector('#screens .phrow');if(!row)return;
  var mq=matchMedia('(max-width:899px)'),LOCK=10,RATIO=2,FLICK=0.35;
  var sx=0,sy=0,sl=0,lx=0,lt=0,v=0,mode=2; /* mode: 0 undecided, 1 horizontal (we move the row), 2 page scroll / ignore */
  function items(){return [].slice.call(row.children)}
  function target(hint){
    var c=row.scrollLeft+row.clientWidth/2,best=0,bd=1e9,its=items();
    its.forEach(function(el,i){var d=Math.abs(el.offsetLeft+el.offsetWidth/2-c);if(d<bd){bd=d;best=i}});
    best=Math.max(0,Math.min(its.length-1,best+hint));
    var el=its[best];
    return Math.max(0,Math.min(row.scrollWidth-row.clientWidth,el.offsetLeft+el.offsetWidth/2-row.clientWidth/2));
  }
  function settle(){
    var hint=Math.abs(v)>FLICK?(v<0?1:-1):0; /* finger moved left (v<0): next mockup */
    var to=target(hint);
    row.style.scrollSnapType='';
    try{row.scrollTo({left:to,behavior:'smooth'})}catch(e){row.scrollLeft=to}
  }
  row.addEventListener('touchstart',function(e){
    if(!mq.matches||e.touches.length!==1){mode=2;return}
    var t=e.touches[0];sx=lx=t.clientX;sy=t.clientY;sl=row.scrollLeft;lt=e.timeStamp;v=0;mode=0;
  },{passive:true});
  row.addEventListener('touchmove',function(e){
    if(mode===2)return;
    var t=e.touches[0],dx=t.clientX-sx,dy=t.clientY-sy,ax=Math.abs(dx),ay=Math.abs(dy);
    if(mode===0){
      if(ax>=LOCK&&ax>RATIO*ay){mode=1;row.style.scrollSnapType='none'}
      else if(ay>=LOCK){mode=2;return}   /* clearly not sideways: the page scrolls */
      else return;                        /* still too small to tell */
    }
    var dt=e.timeStamp-lt;if(dt>0)v=0.8*v+0.2*((t.clientX-lx)/dt);lx=t.clientX;lt=e.timeStamp;
    row.scrollLeft=sl-dx;
  },{passive:true});
  ['touchend','touchcancel'].forEach(function(n){row.addEventListener(n,function(){if(mode===1)settle();mode=2},{passive:true})});
})();
