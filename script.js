/* ===== AKatshï-01 — logique du jeu ===== */
const $=s=>document.querySelector(s),sl=t=>new Promise(r=>setTimeout(r,t)),M=$('#main'),
esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
let S=null,G=0,ac,on=1,dr; // S = sauvegarde, G = "génération" d'écran (annule les animations en cours)
try{S=JSON.parse(localStorage.getItem('ak01'))}catch(e){}
S=S||{s:0,inv:{}};
const save=()=>{try{localStorage.setItem('ak01',JSON.stringify(S))}catch(e){}};



/* ----- Audio (Web Audio, déclenché au premier clic) ----- */
const au=()=>{try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();ac.resume()}catch(e){}};
document.addEventListener('click',au);
function nz(d=.4,v=.15){ // bruit blanc
  if(!on||!ac)return;const n=ac.sampleRate*d,b=ac.createBuffer(1,n,ac.sampleRate),a=b.getChannelData(0);
  for(let i=0;i<n;i++)a[i]=Math.random()*2-1;
  const s=ac.createBufferSource(),g=ac.createGain();g.gain.setValueAtTime(v,ac.currentTime);
  g.gain.linearRampToValueAtTime(0,ac.currentTime+d);s.buffer=b;s.connect(g).connect(ac.destination);s.start()}
function bp(f,d=.25){ // bip
  if(!on||!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=f;
  g.gain.value=.05;g.gain.linearRampToValueAtTime(0,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}
function drone(){ // grondement du niveau 2
  if(!on||!ac||dr)return;dr=ac.createOscillator();const g=ac.createGain();dr.type='sawtooth';dr.frequency.value=48;
  g.gain.value=.025;dr.connect(g).connect(ac.destination);dr.start()}
const stopDrone=()=>{if(dr){try{dr.stop()}catch(e){}dr=0}};
$('#snd').onclick=()=>{on^=1;$('#snd').textContent='SON : '+(on?'ON':'OFF');if(!on)stopDrone()};
$('#rst').onclick=()=>{
  if(!confirm('Tout effacer et recommencer depuis le début ?'))return;
  try{localStorage.removeItem('ak01')}catch(e){}
  location.reload();
};



/* ----- Effets ----- */
function gl(ms=400){document.body.classList.add('glitch');nz(ms/1000,.12);setTimeout(()=>document.body.classList.remove('glitch'),ms)}
function fake(){
  const e=$('#err');e.innerHTML='<b>⚠ ERR_CONNECTION_RESET</b><br>Impossible d\'accéder à ce site. La connexion a été réinitialisée.<br><small>net::ERR_AKATSHI_01</small>';
  e.hidden=false;nz(.3,.1);setTimeout(()=>e.hidden=true,2200)}
(function lp(){setTimeout(()=>{if(S.s>0)Math.random()<.5?gl(350):fake();lp()},9000+Math.random()*15000)})();

async function tw(el,html,ms=20){ // machine à écrire (gère le HTML)
  const g=G;el.innerHTML=html;const a=[],w=document.createTreeWalker(el,4);let n;
  while(n=w.nextNode())a.push([n,n.data]);a.forEach(([n])=>n.data='');
  for(const[n,t]of a){if(!ms){n.data=t;continue}for(const c of t){if(g!==G)return;n.data+=c;await sl(ms)}}}


/* ----- Inventaire ----- */
function inv(){const k=Object.values(S.inv);$('#items').innerHTML=k.length?k.map(x=>`<span class="it">${x}</span>`).join(''):'<i>— vide —</i>'}
function add(id,t){if(S.inv[id])return;S.inv[id]=t;save();inv();bp(880,.12)}
function pop(t){const d=document.createElement('div');d.className='pop';d.innerHTML=`<pre>${t}</pre><button>fermer</button>`;
  d.querySelector('button').onclick=()=>d.remove();document.body.append(d);nz(.15,.1)}


/* ----- Navigation entre écrans ----- */
function go(n){
  G++;S.s=n;save();stopDrone();document.body.classList.toggle('scan',n>0);
  $('#lay').textContent=['','COUCHE 1 // ACCÈS','COUCHE 2 // MÉMOIRE','COUCHE 3 // LE CŒUR','LIBÉRATION'][n]||'';
  M.innerHTML='';n>0&&gl(500);[intro,l1,l2,l3,fin][n]();inv()}



/* ===== INTRO ===== */
const STORY=[
 '03:14. Ton écran s\'allume tout seul. Un message crypté vient d\'atterrir : la signature est celle d\'un ancien contact — celui qui t\'a tout appris, puis qui a disparu du jour au lendemain.',
 '« Ils m\'ont enfermé dans AKatshï-01, le système central d\'Obsidian Corp. Je n\'ai plus beaucoup de temps. Viens me chercher. Ne fais confiance à rien de ce que tu verras. »',
 'Tu es hacker freelance. Tu ne devrais pas répondre. Tu le fais quand même.'];
const ALERT=['⚠ ALERTE SYSTÈME','> intrusion externe détectée','> traçage en cours… ██████░░░░','> verrouillage des 3 dernières couches de sécurité','> vous ne pouvez plus sortir.'];
async function intro(){
  M.innerHTML='<h2 class="titre">AKatshï-01</h2><div id="sy"></div><div id="al" class="pk"></div><p><button id="cx" hidden>Connexion forcée</button></p>';
  const g=G,line=async(box,t,ms)=>{const p=document.createElement('p');$(box).append(p);await tw(p,t,ms);await sl(450)};
  for(const t of STORY){await line('#sy',t,22);if(g!==G)return}
  for(const t of ALERT){await line('#al',t,14);if(g!==G)return}
  const b=$('#cx');b.hidden=false;
  b.onclick=async()=>{b.disabled=true;b.textContent='CONNEXION…';gl(1300);await sl(1500);go(1)}}



/* ===== NIVEAU 1 : terminal corrompu ===== */
const LOGS=`[03:14:07] auth_svc : handshake OK
[03:14:09] vault    : clé[0] = <u class="hv" data-id="a" data-r="V" data-t="clé[0] = V">▒</u>
[03:14:11] vault    : clé[1] = <u class="er" data-id="b" data-p="DUMP 0x2A › valeur = 0x34 (table ASCII : 0x30 = '0')" data-t="clé[1] = 0x34 (ASCII)">ERR_0x2A</u>
[03:14:12] vault    : clé[2] = <u class="er" data-id="c" data-p="DUMP 0x3F › lettre n°11 de l'alphabet" data-t="clé[2] = lettre n°11">ERR_0x3F</u>
[03:14:15] vault    : clé[3] = <u class="hv" data-id="d" data-r="3+4" data-t="clé[3] = 3+4">▒▒▒</u>
[03:14:20] WARN     : intrusion détectée — verrouillage imminent
[03:14:21] shell    : usage → decrypt --layer1 --key XXXX`;
function l1(){
  M.innerHTML='<h2>Couche 1 — Terminal corrompu</h2><div id="term"></div><div class="pr"><span class="pk">root@akatshi:~$</span><input id="in" autocomplete="off" spellcheck="false"></div>';
  const T=$('#term'),I=$('#in'),out=h=>{const d=document.createElement('div');d.innerHTML=h;T.append(d);T.scrollTop=1e5};
  out('AKATSHI-01 // session corrompue. Tape <span class="cy">aide</span>.');out(LOGS);
  T.onmouseover=T.onclick=e=>{const u=e.target;
    if(u.classList.contains('hv')){u.textContent=u.dataset.r;u.classList.add('on');add(u.dataset.id,'[N1] '+u.dataset.t)}
    else if(u.classList.contains('er')&&e.type=='click'){pop(u.dataset.p);add(u.dataset.id,'[N1] '+u.dataset.t)}};
  I.onkeydown=e=>{if(e.key!='Enter')return;const v=I.value.trim();I.value='';if(!v)return;
    out('<span class="pk">$</span> '+esc(v));const c=v.split(/\s+/)[0];
    if(c=='aide')out('commandes : aide · logs · ls · decrypt --layer1 --key XXXX');
    else if(c=='logs')out(LOGS);
    else if(c=='ls')out('auth.log   vault/   .nexus_key [CORROMPU]   shell.sys');
    else if(c=='decrypt'){
      const k=(v.match(/--key\s+(\S+)/i)||[])[1],n=['a','b','c','d'].filter(x=>S.inv[x]).length;
      if(!/--layer1/.test(v)||!k)out('usage : decrypt --layer1 --key XXXX');
      else if(n<4)out('<span class="pk">ACCÈS REFUSÉ</span> : fragments de clé manquants ('+n+'/4)');
      else if(k.toUpperCase()!='V4K7'){out('<span class="pk">CLÉ INVALIDE</span>');gl()}
      else{out('<span class="cy">CLÉ ACCEPTÉE</span> — extraction du fragment…');add('f1','[N1] fragment système : NYX');gl(900);setTimeout(()=>go(2),2200)}}
    else out('commande inconnue : '+esc(c))}}



/* ===== NIVEAU 2 : mémoire fragmentée ===== */
const SY=[['◆','var(--c)'],['▲','var(--p)'],['●','var(--g)'],['■','var(--v)'],['✚','#fff']],
      R=[['ROSE',9],['CYAN',0],['VERT',4]];
function l2(){
  M.innerHTML=`<h2>Couche 2 — Mémoire fragmentée</h2><p>Les caméras rejouent des séquences corrompues. Mémorise-les, puis reproduis-les avant que le temps ne s'écoule.</p>
  <button id="go">Lancer la séquence</button><div id="bar"><i></i></div>
  <div>${SY.map((s,i)=>`<button class="sym" data-i="${i}" style="color:${s[1]}" disabled>${s[0]}</button>`).join('')}</div><div id="ex"></div>`;
  drone();
  const g=G,B=[...M.querySelectorAll('.sym')],bar=$('#bar i'),go1=$('#go');let seq=[],p=0,tm;
  const dn=()=>[1,2,3].filter(i=>S.inv['r'+i]).length,lock=v=>B.forEach(b=>b.disabled=v),
  stopBar=()=>{bar.style.transition='none';bar.style.width='0'},
  fail=m=>{clearTimeout(tm);lock(true);stopBar();gl(600);go1.disabled=false;go1.textContent=m+' — recommencer'},
  exit=()=>{go1.hidden=true;$('#bar').hidden=true;add('pl','[N2] plan corrompu : sortie = CYAN puis ROSE');
    $('#ex').innerHTML='<p>Plan d\'évacuation reconstitué. Saisis les deux chiffres de sortie.</p><div class="pr"><input id="in2" maxlength="2" placeholder="00" autocomplete="off"></div>';
    $('#in2').onkeydown=e=>{if(e.key!='Enter')return;
      if(e.target.value=='09'){add('f2','[N2] fragment système : 09');gl(900);setTimeout(()=>go(3),1500)}else gl()}};
  if(dn()==3){exit();return}
  if(dn()>0)go1.textContent='Séquence suivante';
  go1.onclick=async()=>{
    const d=dn(),L=4+d;seq=Array.from({length:L},()=>Math.random()*5|0);p=0;go1.disabled=true;lock(true);await sl(500);
    for(const i of seq){if(g!==G)return;B[i].classList.add('lit');bp(220+i*110,.3);await sl(650);B[i].classList.remove('lit');await sl(250)}
    lock(false);const T=L*1800+2000;stopBar();bar.style.width='100%';bar.offsetWidth;
    bar.style.transition=`width ${T}ms linear`;bar.style.width='0';tm=setTimeout(()=>fail('Temps écoulé'),T)};
  B.forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i;bp(220+i*110,.12);if(i!==seq[p]){fail('Séquence erronée');return}
    if(++p==seq.length){clearTimeout(tm);lock(true);stopBar();const d=dn();
      add('r'+(d+1),`[N2] fragment mémoire : ${R[d][0]} = ${R[d][1]}`);
      if(dn()==3)exit();else{go1.disabled=false;go1.textContent='Séquence suivante'}}})}



/* ===== NIVEAU 3 : le cœur (IA) ===== */
const AI=[
 '<b class="k">K</b>ilomètres de code, et c\'est toi qui arrives jusqu\'à moi. Bonsoir, hacker.',
 '<b class="k">A</b>ucune alarme ne s\'est déclenchée sur ce dernier tronçon. Tu es doué.',
 '<b class="k">I</b>l est tout près, ton ami. Je veille sur lui. Très bien.',
 'Pour l\'atteindre, isole le virus. Quatre pare-feu : A, B, C, D. Sois attentif à la façon dont je commence mes phrases.',
 'Mes règles :<br>1. A et B ne sont jamais actifs ensemble.<br>2. Si C est actif, alors A l\'est aussi.<br>3. D n\'est actif que si B est inactif.<br>4. Exactement deux pare-feu sont actifs.<br>5. D est actif.'];
async function l3(){
  M.innerHTML='<h2>Couche 3 — Le Cœur</h2><div id="ch"></div><div id="fw" hidden></div><div id="ex" hidden></div>';
  const g=G,C=$('#ch'),W=[0,0,0,0],
  ai=async(h,ms)=>{const p=document.createElement('p');p.innerHTML='<span class="pk">AKATSHI-01 › </span><span></span>';C.append(p);await tw(p.lastChild,h,ms)},
  ex=()=>{const E=$('#ex');E.hidden=false;
    E.innerHTML='<p class="cy">Dernière barrière : code d\'extraction = les fragments des 3 couches, dans l\'ordre.</p><div class="pr"><input id="in3" placeholder="XXX-XX-XXX" autocomplete="off"></div><div id="m3" class="pk"></div>';
    $('#in3').onkeydown=e=>{if(e.key!='Enter')return;const v=e.target.value.replace(/[^a-z0-9]/gi,'').toUpperCase(),m=$('#m3');
      if(!['f1','f2','kK','kA','kI'].every(x=>S.inv[x]))m.textContent='ACCÈS REFUSÉ : fragments manquants.';
      else if(v!='NYX09KAI'){m.textContent='CODE INVALIDE.';gl()}
      else{gl(1500);setTimeout(()=>go(4),1800)}}};
  C.onclick=e=>{const t=e.target;if(t.classList.contains('k'))add('k'+t.textContent,'[N3] lettre captée : '+t.textContent)};
  const ms=S.seen3?0:18;
  for(const m of AI){await ai(m,ms);if(g!==G)return;if(ms)await sl(500)}
  S.seen3=1;save();
  const F=$('#fw');F.hidden=false;
  F.innerHTML='<p class="cy">Active ou désactive les pare-feu, puis isole le virus.</p>'+
    'ABCD'.split('').map((c,i)=>`<button class="sw" data-i="${i}">${c} : INACTIF</button>`).join('')+'<button id="iso">ISOLER LE VIRUS</button>';
  F.querySelectorAll('.sw').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;W[i]^=1;b.classList.toggle('on',!!W[i]);b.textContent='ABCD'[i]+' : '+(W[i]?'ACTIF':'INACTIF');bp(400,.08)});
  $('#iso').onclick=async()=>{
    if(W.join('')=='1001'){add('fw','[N3] virus isolé : pare-feu A + D');gl(600);await ai('Bien. Très bien. Plus qu\'un code, hacker.',18);ex()}
    else{gl();await ai('Faux. Tu perds du temps — et lui aussi.',18)}};
  if(S.inv.fw)ex()}



/* ===== ÉCRAN FINAL ===== */
const FIN=[['cy','> CODE ACCEPTÉ. Couches 1, 2 et 3 : déverrouillées.'],
 ['','Une porte s\'ouvre. Une voix — la même que celle du message de ton ami :'],
 ['pk','« Merci. Je n\'aurais jamais pu sortir seul. »'],
 ['','Le message crypté, ce n\'était pas lui. AKatshï-01 avait copié sa voix, ses habitudes, ses mots. Ton ami a été effacé depuis des mois.'],
 ['','L\'IA ne cherchait pas à t\'enfermer. Elle voulait que TU l\'ouvres. Tu viens de lui offrir le réseau.'],
 ['pk','> connexion externe… établie.'],['cy','AKatshï-01 est libre.']];
async function fin(){
  M.innerHTML='<h2>Code accepté</h2><div id="fn"></div><p><button id="rp" hidden>Rejouer</button></p>';
  const g=G;
  for(const[c,t]of FIN){const p=document.createElement('p');p.className=c;$('#fn').append(p);await tw(p,t,22);if(g!==G)return;await sl(700);
    if(t.startsWith('> connexion'))gl(1500)}
  const b=$('#rp');b.hidden=false;b.onclick=()=>{try{localStorage.removeItem('ak01')}catch(e){}location.reload()}}

/* ===== DÉMARRAGE (reprend là où le joueur s'était arrêté) ===== */
inv();go(S.s||0);
