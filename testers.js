/* touch behaviour: while a finger is on a pill it is yellow and its row stands still; as soon as the finger lifts or is not on a pill, the rows move again (the Q turns to the last tap, see above) */
(function(){var L=document.querySelector('#t7 .lanes');if(!L)return;var hot=null,down=false;
function off(){if(hot)hot.classList.remove('hot');L.classList.remove('hold');hot=null}
function at(x,y){var el=document.elementFromPoint(x,y),p=el&&el.closest?el.closest('#t7 .lanes .pill2'):null;if(p===hot)return;off();if(p){hot=p;p.classList.add('hot');L.classList.add('hold')}}
function end(){down=false;off()}
document.addEventListener('touchstart',function(e){var t=e.touches[0];down=true;at(t.clientX,t.clientY)},{passive:true});
document.addEventListener('touchmove',function(e){if(!down)return;var t=e.touches[0];at(t.clientX,t.clientY)},{passive:true});
['touchend','touchcancel'].forEach(function(n){document.addEventListener(n,end,{passive:true})});
})();
/* Live numbers: the Google Apps Script (data-endpoint of the apply form) returns total, testers and places left from the Stats tab of the spreadsheet. The typed numbers in index.html stay if this cannot be read. */
(function(){var f=document.getElementById('apply-form'),EP=f&&f.getAttribute('data-endpoint');if(!EP||!window.fetch)return;
function ok(n){return typeof n==='number'&&isFinite(n)&&n>=0&&n===Math.floor(n)}
function set(k,t){var e=document.querySelector('[data-stat="'+k+'"]');if(e)e.textContent=t}
fetch(EP+'?stats=1').then(function(r){return r.json()}).then(function(d){
 if(!d||!ok(d.total)||!ok(d.testers)||!ok(d.left))return;
 set('testers',d.testers);set('total',d.total);
 set('left',d.left===1?'1 place left':d.left===0?'No places left':d.left+' places left');
 var b=d.bars,rows=document.querySelectorAll('.bars .bar');
 if(b&&b.length===4&&rows.length===4&&b.every(ok)){var mx=Math.max.apply(null,b);
  for(var i=0;i<4;i++){var n=rows[i].querySelectorAll('.l span')[1],fill=rows[i].querySelector('.t i');
   if(n)n.textContent=b[i];if(fill)fill.style.setProperty('--w',(mx?Math.round(b[i]/mx*100):0)+'%')}}
}).catch(function(){})})();
