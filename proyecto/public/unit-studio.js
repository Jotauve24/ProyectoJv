import {experienceFor, restoreStudioState, calculateBudget, assessPractice} from './unit-models.js?v=1';
import {motionButton, motionReduced} from './motion.js?v=1';

const el = (tag, className, text) => { const n = document.createElement(tag); if (className) n.className = className; if (text !== undefined) n.textContent = text; return n; };
const btn = (text, action, cls = 'studio-button') => { const b = el('button', cls, text); b.type = 'button'; b.onclick = action; return b; };
const read = key => { try { const value = JSON.parse(localStorage.getItem(key) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { return {}; } };
const currency = value => 'B/. ' + value.toLocaleString('es-PA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const icons = {
  internet: '<circle cx="40" cy="40" r="27"/><ellipse cx="40" cy="40" rx="12" ry="27"/><path d="M14 40h52M20 24h40M20 56h40"/>',
  cloud: '<path d="M21 49a13 13 0 0 1 0-26 20 20 0 0 1 38-1 14 14 0 0 1 0 28H21Z"/><path d="M40 33v35M25 68h30M18 60v8m44-8v8"/>',
  word: '<path d="M22 10h27l13 13v47H22Z"/><path d="M48 11v14h13M31 34h21M31 43h21M31 52h14M31 61h19"/>',
  slides: '<rect x="11" y="16" width="58" height="40" rx="5"/><path d="M40 56v15M29 71h22M21 27h21M21 35h15M48 45V34m9 11V27"/>',
  sheets: '<rect x="12" y="14" width="56" height="52" rx="5"/><path d="M12 28h56M12 41h56M12 54h56M31 14v52M49 14v52"/>',
};
export function unitIllustration(index, title, courseName) {
  const experience = experienceFor(courseName, index, title), host = el('div', 'unit-visual');
  host.setAttribute('aria-hidden', 'true');
  if (index === 0 && /inform[aá]tica/i.test(courseName)) { host.classList.add('unit-visual-pc'); const image = el('img'); image.src = 'aula-pc-hero.webp'; image.alt = ''; image.loading = 'lazy'; host.append(image); }
  else if (experience) { host.style.setProperty('--unit-accent', experience.accent); host.style.setProperty('--unit-light', experience.light); host.innerHTML = '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icons[experience.id] + '</svg>'; }
  else host.textContent = String(index + 1).padStart(2, '0');
  return host;
}

export function openUnitStudio({course, group, unit, unitIndex, context, onClose}) {
  const experience = experienceFor(course.name, unitIndex, unit.title); if (!experience) return false;
  const opener = document.activeElement;
  const hasStudent = !!context.studentId, storageKey = 'aula-jt-learning-' + [context.groupId, unitIndex, context.studentId].join(':');
  const previous = hasStudent ? read(storageKey) : {};
  const state = restoreStudioState(experience, previous.unitStudio?.experienceId === experience.id ? previous.unitStudio : null);
  let playing = false, timer = null, disposed = false;
  const dlg = el('dialog', 'unitstudio');
  dlg.style.setProperty('--studio-accent', experience.accent); dlg.style.setProperty('--studio-light', experience.light);
  dlg.setAttribute('aria-label', `Unidad ${unitIndex + 1}: ${unit.title}`);
  const top = el('div', 'studio-topbar'), brand = el('span', 'studio-brand', 'ProyectoJv');
  const back = btn('Cerrar unidad', () => dlg.close(), 'studio-button studio-back');
  top.append(brand, el('span', 'studio-top-context', group.name + (hasStudent ? ' · Tu espacio de aprendizaje' : ' · Vista previa docente')), back); dlg.append(top);
  const header = el('div', 'studio-header'), copy = el('div');
  copy.append(el('p', 'studio-eyebrow', `Unidad ${String(unitIndex + 1).padStart(2, '0')} de 06 · ${experience.tag}`), el('h2', '', experience.label), el('p', 'studio-intro', experience.intro));
  const badge = el('div', 'studio-duration'); badge.append(el('b', '', experience.time), el('span', '', 'Explora a tu ritmo')); header.append(copy, badge); dlg.append(header);
  const layout = el('div', 'studio-layout'), main = el('div', 'studio-main'), guide = el('aside', 'studio-guide'); layout.append(main, guide); dlg.append(layout);
  const figure = el('figure', 'studio-stage'), stageHead = el('div', 'studio-stage-head');
  stageHead.append(el('span', 'studio-window-dots', '•••'), el('span', '', {internet: 'El viaje de una página', cloud: 'Un documento · tres personas', word: 'Un documento que se entiende', slides: 'Una historia · tres momentos', sheets: 'Un presupuesto que responde'}[experience.id]), el('span', 'studio-stage-kind', 'EJEMPLO INTERACTIVO'));
  const scene = el('div', 'studio-scene'), caption = el('figcaption', 'studio-caption');
  figure.append(stageHead, scene, caption); main.append(figure);
  const controls = el('div', 'studio-playback'), playback = btn('Reproducir recorrido', togglePlayback, 'studio-button studio-play');
  const restart = btn('Reiniciar recorrido', () => { stop(false); setStep(0); }, 'studio-button studio-quiet');
  const motion = motionButton('studio-button studio-quiet'); controls.append(playback, restart, motion); main.append(controls);
  const timeline = el('nav', 'studio-timeline'); timeline.setAttribute('aria-label', 'Pasos del recorrido');
  const stepButtons = experience.steps.map((step, i) => {
    const b = btn('', () => { stop(false); setStep(i); }, 'studio-step'); b.append(el('span', '', String(i + 1).padStart(2, '0')), el('b', '', step[0])); timeline.append(b); return b;
  }); main.append(timeline);
  const description = el('details', 'studio-instructions'); description.append(el('summary', '', 'Indicaciones de mi docente'), el('p', '', unit.description || 'Revisa las actividades y la entrega con tu docente.'));
  if (unit.link) { try { const link = new URL(unit.link); if (['https:', 'http:'].includes(link.protocol) && !link.username && !link.password) { const a = el('a', 'studio-resource', 'Abrir material del docente ↗'); a.href = link.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.onclick = () => record({type: 'resource', name: unit.title}); description.append(a); } } catch {} }
  main.append(description);
  const stepCount = el('p', 'studio-step-count'), stepTitle = el('h3'), stepText = el('p', 'studio-step-text'); stepText.setAttribute('aria-live', 'polite');
  const next = btn('Siguiente paso →', () => { stop(false); if(state.step<2)setStep(state.step+1);else{practice.scrollIntoView({behavior:motionReduced()?'instant':'smooth',block:'center'});(form.querySelector('input,select')||check).focus({preventScroll:true})} }, 'studio-button studio-next'); guide.append(stepCount, stepTitle, stepText, next);
  const practice = el('section', 'studio-practice'); practice.setAttribute('aria-label', 'Práctica de la unidad');
  practice.append(el('p', 'studio-eyebrow', 'Tu turno'), el('h3', '', experience.challenge));
  const form = el('div', 'studio-practice-fields'), feedback = el('p', 'studio-feedback'); feedback.setAttribute('role', 'status');
  const check = btn('Comprobar mi práctica', checkPractice, 'studio-button studio-check'); practice.append(form, check, feedback); guide.append(practice);
  const reading = btn('Confirmar que revisé las indicaciones', () => { record({type: 'reading', name: unit.title}); reading.disabled = true; reading.textContent = 'Lectura confirmada ✓'; }, 'studio-button studio-reading');
  reading.hidden = !hasStudent; description.append(reading);
  const saveStatus = el('p', 'studio-save-status', hasStudent ? 'Tu avance se conserva en este navegador.' : 'Explora la actividad antes de compartirla con tu grupo.');
  if (hasStudent) {
    const notesLabel = el('label', 'studio-notes', 'Mi libreta de esta unidad'), notes = el('textarea'); notes.rows = 3; notes.maxLength = 4000; notes.value = typeof previous.notes === 'string' ? previous.notes : ''; notes.placeholder = 'Una idea que entendí o una duda para mi docente…';
    notes.oninput = () => persist({notes: notes.value}); notesLabel.append(notes); guide.append(notesLabel);
  }
  const evidence = btn(hasStudent ? 'Preparar mi evidencia PDF' : 'Volver al grupo', () => {
    stop(true); if (hasStudent && available()) window.dispatchEvent(new CustomEvent('aula-evidence-request', {detail: context})); else dlg.close();
  }, 'studio-button studio-evidence'); guide.append(saveStatus, evidence);
  const footer = el('p', 'studio-disclaimer', experience.id === 'cloud' ? 'Simulación educativa local. No comparte archivos con otras personas. Realiza el trabajo colaborativo y la entrega en las herramientas indicadas por tu docente.' : 'Ejemplo educativo de apoyo. Realiza el trabajo final y la entrega en las herramientas y la plataforma indicadas por tu docente.'); dlg.append(footer);

  function available() {
    if (!hasStudent || disposed) return false;
    const db = read('aula-jt-campus-v1'), g = db.groups?.find(g => g.id === context.groupId), cycle = db.cycles?.find(c => c.id === g?.cycle);
    return !!g?.students?.some(s => s.id === context.studentId) && !cycle?.closed && (document.body.dataset.mode !== 'student' || g.units[unitIndex]?.released === true);
  }
  function record(detail) { if (available()) window.dispatchEvent(new CustomEvent('aula-activity', {detail})); }
  function persist(extra = {}) {
    if (!available()) return;
    const latest = read(storageKey); Object.assign(latest, extra);
    latest.unitStudio = {version: 1, experienceId: experience.id, step: state.step, controls: state.controls};
    try { localStorage.setItem(storageKey, JSON.stringify(latest)); saveStatus.textContent = 'Guardado en este navegador.'; }
    catch { saveStatus.textContent = 'No se pudo guardar. Conserva tus notas y revisa el almacenamiento del navegador.'; }
  }
  function resetFeedback() { check.disabled = false; feedback.textContent = ''; feedback.className = 'studio-feedback'; }
  function changed() { resetFeedback(); persist(); renderScene(false); }
  function select(label, name, options) {
    const l = el('label', '', label), s = el('select'); s.name = name; s.setAttribute('aria-label', label);
    options.forEach(([value, text]) => { const option = el('option', '', text); option.value = value; s.append(option); });
    s.value = state.controls[name]; s.onchange = () => { state.controls[name] = s.value; changed(); }; l.append(s); form.append(l);
  }
  function checkbox(label, name) {
    const l = el('label', 'studio-checkbox'), input = el('input'); input.type = 'checkbox'; input.checked = state.controls[name];
    input.onchange = () => { state.controls[name] = input.checked; changed(); }; l.append(input, el('span', '', label)); form.append(l);
  }
  function buildPractice() {
    if (experience.id === 'internet') {
      const field = el('fieldset'); field.append(el('legend', 'Fuentes de ejemplo'));
      [['library', 'Biblioteca universitaria', 'Autor identificado, fecha reciente y referencias para comprobar.'], ['ad', 'Anuncio promocional', 'Afirmaciones llamativas, sin autor ni fuentes.'], ['chain', 'Mensaje reenviado', 'Cifras sin fecha y sin enlace al estudio original.']].forEach(([value, title, detail]) => {
        const label = el('label', 'studio-radio'), radio = el('input'); radio.type = 'radio'; radio.name = 'source'; radio.value = value; radio.checked = state.controls.source === value;
        radio.onchange = () => { state.controls.source = value; changed(); }; const text = el('span'); text.append(el('b', '', title), el('small', '', detail)); label.append(radio, text); field.append(label);
      }); form.append(field);
    }
    if (experience.id === 'cloud') { const options = [['viewer', 'Lector · puede consultar'], ['editor', 'Editor · puede modificar']]; select('Permiso de Ana', 'ana', options); select('Permiso de Luis', 'luis', options); }
    if (experience.id === 'word') { checkbox('Aplicar estilos Título 1 y Título 2', 'styles'); checkbox('Actualizar la tabla de contenido', 'contents'); }
    if (experience.id === 'slides') { select('Composición de las diapositivas', 'layout', [['crowded', 'Todo en una diapositiva'], ['focused', 'Una idea por diapositiva']]); select('Recurso para comparar gastos', 'visual', [['decoration', 'Imagen decorativa'], ['bars', 'Gráfico de barras']]); }
    if (experience.id === 'sheets') select('Fórmula para el total general', 'formula', [['', 'Elige una fórmula'], ['inputs', '=SUMA(B2:C4)'], ['sum', '=SUMA(D2:D4)']]);
  }
  function checkPractice() {
    stop(false); const result = assessPractice(experience.id, state.controls); feedback.textContent = (result.correct ? 'Bien razonado. ' : 'Vamos a revisarlo. ') + result.feedback;
    feedback.className = 'studio-feedback ' + (result.correct ? 'is-correct' : 'needs-review'); check.disabled = true;
    record({type: 'unit-practice', name: experience.tag, question: experience.challenge, answer: result.answer, correct: result.correct, feedback: result.feedback}); persist();
  }
  function stop(pauseScene = false) { playing = false; clearTimeout(timer); timer = null; playback.textContent = motionReduced() ? 'Avanzar sin animación' : 'Reproducir recorrido'; playback.setAttribute('aria-pressed', 'false'); dlg.classList.toggle('motion-paused', pauseScene); }
  function schedule() { clearTimeout(timer); if (!playing) return; timer = setTimeout(() => { if (state.step >= 2) { stop(false); return; } setStep(state.step + 1, false); schedule(); }, 3800); }
  function togglePlayback() {
    if (playing) { stop(true); return; }
    if (motionReduced()) { setStep((state.step + 1) % 3); return; }
    dlg.classList.remove('motion-paused'); playing = true; if (state.step === 2) setStep(0, false); else renderScene(true);
    playback.textContent = 'Pausar recorrido'; playback.setAttribute('aria-pressed', 'true'); schedule();
  }
  function setStep(index, manual = true) {
    if (disposed || index < 0 || index > 2) return;
    state.step = index; if (manual) stop(false); stepCount.textContent = `Paso ${index + 1} de 3`; stepTitle.textContent = experience.steps[index][0]; stepText.textContent = experience.steps[index][1];
    stepButtons.forEach((b, i) => { b.classList.toggle('is-active', i === index); b.setAttribute('aria-current', i === index ? 'step' : 'false'); });
    next.textContent = index === 2 ? 'Ir a mi práctica ↓' : 'Siguiente paso →';
    renderScene(true); record({type: 'unit-explore', name: experience.steps[index][0], experience: experience.tag, step: index + 1}); persist();
  }
  function renderScene(animate = false) {
    scene.className = 'studio-scene scene-' + experience.id + (animate && !motionReduced() ? ' scene-animate' : ''); scene.dataset.step = state.step; scene.replaceChildren();
    caption.textContent = experience.steps[state.step][0] + ' · ' + ['Sigue el recorrido. Después compara las fuentes.', 'Cambia los permisos y observa quién puede editar.', 'Aplica los estilos y mira cómo aparece el índice.', 'Cambia la composición y el apoyo visual.', 'Edita los datos; las fórmulas hacen el resto.'][unitIndex - 1];
    if (experience.id === 'internet') renderInternet();
    if (experience.id === 'cloud') renderCloud();
    if (experience.id === 'word') renderWord();
    if (experience.id === 'slides') renderSlides();
    if (experience.id === 'sheets') renderSheets();
  }
  function panel(cls, label, title) { const n = el('div', cls); n.append(el('span', 'scene-label', label), el('b', '', title)); return n; }
  function renderInternet() {
    const graph = el('div', 'network-scene');
    const browser = panel('network-browser', 'TU NAVEGADOR', 'biblioteca.universidad.example');
    const screen = el('div', 'network-screen'); screen.append(el('span', '', state.step === 2 ? 'Biblioteca digital' : 'Preparando la consulta'), el('strong', '', state.step === 2 ? 'Una página. Muchas decisiones.' : '¿Cómo llegamos al contenido?'));
    for (let i = 0; i < 3; i++) screen.append(el('i', 'browser-line')); browser.append(screen);
    const track = el('div', 'network-route'); track.innerHTML = '<svg viewBox="0 0 240 140" fill="none" aria-hidden="true"><path class="route-line" d="M5 70h230"/><path d="m221 61 12 9-12 9"/><rect class="network-packet" x="5" y="58" width="30" height="24" rx="6"/></svg>';
    track.append(el('span', 'network-route-label', ['Nombre → dirección IP', 'Solicitud HTTPS →', '← Respuesta y recursos'][state.step]));
    const remote = el('div', 'network-remotes'), dns = panel('network-node', '01 · DNS', 'Localiza el servidor'), server = panel('network-node', '02 · SERVIDOR', 'Entrega los recursos');
    dns.classList.toggle('scene-highlight', state.step === 0); server.classList.toggle('scene-highlight', state.step > 0); remote.append(dns, server); graph.append(browser, track, remote); scene.append(graph, el('p', 'scene-note', 'Representación simplificada · no se realiza una conexión real'));
  }
  function renderCloud() {
    const graph = el('div', 'cloud-scene'); graph.innerHTML = '<svg class="cloud-connections" viewBox="0 0 680 340" fill="none" aria-hidden="true"><path d="M140 90 340 175 550 95M340 175v125"/><circle class="cloud-change" cx="140" cy="90" r="7"/></svg>';
    const document = panel('cloud-document', 'DOCUMENTO COMPARTIDO', 'Informe de equipo'); document.append(el('span', 'cloud-version', state.step === 2 ? 'Versión 03 · cambios revisados' : 'Una misma versión'), el('i'), el('i'), el('i'));
    const ana = panel('cloud-person person-ana', 'ANA', state.controls.ana === 'viewer' ? 'Lectora' : 'Editora'); ana.prepend(el('span', 'cloud-avatar', 'A'));
    const luis = panel('cloud-person person-luis', 'LUIS', state.controls.luis === 'editor' ? 'Editor' : 'Lector'); luis.prepend(el('span', 'cloud-avatar', 'L'));
    const you = panel('cloud-person person-you', 'TÚ', 'Responsable'); you.prepend(el('span', 'cloud-avatar', 'T'));
    graph.append(document, ana, luis, you); scene.append(graph);
  }
  function renderWord() {
    const spread = el('div', 'document-scene'), outline = el('div', 'document-outline'); outline.append(el('span', 'scene-label', 'TABLA DE CONTENIDO'));
    const ready = state.controls.styles && state.controls.contents;
    if (ready) ['1. Resumen ejecutivo', '2. Resultados', '2.1 Próximos pasos'].forEach(text => outline.append(el('span', '', text)));
    else outline.append(el('p', '', state.controls.contents ? 'Aplica estilos a los títulos para construir el índice.' : 'El índice aparecerá al aplicar estilos y actualizarlo.'));
    const paper = el('div', 'document-paper' + (state.controls.styles ? ' has-styles' : ''));
    paper.append(el('span', 'document-style-tag', state.controls.styles ? 'Título 1 · estructura aplicada' : 'Texto normal'), el('h4', '', 'Informe empresarial'), el('h5', '', '1. Resumen ejecutivo'), el('p', '', 'Una estructura clara ayuda a encontrar y comprender las ideas del informe.'), el('h5', '', '2. Resultados'), el('p', '', 'Los datos y sus conclusiones se organizan por secciones.'), el('h6', '', '2.1 Próximos pasos'));
    for (let i = 0; i < 3; i++) paper.append(el('i', 'paper-line')); spread.append(outline, paper); scene.append(spread);
  }
  function renderSlides() {
    const deck = el('div', 'slides-scene'), ribbon = el('div', 'slides-ribbon'); ['Pregunta', 'Evidencia', 'Decisión'].forEach((title, i) => { const item = el('span', i === state.step ? 'active' : '', `${String(i + 1).padStart(2, '0')} ${title}`); ribbon.append(item); });
    const slide = el('div', 'presentation-slide' + (state.controls.layout === 'focused' ? ' is-focused' : ' is-crowded'));
    slide.append(el('span', 'scene-label', ['01 / EL PUNTO DE PARTIDA', '02 / LA EVIDENCIA', '03 / LA DECISIÓN'][state.step]), el('h4', '', ['¿Dónde se concentra el gasto?', 'Compara antes de decidir.', 'Explica tu siguiente paso.'][state.step]));
    if (state.controls.visual === 'bars') {
      const bars = el('div', 'slide-chart'); [['Operación', 75, '750'], ['Tecnología', 53, '530'], ['Formación', 30, '300']].forEach(([name, value, amount]) => { const row = el('div'); const bar = el('i'); bar.style.setProperty('--value', value / 100); row.append(el('span', '', name), bar, el('b', '', amount)); bars.append(row); }); slide.append(bars, el('small', '', 'Gastos de ejemplo · B/.'));
    } else { const visual = el('div', 'slide-decoration'); visual.innerHTML = '<svg viewBox="0 0 260 120" fill="none" aria-hidden="true"><circle cx="130" cy="60" r="47"/><path d="M30 85 80 25l50 65 40-50 60 45"/></svg>'; slide.append(visual, el('p', '', 'Una imagen llamativa no explica por sí sola los gastos.')); }
    if (state.controls.layout !== 'focused') slide.append(el('p', 'slide-overload', 'Antecedentes · objetivos · todos los datos · metodología · resultados · conclusiones · próximos pasos · detalles del informe completo'));
    deck.append(ribbon, slide, el('p', 'scene-note', 'Datos de ejemplo · utiliza los controles para mejorar esta presentación')); scene.append(deck);
  }
  function renderSheets() {
    const sheet = el('div', 'sheets-scene'), formula = el('div', 'sheet-formula'); formula.append(el('b', '', state.step === 2 ? 'D5' : 'D2'), el('span', '', 'ƒx'), el('code', '', state.step === 2 ? '=SUMA(D2:D4)' : '=B2*C2'));
    const table = el('table', 'sheet-table'), caption = el('caption', 'sr-only', 'Presupuesto de ejemplo. Edita cantidad y precio; se recalculan los subtotales y el total.'); table.append(caption);
    const head = el('thead'), columns = el('tr'); ['', 'A · Producto', 'B · Cantidad', 'C · Precio', 'D · Total'].forEach(name => { const th = el('th', '', name); th.scope = 'col'; columns.append(th); }); head.append(columns); table.append(head);
    const body = el('tbody'), outputs = [];
    state.controls.rows.forEach((row, i) => {
      const tr = el('tr'), number = el('th', '', String(i + 2)); number.scope = 'row'; tr.append(number, el('td', 'sheet-product', row.name));
      ['quantity', 'price'].forEach(key => {
        const td = el('td'), input = el('input'); input.type = 'number'; input.value = row[key]; input.min = '0'; input.max = key === 'quantity' ? '1000' : '100000'; input.step = key === 'quantity' ? '1' : '0.01'; input.inputMode = key === 'quantity' ? 'numeric' : 'decimal'; input.setAttribute('aria-label', (key === 'quantity' ? 'Cantidad de ' : 'Precio de ') + row.name.toLowerCase());
        input.oninput = () => { row[key] = input.value; resetFeedback(); persist(); update(); }; td.append(input); tr.append(td);
      }); const out = el('td', 'sheet-result'); outputs.push(out); tr.append(out); body.append(tr);
    });
    const totalRow = el('tr', 'sheet-total'); const corner = el('th', '', '5'); corner.scope = 'row'; const totalLabel = el('th', '', 'Total general'); totalLabel.colSpan = 3; totalLabel.scope = 'row'; const total = el('td'); total.setAttribute('aria-live', 'polite'); totalRow.append(corner, totalLabel, total); body.append(totalRow); table.append(body);
    const warning = el('p', 'sheet-warning'); warning.setAttribute('role', 'status'); const bars = el('div', 'sheet-bars');
    const fills = state.controls.rows.map(row => { const line = el('div'); const fill = el('i'); line.append(el('span', '', row.name), fill); bars.append(line); return fill; });
    function update() {
      const budget = calculateBudget(state.controls.rows); warning.textContent = budget.valid ? 'Los subtotales son cantidad × precio. Los datos de este ejemplo son editables.' : budget.error;
      outputs.forEach((out, i) => out.textContent = budget.valid ? currency(budget.totals[i]) : 'Revisar'); total.textContent = budget.valid ? currency(budget.total) : 'Revisar datos';
      const max = budget.valid ? Math.max(...budget.totals, 1) : 1; fills.forEach((fill, i) => fill.style.setProperty('--value', budget.valid ? budget.totals[i] / max : 0));
    }
    sheet.append(formula, table, warning, bars); scene.append(sheet); update();
  }
  const onMotion = () => { stop(true); renderScene(false); };
  const onVisibility = () => { if (document.hidden) stop(true); };
  window.addEventListener('aula-motion-change', onMotion); document.addEventListener('visibilitychange', onVisibility);
  dlg.addEventListener('focusin', () => { if (playing) stop(true); });
  dlg.addEventListener('close', () => { disposed = true; stop(true); motion.releaseMotionListener(); window.removeEventListener('aula-motion-change', onMotion); document.removeEventListener('visibilitychange', onVisibility); dlg.remove(); onClose?.(); if(opener?.isConnected)opener.focus(); }, {once: true});
  buildPractice(); document.body.append(dlg); dlg.showModal(); stop(false); setStep(state.step, false);
  return true;
}
