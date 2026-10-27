import {ensurePreparedCatalog,subjectChoices,subjectKey} from './enrollment-models.js?v=1';
import {activityCatalog,activityForUnit,courseTemplates,courseTemplate,unitsForCourse,isLaboratoryUnit,tallerUnitDescription} from './activity-catalog.js?v=1';
import {openFoundations,closeFoundations,showFoundationsPC} from './foundations.js?v=3';
import {mergeCampus} from './campus-store.js?v=1';
import {guideUnits} from './course-guide.js?v=1';
import {createMaterial, importMaterial} from './material.js?v=3';
import {openUnitStudio} from './unit-studio.js?v=4';
import {decorateAction} from './interface.js?v=2';
import {experienceFor} from './unit-models.js?v=2';
const $=s=>document.querySelector(s);const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
let db;try{db=JSON.parse(localStorage.getItem('aula-jt-campus-v1'))}catch{}let savedSnapshot=structuredClone(db);const uid=()=>crypto.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
const defaultUnits=guideUnits.map(u=>u.title);const oldDefaultUnits=['Hardware y software','Sistemas operativos','Gestión de archivos','Herramientas de productividad','Internet y colaboración','Proyecto integrador'];
const newUnits=names=>Array.from({length:6},(_,i)=>({title:names?.[i]||`Unidad ${i+1}`,description:guideUnits.find(u=>u.title===names?.[i])?.description||'',purpose:'support',link:'',released:false,done:false}));
if(!db||!Array.isArray(db.groups))db={cycles:[{id:uid(),name:'Mi primer ciclo',closed:false}],courses:[{id:uid(),name:'Informática empresarial',units:defaultUnits}],groups:[]};
if(!db.groups.length&&!db.initialized){db.groups.push({id:uid(),name:'Grupo de demostración',course:db.courses[0].id,cycle:db.cycles[0].id,students:[],units:newUnits(defaultUnits),demo:true});db.initialized=true}
if(!db.academicGuideVersion){for(const g of db.groups.filter(g=>g.demo)){const course=db.courses.find(c=>c.id===g.course);if(course&&['Fundamentos de informática','Informática empresarial'].includes(course.name)){course.name='Informática empresarial';course.units=defaultUnits;g.units=g.units.map((u,i)=>!u.description&&oldDefaultUnits[i]===u.title?{...u,title:guideUnits[i].title,description:guideUnits[i].description,purpose:u.purpose||'support'}:u)}}db.academicGuideVersion=1}
ensurePreparedCatalog(db);
let currentCycle=db.cycles.find(c=>!c.closed)?.id||db.cycles[0].id,activeGroup=null,tab='units',groupQuery='';
function latestCampus(){try{const value=JSON.parse(localStorage.getItem('aula-jt-campus-v1'));return value&&Array.isArray(value.groups)?value:null}catch{return null}}function reloadCampus(){const latest=latestCampus();if(latest){db=latest;savedSnapshot=structuredClone(latest)}}
function save(){try{const remote=latestCampus(),merged=remote?mergeCampus(savedSnapshot,db,remote):db;localStorage.setItem('aula-jt-campus-v1',JSON.stringify(merged));db=merged;savedSnapshot=structuredClone(db);window.dispatchEvent(new Event('aula-campus-updated'))}catch{alert('No se pudo guardar. Revisa el almacenamiento de tu navegador.')}}save();
const host=$('#campus'),lab=$('#laboratory');
function button(text,fn,cls='campusbutton'){const b=make('button',cls,text);b.type='button';b.onclick=fn;return decorateAction(b,text)}
function h(title,sub){const d=make('div','campusheading');const text=make('div');text.append(make('p','campuskicker','Espacio docente'),make('h1','',title),make('p','campussub',sub));d.append(text);return d}
function showCampus(){closeFoundations();reloadCampus();if(document.body.dataset.mode!=='teacher'){host.hidden=true;if(document.body.dataset.audience==='student')window.dispatchEvent(new Event('aula-student-home'));return}lab.hidden=true;host.hidden=false;$('#campusnav').classList.add('active');$('#campusnav').setAttribute('aria-current','page');document.querySelectorAll('.railbtn[data-view]').forEach(x=>{x.classList.remove('active');x.removeAttribute('aria-current')});render()}
function openLab(){closeFoundations();host.hidden=true;lab.hidden=false;$('#campusnav').classList.remove('active');document.querySelector('[data-view="lab"]').click();window.dispatchEvent(new Event('resize'));window.scrollTo({top:0})}
$('#campusnav').onclick=()=>{activeGroup=null;showCampus()};$('#backcampus').onclick=showCampus;
document.querySelectorAll('.railbtn[data-view]').forEach(b=>b.addEventListener('click',()=>{if(document.body.dataset.unitActivity==='computer-foundations'){showFoundationsPC();return}host.hidden=true;lab.hidden=false;$('#campusnav').classList.remove('active');window.dispatchEvent(new Event('resize'))}));
function modal(title,content,onSubmit,submit='Guardar'){const opener=document.activeElement;const dlg=make('dialog','campusdialog'),form=make('form');const close=button('×',()=>dlg.close(),'close');close.setAttribute('aria-label','Cerrar');form.append(close,make('h2','',title));content(form);if(onSubmit){const b=make('button','primary',submit);b.type='submit';form.append(b);form.onsubmit=e=>{e.preventDefault();if(onSubmit(form)!==false){dlg.close();render()}}}dlg.append(form);document.body.append(dlg);dlg.onclose=()=>{dlg.remove();if(opener?.isConnected&&document.body.dataset.mode==='teacher'&&!document.querySelector('dialog[open]'))opener.focus({preventScroll:true})};dlg.showModal();return dlg}
function field(f,label,name,value='',type='text'){const l=make('label','',label),i=make('input');i.name=name;i.value=value;i.type=type;i.required=true;l.append(i);f.append(l);return i}
function addCycle(){modal('Nuevo ciclo',f=>field(f,'Nombre del ciclo','name',''),f=>{const name=f.elements.name.value.trim();if(!name)return false;const c={id:uid(),name,closed:false};db.cycles.push(c);currentCycle=c.id;activeGroup=null;save()},'Crear ciclo')}
function addGroup(preset){
 reloadCampus();const cycle=db.cycles.find(c=>c.id===currentCycle);if(!cycle||cycle.closed)return;
 modal('Un grupo, una materia',f=>{
  f.append(make('p','campussub','Cada grupo tendrá sus estudiantes y sus propias seis unidades.'));field(f,'Nombre o código del grupo','name');
  const label=make('label','','Materia'),subject=make('select');subject.name='subject';subject.required=true;
  subject.append(new Option('Selecciona una materia existente',''));
  subjectChoices(db).forEach(c=>subject.append(new Option(c.name,c.id)));
  subject.append(new Option('Crear otra materia','__new__'));label.append(subject);f.append(label);
  const custom=field(f,'Nombre de la nueva materia','newSubject');custom.parentElement.hidden=true;custom.required=false;
  function update(){custom.parentElement.hidden=subject.value!=='__new__';custom.required=subject.value==='__new__';custom.setCustomValidity('')}
  subject.onchange=update;
  if(typeof preset==='string'){
   const found=subjectChoices(db).find(c=>subjectKey(c.name)===subjectKey(preset));
   if(found)subject.value=found.id;else{subject.value='__new__';custom.value=preset}update();
  }
  f.append(make('p','formhint',`Ciclo: ${cycle.name}. La lista incluye las materias existentes y las preparadas.`));
 },f=>{
  const name=f.elements.name.value.trim(),selected=subjectChoices(db).find(c=>c.id===f.elements.subject.value);
  const subject=f.elements.subject.value==='__new__'?f.elements.newSubject.value.trim():selected?.name;
  if(!name||!subject)return false;
  let course=db.courses.find(c=>subjectKey(c.name)===subjectKey(subject));
  if(!course){course={id:uid(),name:subject,units:courseTemplate(subject)?.units.map(u=>u.title)||newUnits().map(u=>u.title)};db.courses.push(course)}
  db.groups.push({id:uid(),name,course:course.id,cycle:currentCycle,students:[],units:courseTemplate(course.name)?unitsForCourse(course):newUnits(course.units)});save();
 },'Crear grupo');
}
function closeCycle(){const c=db.cycles.find(x=>x.id===currentCycle);modal('Finalizar este ciclo',f=>{f.append(make('p','campussub',`Los grupos de «${c.name}» pasarán al historial. Sus estudiantes y contenidos se conservarán. El siguiente ciclo se crea por separado.`))},()=>{c.closed=true;save()},'Finalizar y conservar historial')}
function focusGroups(){
  const title=host.querySelector('#groups-title');
  title?.scrollIntoView({behavior:document.body.dataset.motion==='reduced'?'instant':'smooth',block:'start'});
  title?.focus({preventScroll:true});
}
function render(){
  if(document.body.dataset.mode!=='teacher')return;
  if(!document.querySelector('dialog[open]'))reloadCampus();
  $('.breadcrumb').textContent='Mi campus / Mis grupos';host.replaceChildren();
  if(activeGroup){renderGroup();return}
  const cycle=db.cycles.find(c=>c.id===currentCycle)||db.cycles[0];currentCycle=cycle.id;
  const groups=db.groups.filter(g=>g.cycle===cycle.id);
  const heading=h('Prepara tu próxima clase.','Abre un grupo, prepara sus unidades y comparte el material con tus estudiantes.');
  const newGroup=button('+ Nuevo grupo',addGroup,'campusbutton blue');newGroup.disabled=cycle.closed===true;
  if(cycle.closed)newGroup.title='Ciclo finalizado. Crea un nuevo ciclo para agregar grupos.';
  heading.append(newGroup);host.append(heading);
  const toolbar=make('div','campustoolbar'),cycleLabel=make('label','cycle-control','Ciclo académico'),select=make('select');select.setAttribute('aria-label','Seleccionar ciclo');
  db.cycles.forEach(c=>{const o=make('option','',c.name+(c.closed?' · Historial':''));o.value=c.id;o.selected=c.id===currentCycle;select.append(o)});
  select.onchange=()=>{currentCycle=select.value;groupQuery='';render()};cycleLabel.append(select);
  toolbar.append(cycleLabel,button('+ Nuevo ciclo',addCycle,'textbutton'),button('Importar material del docente',importGroup,'textbutton'),button('Actividades preparadas',showActivityLibrary,'textbutton'));
  if(!cycle.closed)toolbar.append(button('Finalizar ciclo',closeCycle,'textbutton subtle'));else toolbar.append(make('span','archivebadge','Ciclo finalizado'));host.append(toolbar);
  const stats=make('div','campusstats');
  [[groups.length,'Grupos en este ciclo'],[groups.reduce((n,g)=>n+g.students.length,0),'Estudiantes registrados'],[groups.reduce((n,g)=>n+g.units.filter(u=>u.released===true).length,0),'Unidades liberadas'],[groups.filter(g=>g.units.every(u=>u.done)).length,'Cursos finalizados']].forEach(([n,t])=>{const d=make('div');d.append(make('b','',String(n)),make('span','',t));stats.append(d)});host.append(stats);
  const feature=make('section','campusfeature panel-feature');feature.setAttribute('aria-label','Vista previa del laboratorio');
  const ft=make('div','panel-feature-copy');ft.append(make('p','featuretag','Laboratorio de informática'),make('h2','','Explora antes de enseñar.'),make('p','','Examina la PC, separa sus piezas y cambia al modelo 3D para girar el equipo.'));
  const featureActions=make('div','panel-feature-actions');featureActions.append(button('Explorar la PC',openLab,'campusbutton'),button('Ver mis grupos',focusGroups,'campusbutton panel-secondary'));ft.append(featureActions);feature.append(ft);host.append(feature);
  const title=make('div','sectionheading group-section-heading'),titleText=make('div'),groupTitle=make('h2','','Mis grupos');groupTitle.id='groups-title';groupTitle.tabIndex=-1;
  titleText.append(groupTitle,make('p','panel-section-note',cycle.closed?'Consulta los grupos de este ciclo conservado en el historial.':'Cada grupo conserva su materia, matrícula y seis unidades.'));
  const result=make('p','group-result-status');result.setAttribute('role','status');result.setAttribute('aria-live','polite');title.append(titleText,result);host.append(title);
  const search=make('div','group-search');search.setAttribute('role','search');
  const searchLabel=make('label','','Buscar grupo o materia'),searchInput=make('input');searchInput.type='search';searchInput.placeholder='Nombre del grupo o de la materia';searchInput.value=groupQuery;searchInput.maxLength=120;
  const grid=make('div','groupgrid');grid.id='group-results';searchInput.setAttribute('aria-controls',grid.id);searchLabel.append(searchInput);
  const clear=button('Limpiar búsqueda',()=>{groupQuery='';searchInput.value='';drawGroups();searchInput.focus()},'textbutton');search.append(searchLabel,clear);host.append(search,grid);
  function drawGroups(){
    grid.replaceChildren();clear.disabled=!groupQuery;
    const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
    const query=normalize(groupQuery.trim()),matches=groups.filter(g=>normalize(g.name+' '+db.courses.find(c=>c.id===g.course).name).includes(query));
    result.textContent=query?`${matches.length} de ${groups.length} grupos`:`${groups.length} ${groups.length===1?'grupo':'grupos'} · ${cycle.name}`;
    matches.forEach(g=>{
      const course=db.courses.find(c=>c.id===g.course),done=g.units.filter(u=>u.done).length,released=g.units.filter(u=>u.released===true).length;
      const card=make('article','groupcard'),meta=make('div','groupmeta');meta.append(make('span','subjectsymbol',course.name.slice(0,2).toUpperCase()),make('span','groupstatus',cycle.closed?'Archivado':g.demo?'Demostración':done===6?'Finalizado':'En curso'));
      card.append(meta,make('p','groupcode',g.name),make('h3','',course.name),make('p','groupdetail',`${g.students.length} ${g.students.length===1?'estudiante':'estudiantes'} · 6 unidades`),make('p','group-release-count',`${released} de 6 unidades liberadas`));
      const bar=make('div','groupbar'),fill=make('i');bar.setAttribute('aria-hidden','true');fill.style.width=done/6*100+'%';bar.append(fill);
      const open=button('Abrir grupo',()=>{activeGroup=g.id;tab='units';render();window.scrollTo({top:0})},'groupopen');open.setAttribute('aria-label',`Abrir grupo ${g.name} · ${course.name}`);
      card.append(bar,make('p','groupdetail',`${done} de 6 unidades finalizadas`),open);grid.append(card);
    });
    if(!matches.length){const empty=make('div','group-empty');empty.append(make('h3','',query?'No hay coincidencias':'Este ciclo está listo para empezar.'),make('p','',query?'Prueba con otro nombre de grupo o materia.':cycle.closed?'Este ciclo no tiene grupos registrados.':'Crea tu primer grupo y elige su materia.'));grid.append(empty)}
    if(!cycle.closed&&!query)grid.append(button('+ Crear otro grupo',addGroup,'addgroup'));
  }
  searchInput.oninput=()=>{groupQuery=searchInput.value;drawGroups()};drawGroups();
  host.append(make('p','campusnotice','Los grupos y registros se guardan en este navegador. Para llevar las unidades a otros dispositivos, usa «Compartir material» dentro del grupo. Las cuentas y la sincronización automática todavía están pendientes.'));
}
function renderGroup(){const g=db.groups.find(x=>x.id===activeGroup);if(!g){activeGroup=null;render();return}const cycle=db.cycles.find(c=>c.id===g.cycle),course=db.courses.find(c=>c.id===g.course);$('.breadcrumb').textContent='Mi campus / '+g.name;const back=button('‹ Todos mis grupos',()=>{activeGroup=null;render()},'textbutton');host.append(back);const head=h(course.name,`${g.name} · ${cycle.name}`);head.append(make('div','grouptotal',`${g.units.filter(u=>u.done).length} / 6 finalizadas · ${g.units.filter(u=>u.released===true).length} / 6 liberadas`),button('Compartir material',()=>exportGroup(g),'campusbutton blue'));host.append(head);const tabs=make('nav','tabs grouptabs');tabs.setAttribute('aria-label','Administrar grupo');[['units','Unidades'],['students','Estudiantes']].forEach(([id,t])=>{const b=button(t,()=>{tab=id;render()},tab===id?'active':'');if(tab===id)b.setAttribute('aria-current','page');tabs.append(b)});host.append(tabs);if(cycle.closed){host.append(make('p','campusnotice','Este ciclo está finalizado. Su información se conserva en modo de consulta.'))}
if(tab==='students'){const title=make('div','sectionheading');title.append(make('h2','',`${g.students.length} ${g.students.length===1?'estudiante':'estudiantes'}`));if(!cycle.closed)title.append(button('+ Agregar estudiantes',()=>addStudents(g),'campusbutton blue'));host.append(title);const roster=make('div','roster');if(!g.students.length)roster.append(make('p','emptyroster','Tu grupo está listo. Agrega los nombres de tus estudiantes para organizarlo.'));g.students.forEach((st,i)=>{const row=make('div','studentrow');row.append(make('span','studentavatar',st.name.trim().split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase()),make('span','',st.name),make('span','studentmeta','Registrado en este grupo'));roster.append(row)});host.append(roster);return}
host.append(make('p','unit-list-hint','Libera cada unidad cuando esté lista. Finalizar una unidad no libera la siguiente.'));const units=make('div','unitlist');g.units.forEach((u,i)=>{const card=make('article','unitcard');const num=make('span','unitnumber',String(i+1).padStart(2,'0'));const info=make('div','unitinfo');info.append(make('p','unitlabel',`Unidad ${i+1} de 6 · ${{support:'Apoyo',extra:'Puntos extras',grade:'Para nota'}[u.purpose]||'Apoyo'}`),make('h3','',u.title),make('span','releasestatus '+(u.released===true?'released':'locked'),u.released===true?'Liberada para estudiantes':'Sin liberar · Bloqueada para estudiantes'));if(u.description){const instructions=make('details','unit-instructions'),summary=make('summary','','Ver indicaciones y actividad');summary.setAttribute('aria-label',`Ver indicaciones de la unidad ${i+1}: ${u.title}`);instructions.append(summary,make('p','',u.description));info.append(instructions)}else info.append(make('p','','Prepara los objetivos, materiales y actividades de esta unidad.'));const acts=make('div','unitactions');acts.append(button('Estudiar / Evidencia',()=>window.dispatchEvent(new CustomEvent('aula-evidence-request',{detail:{groupId:g.id,unitIndex:i}})),'textbutton'));if(activityForUnit(course.name,i,u)?.kind==='pc')acts.append(button('Explorar la PC',openLab,'textbutton'));if(activityForUnit(course.name,i,u)?.kind==='foundations'||experienceFor(course.name,i,u.title,u.activityId))acts.append(button('Explorar actividad',()=>window.dispatchEvent(new CustomEvent('aula-study-unit',{detail:{groupId:g.id,unitIndex:i}})),'textbutton'));if(u.link){try{const url=new URL(u.link);if(['https:','http:'].includes(url.protocol)){const a=make('a','textbutton','Abrir material ↗');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';acts.append(a)}}catch{}}if(!cycle.closed){acts.append(button(u.released===true?'Retirar acceso':'Liberar unidad',()=>{const ready=(activityForUnit(course.name,i,u)?.kind&&activityForUnit(course.name,i,u).kind!=='reading')||u.description?.trim()||u.link?.trim();if(!u.released&&!ready){modal('Prepara el contenido primero',f=>f.append(make('p','campussub','Pulsa «Editar» y añade indicaciones o un enlace antes de liberar esta unidad.')),null);return}u.released=u.released!==true;u.releasedAt=u.released?new Date().toISOString():null;save();render()},u.released===true?'releaseunit available':'releaseunit'));acts.append(button('Editar',()=>editUnit(g,i),'textbutton'));acts.append(button(u.done?'✓ Finalizada':'Finalizar unidad',()=>{u.done=!u.done;save();render()},u.done?'doneunit':'finishunit'))}else acts.append(make('span','groupstatus',u.done?'Finalizada':'Sin finalizar'));card.append(num,info,acts);units.append(card)});host.append(units);if(g.units.every(u=>u.done))host.append(make('div','completecourse','Curso completado. Las seis unidades han finalizado; este grupo queda disponible para consulta.'))}
function addStudents(g){modal('Agregar estudiantes',f=>{f.append(make('p','campussub','Escribe o pega un nombre por línea. Los duplicados se omitirán dentro de este grupo.'));const l=make('label','','Nombres de los estudiantes'),t=make('textarea');t.name='names';t.required=true;t.rows=8;t.placeholder='Nombre y apellido\nNombre y apellido';l.append(t);f.append(l)},f=>{const names=f.elements.names.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!names.length)return false;const seen=new Set(g.students.map(s=>s.name.toLocaleLowerCase()));names.forEach(name=>{if(!seen.has(name.toLocaleLowerCase())){g.students.push({id:uid(),name});seen.add(name.toLocaleLowerCase())}});save()},'Agregar al grupo')}
function showActivityLibrary(){
 const dlg=modal('Actividades preparadas',f=>{
  f.append(make('p','campussub','Reutiliza los recursos en varias materias. Cada grupo conserva su liberación, estudiantes, borradores y evidencias.'));
  const lead=make('section','activity-row');lead.append(make('h3','','Taller de Informática · Unidad I'),make('p','','Seis temas de la guía RMES 03-304, diagnóstico formativo, PC interactiva y preparación del trabajo grupal de glosario, línea de tiempo y ensayo. El foro se evalúa aparte.'));
  const actions=make('div','foundation-actions');actions.append(button('Vista previa de la unidad',()=>{
   const course={id:'preview-taller',name:courseTemplates[0].name},units=unitsForCourse(course),group={id:'preview-taller',name:'Vista previa docente',units};
   dlg.close();window.dispatchEvent(new Event('aula-clear-context'));openLab();openFoundations({course,group,unit:units[0],unitIndex:0,context:{groupId:group.id}});
  },'campusbutton blue'),button('Crear grupo de Taller',()=>{dlg.close();addGroup(courseTemplates[0].name)},'campusbutton'));
  lead.append(actions);f.append(lead);
  activityCatalog.filter(a=>a.id!=='computer-foundations'&&a.id!=='reading').forEach(a=>{const row=make('section','activity-row');row.append(make('h3','',a.title),make('p','',a.summary));f.append(row)});
  f.append(make('p','formhint','Para usar un recurso en un grupo existente, abre la unidad, pulsa Editar y elige Actividad preparada. También puedes traer las indicaciones y el recurso de otra unidad.'));
 },null);dlg.classList.add('activity-library');
}
function editUnit(g,i){
 const u=g.units[i],course=db.courses.find(c=>c.id===g.course);
 modal(`Editar unidad ${i+1}`,f=>{
  field(f,'Título','title',u.title);
  const activityLabel=make('label','','Actividad preparada'),activity=make('select');activity.name='activityId';
  activityCatalog.forEach(a=>{const o=make('option','',a.title);o.value=a.id;activity.append(o)});activity.value=activityForUnit(course.name,i,u)?.id||'reading';activityLabel.append(activity);f.append(activityLabel);
  const profileLabel=make('label','','Guía de trabajo'),profile=make('select');profile.name='assignmentProfile';
  [['custom','Indicaciones propias de esta unidad'],['taller-u1','Taller · glosario, línea de tiempo, ensayo y foro independiente']].forEach(([v,t])=>{const o=make('option','',t);o.value=v;profile.append(o)});profile.value=u.assignmentProfile||'custom';profileLabel.append(profile);f.append(profileLabel);
  const fromLabel=make('label','','Traer actividad de otra unidad'),from=make('select');from.name='fromUnit';const empty=make('option','','Selecciona una unidad ya preparada');empty.value='';from.append(empty);
  const sources=[];db.groups.forEach(other=>other.units.forEach((unit,index)=>{if(other.id===g.id&&index===i)return;const subject=db.courses.find(c=>c.id===other.course);sources.push({unit,subject,unitIndex:index});const option=make('option','',`${subject.name} · ${other.name} · Unidad ${index+1}: ${unit.title}`);option.value=String(sources.length-1);from.append(option)}));fromLabel.append(from);f.append(fromLabel,make('p','formhint','Se reutilizan el recurso y sus indicaciones. Los registros de estudiantes, la finalización y el acceso del grupo actual se conservan.'));
  const purpose=make('label','','Uso de la actividad'),sel=make('select');sel.name='purpose';[['support','Material de apoyo'],['extra','Puntos extras'],['grade','Actividad para nota']].forEach(([v,t])=>{const o=make('option','',t);o.value=v;sel.append(o)});sel.value=u.purpose||'support';purpose.append(sel);f.append(purpose);
  const label=make('label','','Objetivos, explicación o actividad'),description=make('textarea');description.name='description';description.value=u.description;description.rows=7;label.append(description);f.append(label);
  const prepared=button('Usar indicaciones de Taller I',()=>{activity.value='computer-foundations';profile.value='taller-u1';description.value=tallerUnitDescription;if(/^Unidad \d+$/.test(f.elements.title.value))f.elements.title.value='Conceptos generales de computadores'},'textbutton');f.append(prepared);
  const link=field(f,'Enlace al material o actividad (opcional)','link',u.link,'url');link.required=false;link.oninput=()=>link.setCustomValidity('');
  from.onchange=()=>{if(from.value==='')return;const source=sources[Number(from.value)];if(!source)return;f.elements.title.value=source.unit.title;description.value=source.unit.description||'';link.value=source.unit.link||'';activity.value=activityForUnit(source.subject.name,source.unitIndex,source.unit)?.id||source.unit.activityId||'reading';profile.value=source.unit.assignmentProfile||'custom';sel.value=source.unit.purpose||'support'};
 },f=>{
  const title=f.elements.title.value.trim();if(!title)return false;
  const link=f.elements.link.value.trim();if(link){let url;try{url=new URL(link)}catch{}if(!url||!['http:','https:'].includes(url.protocol)||url.username||url.password){f.elements.link.setCustomValidity('Usa un enlace HTTP o HTTPS sin usuario ni contraseña.');f.elements.link.reportValidity();return false}}
  const activityId=f.elements.activityId.value;if(!activityCatalog.some(a=>a.id===activityId))return false;
  u.title=title;u.purpose=f.elements.purpose.value;u.description=f.elements.description.value.trim();u.link=link;u.activityId=activityId;u.assignmentProfile=f.elements.assignmentProfile.value;save();
 });
}

window.addEventListener('aula-audience-changed',()=>{if(document.body.dataset.audience==='student'){host.hidden=true;host.replaceChildren()}});

window.addEventListener('aula-study-unit',e=>{if(!['teacher','student'].includes(document.body.dataset.mode))return;reloadCampus();const c=e.detail,g=db.groups.find(x=>x.id===c.groupId),u=g?.units[c.unitIndex];if(!u)return;if(document.body.dataset.mode==='student'&&u.released!==true){window.dispatchEvent(new Event('aula-student-home'));return}const course=db.courses.find(x=>x.id===g.course);if(document.body.dataset.mode==='student'&&db.cycles.find(x=>x.id===g.cycle)?.closed){window.dispatchEvent(new Event('aula-student-home'));return}if(!c.studentId)window.dispatchEvent(new Event('aula-clear-context'));const prepared=activityForUnit(course.name,c.unitIndex,u);if(['pc','foundations'].includes(prepared?.kind)){openLab();if(prepared.kind==='foundations')openFoundations({course,group:g,unit:u,unitIndex:c.unitIndex,context:c});return}if(openUnitStudio({course,group:g,unit:u,unitIndex:c.unitIndex,context:c,onClose:()=>{if(document.body.dataset.mode==='student')window.dispatchEvent(new CustomEvent('aula-unit-closed',{detail:c}));else window.dispatchEvent(new Event('aula-clear-context'))}}))return;const readingDialog=modal(u.title,f=>{f.append(make('p','campussub',u.description||'El docente todavía no ha añadido contenidos para esta unidad.'));if(u.link){try{const url=new URL(u.link);if(['https:','http:'].includes(url.protocol)){const a=make('a','meetinglink','Abrir material');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.onclick=()=>window.dispatchEvent(new CustomEvent('aula-activity',{detail:{type:'resource',name:u.title}}));f.append(a)}}catch{}}const confirm=button('Confirmar que revisé el contenido',()=>{if(confirm.disabled)return;window.dispatchEvent(new CustomEvent('aula-activity',{detail:{type:'reading',name:u.title}}));confirm.disabled=true;confirm.textContent='Lectura confirmada ✓';const n=make('p','formhint','Lectura registrada como declaración del estudiante.');f.append(n)},'campusbutton blue');confirm.dataset.confirmReading='true';f.append(confirm);f.append(button('Preparar mi informe',()=>window.dispatchEvent(new CustomEvent('aula-evidence-request',{detail:c})),'textbutton'))},null);readingDialog.classList.add('readingdialog');readingDialog.addEventListener('close',()=>{if(document.body.dataset.mode==='student')window.dispatchEvent(new CustomEvent('aula-unit-closed',{detail:c}))})});

function exportGroup(g){
const pack=createMaterial(db,g),blob=new Blob([JSON.stringify(pack,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
const filename='ProyectoJv_'+g.name.replace(/[^a-zA-Z0-9]/g,'_')+'.json';let download;
const dlg=modal('Material listo para compartir',f=>{
f.append(make('p','campussub','Descarga este archivo y súbelo a tu plataforma educativa junto con el enlace de ProyectoJv. Cada estudiante lo importa y escribe su nombre. El paquete no incluye tu lista de estudiantes ni sus resultados; comparte el contenido de las unidades liberadas. Si liberas otra unidad, comparte el archivo actualizado.'));
download=make('a','meetinglink','Descargar material JSON');download.href=url;download.download=filename;f.append(download);
},null);dlg.addEventListener('close',()=>URL.revokeObjectURL(url));download.click();
}

function importGroup(){reloadCampus();const studentView=document.body.dataset.audience==='student';modal(studentView?'Cargar material de mi curso':'Importar material del docente',f=>{f.append(make('p','campussub',studentView?'Selecciona el archivo de material de tu curso. Tus evidencias se guardan en este navegador.':'Importa las unidades de un grupo a tu espacio docente. Esta acción no te registra como estudiante.'));const l=make('label','','Archivo del grupo (.json)'),file=make('input');file.type='file';file.accept='.json,application/json';file.required=true;file.name='file';l.append(file);f.append(l);if(studentView)field(f,'Tu nombre y apellido','studentname');const err=make('p','evidenceerror');err.setAttribute('role','alert');f.append(err);const submit=make('button','primary',studentView?'Importar y abrir mi grupo':'Importar material');submit.type='button';submit.onclick=async()=>{submit.disabled=true;err.textContent='';try{const chosen=file.files?.[0];if(!chosen||chosen.size>1000000)throw Error('Selecciona un archivo JSON de menos de 1 MB.');const student=studentView?f.elements.studentname.value.trim():'';if(studentView&&!student)throw Error('Escribe tu nombre y apellido.');const data=JSON.parse(await chosen.text());const {group,student:registered,cycle}=importMaterial(db,data,student,uid,{enroll:studentView});save();currentCycle=cycle.id;activeGroup=group.id;tab='units';f.closest('dialog').close();render();if(studentView)window.dispatchEvent(new CustomEvent('aula-material-imported',{detail:{groupId:group.id,studentId:registered.id,name:registered.name}}))}catch(e){err.textContent=e.message}finally{submit.disabled=false}};f.append(submit)},null)}

window.addEventListener('aula-import-material-request',()=>{reloadCampus();importGroup()});

window.addEventListener('storage',e=>{if(e.key==='aula-jt-campus-v1'&&document.body.dataset.mode==='teacher'&&!host.hidden&&!document.querySelector('dialog[open]')){reloadCampus();if(!db.cycles.some(c=>c.id===currentCycle))currentCycle=db.cycles.find(c=>!c.closed)?.id||db.cycles[0].id;render()}});
