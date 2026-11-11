/* Live racing loop (key feature 1). Round3, 2026-11-07. No external requests.
   An endless conveyor: earlier activities (purple / green / yellow by rank, pills with the weekday) enter the card, cross it and leave,
   then come round again with a gap; the blue rider is faster and overtakes the pack on every lap, restarting as soon as it has left the card.
   Settings = Nathan's choice in preview A (previews/A_live-racing-loop.html). Runs only while visible; reduced motion = one still frame. */
(function(){
  var svgs=[].slice.call(document.querySelectorAll('svg.kf-live'));if(!svgs.length)return;
  var NS='http://www.w3.org/2000/svg',reduce=matchMedia('(prefers-reduced-motion: reduce)');
  var CFG={speed:65,gap:390,spacing:122,rspeed:2,rwait:0,dr:14};
  var NAMES=['Thu','Tue','Mon','Sat','Wed'],TIERS=['p','g','g','y','y'],VAR={p:'var(--purple)',g:'var(--green)',y:'var(--yellow)'};
  function mk(tag,at,par){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e}
  function Live(svg){
    var route=svg.querySelector('[data-kf-route]'),g=svg.querySelector('.kf-dots'),L=route.getTotalLength(),STEP=2,N=Math.ceil(L/STEP)+1,PX=new Float32Array(N+1),PY=new Float32Array(N+1);
    for(var i=0;i<=N;i++){var p=route.getPointAtLength(Math.min(i*STEP,L));PX[i]=p.x;PY[i]=p.y}
    function pt(s){s=Math.max(0,Math.min(L,s));var f=s/STEP,i=Math.floor(f),t=f-i,j=Math.min(i+1,N);return [PX[i]+(PX[j]-PX[i])*t,PY[i]+(PY[j]-PY[i])*t]}
    var VIS0=0,VIS1=L;
    function vis(){ /* the part of the route that is on screen (the picture is cropped to the card): the blue dot restarts as soon as it has left it */
      var r=svg.getBoundingClientRect(),w=r.width||360,h=r.height||270,s=Math.max(w/1120,h/625),hx=w/(2*s),hy=h/(2*s),x0=560-hx-20,x1=560+hx+20,y0=312.5-hy-20,y1=312.5+hy+20,a=null,b=null;
      for(var q=0;q<=L;q+=2){var p=pt(q);if(p[0]>x0&&p[0]<x1&&p[1]>y0&&p[1]<y1){if(a===null)a=q;b=q}}
      if(a!==null){VIS0=Math.max(0,a-60);VIS1=b+60}
    }
    var span=(NAMES.length-1)*CFG.spacing,P=span+CFG.gap,kmax=Math.ceil(L/P)+1,objs=[];
    for(var j=0;j<NAMES.length;j++)for(var k=0;k<=kmax;k++){
      var gg=mk('g',{},g);
      mk('rect',{class:'pl',x:-97,y:-20,width:72,height:40,rx:20},gg);
      var t=mk('text',{class:'pt',x:-61,y:0,'text-anchor':'middle','dominant-baseline':'central'},gg);t.textContent=NAMES[j];
      var c=mk('circle',{class:'rd',cx:0,cy:0,r:CFG.dr},gg);c.style.fill=VAR[TIERS[j]];
      objs.push({g:gg,off:j*CFG.spacing,k:k});
    }
    var rg=mk('g',{},g);mk('circle',{class:'dot-me',cx:0,cy:0,r:CFG.dr+2},rg);
    function draw(D){
      var ord=[];
      for(var i=0;i<objs.length;i++){var o=objs[i],s=((((D-o.off)%P)+P)%P)+o.k*P;
        if(s>L||s<0){o.g.style.display='none';continue}
        var q=pt(s);o.g.style.display='';o.g.setAttribute('transform','translate('+q[0].toFixed(1)+','+q[1].toFixed(1)+')');ord.push([s,o.g])}
      var rs=VIS0+((CFG.rspeed*D)%(VIS1-VIS0+CFG.rwait)),q2=pt(rs);rg.setAttribute('transform','translate('+q2[0].toFixed(1)+','+q2[1].toFixed(1)+')');ord.push([rs,rg]);
      /* stacking like the app: the dot further along the route is on top, until the one behind overtakes it */
      ord.sort(function(a,b){return a[0]-b[0]});
      var cur=g.childNodes,chg=false;for(var n=0;n<ord.length;n++){if(cur[n]!==ord[n][1]){chg=true;break}}
      if(chg)for(var m=0;m<ord.length;m++)g.appendChild(ord[m][1]);
    }
    vis();
    return {svg:svg,draw:draw,vis:vis,D:0,inView:true};
  }
  var items=svgs.map(Live),raf=null,last=null;
  function active(it){return it.inView&&!document.hidden&&!reduce.matches}
  function loop(ts){
    raf=null;var any=false;
    if(last===null)last=ts;var dt=Math.min((ts-last)/1000,.1);last=ts;
    items.forEach(function(it){if(active(it)){it.D+=CFG.speed*dt;it.draw(it.D);any=true}});
    if(any)raf=requestAnimationFrame(loop);else last=null;
  }
  function kick(){if(raf===null&&items.some(active)){last=null;raf=requestAnimationFrame(loop)}}
  function still(){items.forEach(function(it){it.vis();it.D=420;it.draw(it.D)})}
  items.forEach(function(it){it.draw(420)});
  if('IntersectionObserver' in window){
    items.forEach(function(it){new IntersectionObserver(function(es){it.inView=es[es.length-1].isIntersecting;kick()},{threshold:0.05}).observe(it.svg)});
  }
  document.addEventListener('visibilitychange',kick);
  if(reduce.addEventListener)reduce.addEventListener('change',function(){reduce.matches?still():kick()});
  addEventListener('resize',function(){items.forEach(function(it){it.vis()});if(reduce.matches)still()});
  if(reduce.matches)still();else kick();
})();
