(function(){
  var r=document.documentElement,k='qualifire-theme';
  try{var s=localStorage.getItem(k);if(s)r.setAttribute('data-theme',s)}catch(e){}
  function cur(){var t=r.getAttribute('data-theme');if(t)return t;return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}
  function maps(){
    var d=cur()==='light'?'day':'night';
    var pic=document.getElementById('hero-pic');
    if(pic){
      var so=pic.querySelector('source'),im=pic.querySelector('img');
      var w=pic.getAttribute('data-'+d+'-webp'),j=pic.getAttribute('data-'+d+'-jpg');
      if(so&&w&&so.getAttribute('srcset')!==w)so.setAttribute('srcset',w);
      if(im&&j&&im.getAttribute('src')!==j)im.setAttribute('src',j);
    }
  }
  document.addEventListener('DOMContentLoaded',function(){
    var hd=document.querySelector('header.top');if(hd){var sc=function(){hd.classList.toggle('scrolled',window.scrollY>8)};addEventListener('scroll',sc,{passive:true});sc()}
    var b=document.getElementById('theme');if(!b)return;
    function label(){b.textContent=cur()==='light'?'Night':'Day'}
    label();maps();
    b.addEventListener('click',function(){var n=cur()==='light'?'dark':'light';r.setAttribute('data-theme',n);try{localStorage.setItem(k,n)}catch(e){}label();maps()});
  });
})();
