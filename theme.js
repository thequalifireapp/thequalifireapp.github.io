(function(){
  var r=document.documentElement,k='qualifire-theme';
  try{var s=localStorage.getItem(k);if(s)r.setAttribute('data-theme',s)}catch(e){}
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.getElementById('theme');if(!b)return;
    function cur(){var t=r.getAttribute('data-theme');if(t)return t;return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}
    function label(){b.textContent=cur()==='light'?'Night':'Day'}
    label();
    b.addEventListener('click',function(){var n=cur()==='light'?'dark':'light';r.setAttribute('data-theme',n);try{localStorage.setItem(k,n)}catch(e){}label()});
  });
})();
