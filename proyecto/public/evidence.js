const $ = s => document.querySelector(s);
const node = (tag, text) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; return el; };
const read = () => { try { return JSON.parse(localStorage.getItem('aula-jt-campus-v1')); } catch { return null; } };
const purposes = {support: 'Material de apoyo', extra: 'Puntos extras', grade: 'Actividad para nota'};
const now = () => new Date().toISOString();
let context = null;
function readRecords() {
  try { const r = JSON.parse(localStorage.getItem('aula-jt-evidence-v1') || '{}'); return r && typeof r === 'object' && !Array.isArray(r) ? r : {}; }
  catch { return {}; }
}
function key(c) { return [c.groupId, c.unitIndex, c.studentId].join(':'); }
function emptyRecord() { return {started: now(), events: [], reflection: ''}; }
function saveRecord(k, record) {
  const records = readRecords(); records[k] = record;
  try { localStorage.setItem('aula-jt-evidence-v1', JSON.stringify(records)); return true; } catch { return false; }
}
function current() { return context ? readRecords()[key(context)] : null; }
function contextInfo(c = context) {
  if (!c) return null;
  const db = read(), g = db?.groups.find(g => g.id === c.groupId);
  if (!g) return null;
  const course = db.courses.find(v => v.id === g.course), cycle = db.cycles.find(v => v.id === g.cycle);
  const unit = g.units[c.unitIndex], student = g.students.find(s => s.id === c.studentId);
  return course && cycle && unit && student ? {...c, g, course, cycle, unit, student} : null;
}
function log(detail) {
  const info = contextInfo(), r = current();
  if (!info || !r || info.cycle.closed || (document.body.dataset.mode === 'student' && info.unit.released !== true)) return;
  r.events.push({...detail, at: now()}); saveRecord(key(context), r);
}
window.addEventListener('aula-activity', e => log(e.detail));
window.addEventListener('aula-evidence-request', e => openEvidence(e.detail || {}));
window.addEventListener('aula-clear-context', () => { context = null; $('#evidencebutton').textContent = 'Descargar evidencia'; });
$('#evidencebutton').onclick = () => openEvidence();
function selectField(form, label, name, options) {
  const l = node('label', label), s = node('select'); s.name = name; s.required = true; s.setAttribute('aria-label', label);
  options.forEach(([value, text]) => { const o = node('option', text); o.value = value; s.append(o); });
  l.append(s); form.append(l); return s;
}
function openEvidence(pre = {}) {
  const db = read(); if (!db) return;
  const studentMode = document.body.dataset.mode === 'student', activeInfo = contextInfo();
  if (studentMode && (!activeInfo || activeInfo.cycle.closed || activeInfo.unit.released !== true)) {
    window.dispatchEvent(new Event('aula-student-home')); return;
  }
  const dlg = node('dialog'); dlg.className = 'evidencedialog';
  const f = node('form'), close = node('button', '×');
  close.type = 'button'; close.className = 'close'; close.setAttribute('aria-label', 'Cerrar'); close.onclick = () => dlg.close();
  f.append(close, node('h2', 'Mi evidencia de aprendizaje'));
  const intro = node('p', studentMode ? 'Escribe tu reflexión, genera el informe y guarda el PDF. Después súbelo a la plataforma que te indicó tu docente.' : 'Consulta la evidencia por grupo, unidad y estudiante. Para registrar una práctica, pulsa «Comenzar o continuar».');
  intro.className = 'campussub'; f.append(intro);
  const groups = studentMode ? [activeInfo.g] : db.groups;
  const gs = selectField(f, 'Grupo y materia', 'group', groups.map(g => [g.id, g.name + ' · ' + db.courses.find(c => c.id === g.course).name + (db.cycles.find(c => c.id === g.cycle)?.closed ? ' · Historial' : '')]));
  const requested = studentMode ? context.groupId : pre.groupId || context?.groupId;
  gs.value = groups.some(g => g.id === requested) ? requested : groups[0]?.id || '';
  const us = selectField(f, 'Unidad', 'unit', []), ss = selectField(f, 'Estudiante registrado', 'student', []);
  const error = node('p'); error.className = 'evidenceerror'; error.setAttribute('role', 'status');
  const label = node('label', 'Mi reflexión: ¿qué aprendí y qué necesito repasar?'), reflection = node('textarea');
  reflection.name = 'reflection'; reflection.rows = 4; reflection.maxLength = 4000; reflection.placeholder = 'Escribe con tus propias palabras…';
  label.append(reflection); f.append(label, error);
  const stats = node('div'); stats.className = 'evidencesummary'; f.append(stats);
  const result = node('div'); result.className = 'pdfresult'; f.append(result);
  let pdfUrl = null;
  function clearPDF() { result.replaceChildren(); if (pdfUrl) { URL.revokeObjectURL(pdfUrl); pdfUrl = null; } }
  const actions = node('div'); actions.className = 'evidenceactions';
  const start = node('button', 'Comenzar o continuar'); start.type = 'button'; start.className = 'primary';
  const download = node('button', 'Descargar informe PDF'); download.type = 'submit'; download.className = 'secondary';
  actions.append(start, download); f.append(actions);
  const notice = node('p', 'La identidad se selecciona sin autenticación. Los registros son locales y no son un certificado ni una calificación oficial. Tu docente decide si se usan como apoyo, nota o puntos extras.');
  notice.className = 'campusnotice'; f.append(notice);
  function selection() { return {groupId: gs.value, unitIndex: Number(us.value), studentId: ss.value}; }
  function fill() {
    const g = db.groups.find(x => x.id === gs.value); us.replaceChildren(); ss.replaceChildren();
    g?.units.forEach((u, i) => { const o = node('option', `${i + 1}. ${u.title}`); o.value = i; us.append(o); });
    g?.students.forEach(st => { const o = node('option', st.name); o.value = st.id; ss.append(o); });
    if (!g?.students.length) { const o = node('option', 'Agrega primero estudiantes al grupo'); o.value = ''; ss.append(o); }
  }
  function updateSummary() {
    const info = contextInfo(selection()), r = info ? readRecords()[key(info)] : null;
    const count = r?.events.filter(e => e.type === 'quiz').length || 0;
    reflection.value = r?.reflection || ''; reflection.readOnly = info?.cycle.closed === true;
    start.hidden = studentMode || info?.cycle.closed === true;
    start.disabled = download.disabled = !info;
    stats.textContent = r ? `${r.events.length} ${r.events.length === 1 ? 'registro' : 'registros'} de actividad · ${count} ${count === 1 ? 'práctica completada' : 'prácticas completadas'}` : 'Sin actividad registrada todavía para este estudiante y unidad.';
    error.textContent = !info ? 'Selecciona un grupo con estudiantes registrados.' : info.cycle.closed ? 'Ciclo finalizado: consulta y descarga del historial, sin modificar sus registros.' : '';
  }
  fill();
  us.value = studentMode ? context.unitIndex : pre.unitIndex ?? (context?.groupId === gs.value ? context.unitIndex : 0);
  if (studentMode || context?.groupId === gs.value) ss.value = context.studentId;
  gs.onchange = () => { clearPDF(); fill(); updateSummary(); };
  us.onchange = ss.onchange = () => { clearPDF(); updateSummary(); };
  reflection.oninput = () => {
    clearPDF(); const info = contextInfo(selection());
    if (!info || info.cycle.closed || (studentMode && info.unit.released !== true)) return;
    const k = key(info), r = readRecords()[k] || emptyRecord(); r.reflection = reflection.value;
    error.textContent = saveRecord(k, r) ? 'Reflexión guardada en este navegador.' : 'No se pudo guardar la reflexión. Revisa el almacenamiento de tu navegador.';
  };
  updateSummary();
  if (studentMode) {
    for (const s of [gs, us, ss]) s.parentElement.hidden = true;
    const identity = node('p', `${activeInfo.student.name} · ${activeInfo.g.name} · Unidad ${context.unitIndex + 1}: ${activeInfo.unit.title}`);
    identity.className = 'evidencesummary'; f.insertBefore(identity, label);
  }
  function prepare(practice = false) {
    const c = selection(), info = contextInfo(c);
    if (!info) { error.textContent = 'Selecciona un grupo, unidad y estudiante registrados.'; return null; }
    if (studentMode && (!context || key(c) !== key(context) || info.unit.released !== true || info.cycle.closed)) {
      error.textContent = 'La unidad ya no está disponible. Regresa a tu curso.'; return null;
    }
    if (practice && info.cycle.closed) return null;
    const k = key(c), r = readRecords()[k] || emptyRecord();
    if (!info.cycle.closed) { r.reflection = reflection.value; if (!saveRecord(k, r)) { error.textContent = 'No se pudo guardar el registro en este navegador.'; return null; } }
    if (practice) {
      const changed = !context || key(context) !== k; context = c;
      if (changed) window.dispatchEvent(new CustomEvent('aula-context', {detail: {...c, key: k}}));
      $('#evidencebutton').textContent = 'Mi evidencia · ' + info.student.name.split(' ')[0];
    }
    return {info, record: r, context: c};
  }
  start.onclick = () => { const chosen = prepare(true); if (!chosen) return; dlg.close(); window.dispatchEvent(new CustomEvent('aula-study-unit', {detail: chosen.context})); };
  f.onsubmit = e => {
    e.preventDefault(); const chosen = prepare(); if (!chosen) return;
    try {
      const pdf = downloadReport(chosen.info, chosen.record); if (!pdf) return;
      clearPDF(); const msg = node('p', 'Informe preparado. Usa el enlace de descarga si el archivo no aparece automáticamente.');
      let retry;
      if (pdf.blob) {
        pdfUrl = URL.createObjectURL(pdf.blob); retry = node('a', 'Volver a descargar PDF');
        retry.href = pdfUrl; retry.download = pdf.filename;
      } else {
        retry = node('button', 'Volver a descargar PDF'); retry.type = 'button';
        retry.onclick = () => pdf.save().catch(() => { msg.textContent = 'No se completó la descarga. Prueba la opción de impresión.'; });
      }
      retry.className = 'meetinglink';
      const print = node('button', 'Imprimir / Guardar como PDF'); print.type = 'button'; print.className = 'secondary';
      print.onclick = () => printReport(chosen.info, chosen.record);
      const help = node('p', 'También puedes usar «Imprimir / Guardar como PDF» y elegir Guardar como PDF como destino.'); help.className = 'downloadhint';
      result.append(msg, retry, print, help);
      if (pdf.blob) retry.click(); else pdf.save().catch(() => { msg.textContent = 'No se completó la descarga. Usa una de las opciones de abajo.'; });
      updateSummary();
    } catch { error.textContent = 'No se pudo preparar el PDF. Cierra el formulario, vuelve a intentarlo y revisa que el generador esté cargado.'; }
  };
  dlg.append(f); document.body.append(dlg); dlg.onclose = () => { clearPDF(); dlg.remove(); }; dlg.showModal();
}
const date=iso=>new Date(iso).toLocaleString('es-PA',{timeZone:'America/Panama',dateStyle:'medium',timeStyle:'short'});
function downloadReport(info,r){if(!window.jspdf){alert('No se pudo cargar el generador PDF. Recarga la página e inténtalo otra vez.');return}const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'});let y=25;const width=170,margin=20;const clean=v=>String(v||'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/[\u{1F300}-\u{1FAFF}]/gu,'');function page(needed=14){if(y+needed>270){doc.addPage();y=23}}function text(t,size=10,color=[77,91,112],bold=false){doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(...color);const lines=doc.splitTextToSize(clean(t),width);for(const line of lines){page(size*.5+2);doc.text(line,margin,y);y+=size*.45+1.3}y+=3}function heading(t){page(22);y+=7;text(t,12,[31,70,125],true)}
doc.setFillColor(18,37,68);doc.rect(0,0,210,53,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(22);doc.text('ProyectoJv',margin,20);doc.setFontSize(12);doc.setFont('helvetica','normal');doc.text('Evidencia de aprendizaje por unidad',margin,30);doc.setTextColor(156,189,232);doc.setFontSize(9);doc.text('Para adjuntar en tu plataforma educativa',margin,41);y=65;
text(info.student.name,18,[29,41,61],true);text(`Materia: ${info.course.name}`);text(`Grupo: ${info.g.name} | Ciclo: ${info.cycle.name}`);text(`Unidad ${info.unitIndex+1} de 6: ${info.unit.title}`);text(`Uso previsto: ${purposes[info.unit.purpose]||purposes.support}`);text(`Inicio del registro: ${date(r.started)}`);text(`Informe generado: ${date(now())} (hora de Panamá)`);
heading('Actividad registrada');const explored=[...new Set(r.events.filter(e=>e.type==='explore').map(e=>e.name))],understood=[...new Set(r.events.filter(e=>e.type==='understood').map(e=>e.name))];text(`Componentes explorados: ${explored.length?explored.join(', '):'Sin registros.'}`);text(`Componentes marcados como comprendidos por el estudiante: ${understood.length?understood.join(', '):'Sin registros.'}`);const reads=r.events.filter(e=>e.type==='reading');text(`Confirmaciones de lectura declaradas por el estudiante: ${reads.length}`);const links=r.events.filter(e=>e.type==='resource');text(`Aperturas de materiales: ${links.length}. La apertura no verifica la realización de actividades externas.`);
heading('Evaluaciones de práctica');const quizzes=r.events.filter(e=>e.type==='quiz');if(quizzes.length){quizzes.forEach((q,i)=>text(`Intento completado ${i+1}: ${q.score} de ${q.total} respuestas correctas (${Math.round(q.score/q.total*100)}% en esta práctica; ${date(q.at)}).`))}else text('No hay una evaluación completada registrada para esta unidad.');const answers=r.events.filter(e=>e.type==='answer');if(answers.length){heading('Respuestas registradas');answers.forEach((a,i)=>{page(27);text(`${i+1}. ${a.question}`,10,[49,65,88],true);text(`Respuesta: ${a.answer}. ${a.correct?'Correcta':'Por repasar'}.`);text(`Fecha: ${date(a.at)}`,8,[126,138,156])})}
try{const notes=JSON.parse(localStorage.getItem('aula-jt-learning-'+key(info))||'{}').notes;if(notes){heading('Notas del estudiante');text(notes)}}catch{}heading('Reflexión del estudiante');text(r.reflection||'No se ha incluido una reflexión.');heading('Alcance de esta evidencia');text('Este informe resume registros guardados en el navegador. La identidad es seleccionada por el usuario, sin verificación de cuenta. Las marcas de comprensión y lectura son declaraciones del estudiante. No acredita por sí solo dominio, autoría, asistencia ni una calificación oficial.',9);text('El estudiante debe subir este archivo a la plataforma indicada por su docente. La evaluación y los puntos extras se determinan allí.',9);
const total=doc.getNumberOfPages();for(let i=1;i<=total;i++){doc.setPage(i);doc.setDrawColor(225,231,241);doc.line(20,282,190,282);doc.setFontSize(8);doc.setTextColor(133,146,165);doc.text('ProyectoJv | Evidencia de práctica',20,289);doc.text(`${i} / ${total}`,182,289)}const slug=info.student.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').slice(0,60);const filename=`ProyectoJv_Evidencia_${slug}_Unidad_${info.unitIndex+1}.pdf`;return{filename,blob:document.querySelector('meta[name="proyectojv-hosting"]')?.content==='github-pages'?doc.output('blob'):null,save:async()=>submitPDF(doc.output('datauristring').split(',')[1],filename)}}

window.addEventListener('aula-start-student', e => {
  const c=e.detail, info=contextInfo(c);
  if(!info || info.cycle.closed || (document.body.dataset.mode==='student' && info.unit.released!==true))return;
  const k=key(c), changed=!context || key(context)!==k;context=c;
  if(!readRecords()[k])saveRecord(k,emptyRecord());
  if(changed)window.dispatchEvent(new CustomEvent('aula-context',{detail:{...c,key:k}}));
  $('#evidencebutton').textContent='Mi evidencia';
});

function printReport(info,r){document.querySelector('#print-evidence')?.remove();const report=node('article');report.id='print-evidence';const add=(tag,text)=>report.append(node(tag,text));add('h1','ProyectoJv — Evidencia de aprendizaje');add('p',info.student.name);add('p',`${info.course.name} · ${info.g.name} · ${info.cycle.name}`);add('p',`Unidad ${info.unitIndex+1}: ${info.unit.title}`);add('p',`Uso previsto: ${purposes[info.unit.purpose]||purposes.support}`);add('p',`Generado: ${date(now())} (Panamá)`);add('h2','Actividad registrada');const explored=[...new Set(r.events.filter(e=>e.type==='explore').map(e=>e.name))];add('p','Componentes explorados: '+(explored.join(', ')||'Sin registros.'));const understood=[...new Set(r.events.filter(e=>e.type==='understood').map(e=>e.name))];add('p','Comprensión declarada por el estudiante: '+(understood.join(', ')||'Sin registros.'));add('p','Confirmaciones de lectura declaradas: '+r.events.filter(e=>e.type==='reading').length);add('h2','Prácticas completadas');const quizzes=r.events.filter(e=>e.type==='quiz');if(!quizzes.length)add('p','No hay una práctica completada registrada.');quizzes.forEach((q,i)=>add('p',`Intento ${i+1}: ${q.score} de ${q.total} respuestas correctas · ${date(q.at)}`));const answers=r.events.filter(e=>e.type==='answer');if(answers.length){add('h2','Respuestas');answers.forEach((a,i)=>{add('h3',`${i+1}. ${a.question}`);add('p',`${a.answer} — ${a.correct?'Correcta':'Por repasar'}`)})}try{const notes=JSON.parse(localStorage.getItem('aula-jt-learning-'+key(info))||'{}').notes;if(notes){add('h2','Notas');add('p',notes)}}catch{}add('h2','Reflexión');add('p',r.reflection||'Sin reflexión escrita.');add('h2','Alcance');add('p','Registros locales del navegador. La identidad no está autenticada y las marcas de lectura y comprensión son declaraciones del estudiante. Este informe no acredita autoría, dominio ni una calificación oficial. El docente evalúa la entrega en su plataforma.');document.body.append(report);window.print()}

function submitPDF(base64,filename){const form=document.createElement('form');form.method='POST';form.action=new URL('api/evidence-pdf',location.href).href;form.target='_self';form.hidden=true;for(const [name,value] of Object.entries({pdf:base64,filename})){const field=document.createElement('input');field.type='hidden';field.name=name;field.value=value;form.append(field)}document.body.append(form);form.submit();setTimeout(()=>form.remove(),5000)}
