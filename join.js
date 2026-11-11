/* Invitation page: tells the Google Apps Script (data-endpoint on body) that this person opened the page and when they press the join button. Needs ?e=<email> in the address. */
(function(){
var EP=document.body.getAttribute('data-endpoint')||'',e=(new URLSearchParams(location.search).get('e')||'').trim();
function send(k){if(!EP||!e)return;var b=new URLSearchParams();b.set('kind',k);b.set('email',e);try{fetch(EP,{method:'POST',mode:'no-cors',body:b,keepalive:true})}catch(x){}}
send('opened');
var g=document.getElementById('jgo');if(g)g.addEventListener('click',function(){send('clicked')});
})();
