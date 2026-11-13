document.addEventListener('DOMContentLoaded',function(){
 document.querySelectorAll('[data-vp-hero]').forEach(hero=>{
  const slides=[...hero.querySelectorAll('.vp-hero-slide')],dots=[...hero.querySelectorAll('.vp-hero-dots button')];
  if(slides.length<2)return;
  let current=Math.max(0,slides.findIndex(s=>s.classList.contains('is-active'))),timer=null;
  function show(i){slides[current].classList.remove('is-active');if(dots[current])dots[current].classList.remove('is-active');current=(i+slides.length)%slides.length;slides[current].classList.add('is-active');if(dots[current])dots[current].classList.add('is-active');}
  function stop(){if(timer)clearInterval(timer);timer=null;}
  function start(){stop();if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>show(current+1),6000);}
  const prev=hero.querySelector('.vp-hero-prev'),next=hero.querySelector('.vp-hero-next');
  if(prev)prev.addEventListener('click',()=>{show(current-1);start();});
  if(next)next.addEventListener('click',()=>{show(current+1);start();});
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);start();}));
  hero.addEventListener('mouseenter',stop);hero.addEventListener('mouseleave',start);start();
 });

 const menu=document.querySelector('.vp-menu-toggle'),nav=document.querySelector('.vp-nav');
 if(menu&&nav)menu.addEventListener('click',()=>{let open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',open?'true':'false');});
 const panel=document.querySelector('.vp-assistant'),launch=document.querySelector('.vp-chat-launch');
 if(!panel||!launch)return;
 const close=panel.querySelector('.vp-assistant-close'),form=panel.querySelector('form'),input=form.querySelector('input'),messages=panel.querySelector('.vp-assistant-messages'),voice=panel.querySelector('.vp-voice-toggle'),mic=panel.querySelector('.vp-mic-button');
 let voiceOn=false;
 function add(text,who){let el=document.createElement('div');el.className='vp-chat-message '+(who==='user'?'vp-chat-user':'vp-chat-bot');el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;}
 function answer(q){q=q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 if(/que es|vinoteca|acerca|sobre la pagina/.test(q))return 'Vinoteca Premium es un proyecto académico de presentación digital dedicado a acercar la cultura del vino. Reúne información sobre variedades, regiones, maridajes y experiencias. La tienda puede conectarse con productos reales de Shopify cuando se configure el catálogo.';
 if(/seccion|pagina|menu|inicio|nosotros|catalogo|promocion|contacto/.test(q))return 'Inicio presenta la marca; Nosotros cuenta su propósito; Catálogo permite explorar variedades y productos; Promociones reúne campañas; Contacto ofrece los canales para escribir al equipo.';
 if(/variedad|tinto|blanco|rose|rosado|espumante|cabernet|malbec|chardonnay|merlot|pinot/.test(q))return 'Entre las variedades que presentamos están Cabernet Sauvignon, Malbec, Merlot, Pinot Noir, Chardonnay, Sauvignon Blanc, Rosé y espumantes. Las fichas describen perfiles generales que cambian según productor y región.';
 if(/maridaje|comida|queso|carne|pescado/.test(q))return 'Como orientación: tintos estructurados suelen acompañar carnes y quesos curados; blancos frescos van bien con pescados y mariscos; rosados acompañan aperitivos y platos ligeros.';
 if(/equipo|creador|autor|proyecto|academico/.test(q))return 'Este proyecto académico fue desarrollado por Luis Ángel Bravo Tumba y Ángel Candia Molina.';
 if(/telefono|llamar|whatsapp|correo|email|contact/.test(q))return 'Puedes contactar al equipo al +51 929 184 435 o escribir a a.luisbravo@seoane.edu.pe. También están los accesos de llamada, correo y WhatsApp en esta ventana.';
 if(/shopify|comprar|pedido|pago|precio|stock|envio/.test(q))return 'Los productos, precios, disponibilidad y pagos dependen de la configuración real de la tienda Shopify. Consulta las fichas de producto para conocer los datos publicados.';
 if(/gracias/.test(q))return '¡Con gusto! Estoy aquí para orientarte sobre el sitio y su contenido.';
 return 'Puedo ayudarte con Vinoteca Premium, el proyecto académico, las secciones, variedades, maridajes y contacto. Para una consulta personalizada escribe a a.luisbravo@seoane.edu.pe o usa WhatsApp al +51 929 184 435.';}
 function speak(t){if(!voiceOn||!window.speechSynthesis)return;speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(t);u.lang='es-ES';u.rate=.94;u.pitch=1.08;let vs=speechSynthesis.getVoices(),es=vs.filter(v=>/^es/i.test(v.lang));u.voice=es.find(v=>/female|woman|monica|paulina|helena|lucia|sofia|zira|laura|elena/i.test(v.name))||es[0]||null;speechSynthesis.speak(u);}
 function ask(q){q=q.trim();if(!q)return;add(q,'user');let a=answer(q);setTimeout(()=>{add(a,'bot');speak(a);},220);}
 function open(){panel.hidden=false;launch.setAttribute('aria-expanded','true');input.focus();}
 function shut(){panel.hidden=true;launch.setAttribute('aria-expanded','false');if(window.speechSynthesis)speechSynthesis.cancel();}
 launch.addEventListener('click',()=>panel.hidden?open():shut());close.addEventListener('click',shut);
 form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);input.value='';});
 panel.querySelectorAll('[data-vp-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.vpQuestion)));
 voice.addEventListener('click',()=>{voiceOn=!voiceOn;voice.setAttribute('aria-pressed',voiceOn?'true':'false');voice.textContent=voiceOn?'♫ Voz activada':'♫ Escuchar respuestas';if(voiceOn)speak('La lectura de respuestas está activada.');else if(window.speechSynthesis)speechSynthesis.cancel();});
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(SR){let rec=new SR();rec.lang='es-PE';mic.addEventListener('click',()=>rec.start());rec.onresult=e=>ask(e.results[0][0].transcript);rec.onerror=()=>add('No pude reconocer el audio. Puedes escribir tu consulta.','bot');}else mic.hidden=true;
});
document.addEventListener('submit',function(event){
 const form=event.target.closest('[data-vp-whatsapp-form]');
 if(!form)return;
 event.preventDefault();
 if(!form.reportValidity())return;
 const data=new FormData(form);
 const message=[
 'Hola, Vinoteca Premium.',
 'Nombre: '+(data.get('name')||''),
 'Correo: '+(data.get('email')||''),
 'Asunto: '+(data.get('subject')||''),
 'Mensaje: '+(data.get('message')||'')
 ].join('\n');
 const number=form.getAttribute('data-wa-number')||'51929184435';
 window.open('https://wa.me/'+number+'?text='+encodeURIComponent(message),'_blank','noopener');
});
