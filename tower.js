/* Ranking loop (round3, 2026-11-07). The card and rows appear once (intro), then the seamless loop runs forever:
   Yellow P7 -> Green P3 -> Purple P1 -> back down to Yellow P7, nothing fades out, nothing restarts. Settings = Nathan's choice in preview B
   (4 s per colour, slide x2, rows 2.4rem via CSS). Plain JS tween table, frame = pure function of t, no external requests.
   The clock advances only while visible; reduced motion = static final frame (purple P1). Source of the engine: previews/B_ranking-loop.html. */
(function(){
  var card=document.getElementById('rk-card');
  if(!card)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){return document.getElementById(id)}
function lin(u){return u}function p1out(u){return 1-(1-u)*(1-u)}function p1in(u){return u*u}
function p2out(u){return 1-Math.pow(1-u,3)}function p2io(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}
function ch(init){return {init:init,tw:[]}}
function add(c,s,d,to,e,from){var prev=c.tw.length?c.tw[c.tw.length-1].to:c.init;c.tw.push({s:s,d:d,from:from===undefined?prev:from,to:to,e:e||lin})}
function val(c,t){var v=c.init;for(var i=0;i<c.tw.length;i++){var w=c.tw[i];if(t<w.s)break;v=w.d>0?w.from+(w.to-w.from)*w.e(Math.min(1,(t-w.s)/w.d)):w.to}return v}
var S={beat:4,mv:2};
var rows=[],today=$('rk-today'),avg=$('rk-avg'),capEls=['rk-cy','rk-cg','rk-cp'].map($);
for(var r=0;r<10;r++)rows.push($('rk-r'+(r+1)));
var k=1;function measure(){k=(rows[0].offsetHeight||40)/60}
function mkSet(intro){
  var X={cardO:ch(intro?0:1),avgO:ch(intro?0:1),tO:ch(intro?0:1),tY:ch(intro?10:6),tTier:ch(intro?0:1),tTv:ch(1),R:[],C:[]};
  for(var r=0;r<10;r++)X.R.push({o:ch(intro?0:(r<9?1:0)),x:ch(intro?-.4:0),y:ch(intro?r:(r<6?r:(r<9?r+1:10)))});
  for(var c=0;c<3;c++)X.C.push({g:ch(0),a:ch(0),ay:ch(14),b:ch(0),by:ch(14)});
  return X;
}
function step(X,i,to,at,dur){add(X.R[i-1].y,at,dur||.3,to,p2io)}
function beat(X,t0,toY,tier,rise,c,B){
  add(X.tY,t0,rise,toY,p2out);add(X.tTier,t0+rise,0,tier);
  add(c.g,t0,0,1);
  add(c.a,t0+rise+.2,.4,1,p2out);add(c.ay,t0+rise+.2,.4,0,p2out);
  add(c.b,t0+rise+.6,.4,1,p2out);add(c.by,t0+rise+.6,.4,0,p2out);
  add(c.g,t0+B-.4,.4,0,lin);
}
var INTRO,CYC,T1;
function build(){
  var B=S.beat,m=S.mv;
  /* intro: card + rows appear, today rises from below to yellow P7 (as on the current site) */
  var X=mkSet(true);
  add(X.cardO,.3,.4,1,p1out);add(X.avgO,2.2,1.2,1,p1out);
  for(var r=0;r<10;r++){add(X.R[r].o,.8+r*.15,.35,1,p2out);add(X.R[r].x,.8+r*.15,.35,0,p2out)}
  add(X.tO,4.0,.25,1,p1out);
  beat(X,4.0,6,1,.7*m,X.C[0],B);
  step(X,10,10,4.05);add(X.R[9].o,4.05,.3,0,p1in);
  step(X,9,9,4.15);step(X,8,8,4.27);step(X,7,7,4.45);
  INTRO=X;T1=4.0+B;
  /* cycle: green P3 -> purple P1 -> back down to yellow P7 (same state as where it started) */
  var Y=mkSet(false);
  add(Y.tTv,0,0,2);beat(Y,0,2,2,.7*m,Y.C[1],B);
  add(Y.avgO,.15,.15,.35,lin);add(Y.avgO,.30,.15,1,lin);
  step(Y,6,6,.05);step(Y,5,5,.15);step(Y,4,4,.27);step(Y,3,3,.45);
  add(Y.tTv,B,0,3);beat(Y,B,0,3,.9*m,Y.C[2],B);
  step(Y,2,2,B+.12);step(Y,1,1,B+.45);
  var t0=2*B,rise=.7*m;
  add(Y.tTv,t0+rise,0,1);beat(Y,t0,6,1,rise,Y.C[0],B);
  var ub=1-Math.pow(1-5/6,1/3);add(Y.avgO,t0+rise*ub-.07,.15,.35,lin);add(Y.avgO,t0+rise*ub+.08,.15,1,lin);
  for(var q=1;q<=6;q++){var f=(q-.5)/6,u=1-Math.pow(1-f,1/3);step(Y,q,q-1,Math.max(t0,t0+rise*u-.15))}
  CYC=Y;
}
function draw(X,t){
  card.style.opacity=val(X.cardO,t);avg.style.opacity=val(X.avgO,t);
  for(var r=0;r<10;r++){var q=X.R[r],e=rows[r];
    e.style.opacity=val(q.o,t);
    e.style.transform='translate3d('+(val(q.x,t)*60*k).toFixed(2)+'px,'+(val(q.y,t)*100).toFixed(2)+'%,0)'}
  today.style.opacity=val(X.tO,t);today.style.transform='translate3d(0,'+(val(X.tY,t)*100).toFixed(2)+'%,0)';
  today.setAttribute('data-tier',val(X.tTier,t));today.setAttribute('data-tv',val(X.tTv,t));
  for(var c=0;c<3;c++){var cc=X.C[c],el=capEls[c];el.style.opacity=val(cc.g,t);
    var a=el.firstChild,b=el.lastChild;
    a.style.opacity=val(cc.a,t);a.style.transform='translateY('+(val(cc.ay,t)*k).toFixed(2)+'px)';
    b.style.opacity=val(cc.b,t);b.style.transform='translateY('+(val(cc.by,t)*k).toFixed(2)+'px)'}
}

  var BEAT=S.beat,LOOP=3*BEAT,FINAL=1.8*BEAT;
  function show(el){draw(CYC,el%LOOP)} /* no intro: the table is simply there, the colours start straight away (Nathan, 2026-11-07) */
  build();measure();
  if(reduce){draw(CYC,FINAL);addEventListener('resize',function(){measure();draw(CYC,FINAL)});return}
  addEventListener('resize',measure);
  var el=0,last=null,inView=false,raf=null;
  function loop(ts){
    raf=null;
    if(!inView||document.hidden){last=null;return}
    if(last===null)last=ts;
    el+=Math.min((ts-last)/1000,.1);last=ts;
    show(el);
    raf=requestAnimationFrame(loop);
  }
  function kick(){if(raf===null&&inView&&!document.hidden){last=null;raf=requestAnimationFrame(loop)}}
  document.addEventListener('visibilitychange',kick);
  show(0);
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(en){
      en.forEach(function(x){inView=x.isIntersecting;if(inView)kick()});
    },{rootMargin:'100px 0px'}).observe($('rk'));
  }else{inView=true;kick()}
  /* test hook (no effect on the page): window.__rk(t) draws frame t (t counts from the start, intro first) and stops the loop */
  window.__rk=function(t){inView=false;if(raf!==null){cancelAnimationFrame(raf);raf=null}show(t)};
})();
