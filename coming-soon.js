/* Coming soon: "Tell me" buttons open the notify-me forms; forms post to the Google Apps Script address in data-endpoint on .cs in index.html. */
document.querySelectorAll('.cs .nb').forEach(function(b){b.addEventListener('click',function(){var f=b.parentNode.querySelector('.inl');f.classList.add('open');b.style.display='none';f.querySelector('input').focus()})});
/* Notify-me forms. EP = data-endpoint on the .cs block in index.html: the Google Apps Script web app address (same as the tester form). Empty = not live yet. */
var CSD=document.querySelector('.cs');var EP=(CSD&&CSD.getAttribute('data-endpoint'))||'';
document.querySelectorAll('.cs .inl').forEach(function(f){f.setAttribute('novalidate','');f.addEventListener('submit',function(e){e.preventDefault();
 var go=f.querySelector('.go'),idea=f.getAttribute('data-kind')==='idea';
 if(go.disabled)return;
 /* Own check with the site's own message (the browser bubble is switched off): same rule as the script, a dot after the @, otherwise the script ignores the address without a word. */
 function warn(t,el){var m=f.querySelector('.err');if(!m){m=document.createElement('p');m.className='ok err';f.appendChild(m)}m.textContent=t;if(el)el.focus()}
 var em=f.elements.email,ev=(em&&em.value||'').trim();
 if(idea&&!(f.elements.idea.value||'').trim()){warn('Please write your idea.',f.elements.idea);return}
 if((!idea||ev)&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ev)){warn('Please use a valid address.',em);return}
 var oe=f.querySelector('.err');if(oe)oe.remove();
 function say(t,cls){var p=document.createElement('p');p.className=cls||'ok';p.textContent=t;return p}
 var thanks=say(idea?'Thank you for your idea.':'Thank you. You will hear from me when it is ready.');
 var hp=f.elements.hp_check&&f.elements.hp_check.value;
 if(hp){f.replaceWith(thanks);return}
 if(!EP){var nl=f.querySelector('.err');if(!nl){nl=say('The form is not live yet. Please write to thequalifireapp@gmail.com.','ok err');f.appendChild(nl)}return}
 var body=new URLSearchParams();body.set('kind',f.getAttribute('data-kind'));body.set('email',(f.elements.email&&f.elements.email.value)||'');if(idea)body.set('idea',f.elements.idea.value||'');
 /* Same sending as the tester form (apply.js): no keepalive (some phone browsers drop keepalive sends to Google without any error), and the thank-you shows only once the request has gone out. */
 var label=go.textContent;go.disabled=true;go.textContent='Sending...';
 fetch(EP,{method:'POST',mode:'no-cors',body:body}).then(function(){var again=document.createElement('button');again.type='button';again.className='again';again.textContent='More';again.addEventListener('click',function(){f.reset();go.disabled=false;go.textContent=label;var oe=f.querySelector('.err');if(oe)oe.remove();thanks.replaceWith(f);f.querySelector('input:not([name=hp_check])').focus()});thanks.appendChild(again);f.replaceWith(thanks)}).catch(function(){go.disabled=false;go.textContent=label;var m=f.querySelector('.err');if(!m){m=say('Could not send. Please write to thequalifireapp@gmail.com.','ok err');f.appendChild(m)}})
})});
