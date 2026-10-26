/* Status section: "Apply to join the testing" button opens the form; answers are posted to a Google Apps Script web app
   (data-endpoint on the form) that appends them to a Google Sheet. No endpoint set = the form says it is not live yet. */
(function(){
  var btn=document.getElementById('apply-btn'),form=document.getElementById('apply-form');
  if(!btn||!form)return;
  var send=document.getElementById('apply-send'),msg=document.getElementById('apply-msg');
  btn.addEventListener('click',function(){
    var open=form.hasAttribute('hidden');
    if(open)form.removeAttribute('hidden');else form.setAttribute('hidden','');
    btn.setAttribute('aria-expanded',open?'true':'false');
    if(open){var f=document.getElementById('ap-use');if(f)f.focus({preventScroll:false})}
  });
  form.addEventListener('submit',function(e){
    e.preventDefault();
    msg.className='st-msg';
    if(!form.checkValidity()){form.reportValidity();return}
    var ep=form.getAttribute('data-endpoint');
    if(!ep){msg.textContent='The form is not live yet. Please write to thequalifireapp@gmail.com.';return}
    if(form.elements.website&&form.elements.website.value){return}
    var body=new URLSearchParams();
    ['use','freq','email'].forEach(function(k){var el=form.elements[k];body.set(k,el.value||'')});
    var chosen=form.querySelector('input[name=freq]:checked');body.set('freq',chosen?chosen.value:'');
    send.disabled=true;msg.textContent='Sending...';
    fetch(ep,{method:'POST',mode:'no-cors',body:body}).then(function(){
      form.reset();
      msg.className='st-msg ok';msg.textContent='Thank you for filling in the form. Your application is under revision.';
      form.classList.add('done');
    }).catch(function(){
      send.disabled=false;msg.textContent='Could not send. Please write to thequalifireapp@gmail.com.';
    });
  });
})();
