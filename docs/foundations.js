import {foundationTopics,historyMilestones,diagnosticQuestions,assessDiagnostic,checkFoundationPractice,foundationStorageKey,restoreFoundations,updateFolder} from './foundation-models.js?v=1';
import {decorateAction} from './interface.js?v=1';
import {motionReduced} from './motion.js?v=1';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const button=(text,fn,cls='foundation-button')=>{const b=el('button',cls,text);b.type='button';b.onclick=fn;return decorateAction(b,text)};
let active=null;
export function closeFoundations(){if(!active)return;active.dispose();active=null;delete document.body.dataset.unitActivity;delete document.body.dataset.foundationView;window.dispatchEvent(new Event('aula-foundations-closed'))}
export function resumeFoundations(){active?.resume()}
export function showFoundationsPC(){active?.pc()}
window.addEventListener('aula-clear-context',closeFoundations);
window.addEventListener('aula-foundations-resume',resumeFoundations);
export function openFoundations({course,group,unit,unitIndex,context}){
 closeFoundations();
 const isTaller=unit.assignmentProfile==='taller-u1',hasStudent=!!context.studentId,key=foundationStorageKey({...context,unitIndex});
 let saved;try{saved=hasStudent?JSON.parse(localStorage.getItem(key)||'{}'):{}}catch{}
 const state=restoreFoundations(saved),root=el('section','foundations');root.id='foundations';root.dataset.ui='';
 const pages=[['start','Antes de empezar'],...foundationTopics.map(t=>[t.id,t.title]),['assignment',isTaller?'Trabajo grupal':'Trabajo de la unidad'],...(isTaller?[['forum','Foro independiente']]:[])];
 if(!pages.some(([id])=>id===state.page))state.page='start';
 const lab=document.querySelector('#laboratory');lab.insertBefore(root,lab.querySelector('.heading'));
 document.body.dataset.unitActivity='computer-foundations';document.body.dataset.foundationView='course';
 let timer=null,downloadURL=null,flowStep=0;
 const saveStatus=el('p','foundation-save',hasStudent?'Tus borradores se guardan en este navegador.':'Vista previa docente · los borradores de esta vista no se guardan.');saveStatus.setAttribute('role','status');
 const available=()=>{
  if(!hasStudent)return true;
  try{const db=JSON.parse(localStorage.getItem('aula-jt-campus-v1')),g=db.groups.find(g=>g.id===context.groupId);return g?.units[unitIndex]?.released===true&&!db.cycles.find(c=>c.id===g.cycle)?.closed&&g.students.some(s=>s.id===context.studentId)&&g.units[unitIndex].activityId==='computer-foundations'}catch{return false}
 };
 function ensure(){if(available())return true;closeFoundations();window.dispatchEvent(new Event('aula-student-home'));return false}
 function save(){if(!hasStudent)return;if(!ensure())return;try{localStorage.setItem(key,JSON.stringify(state));saveStatus.textContent='Borrador guardado en este navegador.'}catch{saveStatus.textContent='No se pudo guardar. Conserva una copia de tu borrador antes de salir.'}}
 function record(detail){if(hasStudent&&ensure())window.dispatchEvent(new CustomEvent('aula-activity',{detail}))}
 function stop(){if(timer){clearInterval(timer);timer=null}}
 const header=el('div','foundation-header'),headText=el('div');headText.append(el('h1','','Conceptos generales de computadores'),el('p','foundation-context',`${course.name} · ${group.name} · Unidad ${unitIndex+1}`));
 header.append(headText);
 const pcReturn=el('div','foundation-pc-return');pcReturn.append(el('p','','Observa la PC y vuelve al tema para aplicar lo que descubriste.'),button('Volver al recorrido',()=>resume(),'foundation-button foundation-primary'));
 const mobileNav=el('select','foundation-mobile-nav');mobileNav.setAttribute('aria-label','Cambiar tema de la unidad');pages.forEach(([id,title])=>mobileNav.append(new Option(title,id)));mobileNav.onchange=()=>go(mobileNav.value,true);
 const layout=el('div','foundation-layout'),nav=el('nav','foundation-nav');nav.setAttribute('aria-label','Recorrido de conceptos generales');
 const content=el('div','foundation-content');content.id='foundation-content';content.tabIndex=-1;
 const progress=el('p','foundation-progress');
 pages.forEach(([id,title])=>{const b=button(title,()=>go(id,true),'foundation-nav-button');b.dataset.page=id;b.setAttribute('aria-controls',content.id);nav.append(b)});
 nav.append(progress);layout.append(nav,content);root.append(header,pcReturn,mobileNav,layout,saveStatus);
 function go(id,focus=false){if(!ensure())return;stop();state.page=id;if(foundationTopics.some(t=>t.id===id)&&!state.visited.includes(id)){state.visited.push(id);record({type:'unit-explore',name:'Consulta del tema: '+foundationTopics.find(t=>t.id===id).title})}save();document.body.dataset.foundationView='course';render();if(focus){content.focus({preventScroll:true});root.scrollIntoView({behavior:'instant',block:'start'})}}
 function resume(){if(!ensure())return;stop();document.body.dataset.foundationView='course';render();root.scrollIntoView({behavior:'instant',block:'start'});content.focus({preventScroll:true})}
 function pc(index=0){if(!ensure())return;stop();document.body.dataset.foundationView='pc';document.querySelector('#nextpart').textContent='Volver al recorrido';document.querySelector('.tabs [data-view="lab"]').click();window.dispatchEvent(new CustomEvent('aula-select-part',{detail:{index}}));if(document.body.dataset.renderView==='realistic')window.dispatchEvent(new CustomEvent('aula-focus-realistic',{detail:{view:'detail'}}));window.dispatchEvent(new Event('resize'));root.scrollIntoView({behavior:'instant',block:'start'})}
 function paragraph(text,cls=''){content.append(el('p',cls,text))}
 function field(host,label,value,oninput,{rows=3,max=2500}={}){const l=el('label','foundation-field',label),n=el(rows===1?'input':'textarea');if(rows!==1)n.rows=rows;n.value=value||'';n.maxLength=max;n.oninput=()=>{oninput(n.value);save()};l.append(n);host.append(l);return n}
 function select(host,label,options,value,onchange){const l=el('label','foundation-field',label),s=el('select');s.append(new Option('Selecciona una respuesta',''));options.forEach(([v,t])=>s.append(new Option(t,v)));s.value=value||'';s.onchange=()=>{onchange(s.value);save()};l.append(s);host.append(l);return s}
 function render(){
  content.replaceChildren();mobileNav.value=state.page;nav.querySelectorAll('[data-page]').forEach(b=>{b.classList.toggle('active',b.dataset.page===state.page);if(b.dataset.page===state.page)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
  progress.textContent=`${state.visited.length} de 6 temas consultados. La consulta no acredita dominio.`;
  if(state.page==='start')renderStart();else if(state.page==='assignment')renderAssignment();else if(state.page==='forum')renderForum();else renderTopic(foundationTopics.find(t=>t.id===state.page));
  const pager=el('div','foundation-pager'),at=pages.findIndex(([id])=>id===state.page);
  if(at>0)pager.append(button('Tema anterior',()=>go(pages[at-1][0],true),'foundation-button foundation-quiet'));
  if(at<pages.length-1)pager.append(button(at===0?'Comenzar con historia':'Continuar recorrido',()=>go(pages[at+1][0],true),'foundation-button foundation-primary'));
  else pager.append(button('Volver a mi curso',()=>{if(hasStudent)window.dispatchEvent(new Event('aula-student-home'));else document.querySelector('#campusnav').click()},'foundation-button foundation-primary'));
  content.append(pager);
 }
 function renderStart(){
  content.append(el('h2','','Antes de empezar'));
  paragraph('Aprenderás a explicar la evolución de las computadoras, distinguir hardware y software, interpretar CPU, RAM y almacenamiento, y organizar archivos en el Explorador de Windows.');
  const overview=el('div','foundation-overview'),copy=el('div');copy.append(el('h3','','Un recorrido, varios recursos'),el('p','','Usa las explicaciones, compara los ejemplos y abre la PC interactiva cuando necesites observar una pieza. Consulta después las indicaciones del trabajo. '+(isTaller?'El glosario, la línea de tiempo y el ensayo forman un trabajo grupal, y el foro tiene evaluación independiente.':'Aplica estos recursos a las indicaciones de tu materia, disponibles en Trabajo de la unidad.')+''));
  copy.append(button('Explorar la PC de la unidad',()=>pc(0),'foundation-button'));
  const img=el('img');img.src='aula-pc-hero.webp';img.alt='PC abierta del laboratorio que se reutiliza en esta unidad';overview.append(copy,img);content.append(overview);
  const diagnostic=el('section','foundation-diagnostic');diagnostic.append(el('h3','','Diagnóstico inicial'),el('p','','Sirve para reconocer tus conocimientos previos. Es formativo, sin nota ni ponderación propia. No hay cuestionario sumativo final en esta unidad.'));
  if(state.diagnosticDone){
   diagnostic.append(el('p','foundation-feedback','Diagnóstico realizado. Revisa las explicaciones y utiliza los temas señalados para orientar tu estudio.'));
   const result=assessDiagnostic(state.diagnostic),list=el('ul');
   result.review.forEach(id=>{const li=el('li');li.append(button('Repasar '+foundationTopics.find(t=>t.id===id).title,()=>go(id,true),'foundation-link'));list.append(li)});
   if(!result.review.length)diagnostic.append(el('p','','Tus respuestas iniciales coinciden con las explicaciones. Continúa y aplica los conceptos en los ejercicios.'));
   diagnostic.append(list);
   const review=el('details');review.append(el('summary','','Revisar respuestas y explicaciones'));
   diagnosticQuestions.forEach(q=>review.append(el('p','',`${q.question} ${q.explanation}`)));diagnostic.append(review);
   diagnostic.append(button('Repetir diagnóstico',()=>{state.diagnosticDone=false;save();render()},'foundation-button foundation-quiet'));
  }else{
   diagnosticQuestions.forEach(q=>{const f=el('fieldset');f.append(el('legend','',q.question));q.options.forEach((text,i)=>{const l=el('label','foundation-radio'),input=el('input');input.type='radio';input.name=q.id;input.value=String(i);input.checked=state.diagnostic[q.id]===i;input.onchange=()=>{state.diagnostic[q.id]=i;save()};l.append(input,el('span','',text));f.append(l)});diagnostic.append(f)});
   const feedback=el('p','foundation-feedback');feedback.setAttribute('role','status');
   diagnostic.append(button('Revisar mi punto de partida',()=>{const result=assessDiagnostic(state.diagnostic);if(!result.complete){feedback.textContent='Responde cada pregunta para revisar tu punto de partida.';return}state.diagnosticDone=true;save();record({type:'diagnostic',name:'Diagnóstico inicial · sin calificación',answer:diagnosticQuestions.map(q=>`${q.question} ${q.options[state.diagnostic[q.id]]}`).join('\n'),feedback:result.review.length?'Temas sugeridos: '+result.review.map(id=>foundationTopics.find(t=>t.id===id).title).join(', '):'Continuar con la aplicación de los conceptos.'});render()},'foundation-button foundation-primary'),feedback);
  }
  content.append(diagnostic);
 }
 function renderTopic(topic){
  content.append(el('h2','',topic.title));paragraph(topic.intro,'foundation-intro');
  topic.paragraphs.forEach(t=>paragraph(t));
  const example=el('section','foundation-example');example.append(el('h3','','Una situación para entenderlo'),el('p','',topic.example));content.append(example);
  if(topic.id==='history')renderHistory();
  if(topic.id==='hardware')renderFlow();
  if(['hardware','cpu','ram','storage'].includes(topic.id)){
   const partIndex={hardware:0,cpu:0,ram:1,storage:2}[topic.id];
   const media=el('div','foundation-part');const image=el('img');image.src=topic.id==='hardware'?'aula-pc-hero.webp':'parts/'+{cpu:'cpu',ram:'ram',storage:'ssd'}[topic.id]+'.webp';image.alt=topic.id==='storage'?'SSD ilustrativo del equipo conservado':topic.title;media.append(image,button('Examinar en la PC',()=>pc(partIndex),'foundation-button'));content.append(media);
  }
  if(topic.id==='cpu')comparison('Ficha ilustrativa de CPU',['Dato','Equipo A','Equipo B'],[['Núcleos','4','8'],['Hilos','8','16'],['Frecuencia base','3 GHz','3 GHz'],['Conclusión','No permite afirmar qué equipo es mejor sin conocer diseño, tarea y demás componentes.','No es una comparación de productos reales.']]);
  if(topic.id==='ram')comparison('Cómo leer la memoria',['Característica','Qué describe'],[['Capacidad · GB','Cuántos datos puede mantener disponibles.'],['Generación · DDR4 / DDR5','Tecnología y plataforma compatibles.'],['Formato · DIMM / SO-DIMM','Presentación física del módulo.'],['Tasa · MT/s','Transferencias por segundo; no es la capacidad en GB.']]);
  if(topic.id==='storage')comparison('HDD y SSD',['Característica','HDD','SSD de memoria flash'],[['Tecnología','Platos magnéticos y piezas móviles','Memoria flash'],['Conserva archivos sin energía','Sí','Sí'],['Capacidad','Se expresa normalmente en GB o TB','Se expresa normalmente en GB o TB'],['Relación con la RAM','No reemplaza la memoria de trabajo','No reemplaza la memoria de trabajo']]);
  if(topic.id==='explorer')renderExplorer();else renderPractice(topic);
  const note=el('section','foundation-notes');note.append(el('h3','','Mi explicación'));field(note,topic.prompt,state.notes,v=>{state.notes=v},{max:4000});note.append(el('p','foundation-small','Esta libreta es común al recorrido. Puedes reunir aquí dudas e ideas para el trabajo de tu equipo.'));content.append(note);
  const sources=el('details','foundation-sources');sources.append(el('summary','','Recursos para ampliar'));
  const links=topic.id==='cpu'?[['Intel · Frecuencia, núcleos y rendimiento','https://www.intel.com/content/www/us/en/gaming/resources/cpu-clock-speed.html']]:topic.id==='storage'?[['Kingston · Diferencias entre HDD, SSD, SATA y NVMe','https://www.kingston.com/es/ssd/ssd-faq']]:topic.id==='explorer'?[['Microsoft · Explorador de archivos','https://support.microsoft.com/es-es/windows/experience/fileexplorer/file-explorer-in-windows']]:topic.id==='history'?[['Computer History Museum · Historia del computador','https://www.computerhistory.org/timeline/computers/']]:[['Intel · Conceptos de memoria y compatibilidad','https://www.intel.com/content/www/us/en/gaming/resources/how-much-ram-gaming.html']];
  links.forEach(([title,url])=>{const a=el('a','',title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a)});content.append(sources);
 }
 function comparison(title,headings,rows){const section=el('section','foundation-comparison');section.append(el('h3','',title));const wrap=el('div','foundation-table-wrap'),table=el('table'),thead=el('thead'),hr=el('tr');headings.forEach(t=>hr.append(el('th','',t)));thead.append(hr);const body=el('tbody');rows.forEach(row=>{const tr=el('tr');row.forEach(t=>tr.append(el('td','',t)));body.append(tr)});table.append(thead,body);wrap.append(table);section.append(wrap);content.append(section)}
 function renderHistory(){
  const section=el('section','foundation-history');section.append(el('h3','','Explora las generaciones'));
  const choices=el('div','foundation-history-choices'),detail=el('div','foundation-history-detail');detail.setAttribute('aria-live','polite');
  function choose(m){choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.milestone===m.id)));detail.replaceChildren(el('p','foundation-period',m.period),el('h4','',m.name),el('p','',m.change),el('p','',m.impact))}
  historyMilestones.forEach(m=>{const b=button(m.technology,()=>choose(m),'foundation-button foundation-quiet');b.dataset.milestone=m.id;choices.append(b)});section.append(choices,detail);choose(historyMilestones[0]);section.append(el('p','foundation-small','Los períodos son aproximados y se superponen. La etapa contemporánea se llama quinta generación en algunas clasificaciones; no existe una única frontera universal.'));content.append(section);
 }
 function renderFlow(){
  const section=el('section','foundation-flow');section.append(el('h3','','Del dato al archivo'));
  const lane=el('ol'),labels=['Teclado: entran datos','CPU: ejecuta instrucciones','RAM: mantiene el trabajo activo','SSD: guarda el archivo'],description=el('p');description.setAttribute('aria-live','polite');
  labels.forEach(t=>lane.append(el('li','',t)));const explain=['Escribes un título con el teclado.','El programa indica a la CPU qué operaciones realizar.','La RAM mantiene disponibles el programa y el trabajo en uso.','Al guardar, el archivo se escribe en el almacenamiento.'];
  function draw(){[...lane.children].forEach((li,i)=>{if(i===flowStep)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current')});description.textContent=explain[flowStep]}
  const controls=el('div','foundation-actions');controls.append(button('Siguiente momento',()=>{stop();flowStep=(flowStep+1)%4;draw()}),button('Reproducir recorrido',()=>{stop();flowStep=0;draw();if(motionReduced()){description.textContent+=' Movimiento reducido: usa Siguiente momento.';return}timer=setInterval(()=>{flowStep++;if(flowStep>3){flowStep=3;stop()}draw()},1800)}),button('Pausar',stop,'foundation-button foundation-quiet'));
  section.append(lane,description,controls);content.append(section);draw();
 }
 function renderPractice(topic){
  const section=el('section','foundation-practice');section.append(el('h3','','Comprueba tu explicación'),el('p','','Ejercicio de apoyo, sin calificación oficial. Puedes revisar y volver a intentarlo.'));
  const answers=state.practice[topic.id]||(state.practice[topic.id]={});
  const choose=(label,key,options)=>select(section,label,options,answers[key],v=>answers[key]=v);
  if(topic.id==='hardware'){const opts=[['hardware','Hardware'],['software','Software'],['data','Datos']];choose('Un teclado','keyboard',opts);choose('Una aplicación de texto','app',opts);choose('El contenido de un informe guardado','report',opts)}
  if(topic.id==='cpu'){choose('Núcleos del equipo A de la ficha','cores',[['4','4 núcleos'],['8','8 núcleos']]);choose('¿La misma frecuencia garantiza el mismo rendimiento?','claim',[['yes','Sí'],['no','No']])}
  if(topic.id==='ram'){field(section,'Capacidad total de dos módulos de 8 GB (en GB)',answers.total,v=>answers.total=v,{rows:1,max:10});choose('¿Un módulo DDR5 sirve en cualquier placa DDR4?','compatibility',[['yes','Sí'],['no','No']])}
  if(topic.id==='storage'){choose('¿Dónde queda un archivo guardado al apagar el equipo?','saved',[['ram','Solo en la RAM'],['storage','En el almacenamiento']]);choose('¿Qué tecnología usa platos magnéticos?','technology',[['hdd','HDD'],['ssd','SSD']])}
  if(topic.id==='history'){choose('¿Qué tecnología aparece primero en el recorrido?','first',historyMilestones.map(m=>[m.id,m.technology]));choose('¿Qué avance integra la función de la CPU en un chip?','next',historyMilestones.map(m=>[m.id,m.technology]))}
  const feedback=el('p','foundation-feedback');feedback.setAttribute('role','status');
  section.append(button('Comprobar mi respuesta',()=>{if(!ensure())return;const result=checkFoundationPractice(topic.id,answers);feedback.textContent=(result.correct?'Tu explicación coincide. ':'Revisa este punto. ')+result.explanation;record({type:'unit-practice',name:topic.title+' · ejercicio formativo',question:topic.prompt,answer:JSON.stringify(answers),correct:result.correct,feedback:result.explanation})},'foundation-button foundation-primary'),feedback);content.append(section);
 }
 function renderExplorer(){
  const section=el('section','foundation-explorer');section.append(el('h3','','Organiza una práctica'),el('p','','Simulador educativo. Usa un archivo ficticio; tus archivos reales no se modifican.'));
  const path=el('p','foundation-path','Documentos / Taller de Informática'),items=el('div','foundation-file-list'),feedback=el('p','foundation-feedback');feedback.setAttribute('role','status');
  function draw(){items.replaceChildren(el('p','',`Original en Documentos: ${state.folder.name}`));if(state.folder.created)items.append(el('p','','Carpeta de destino: Taller de Informática / Unidad I'));if(state.folder.copied)items.append(el('p','',`Copia en Unidad I: ${state.folder.copyName||state.folder.name}`))}
  function act(action,value){if(!ensure())return;const result=updateFolder(state.folder,action,value);feedback.textContent=result.feedback;if(result.ok){state.folder=result.folder;save();draw();record({type:'unit-practice',name:'Explorador · '+action,answer:result.feedback,correct:true,feedback:'Acción realizada en un simulador; no acredita una operación en Windows real.'})}}
  section.append(path,items,button('Crear carpeta Unidad I',()=>act('create')));const rename=el('div','foundation-rename'),name=field(rename,'Nombre del archivo de práctica',state.folder.name,()=>{},{rows:1,max:80});rename.append(button('Cambiar nombre',()=>act('rename',name.value)));section.append(rename,button('Copiar a Unidad I',()=>act('copy'),'foundation-button foundation-primary'),feedback);draw();content.append(section);
 }
 function renderAssignment(){
  if(!isTaller){content.append(el('h2','','Trabajo de la unidad'));paragraph(unit.description||'Consulta las indicaciones del docente para aplicar estos recursos en tu materia.');const draft=el('section','foundation-work');draft.append(el('h3','','Prepara tus aportes'));field(draft,'Ideas y dudas para la actividad',state.notes,v=>state.notes=v,{max:4000});content.append(draft);if(unit.link){const a=el('a','foundation-download','Abrir material del docente');try{const url=new URL(unit.link);if(['http:','https:'].includes(url.protocol)&&!url.username&&!url.password){a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';content.append(a)}}catch{}}return}
  content.append(el('h2','','Trabajo grupal integrado'));paragraph('Con tu equipo, prepara un solo trabajo que reúna glosario, línea de tiempo y ensayo reflexivo. Los campos siguientes son un borrador local para organizar aportes; no son una edición compartida en tiempo real.');paragraph('La entrega y la rúbrica oficial están en tu plataforma. Usa ejemplos ficticios del entorno profesional, sin datos personales de pacientes.');
  const glossary=el('section','foundation-work');glossary.append(el('h3','','Glosario de términos informáticos'),el('p','','Define cada término con tus palabras y acompáñalo de un ejemplo. Puedes ampliar la selección según las indicaciones del docente.'));
  state.glossary.forEach((row,i)=>{const block=el('div','foundation-glossary-row');field(block,`Término ${i+1}`,row.term,v=>row.term=v,{rows:1,max:100});field(block,'Definición',row.definition,v=>row.definition=v,{max:700});field(block,'Ejemplo de uso',row.example,v=>row.example=v,{max:500});glossary.append(block)});
  glossary.append(button('Añadir término',()=>{if(state.glossary.length>=30)return;state.glossary.push({term:'',definition:'',example:''});save();render()},'foundation-button foundation-quiet'));content.append(glossary);
  const timeline=el('section','foundation-work');timeline.append(el('h3','','Línea de tiempo'),el('p','','Relaciona períodos, generaciones, avances y características. Verifica los hechos y conserva las fuentes consultadas.'));
  state.timeline.forEach((row,i)=>{const block=el('div','foundation-timeline-row');block.append(el('h4','',historyMilestones[i]?.technology||'Otro avance'));field(block,'Período o fecha',row.period,v=>row.period=v,{rows:1,max:100});field(block,'Avance y características',row.change,v=>row.change=v,{max:700});field(block,'Impacto explicado por el equipo',row.impact,v=>row.impact=v,{max:700});timeline.append(block)});content.append(timeline);
  const essay=el('section','foundation-work');essay.append(el('h3','','Ensayo reflexivo'),el('p','','Construyan una postura propia sobre la importancia de la informática y los sistemas informáticos. Relacionen sociedad, educación, trabajo, vida cotidiana y ámbito profesional.'));
  [['idea','Idea central e introducción'],['argument','Argumentos: educación, trabajo y vida cotidiana'],['example','Ejemplo profesional y reflexión crítica'],['conclusion','Conclusión del equipo'],['sources','Fuentes consultadas para el trabajo']].forEach(([id,label])=>field(essay,label,state.essay[id],v=>state.essay[id]=v));
  content.append(essay,button('Descargar borrador del trabajo',downloadDraft,'foundation-button foundation-primary'));paragraph('Antes de entregar: revisen que estén los tres componentes, que las fechas y afirmaciones estén respaldadas y que todos los integrantes conozcan el trabajo. El foro se evalúa por separado.','foundation-small');
 }
 function downloadDraft(){
  if(!ensure())return;if(downloadURL)URL.revokeObjectURL(downloadURL);
  const lines=[`# Borrador grupal · ${unit.title}`,`${course.name} · ${group.name}`,'Borrador local de apoyo. Revisar y completar en equipo antes de entregar.','\n## Glosario',...state.glossary.map(r=>`### ${r.term}\nDefinición: ${r.definition}\nEjemplo: ${r.example}`),'\n## Línea de tiempo',...state.timeline.map(r=>`### ${r.period}\nAvance: ${r.change}\nImpacto: ${r.impact}`),'\n## Ensayo',...Object.entries(state.essay).map(([k,v])=>`${{idea:'Idea central',argument:'Argumentos',example:'Ejemplo profesional',conclusion:'Conclusión',sources:'Fuentes'}[k]}\n${v}`),'\nEl foro es una actividad independiente.'];
  downloadURL=URL.createObjectURL(new Blob([lines.join('\n\n')],{type:'text/markdown;charset=utf-8'}));
  const a=el('a','foundation-download','Volver a descargar el borrador');a.href=downloadURL;a.download='ProyectoJv_Borrador_Unidad_'+(unitIndex+1)+'.md';content.querySelector('.foundation-download')?.remove();content.append(a);a.click();record({type:'resource',name:'Borrador de glosario, línea de tiempo y ensayo descargado; no es entrega institucional.'});
 }
 function renderForum(){content.append(el('h2','','Foro independiente'));paragraph('Presentación y la importancia de conocer los componentes del computador','foundation-intro');paragraph('Prepara una sola participación que incluya tu presentación y tu reflexión sobre la importancia de conocer los componentes del computador. Relaciona una función del equipo con una situación académica o profesional. Publica tu aporte y participa según las indicaciones del docente en la plataforma institucional.');paragraph('Este foro se evalúa de manera independiente del trabajo grupal. No es un segundo ensayo ni un cuestionario final.');const draft=el('section','foundation-work');draft.append(el('h3','','Prepara tu participación'));field(draft,'Presentación y reflexión para el foro',state.forum,v=>state.forum=v,{max:4000});content.append(draft);paragraph('El glosario en inglés y el foro de presentación en inglés corresponden al desarrollo de segundo idioma, con sus propias indicaciones.','foundation-small')}
 const onStorage=e=>{if(e.key==='aula-jt-campus-v1')ensure()};window.addEventListener('storage',onStorage);
 const onVisibility=()=>{if(document.hidden)stop()};document.addEventListener('visibilitychange',onVisibility);
 active={resume,pc,dispose(){stop();root.remove();window.removeEventListener('storage',onStorage);document.removeEventListener('visibilitychange',onVisibility);if(downloadURL)URL.revokeObjectURL(downloadURL)}};
 render();return true;
}
