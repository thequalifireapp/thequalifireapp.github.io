/* hero v2 (round3): site map + mini race on the route. Generated from previews/C_hero-ideas.html by apply-hero2-to-site.py. Profiles at the top. */
(function(){
var vis=true;
var DESK={rx:230,ry:-50,rz:100,cw:8,kw:5,gw:3,dr:5},PHONE={rx:0,ry:10,rz:70,cw:7,kw:4,gw:2,dr:5};
var D="M660.6 923.9 L681.1 905.4 L682.5 905.3 L686.2 909.8 L687.3 909.5 L756.1 858.3 L782.7 851.9 L830.8 830.8 L835.8 833.8 L843.7 835.4 L855.7 836.1 L859.1 834.4 L932.8 755.3 L959.5 732.7 L969.9 726.5 L988.1 706.7 L989.4 696.9 L988.5 693.0 L977.8 684.6 L959.0 677.6 L954.9 679.7 L950.7 679.5 L915.9 667.4 L914.6 663.5 L921.1 648.8 L922.1 642.9 L925.2 640.3 L926.5 640.7 L978.3 661.6 L986.8 656.2 L1060.8 595.2 L1064.7 589.7 L1088.6 537.8 L1099.0 520.6 L1123.0 490.1 L1131.4 476.9 L1148.9 456.1 L1160.5 436.7 L1164.0 434.7 L1190.6 431.8 L1195.4 428.9 L1243.7 377.2 L1250.9 359.6 L1268.0 338.3",TK=[[651.2, 913.5, 670.0, 934.3], [868.7, 803.6, 889.2, 822.7], [905.9, 648.6, 931.5, 659.9], [1085.6, 515.7, 1109.6, 530.2], [1257.1, 329.5, 1278.9, 347.1]];
var NS='http://www.w3.org/2000/svg',svg=document.getElementById('sr');
function mk(tag,at,par){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e}
var rt=mk('g',{transform:'translate(640,360)'},svg),cas=mk('path',{class:'sc',d:D},rt),gry=mk('path',{class:'sg',d:D},rt),cas2=mk('path',{class:'sc sc2',d:D},rt),yel=mk('path',{class:'sy',d:D},rt);
var tc=[],tk=[];TK.forEach(function(t){var a={x1:t[0],y1:t[1],x2:t[2],y2:t[3]};tc.push(mk('line',Object.assign({class:'tc'},a),rt));tk.push(mk('line',Object.assign({class:'tk'},a),rt))});
/* app style: the line behind the rider is coloured per sector (between gates): purple / green / yellow, as in the app. Demo colours. */
var SEC=['#F5C542','var(--green)','var(--purple)','#F5C542'],ss=[],ga=[];
(function(){var pts=[],Lt=gry.getTotalLength();for(var l=0;l<=Lt;l+=3){var p=gry.getPointAtLength(l);pts.push([l,p.x,p.y])}
 TK.forEach(function(t){var cx=(t[0]+t[2])/2,cy=(t[1]+t[3])/2,bd=1e9,bl=0;pts.forEach(function(q){var d=(q[1]-cx)*(q[1]-cx)+(q[2]-cy)*(q[2]-cy);if(d<bd){bd=d;bl=q[0]}});ga.push(bl)});
 ga.sort(function(x,y){return x-y});
 for(var i=0;i<ga.length-1;i++){var e=mk('path',{class:'ss',d:D},rt);e.style.stroke=SEC[i%SEC.length];rt.insertBefore(e,tc[0]);ss.push(e)}
})();
var race=mk('g',{},rt),L=gry.getTotalLength(),bb=gry.getBBox(),cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;
var GH=[{n:'Thu',c:'var(--purple)',T:22,f:.88},{n:'Tue',c:'var(--green)',T:24,f:.74},{n:'Mon',c:'var(--green)',T:26,f:.50},{n:'Sat',c:'#F5C542',T:28,f:.36},{n:'Wed',c:'#F5C542',T:30,f:.22}];
var RD={T:16,f:.60},C={rx:220,ry:0,rz:1,cw:10,kw:6,gw:4,dr:8,pace:1,rs:1,lab:1,dots:'app'},u=1,t0=0;
GH.forEach(function(d){d.g=mk('g',{},race);d.w=Math.round(18+d.n.length*7);d.pr=mk('rect',{class:'hp',y:-11,width:d.w,height:22,rx:11},d.g);d.pt=mk('text',{class:'ht','text-anchor':'middle','dominant-baseline':'central'},d.g);d.pt.textContent=d.n;d.c0=mk('circle',{class:'hd','stroke-width':2},d.g)});
var rg=mk('g',{},race),rc=mk('circle',{class:'hr','stroke-width':2.5},rg);
function edge(f){return Math.min(1,Math.min(f,1-f)/.03)}
function at(g,f,op){var p=gry.getPointAtLength(Math.min(.9999,Math.max(.0001,f))*L);g.setAttribute('transform','translate('+p.x.toFixed(1)+','+p.y.toFixed(1)+') scale('+u.toFixed(4)+')');g.style.opacity=op}
function draw(t){
  var ord=[];
  GH.forEach(function(d){var f=((t/(d.T/C.rs))+d.f)%1;at(d.g,f,edge(f));d.g.firstChild.style.display=d.pt.style.display=C.lab?'':'none';ord.push([f,d.g])});
  var rf=((t/(RD.T/C.rs/C.pace))+RD.f)%1;at(rg,rf,edge(rf));ord.push([rf,rg]);
  /* stacking like the app: whoever is further along the route is on top, until the one behind overtakes it */
  ord.sort(function(x,y){return x[0]-y[0]});
  var cur=race.childNodes,chg=false;for(var i=0;i<ord.length;i++){if(cur[i]!==ord[i][1]){chg=true;break}}
  if(chg)ord.forEach(function(o){race.appendChild(o[1])});
  yel.setAttribute('stroke-dasharray',(rf*L).toFixed(1)+' '+(L*2).toFixed(1));yel.style.opacity=edge(rf);cas2.setAttribute('stroke-dasharray',(rf*L).toFixed(1)+' '+(L*2).toFixed(1));cas2.style.opacity=edge(rf);
  ss.forEach(function(e,i){var a=ga[i],b=ga[i+1],v=b-a;/* a sector only gets its colour once the rider has crossed its end gate */if(rf*L<b){e.style.visibility='hidden';return}e.style.visibility='';e.setAttribute('stroke-dasharray',v.toFixed(1)+' '+(L*3).toFixed(1));e.setAttribute('stroke-dashoffset',(-a).toFixed(1));e.style.opacity=edge(rf)});
}
function layout(){
  /* the map picture is shown whole (3200x1800 at the old 1920 scale), not cropped to the hero's shape, so it can be moved over its full extent */
  var hero=document.getElementById('hero'),hw=hero.clientWidth,hh=hero.clientHeight,k0=Math.max(hw/1920,hh/1080)||1,swe=document.getElementById('sw');
  if(swe){swe.style.width=(3200*k0)+'px';swe.style.height=(1800*k0)+'px';swe.style.left=((hw-3200*k0)/2)+'px';swe.style.top=((hh-1800*k0)/2)+'px'}
  var r={width:svg.clientWidth,height:svg.clientHeight},s=Math.max(r.width/3200,r.height/1800)||1;u=1/(s*C.rz);
  var fx=1;var sw=document.getElementById('sw');if(sw)sw.style.transform='translate('+(C.rx*fx)+'px,'+C.ry+'px) scale('+C.rz+')';
  cas.setAttribute('stroke-width',C.cw*u);cas2.setAttribute('stroke-width',C.cw*u);ss.forEach(function(e){e.setAttribute('stroke-width',C.kw*u)});gry.setAttribute('stroke-width',C.kw*u);yel.setAttribute('stroke-width',C.kw*u);
  tc.forEach(function(e){e.setAttribute('stroke-width',(C.gw+3)*u)});tk.forEach(function(e){e.setAttribute('stroke-width',C.gw*u)});
  GH.forEach(function(d){var R=C.dr,w=d.w;d.c0.setAttribute('r',R);d.c0.setAttribute('fill',C.dots==='app'?d.c:'#F5C542');d.pr.setAttribute('x',-(R+5+w));d.pt.setAttribute('x',-(R+5+w/2))});
  rc.setAttribute('r',C.dr+1);
}
window.raceApply=function(S){C.rx=+S.rx;C.ry=+S.ry;C.rz=S.rz/100;C.cw=+S.cw;C.kw=+S.kw;C.gw=+S.gw;C.dr=+S.dr;C.pace=S.pace/100;C.rs=S.rs/100;C.lab=S.lab==='1'?1:0;C.dots=S.dots;layout();draw(still?0:t0)};
var still=/[?&]still/.test(location.search)||matchMedia('(prefers-reduced-motion:reduce)').matches,last=null,raf=null;
function loop(ts){raf=null;if(document.hidden||!vis){last=null;raf=requestAnimationFrame(loop);return}
  if(last===null)last=ts;t0+=Math.min((ts-last)/1000,.1);last=ts;draw(t0);raf=requestAnimationFrame(loop)}
addEventListener('resize',function(){layout();draw(t0)});
window.__sr=function(t){still=true;t0=t;layout();draw(t)};
/* profiles: laptop numbers above 700 px, phone numbers up to 700 px (same break point as the CSS) */
var mq=matchMedia('(max-width:700px)');
function go(){var p=mq.matches?PHONE:DESK;window.raceApply({rx:p.rx,ry:p.ry,rz:p.rz,cw:p.cw,kw:p.kw,gw:p.gw,dr:p.dr,pace:125,rs:100,lab:'1',dots:'app'})}
if(mq.addEventListener)mq.addEventListener('change',go);else mq.addListener(go);
var hero=document.getElementById('hero');hero.classList.add('in');
if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting},{rootMargin:'120px'}).observe(hero);
go();if(!still)raf=requestAnimationFrame(loop);
})();
