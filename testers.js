/* touch behaviour: while a finger is on a pill it is yellow and its row stands still; as soon as the finger lifts or is not on a pill, the rows move again (the Q turns to the last tap, see above) */
(function(){var L=document.querySelector('#t7 .lanes');if(!L)return;var hot=null,down=false;
function off(){if(hot)hot.classList.remove('hot');L.classList.remove('hold');hot=null}
function at(x,y){var el=document.elementFromPoint(x,y),p=el&&el.closest?el.closest('#t7 .lanes .pill2'):null;if(p===hot)return;off();if(p){hot=p;p.classList.add('hot');L.classList.add('hold')}}
function end(){down=false;off()}
document.addEventListener('touchstart',function(e){var t=e.touches[0];down=true;at(t.clientX,t.clientY)},{passive:true});
document.addEventListener('touchmove',function(e){if(!down)return;var t=e.touches[0];at(t.clientX,t.clientY)},{passive:true});
['touchend','touchcancel'].forEach(function(n){document.addEventListener(n,end,{passive:true})});
})();
