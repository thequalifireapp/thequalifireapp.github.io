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
  function set(c,on){c.classList.toggle('open',on)}
  cards.forEach(function(c){
    var a=c.querySelector('.fc-btn');
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
    function tick(){i=(i+1)%pills.length;show(i)}
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
