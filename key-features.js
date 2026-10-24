/* Key features (final, round7 / C25). No external requests.
   - each card is a plain link to feature.html?f=N (same tab). Laptop: mouse hover or keyboard focus shows a text preview over the picture;
     click/Enter goes to the detail page; Esc closes the preview. The preview is switched off below 640 px (CSS), so a phone tap goes straight to the detail page.
   - card 2 pill row: the yellow highlight steps through all pills in DOM order (1 s each), loops forever, pauses when the row is off screen or the tab is hidden,
     static (highlight stays on "Fast walk") under prefers-reduced-motion. Test hook: ?pill=1..7 freezes the highlight on that pill.
   - detail page: shows the article chosen by ?f=1..6 (default 1). Without JS all six are listed (CSS). */
(function(){
  var root=document.getElementById('built-in');if(!root)return;
  var q=new URLSearchParams(location.search);

  var cards=[].slice.call(root.querySelectorAll('.fc'));
  var lap=matchMedia('(hover:hover) and (min-width:640px)'); /* laptop: no detail page, the hover preview is the whole card */
  function set(c,on){c.classList.toggle('open',on)}
  cards.forEach(function(c){
    var a=c.querySelector('.fc-btn');
    a.addEventListener('click',function(e){if(lap.matches)e.preventDefault()});
    c.addEventListener('pointerenter',function(e){
      if(e.pointerType!=='mouse')return;
      cards.forEach(function(o){if(o!==c)set(o,false)});set(c,true);
    });
    c.addEventListener('pointerleave',function(e){
      if(e.pointerType!=='mouse')return;
      var ae=document.activeElement;
      if(!(c.contains(ae)&&ae.matches(':focus-visible')))set(c,false);
    });
    a.addEventListener('focus',function(){try{if(a.matches(':focus-visible')){cards.forEach(function(o){set(o,false)});set(c,true)}}catch(e){}});
    a.addEventListener('blur',function(){set(c,false)});
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')cards.forEach(function(c){set(c,false)})});

  var arts=root.querySelectorAll('.fd');
  if(arts.length){
    var f=parseInt(q.get('f'),10);if(!(f>=1&&f<=6))f=1;
    arts.forEach(function(a){a.classList.toggle('on',a.getAttribute('data-f')==String(f))});
    var on=document.getElementById('f'+f);
    document.title=on.querySelector('h1').textContent+' | Qualifire';
  }

  var reduce=matchMedia('(prefers-reduced-motion: reduce)');
  root.querySelectorAll('.sp-pills').forEach(function(row){
    var pills=[].slice.call(row.querySelectorAll('.sp-pill'));
    if(pills.length<2)return;
    function show(i){pills.forEach(function(p,k){p.classList.toggle('on',k===i)})}
    var fixed=parseInt(q.get('pill'),10);
    if(fixed>=1&&fixed<=pills.length){show(fixed-1);return}
    var i=-1,timer=null,inView=false;
    function tick(){var n;do{n=Math.floor(Math.random()*pills.length)}while(n===i);i=n;show(i)} /* random pick, never the same twice in a row */
    function update(){
      var run=inView&&!document.hidden&&!reduce.matches;
      if(run&&!timer){tick();timer=setInterval(tick,1000)}
      if(!run&&timer){clearInterval(timer);timer=null}
    }
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){inView=es[es.length-1].isIntersecting;update()},{threshold:0.2}).observe(row);
    }else{inView=true}
    document.addEventListener('visibilitychange',update);
    if(reduce.addEventListener)reduce.addEventListener('change',update);
    update();
  });
})();

/* cards 1 and 5: the SVG animations (race, maze) stop under reduced motion and while off screen or the tab is hidden */
(function(){
  var svgs=[].slice.call(document.querySelectorAll('#built-in svg.sp-ov,#built-in svg.sp-art'));if(!svgs.length||!svgs[0].pauseAnimations)return;
  var rm=matchMedia('(prefers-reduced-motion: reduce)');
  svgs.forEach(function(s){
    var inView=true;
    function upd(){
      if(rm.matches){s.pauseAnimations();try{s.setCurrentTime(3.2)}catch(e){}return}
      if(inView&&!document.hidden)s.unpauseAnimations();else s.pauseAnimations();
    }
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[es.length-1].isIntersecting;upd()},{threshold:0.05}).observe(s);
    document.addEventListener('visibilitychange',upd);
    if(rm.addEventListener)rm.addEventListener('change',upd);
    upd();
  });
})();

/* card 4: "Recent you": the window of recent activities rolls on every 2.8 s (oldest fades out, yesterday turns grey, a new bar for today grows).
   Stays still under reduced motion, off screen or in a hidden tab. Without script the static bars in the page stay. */
(function(){
  var NS='http://www.w3.org/2000/svg',BASE=180,rm=matchMedia('(prefers-reduced-motion: reduce)');
  [].slice.call(document.querySelectorAll('#built-in .roll')).forEach(function(g){
    var bars=[],inView=true,timer=null;
    while(g.firstChild)g.removeChild(g.firstChild);
    function hh(){return 55+Math.round(Math.random()*95)}
    function tf(b){return 'translateX('+(b.slot*40+20)+'px) scaleY('+b.s+')'}
    function cls(b){return b.slot<=0?'rw-out':(b.slot>=9?'rw-bar-y':'rw-bar')}
    function mk(slot,h,s){var e=document.createElementNS(NS,'rect');e.setAttribute('x',0);e.setAttribute('y',BASE-h);e.setAttribute('width',28);e.setAttribute('height',h);e.setAttribute('rx',3);
      var b={el:e,slot:slot,s:s};e.setAttribute('class','rb '+cls(b));e.style.transform=tf(b);g.appendChild(e);bars.push(b);return b}
    [70,100,60,130,90,115,75,105,85,150].forEach(function(h,i){mk(i,h,1)});
    function step(){
      var gone=bars.filter(function(b){return b.slot<=0})[0];
      if(gone){bars.splice(bars.indexOf(gone),1);gone.el.style.opacity=0;setTimeout(function(){if(gone.el.parentNode)gone.el.parentNode.removeChild(gone.el)},800)}
      bars.forEach(function(b){b.slot--;b.el.setAttribute('class','rb '+cls(b));b.el.style.transform=tf(b)});
      var nb=mk(9,hh(),0);nb.el.getBoundingClientRect();nb.s=1;nb.el.style.transform=tf(nb);
    }
    function upd(){var run=inView&&!document.hidden&&!rm.matches;if(run&&!timer)timer=setInterval(step,2800);if(!run&&timer){clearInterval(timer);timer=null}}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[es.length-1].isIntersecting;upd()},{threshold:.2}).observe(g.ownerSVGElement);
    document.addEventListener('visibilitychange',upd);
    if(rm.addEventListener)rm.addEventListener('change',upd);
    upd();setTimeout(function(){if(!rm.matches&&!timer)return;if(!rm.matches)step()},700);
  });
})();

/* card 6: a random way (Sunny, Calm, Fast) lights up every 1.8 s, never the same twice in a row. Still under reduced motion, off screen or in a hidden tab. */
(function(){
  var rm=matchMedia('(prefers-reduced-motion: reduce)');
  [].slice.call(document.querySelectorAll('#built-in .cE')).forEach(function(svg){
    var els=[0,1,2].map(function(k){return [].slice.call(svg.querySelectorAll('.w'+k))});
    var i=1,timer=null,inView=true;
    function show(n){els.forEach(function(g,k){g.forEach(function(e){e.classList.toggle('on',k===n)})})}
    function tick(){var n;do{n=Math.floor(Math.random()*3)}while(n===i);i=n;show(i)}
    function upd(){var run=inView&&!document.hidden&&!rm.matches;if(run&&!timer){tick();timer=setInterval(tick,1800)}if(!run&&timer){clearInterval(timer);timer=null}}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[es.length-1].isIntersecting;upd()},{threshold:.2}).observe(svg);
    document.addEventListener('visibilitychange',upd);
    if(rm.addEventListener)rm.addEventListener('change',upd);
    upd();
  });
})();
