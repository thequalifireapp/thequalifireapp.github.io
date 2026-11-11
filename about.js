/* About section: the moving Q (follows mouse or finger, swings back to rest) and the straight-up/down swipe rule. */
(function(){
 var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,still=location.search.indexOf('still')>-1,ring=2*Math.PI;
 function pt(a,r){r=r||118;return [256+r*Math.sin(a),218-r*Math.cos(a)]}
 var mx=null,my=null;var lock=null;
 function ang(){var s=document.getElementById('qm1');if(!s||mx===null)return null;var c=ctr(s);return Math.atan2(my-c[1],mx-c[0])}
 function aim(x,y){mx=x;my=y;lock=null}
 function rel(){lock=null;mx=null}
 addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;aim(e.clientX,e.clientY)},{passive:true});
 /* finger (or the click-and-hold stand-in): the yellow line follows it while it touches the screen; on release it swings back to the standard orientation by the shortest way */
 /* the Q only reacts while the finger is inside the About section; outside it (or after lifting) it swings back to rest */
 var act=false,SEC=null;
 function inSec(x,y){SEC=SEC||document.getElementById('about-m1');if(!SEC)return false;var r=SEC.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom}
 function touchAt(x,y){if(inSec(x,y)){act=true;aim(x,y)}else if(act){act=false;rel()}}
 function touchEnd(){if(act){act=false;rel()}}
 addEventListener('touchstart',function(e){var t=e.touches[0];touchAt(t.clientX,t.clientY)},{passive:true});
 addEventListener('touchmove',function(e){var t=e.touches[0];touchAt(t.clientX,t.clientY)},{passive:true});
 addEventListener('touchend',touchEnd,{passive:true});addEventListener('touchcancel',touchEnd,{passive:true});
 function ctr(svg){var r=svg.getBoundingClientRect();return [r.left+(256-116)/294*r.width,r.top+(218-78)/294*r.height,r.width]}
 function sh(d){while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d}
 var REST=Math.PI/4;
 (function(){var svg=document.getElementById('qm1');if(!svg||RM||still)return;var g=document.getElementById('qm1g'),a=REST;
  (function loop(){var c=ctr(svg),t=lock!==null?lock:mx===null?REST:Math.atan2(my-c[1],mx-c[0]);a+=sh(t-a)*.12;g.setAttribute('transform','rotate('+((a-REST)*180/Math.PI).toFixed(2)+' 256 218)');requestAnimationFrame(loop)})()})();

})();
/* About section: a swipe scrolls the page only when it is nearly straight up or down; any sideways or diagonal move is for the Q and does not scroll */
(function(){var A=document.getElementById('about-m1');if(!A)return;var sx=0,sy=0,mode=0;
A.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;mode=0},{passive:true});
A.addEventListener('touchmove',function(e){var t=e.touches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(!mode&&(Math.abs(dx)>6||Math.abs(dy)>6))mode=Math.abs(dy)>2*Math.abs(dx)?1:2;if(mode===2&&e.cancelable)e.preventDefault()},{passive:false});
})();
