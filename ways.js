/* ways comparison slider, Dry / Wet (PLAN-K). Lines: #ways-data = PLACEHOLDER polylines. One rAF loop like hero.js: clock runs only while visible. */
(function(){
var art=document.getElementById('cmp');if(!art)return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(i){return document.getElementById(i)}
function cl(v,a,b){return Math.max(a,Math.min(b,v))}
var DATA=JSON.parse($('ways-data').textContent),hd=$('cmp-h'),dry=$('cmp-dry'),sun=$('cmp-sun'),cv=$('cmp-rain'),ctx=cv.getContext('2d'),
LO=.05,HI=.95,SWEEP=6000,IDLE=1200,LAP=5200,p=.5,clock=0,ticks=0,hold=false,tw=null,auto=false,dir=1,idle=0,idleOn=false,dragging=false,
k=1,riders=[],paths=[],drops=[],cw=0,ch=0,ds=1,loaded=false,lastP=-1;
function eIO(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}
function small(){return matchMedia('(max-width:640px)').matches}
function night(){var t=document.documentElement.getAttribute('data-theme');return t?t!=='light':!matchMedia('(prefers-color-scheme: light)').matches}
function mk(n,a,pr){var e=document.createElementNS(pr.namespaceURI,n);for(var i in a)e.setAttribute(i,a[i]);pr.appendChild(e);return e}
function cum(q){var c=[0];for(var i=1;i<q.length;i++)c.push(c[i-1]+Math.hypot(q[i][0]-q[i-1][0],q[i][1]-q[i-1][1]));return c}
function at(w,f){var c=w.c,t=f*c[c.length-1],i=1;while(i<c.length-1&&c[i]<t)i++;var u=(t-c[i-1])/((c[i]-c[i-1])||1),a=w.p[i-1],b=w.p[i];return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]}
function build(){
var d=DATA[small()?'m':'d'];k=art.clientWidth/d.vb[0]||1;var u=1/k;riders=[];paths=[];
['dry','wet'].forEach(function(n){var s=$('svg-'+n),q=d.ways[n],dd='M'+q.join('L').replace(/,/g,' ');
s.textContent='';s.setAttribute('viewBox','0 0 '+d.vb[0]+' '+d.vb[1]);
mk('path',{d:dd,class:'l cs'},s);mk('path',{d:dd,class:'l yl'},s);
[d.start,d.finish].forEach(function(c){var g=mk('g',{transform:'translate('+c+') scale('+1.1*u+')'},s);
mk('path',{class:'pin',d:'M0 0L-10-18A12 12 0 1 1 10-18Z'},g);mk('circle',{class:'pin-dot',cx:0,cy:-30,r:4},g)});
var r=mk('circle',{class:'rider',r:7*u,'stroke-width':2*u,cx:-99,cy:-99},s);if(reduce)r.style.display='none';riders.push(r);paths.push({p:q,c:cum(q)})});
sizeCv();lastP=-1;render()}
function sizeCv(){var w=cw=art.clientWidth,h=ch=art.clientHeight,n=w<=480?60:120;ds=Math.min(devicePixelRatio||1,1.5);
cv.width=Math.round(w*ds);cv.height=Math.round(h*ds);drops=[];
for(var i=0;i<n;i++)drops.push({x:Math.random()*(w+80)-40,y:Math.random()*h,l:14+Math.random()*8,s:900+Math.random()*400});drawRain(0)}
var SL=Math.sin(.2618),CO=Math.cos(.2618);
function drawRain(dt){ctx.setTransform(ds,0,0,ds,0,0);ctx.clearRect(0,0,cw,ch);
ctx.strokeStyle='rgba(207,227,255,.6)';ctx.lineWidth=1.3;ctx.beginPath();
for(var i=0;i<drops.length;i++){var q=drops[i];
if(dt){q.y+=q.s*dt*CO;q.x-=q.s*dt*SL;if(q.y>ch+20){q.y=-20;q.x=Math.random()*(cw+80)}if(q.x<-40)q.x+=cw+80}
ctx.moveTo(q.x,q.y);ctx.lineTo(q.x+q.l*SL,q.y-q.l*CO)}ctx.stroke()}
function render(){/* writes only when p changed */
if(lastP===p)return;lastP=p;var pc=(p*100).toFixed(2);
dry.style.clipPath='inset(0 '+(100-pc).toFixed(2)+'% 0 0)';hd.style.left=pc+'%';
hd.setAttribute('aria-valuenow',Math.round(p*100))}
function anim(){var f=(clock%LAP)/LAP;for(var i=0;i<2;i++){var q=at(paths[i],f);riders[i].setAttribute('cx',q[0]);riders[i].setAttribute('cy',q[1])}
var a=clock/8000*6.283;sun.style.transform='translate('+Math.sin(a)*2+'%,'+Math.cos(a)*2+'%)'}
/* images follow the SITE theme (both layers use the same map); looks are overlays */
function setImgs(){art.setAttribute('data-map',night()?'night':'day');if(!loaded)return;
var t=night()?'night':'day',z=small()?'m':'d',b='assets/ways-'+t+'-'+z;
[].forEach.call(art.querySelectorAll('picture'),function(pc){pc.querySelector('source').srcset=b+'.webp';var i=pc.querySelector('img'),s=b+'.jpg';if(i.getAttribute('src')!==s)i.src=s})}
/* input */
function touch(){idle=0;idleOn=true;auto=false}
function set(n,d){n=cl(n,0,1);if(d)dir=d;p=n;tw=null;touch();render()}
var ad=false,dec=false,px=0,py=0,p0=0,pid=0;
art.addEventListener('pointerdown',function(e){if(e.button>0)return;ad=true;dec=false;px=e.clientX;py=e.clientY;p0=p;pid=e.pointerId});
art.addEventListener('pointermove',function(e){if(!ad||e.pointerId!==pid)return;var dx=e.clientX-px,dy=e.clientY-py;
if(!dec){if(Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)){dec=dragging=true;art.classList.add('drag');try{art.setPointerCapture(pid)}catch(x){}px=e.clientX;p0=p;dx=0}else return}
var n=cl(p0+dx/art.clientWidth,0,1);set(n,n>p?1:n<p?-1:0)});
function end(){ad=false;if(dec){dec=dragging=false;art.classList.remove('drag');touch()}}
art.addEventListener('pointerup',end);art.addEventListener('pointercancel',end);
hd.addEventListener('keydown',function(e){var m=e.key,n=null;
if(m==='ArrowRight'||m==='ArrowUp')n=p+.05;else if(m==='ArrowLeft'||m==='ArrowDown')n=p-.05;else if(m==='PageUp')n=p+.2;else if(m==='PageDown')n=p-.2;else if(m==='Home')n=0;else if(m==='End')n=1;
if(n!==null){e.preventDefault();set(n,n>p?1:-1)}});
/* autoplay: sweeps LO<->HI, ease in-out, ~6 s per sweep; after IDLE ms it resumes from the CURRENT handle position */
function sweep(){if(p>=HI-.001)dir=-1;else if(p<=LO+.001)dir=1;var b=dir>0?HI:LO;auto=true;idleOn=false;tw={a:p,b:b,d:Math.max(1200,SWEEP*Math.abs(b-p)/(HI-LO)),t:0}}
function advance(dt){
if(dragging)return;
if(idleOn){idle+=dt;if(idle>=IDLE)sweep();return}
if(!auto)return;
if(!tw){dir=-dir;sweep();return}
tw.t+=dt;var u=Math.min(1,tw.t/tw.d);p=tw.a+(tw.b-tw.a)*eIO(u);render();if(u>=1){p=tw.b;tw=null}}
var raf=null,lt=null,inView=true,td=0;
function step(ts){raf=null;if(hold||document.hidden||!inView){lt=null;return}
if(lt===null)lt=ts;var dt=Math.min(ts-lt,100);lt=ts;ticks++;clock+=dt;advance(dt);
if(ts-td>=33){var r=td?Math.min((ts-td)/1000,.1):.033;td=ts;anim();drawRain(r)}
raf=requestAnimationFrame(step)}
function kick(){if(!reduce&&!hold&&raf===null&&inView&&!document.hidden){lt=null;raf=requestAnimationFrame(step)}}
function load(){if(loaded)return;loaded=true;setImgs()}
if('IntersectionObserver' in window){
new IntersectionObserver(function(e){if(e[0].isIntersecting)load()},{rootMargin:'300px'}).observe(art);
new IntersectionObserver(function(e){inView=e[0].isIntersecting;if(inView)kick()},{threshold:.15}).observe(art)}else load();
document.addEventListener('visibilitychange',kick);
new MutationObserver(setImgs).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
matchMedia('(prefers-color-scheme: light)').addEventListener('change',setImgs);
function rebuild(){build();setImgs()}
matchMedia('(max-width:640px)').addEventListener('change',rebuild);
var rt;if('ResizeObserver' in window)new ResizeObserver(function(){clearTimeout(rt);rt=setTimeout(function(){if(art.clientWidth!==cw)rebuild()},120)}).observe(art);
setImgs();build();if(!reduce){auto=true;dir=1;sweep()}else drawRain(0);kick();
/* test hook, no UI: __wx.hold(p,clockMs) freezes everything at handle p (sheets, checks) */
window.__wx={p:function(){return p},clock:function(){return clock},ticks:function(){return ticks},
hold:function(n,c){hold=true;tw=null;auto=false;idleOn=false;p=n;clock=c||0;lastP=-1;render();anim();drawRain(0)}};
})();
