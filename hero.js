(function(){
  var hp=document.getElementById('route-path');
  if(!hp)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){return document.getElementById(id)}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  var hl=hp.getTotalLength();
  var hc=$('route-casing');
  var hr=$('rider'),hticks=[].slice.call(document.querySelectorAll('#hero-map .tick'));
  function place(path,len,dot,p){var pt=path.getPointAtLength(clamp(p,0,1)*len);dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y)}
  var HOLD_MS=2200,FADE_MS=700,HERO_MS=2400,heroDone=false;
  function heroFrame(p,f){
    if(f===undefined)f=1;
    hp.style.strokeDashoffset=hl*(1-p);
    if(hc)hc.style.strokeDashoffset=hl*(1-p);
    place(hp,hl,hr,p);
    hp.style.opacity=f;
    if(hc)hc.style.opacity=.55*f;
    hr.style.opacity=f;
    hticks.forEach(function(t){t.style.opacity=(f>0&&p+0.001>=parseFloat(t.getAttribute('data-f')))?f:0});
  }
  if(reduce){
    heroDone=true;place(hp,hl,hr,1);
  }else{
    hp.style.strokeDasharray=hl;
    if(hc)hc.style.strokeDasharray=hl;
    heroFrame(0);
    /* loop: draw -> hold -> fade -> restart; clock only advances while running */
    var el=0,last=null,running=true,inView=true,raf=null,CYCLE=HERO_MS+HOLD_MS+FADE_MS;
    function loopStep(ts){
      raf=null;
      if(!running||!inView||document.hidden){last=null;return}
      if(last===null)last=ts;
      el+=Math.min(ts-last,100);last=ts;
      if(el>=CYCLE)el-=CYCLE;
      if(el<HERO_MS){
        var u=el/HERO_MS,e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
        heroFrame(e,1);
      }else if(el<HERO_MS+HOLD_MS){
        heroFrame(1,1);
        if(!heroDone){heroDone=true}
      }else{
        heroFrame(1,1-(el-HERO_MS-HOLD_MS)/FADE_MS);
      }
      raf=requestAnimationFrame(loopStep);
    }
    function kick(){if(raf===null&&inView&&!document.hidden){last=null;raf=requestAnimationFrame(loopStep)}}
    document.addEventListener('visibilitychange',kick);
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(en){
        en.forEach(function(x){inView=x.isIntersecting;if(inView)kick()});
      },{rootMargin:'200px 0px'}).observe($('hero-map'));
    }
    kick();
  }
})();
