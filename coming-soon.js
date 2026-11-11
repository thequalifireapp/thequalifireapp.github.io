/* Coming soon: "Tell me" buttons open the notify-me forms; forms post to the Google Apps Script address in data-endpoint on .cs in index.html. */
document.querySelectorAll('.cs .nb').forEach(function(b){b.addEventListener('click',function(){var f=b.parentNode.querySelector('.inl');f.classList.add('open');b.style.display='none';f.querySelector('input').focus()})});
/* Notify-me forms. EP = data-endpoint on the .cs block in index.html: the Google Apps Script web app address (same as the tester form). Empty = not live yet. */
var CSD=document.querySelector('.cs');var EP=(CSD&&CSD.getAttribute('data-endpoint'))||'';
document.querySelectorAll('.cs .inl').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
 if(f.elements.website&&f.elements.website.value)return;
 var go=f.querySelector('.go'),idea=f.getAttribute('data-kind')==='idea';
 function say(t,cls){var p=document.createElement('p');p.className=cls||'ok';p.textContent=t;return p}
 var thanks=idea?'Thank you for your idea.':'Thank you. You will hear from me when it is ready.';
 if(!EP){var nl=f.querySelector('.err');if(!nl){nl=say('The form is not live yet. Please write to thequalifireapp@gmail.com.','ok err');f.appendChild(nl)}return}
 var body=new URLSearchParams();body.set('kind',f.getAttribute('data-kind'));body.set('email',(f.elements.email&&f.elements.email.value)||'');if(idea)body.set('idea',f.elements.idea.value||'');
 go.disabled=true;
 fetch(EP,{method:'POST',mode:'no-cors',body:body}).then(function(){f.replaceWith(say(thanks))}).catch(function(){go.disabled=false;var m=f.querySelector('.err');if(!m){m=say('Could not send. Please write to thequalifireapp@gmail.com.','ok err');f.appendChild(m)}})
})});
