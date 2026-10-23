/* Ranking tower loop. Plain JS port of marketing/archive/pre-teaser-full-studios/silent-studio/colours/index.html
   (GSAP timeline replaced by a small stateless tween table; no external requests).
   Time unit: seconds. Frame = pure function of t, so the loop restarts cleanly.
   Loops forever; clock advances only while visible; reduced motion = static final frame. */
(function(){
  var card=document.getElementById('rk-card');
  if(!card)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){return document.getElementById(id)}
  /* easing (GSAP names: power1 = quad, power2 = cubic) */
  function lin(u){return u}
  function p1out(u){return 1-(1-u)*(1-u)}
  function p1in(u){return u*u}
  function p2out(u){return 1-Math.pow(1-u,3)}
  function p2io(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}
  /* channels */
  function ch(init){return {init:init,tw:[]}}
  function add(c,s,d,to,e,from){
    var prev=c.tw.length?c.tw[c.tw.length-1].to:c.init;
    c.tw.push({s:s,d:d,from:from===undefined?prev:from,to:to,e:e||lin});
  }
  function val(c,t){
    var v=c.init;
    for(var i=0;i<c.tw.length;i++){
      var w=c.tw[i];if(t<w.s)break;
      v=w.d>0?w.from+(w.to-w.from)*w.e(Math.min(1,(t-w.s)/w.d)):w.to;
    }
    return v;
  }
  var LOOP=19.8,FINAL=17.4;
  var cardO=ch(0);add(cardO,.3,.4,1,p1out);add(cardO,18.6,.4,0,lin);
  var avgO=ch(0);add(avgO,2.2,1.2,1,p1out);
  add(avgO,9.15,.15,.35,lin);add(avgO,9.30,.15,1,lin);
  /* ten earlier rides: slot index y (row units), opacity, x offset (row-height units, -24px of 60 in the source) */
  var R=[];
  for(var r=0;r<10;r++){
    var o=ch(0),x=ch(-.4),y=ch(r);
    add(o,.8+r*.15,.35,1,p2out);add(x,.8+r*.15,.35,0,p2out);
    R.push({el:$('rk-r'+(r+1)),o:o,x:x,y:y});
  }
  function step(i,to,at,dur){add(R[i-1].y,at,dur||.3,to,p2io)}
  /* today row */
  var tO=ch(0),tY=ch(10),tTier=ch(0),tTv=ch(1);
  add(tO,4.0,.25,1,p1out);
  /* captions: group opacity, tier line, second line */
  var CAPS=[];
  function cap(id){
    var c={el:$(id),g:ch(0),a:ch(0),ay:ch(14),b:ch(0),by:ch(14)};CAPS.push(c);return c;
  }
  function beat(t0,toY,tier,rise,c){
    add(tY,t0,rise,toY,p2out);
    add(tTier,t0+rise,0,tier);
    add(c.g,t0,0,1);
    add(c.a,t0+rise+.2,.4,1,p2out);add(c.ay,t0+rise+.2,.4,0,p2out);
    add(c.b,t0+rise+.6,.4,1,p2out);add(c.by,t0+rise+.6,.4,0,p2out);
    add(c.g,t0+4.6,.4,0,lin);add(c.g,t0+5.0,0,0);
  }
  /* beat 1: yellow, P7 */
  beat(4.0,6,1,.7,cap('rk-cy'));
  step(10,10,4.05);add(R[9].o,4.05,.3,0,p1in);
  step(9,9,4.15);step(8,8,4.27);step(7,7,4.45);
  /* beat 2: green, P3 */
  add(tTv,9.0,0,2);
  beat(9.0,2,2,.7,cap('rk-cg'));
  step(6,6,9.05);step(5,5,9.15);step(4,4,9.27);step(3,3,9.45);
  /* beat 3: purple, P1 */
  add(tTv,14.0,0,3);
  beat(14.0,0,3,.9,cap('rk-cp'));
  step(2,2,14.12);step(1,1,14.45);
  var today=$('rk-today'),avg=$('rk-avg'),k=1;
  function measure(){k=(R[0].el.offsetHeight||40)/60}
  function frame(t){
    card.style.opacity=val(cardO,t);
    avg.style.opacity=val(avgO,t);
    R.forEach(function(q){
      q.el.style.opacity=val(q.o,t);
      q.el.style.transform='translate3d('+(val(q.x,t)*60*k).toFixed(2)+'px,'+(val(q.y,t)*100).toFixed(2)+'%,0)';
    });
    today.style.opacity=val(tO,t);
    today.style.transform='translate3d(0,'+(val(tY,t)*100).toFixed(2)+'%,0)';
    today.setAttribute('data-tier',val(tTier,t));
    today.setAttribute('data-tv',val(tTv,t));
    CAPS.forEach(function(c){
      c.el.style.opacity=val(c.g,t);
      var a=c.el.firstChild,b=c.el.lastChild;
      a.style.opacity=val(c.a,t);a.style.transform='translateY('+(val(c.ay,t)*k).toFixed(2)+'px)';
      b.style.opacity=val(c.b,t);b.style.transform='translateY('+(val(c.by,t)*k).toFixed(2)+'px)';
    });
  }
  measure();
  addEventListener('resize',function(){measure();if(reduce)frame(FINAL)});
  if(reduce){frame(FINAL);return}
  var el=0,last=null,inView=false,raf=null;
  function loop(ts){
    raf=null;
    if(!inView||document.hidden){last=null;return}
    if(last===null)last=ts;
    el+=Math.min((ts-last)/1000,.1);last=ts;
    if(el>=LOOP)el-=LOOP;
    frame(el);
    raf=requestAnimationFrame(loop);
  }
  function kick(){if(raf===null&&inView&&!document.hidden){last=null;raf=requestAnimationFrame(loop)}}
  document.addEventListener('visibilitychange',kick);
  frame(0);
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(en){
      en.forEach(function(x){inView=x.isIntersecting;if(inView)kick()});
    },{rootMargin:'100px 0px'}).observe($('rk'));
  }else{inView=true;kick()}
  /* test hook (no effect on the page): window.__rk(t) draws frame t and stops the loop */
  window.__rk=function(t){inView=false;if(raf!==null){cancelAnimationFrame(raf);raf=null}frame(t)};
})();
