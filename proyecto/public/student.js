import {subjectChoices,groupsForSubject,enrollStudent,requestedAudience,portalTarget} from './enrollment-models.js?v=1';
import {activityForUnit,isLaboratoryUnit} from './activity-catalog.js?v=1';
import {unitIllustration} from './unit-studio.js?v=4';
import {brandLink, homeLink, uiIcon, decorateAction} from './interface.js?v=2';
import {experienceFor} from './unit-models.js?v=2';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};const button=(text,fn,cls='campusbutton blue')=>{const b=el('button',cls,text);b.type='button';b.onclick=fn;return decorateAction(b,text)};const dbRead=()=>{try{return JSON.parse(localStorage.getItem('aula-jt-campus-v1'))}catch{return null}};const entry=$('#entry'),home=$('#studenthome'),campus=$('#campus'),lab=$('#laboratory');let identity=null,unit=0;try{identity=JSON.parse(sessionStorage.getItem('aula-jt-student')||'null')}catch{};let mode='entry',studentImport=false,unitOpen=false,audience='welcome',refreshEnrollment=null;
function hideViews(){for(const v of [entry,home,campus,lab])v.hidden=true}
function activateAudience(next){
 audience=next;document.body.dataset.audience=next;
 try{sessionStorage.setItem('proyectojv-audience',next)}catch{}
 const target=portalTarget(location.pathname,next);if(location.pathname+location.search+location.hash!==target)history.replaceState(null,'',target);
 window.dispatchEvent(new Event('aula-audience-changed'));
}
function setMode(next){
 unitOpen=false;refreshEnrollment=null;mode=next;document.body.dataset.mode=next;
 document.querySelectorAll('dialog[open]').forEach(d=>d.close());
 window.dispatchEvent(new Event('aula-clear-context'));hideViews();
 if(next!=='entry')delete document.body.dataset.entryScreen;
 $('#studentguide').hidden=next!=='student';$('#teacher').hidden=next!=='teacher';$('#studentmode').hidden=next!=='teacher';$('#evidencebutton').hidden=next==='entry';
 $$('.railbtn[data-view]').forEach(b=>b.hidden=false);
 $('#campusnav').setAttribute('aria-label',next==='student'?'Mi curso':'Mis grupos');$('#campusnav').title=next==='student'?'Mi curso':'Mis grupos';
 $('#backcampus').textContent=next==='student'?'‹ Mi curso':'‹ Mis grupos';
 $$('.railbtn[data-view="live"]').forEach(b=>b.hidden=next!=='teacher');$('.tabs [data-view="live"]').hidden=next!=='teacher';
 window.scrollTo({top:0});
}
function portalHeader(onWelcome=false){const top=el('div','portal-header'),nav=el('nav','portal-nav');nav.setAttribute('aria-label','Navegación principal');const start=homeLink();if(onWelcome)start.setAttribute('aria-current','page');nav.append(start);if(onWelcome){const how=el('a','portal-about','Cómo aprender');how.href='#recorrido';nav.append(how);const access=el('a','portal-access','Entrar al aula');access.href='#accesos';access.append(uiIcon('arrow'));access.onclick=e=>{e.preventDefault();const target=document.querySelector('#accesos');target?.scrollIntoView({behavior:document.body.dataset.motion==='reduced'?'instant':'smooth',block:'start'});document.querySelector('.welcomecards button')?.focus({preventScroll:true})};nav.append(access)}top.append(brandLink(),nav);return top}
function goHome(){
 studentImport=false;
 if(audience==='student'){if(identity)studentHome();else studentEntry()}
 else if(audience==='teacher')teacherEntry();else welcome();
 setTimeout(()=>{const target=mode==='entry'?entry.querySelector('[data-project-home]'):document.querySelector('.app>header .home-control');target?.focus({preventScroll:true})},0);
}
function teacherEntry(){studentImport=false;activateAudience('teacher');setMode('teacher');$('#campusnav').click()}
function welcome(){activateAudience('welcome');setMode('entry');document.body.dataset.entryScreen='welcome';entry.hidden=false;entry.replaceChildren(portalHeader(true));const intro=el('div','welcomeintro'),title=el('h1');for(const [lead,accent,cls] of [['Mira ','dentro.','hero-blue'],['Entiende ','mejor.','hero-purple']]){const line=el('span','headline-line',lead);line.append(el('span',cls,accent));title.append(line)}intro.append(title,el('p','hero-promise','Seis unidades de informática para aprender explorando.'),el('p','welcometext','Explora una computadora, sigue el viaje de la información y dale forma a tus ideas. Aprende a tu ritmo y guarda lo que descubriste.'));const actions=el('div','hero-actions');actions.append(button('Comenzar mi recorrido',studentEntry),button('Abrir espacio docente',teacherEntry,'campusbutton hero-teacher'));intro.append(actions);const route=el('div','herofoot');route.id='recorrido';route.setAttribute('aria-label','Recorrido de aprendizaje');route.append(el('b','journey-label','TU RECORRIDO'));['Explora','Practica','Reflexiona','Guarda tu evidencia'].forEach((label,i)=>{if(i)route.append(uiIcon('arrow'));route.append(el('span','',label))});const access=el('div','access-heading');access.id='accesos';access.append(el('h2','','Entra a tu aula'),el('p','','Elige cómo entrar'));const cards=el('div','welcomecards');const student=el('div','welcomecard');student.append(el('h2','','Soy estudiante'),el('p','','Entra a tu grupo, abre una unidad y sigue las instrucciones.'),button('Entrar a mi curso',studentEntry));const teacher=el('div','welcomecard secondarycard');teacher.append(el('h2','','Soy docente'),el('p','','Organiza tus grupos, prepara las seis unidades y define cómo usar las actividades.'),button('Gestionar mis grupos',teacherEntry,'campusbutton'));cards.append(student,teacher);const accessSection=el('div','portal-access-section');accessSection.append(access,cards,el('p','welcomefoot','Las vistas organizan esta demostración; todavía no son cuentas con contraseña.'));entry.append(intro,route,accessSection)}
function studentEntry(){
 activateAudience('student');setMode('entry');document.body.dataset.entryScreen='student';entry.hidden=false;entry.replaceChildren(portalHeader());
 if(identity)entry.append(button('Volver a mi curso',studentHome,'textbutton'));
 entry.append(el('p','student-portal-label','Acceso de estudiantes'),el('h1','studenttitle','Entra a tu materia'),el('p','campussub','Selecciona la materia, el grupo y escribe tu nombre para continuar con tus unidades.'));
 const form=el('form','studententryform'),subjectLabel=el('label','','Materia'),subject=el('select');subject.name='subject';subject.required=true;subject.setAttribute('aria-label','Materia');subjectLabel.append(subject);
 const groupLabel=el('label','','Grupo'),group=el('select');group.required=true;group.name='group';group.setAttribute('aria-label','Grupo');groupLabel.append(group);
 const nameLabel=el('label','','Tu nombre y apellido'),name=el('input');name.name='student';name.required=true;name.autocomplete='name';name.maxLength=100;name.placeholder='Escribe tu nombre completo';name.value=identity?.name||'';nameLabel.append(name);
 const hint=el('p','enrollment-status');hint.setAttribute('role','status');
 const submit=el('button','primary','Entrar como estudiante');submit.type='submit';form.append(subjectLabel,groupLabel,nameLabel,hint,submit);
 const error=el('p','evidenceerror');error.setAttribute('role','alert');form.append(error);entry.append(form);
 let previousGroup=identity?.groupId||'',previousSubject='';
 const fillGroups=()=>{
  const db=dbRead(),groups=groupsForSubject(db,subject.value),wanted=group.value||previousGroup;
  group.replaceChildren();group.disabled=groups.length===0;submit.disabled=groups.length===0;
  if(!groups.length)group.append(new Option(subject.value?'No hay grupos activos':'Primero selecciona tu materia',''));
  else{
   groups.forEach(g=>group.append(new Option(g.name+' · '+db.cycles.find(c=>c.id===g.cycle).name,g.id)));
   if(groups.some(g=>g.id===wanted))group.value=wanted;
  }
  hint.textContent=subject.options.length===1?'Carga el material de tu curso para encontrar tu materia y grupo.':!subject.value?'Elige tu materia para ver los grupos disponibles.':groups.length?`${groups.length} ${groups.length===1?'grupo disponible':'grupos disponibles'}.`:'Este navegador todavía no tiene un grupo activo para esta materia.';
  previousGroup=group.value;previousSubject=subject.value;error.textContent='';
 };
 refreshEnrollment=()=>{
  const db=dbRead(),choices=subjectChoices(db,{student:true}),wanted=subject.value||previousSubject;
  subject.replaceChildren(new Option('Selecciona tu materia',''));
  choices.forEach(c=>subject.append(new Option(c.name,c.id)));
  const own=choices.find(c=>groupsForSubject(db,c.id).some(g=>g.id===previousGroup));
  if(choices.some(c=>c.id===wanted))subject.value=wanted;else if(own)subject.value=own.id;
  if(!choices.length)hint.textContent='Carga el material de tu curso para encontrar tu materia y grupo.';
  fillGroups();
 };
 subject.onchange=()=>{previousGroup='';group.value='';fillGroups()};group.onchange=()=>{previousGroup=group.value;error.textContent=''};
 name.oninput=()=>{name.setCustomValidity('');error.textContent=''};
 form.onsubmit=e=>{
  e.preventDefault();const latest=dbRead();
  try{
   const who=enrollStudent(latest,group.value,subject.value,name.value,()=>crypto.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2));
   try{localStorage.setItem('aula-jt-campus-v1',JSON.stringify(latest))}catch{throw Error('No se pudo guardar tu entrada. Revisa el almacenamiento del navegador.')}
   identity=who;try{sessionStorage.setItem('aula-jt-student',JSON.stringify(identity))}catch{}
   window.dispatchEvent(new Event('aula-campus-updated'));studentHome();
  }catch(err){if(!name.value.trim()){name.setCustomValidity('Escribe tu nombre y apellido.');name.reportValidity()}else refreshEnrollment?.();error.textContent=err.message}
 };
 entry.append(el('p','studentimporthint','Si tu grupo no aparece en este navegador, carga el archivo de material de tu curso.'),button('Cargar material de mi curso',()=>{studentImport=true;window.dispatchEvent(new Event('aula-import-material-request'))},'textbutton'));
 refreshEnrollment();
}
function studentHome(){
  activateAudience('student');
  if(!identity){studentEntry();return}
  const db=dbRead(),g=db?.groups.find(g=>g.id===identity.groupId),st=g?.students.find(s=>s.id===identity.studentId);
  if(!g||!st||db.cycles.find(c=>c.id===g.cycle)?.closed){identity=null;try{sessionStorage.removeItem('aula-jt-student')}catch{}studentEntry();return}
  identity.name=st.name;setMode('student');home.hidden=false;$('#evidencebutton').hidden=true;
  $$('.railbtn[data-view]').forEach(b=>b.hidden=true);home.replaceChildren();$('.breadcrumb').textContent='Mi curso / '+g.name;
  const courseName=db.courses.find(c=>c.id===g.course).name,isComputing=courseName.toLowerCase().includes('informática');
  let records={};try{records=JSON.parse(localStorage.getItem('aula-jt-evidence-v1')||'{}')}catch{}
  const practiced=i=>records?.[[g.id,i,identity.studentId].join(':')]?.events?.some(e=>e.type==='unit-practice'||e.type==='quiz')===true;
  const ready=i=>g.units[i].released===true&&Boolean((activityForUnit(courseName,i,g.units[i])?.kind&&activityForUnit(courseName,i,g.units[i]).kind!=='reading')||g.units[i].description?.trim()||g.units[i].link?.trim());
  const available=g.units.map((u,i)=>i).filter(ready),next=available.find(i=>!practiced(i))??available[0];
  const heading=el('div','campusheading'),info=el('div');info.append(el('p','campuskicker','Hola, '+identity.name.split(' ')[0]),el('h1','',courseName),el('p','campussub',g.name+' · Tu espacio para explorar, practicar y guardar lo aprendido.'));
  heading.append(info,button('Cambiar grupo o nombre',studentEntry,'textbutton'));home.append(heading);
  const focus=el('section','course-focus panel-feature'+(isComputing?' has-pc':''));focus.setAttribute('aria-label','Tu siguiente actividad');
  const focusText=el('div','panel-feature-copy');focusText.append(el('p','featuretag',next===undefined?'Tu curso está preparado':`Unidad ${next+1} · ${practiced(next)?'Disponible para repasar':'Disponible para explorar'}`),el('h2','',next===undefined?'Tu próximo descubrimiento está por llegar.':g.units[next].title),el('p','',next===undefined?'Tu docente todavía no ha liberado una unidad con contenido. Puedes consultar aquí su disponibilidad.':'Explora la actividad, realiza la práctica y guarda una reflexión con tus propias palabras.'));
  const actions=el('div','panel-feature-actions');if(next!==undefined)actions.append(button(`Abrir unidad ${next+1}`,()=>startUnit(next),'campusbutton'));
  const viewUnits=()=>{const title=home.querySelector('#student-units-title');title?.scrollIntoView({behavior:document.body.dataset.motion==='reduced'?'instant':'smooth',block:'start'});title?.focus({preventScroll:true})};
  actions.append(button('Ver las seis unidades',viewUnits,'campusbutton panel-secondary'));
  focusText.append(actions,el('p','course-availability',`${available.length} de 6 unidades disponibles · ${g.units.filter((u,i)=>practiced(i)).length} con práctica registrada`));focus.append(focusText);home.append(focus);
  const route=el('ol','studentroute');route.setAttribute('aria-label','Tu recorrido');['Explora la unidad','Realiza la práctica','Guarda tu PDF y entrégalo en tu plataforma'].forEach((text,i)=>{const step=el('li');step.append(el('span','route-step',String(i+1)),el('span','',text));route.append(step)});home.append(route);
  const sectionTitle=el('div','sectionheading'),unitsTitle=el('h2','','Tus seis unidades');unitsTitle.id='student-units-title';unitsTitle.tabIndex=-1;sectionTitle.append(unitsTitle,el('span','','Tu docente decide cuándo liberar cada unidad.'));home.append(sectionTitle);
  const list=el('div','studentunits');list.setAttribute('aria-labelledby',unitsTitle.id);
  g.units.forEach((u,i)=>{
    const card=el('article','studentunit'),meta=el('div','studentunit-info'),released=u.released===true,canOpen=ready(i);card.classList.toggle('islocked',!released);
    meta.append(el('p','unitlabel',`Unidad ${i+1} de 6`),el('h3','',u.title));
    const state=el('span','student-unit-state '+(released?'available':'locked'),!released?'Bloqueada por el docente':canOpen?'Disponible':'Contenido pendiente');state.prepend(uiIcon(!released?'lock':'book'));meta.append(state);
    meta.append(el('p','',!released?'Se abrirá aquí cuando tu docente la libere.':canOpen?(u.description?.split('\n\n')[0]||'Explora los componentes de una computadora y realiza la práctica de cinco preguntas.'):'El docente todavía no ha añadido el contenido de esta unidad.'));
    meta.append(el('span','groupstatus',{support:'Material de apoyo',extra:'Puntos extras',grade:'Actividad para nota'}[u.purpose]||'Material de apoyo'));
    const experience=experienceFor(courseName,i,u.title,u.activityId);if(experience)meta.append(el('span','unit-experience-label',experience.label+' · '+experience.time));if(practiced(i))meta.append(el('span','unit-progress-label','Práctica registrada'));
    const b=button(!released?'Bloqueada':canOpen?'Abrir unidad':'Contenido pendiente',()=>startUnit(i));b.disabled=!canOpen;b.setAttribute('aria-label',`${!released?'Unidad bloqueada':canOpen?'Abrir unidad':'Contenido pendiente'} ${i+1}: ${u.title}`);
    card.append(unitIllustration(i,u.title,courseName,u.activityId),meta,b);list.append(card);
  });
  home.append(list,el('p','campusnotice','Tus notas y actividades se guardan en este navegador. Al terminar, guarda tu PDF y súbelo a la plataforma indicada por tu docente; allí se realiza la entrega y la calificación.'));
  home.append(button('Salir de mi curso',()=>{identity=null;try{sessionStorage.removeItem('aula-jt-student')}catch{}studentEntry()},'textbutton'));
}
function startUnit(i){const latest=dbRead(),group=latest?.groups.find(g=>g.id===identity?.groupId);if(group?.units[i]?.released!==true||latest.cycles.find(c=>c.id===group.cycle)?.closed){studentHome();return}unit=i;guideStep=0;setMode('student');unitOpen=true;const courseDB=latest,currentGroup=group,isLab=isLaboratoryUnit(courseDB.courses.find(c=>c.id===currentGroup.course).name,i,currentGroup.units[i]);if(!isLab)home.hidden=false;$('#studentguide').hidden=false;window.dispatchEvent(new CustomEvent('aula-start-student',{detail:{...identity,unitIndex:i}}));try{const k=[identity.groupId,i,identity.studentId].join(':');const progress=JSON.parse(localStorage.getItem('aula-jt-learning-'+k)||'{}');const evidence=JSON.parse(localStorage.getItem('aula-jt-evidence-v1')||'{}')[k];guideStep=evidence?.events?.some(e=>e.type==='quiz')?2:progress.seen?.length===6?1:0}catch{}window.dispatchEvent(new CustomEvent('aula-study-unit',{detail:{...identity,unitIndex:i}}));renderGuide();window.scrollTo({top:0});setTimeout(()=>window.dispatchEvent(new Event('resize')),0)}
let guideStep=0;function renderGuide(){const host=$('#studentguide');host.replaceChildren();const db=dbRead(),g=db.groups.find(g=>g.id===identity?.groupId);if(!g)return;const ctx=el('p','guidecontext',`${identity.name} · ${g.name} · Unidad ${unit+1}`);const row=el('div','guidemain');const info=el('div');const names=['Explora las seis piezas de la computadora','Ahora comprueba lo que aprendiste','Prepara tu evidencia para entregar'];const descriptions=['Pulsa una etiqueta o separa las piezas para examinarlas. Lee la explicación y marca «Ya lo comprendí». Si quieres girar el equipo, cambia a «Modelo 3D».','Responde las cinco preguntas. Recibirás una explicación después de cada respuesta; puedes repetir la práctica.','Escribe una breve reflexión, genera el informe y guarda el PDF. Luego súbelo a la plataforma indicada por tu docente.'];info.append(el('b','',names[guideStep]),el('p','',descriptions[guideStep]));row.append(info,button(guideStep===0?'Empezar por la CPU':guideStep===1?'Ir a la práctica':'Preparar mi PDF',()=>{if(guideStep===0){$('.tabs [data-view="lab"]').click();$('#componentbuttons button').click();if(document.body.dataset.renderView==='realistic')window.dispatchEvent(new CustomEvent('aula-focus-realistic',{detail:{view:'detail'}}));else $('#focuscpu').click();(document.body.dataset.renderView==='realistic'?$('#photolab'):$('.scene')).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}else if(guideStep===1)$('.tabs [data-view="quiz"]').click();else $('#evidencebutton').click()},'campusbutton blue'));const steps=el('div','guidesteps');['1. Explorar','2. Practicar','3. Mi evidencia'].forEach((s,i)=>steps.append(button(s,()=>{guideStep=i;renderGuide();if(i===0)$('.tabs [data-view="lab"]').click();if(i===1)$('.tabs [data-view="quiz"]').click();if(i===2)$('#evidencebutton').click()},i===guideStep?'current':'')));host.append(ctx,row,steps);if(g.units[unit].description)host.append(button('Ver indicaciones de esta unidad',()=>{const d=el('dialog','unitinstructions');const close=button('Cerrar',()=>d.close(),'textbutton');const title=el('h2','',g.units[unit].title),content=el('p','',g.units[unit].description);d.append(title,content,close);document.body.append(d);d.onclose=()=>d.remove();d.showModal()},'textbutton'))}
window.addEventListener('aula-student-home',studentHome);window.addEventListener('aula-activity',e=>{if(mode!=='student')return;if(e.detail.type==='understood'){let key=[identity.groupId,unit,identity.studentId].join(':');let learning;try{learning=JSON.parse(localStorage.getItem('aula-jt-learning-'+key)||'{}')}catch{}setTimeout(()=>{try{const after=JSON.parse(localStorage.getItem('aula-jt-learning-'+key)||'{}');if(after.seen?.length===6){guideStep=1;renderGuide()}}catch{}},0)}if(e.detail.type==='quiz')guideStep=2;renderGuide()});
window.addEventListener('aula-home-request',goHome);
$('#studentguide').hidden=true;let remembered;try{remembered=sessionStorage.getItem('proyectojv-audience')}catch{}const first=requestedAudience(location.href,remembered);if(first==='teacher')teacherEntry();else if(first==='student'){if(identity)studentHome();else studentEntry()}else welcome();

window.addEventListener('aula-material-imported',e=>{if(studentImport){studentImport=false;identity=e.detail;try{sessionStorage.setItem('aula-jt-student',JSON.stringify(identity))}catch{}studentHome()}});

window.addEventListener('aula-campus-updated',()=>{if(mode==='entry'&&audience==='student')refreshEnrollment?.()});
window.addEventListener('storage',e=>{if(e.key!=='aula-jt-campus-v1')return;if(mode==='entry'&&audience==='student'){refreshEnrollment?.();return}if(mode!=='student')return;const db=dbRead(),g=db?.groups.find(g=>g.id===identity?.groupId);if(!unitOpen){studentHome();return}if(g?.units[unit]?.released!==true||db.cycles.find(c=>c.id===g.cycle)?.closed||!g.students.some(s=>s.id===identity.studentId)){document.querySelectorAll('dialog[open]').forEach(d=>d.close());studentHome()}});

window.addEventListener('aula-unit-closed',e=>{const c=e.detail;if(mode==='student'&&unitOpen&&identity?.groupId===c.groupId&&unit===c.unitIndex&&!document.querySelector('.unitstudio[open],.readingdialog[open]')){studentHome();document.querySelectorAll('#studenthome .studentunit')[c.unitIndex]?.querySelector('button')?.focus()}});
