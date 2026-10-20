import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync, writeFileSync} from 'node:fs';

const evidenceSource = readFileSync(new URL('../public/evidence.js', import.meta.url), 'utf8');
function laboratory() {
  const db = {cycles: [{id: 'ciclo', name: 'Ciclo', closed: false}], courses: [{id: 'curso', name: 'Informática'}],
    groups: [{id: 'grupo', name: 'Grupo', cycle: 'ciclo', course: 'curso', students: [{id: 'alumno', name: 'Estudiante de prueba'}],
      units: Array.from({length: 6}, (_, i) => ({title: `Unidad ${i + 1}`, purpose: 'support', released: i === 0}))}]};
  const storage = new Map([['aula-jt-campus-v1', JSON.stringify(db)]]), listeners = new Map(), header = {};
  const localStorage = {getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v)};
  const window = {addEventListener: (type, fn) => { const all = listeners.get(type) || []; all.push(fn); listeners.set(type, all); },
    dispatchEvent: event => { for (const fn of listeners.get(event.type) || []) fn(event); }};
  const sandbox = {window, document: {body: {dataset: {mode: 'student'}}, querySelector: selector => selector === '#evidencebutton' ? header : {content: 'github-pages'}},
    localStorage, console, URL, Blob, atob, btoa, Date,
    Event: class {constructor(type) {this.type = type;}},
    CustomEvent: class {constructor(type, options) {this.type = type; this.detail = options?.detail;}}};
  vm.createContext(sandbox); vm.runInContext(evidenceSource, sandbox);
  const send = (type, detail) => window.dispatchEvent({type, detail});
  const who = {groupId: 'grupo', studentId: 'alumno', unitIndex: 0};
  const records = () => JSON.parse(localStorage.getItem('aula-jt-evidence-v1') || '{}');
  return {sandbox, db, localStorage, send, who, records, header};
}

test('salir del contexto impide que la exploración docente se atribuya al alumno anterior', () => {
  const lab = laboratory(); lab.send('aula-start-student', lab.who);
  lab.send('aula-activity', {type: 'explore', name: 'CPU'});
  lab.send('aula-clear-context'); lab.send('aula-activity', {type: 'explore', name: 'GPU'});
  assert.equal(lab.records()['grupo:0:alumno'].events.length, 1);
  assert.equal(lab.header.textContent, 'Descargar evidencia');
});

test('retirar acceso, eliminar una matrícula o archivar el ciclo detiene nuevos registros', () => {
  for (const change of [db => db.groups[0].units[0].released = false, db => db.groups[0].students = [], db => db.cycles[0].closed = true]) {
    const lab = laboratory(); lab.send('aula-start-student', lab.who); change(lab.db);
    lab.localStorage.setItem('aula-jt-campus-v1', JSON.stringify(lab.db));
    lab.send('aula-activity', {type: 'quiz', score: 5, total: 5});
    assert.equal(lab.records()['grupo:0:alumno'].events.length, 0);
  }
});

test('una pestaña conserva los registros y reflexiones guardados por otra', () => {
  const lab = laboratory(); lab.send('aula-start-student', lab.who);
  const shared = lab.records(); shared['otro:0:alumno'] = {events: [], reflection: 'Otra evidencia'};
  shared['grupo:0:alumno'].reflection = 'Reflexión recién guardada';
  lab.localStorage.setItem('aula-jt-evidence-v1', JSON.stringify(shared));
  lab.send('aula-activity', {type: 'reading', name: 'Contenido'});
  assert.equal(lab.records()['otro:0:alumno'].reflection, 'Otra evidencia');
  assert.equal(lab.records()['grupo:0:alumno'].reflection, 'Reflexión recién guardada');
});

test('una unidad bloqueada nunca inicia un expediente de estudiante', () => {
  const lab = laboratory(); lab.send('aula-start-student', {...lab.who, unitIndex: 1});
  lab.send('aula-activity', {type: 'reading', name: 'Contenido'});
  assert.deepEqual(lab.records(), {});
});

test('el recorrido y las prácticas nuevas quedan en la unidad elegida y se detienen al retirar acceso', () => {
  const lab = laboratory(); lab.db.groups[0].units[5].released = true;
  lab.localStorage.setItem('aula-jt-campus-v1', JSON.stringify(lab.db));
  lab.send('aula-start-student', {...lab.who, unitIndex: 5});
  lab.send('aula-activity', {type: 'unit-explore', name: 'Un total que responde'});
  lab.send('aula-activity', {type: 'unit-practice', name: 'Hojas de cálculo', correct: true, answer: 'Total del ejemplo: 594.00.'});
  assert.equal(lab.records()['grupo:5:alumno'].events.length, 2);
  assert.equal(lab.records()['grupo:0:alumno'], undefined);
  lab.db.groups[0].units[5].released = false; lab.localStorage.setItem('aula-jt-campus-v1', JSON.stringify(lab.db));
  lab.send('aula-activity', {type: 'unit-practice', name: 'Hojas de cálculo', correct: true});
  assert.equal(lab.records()['grupo:5:alumno'].events.length, 2);
});

test('el PDF usa el estudiante y la unidad seleccionados y genera bytes PDF válidos', async () => {
  const lab = laboratory(), exports = {}, pdfRuntime = {exports, module: {exports}, atob, btoa, Blob, console};
  pdfRuntime.global = pdfRuntime; vm.createContext(pdfRuntime);
  vm.runInContext(readFileSync(new URL('../public/jspdf.umd.min.js', import.meta.url), 'utf8'), pdfRuntime);
  lab.sandbox.window.jspdf = exports;
  lab.send('aula-start-student', lab.who);
  lab.send('aula-activity', {type: 'quiz', score: 4, total: 5});
  lab.send('aula-activity', {type: 'unit-explore', name: 'Un total que responde'});
  lab.send('aula-activity', {type: 'unit-practice', name: 'Presupuesto', question: 'Calcula el total', answer: 'Total del ejemplo: 594.00.', correct: true, feedback: 'Suma los subtotales.'});
  vm.runInContext("testInfo=contextInfo();testRecord=current();testRecord.reflection='Reflexión de prueba';context={groupId:'otro',studentId:'otro',unitIndex:5};testPdf=downloadReport(testInfo,testRecord)", lab.sandbox);
  assert.equal(lab.sandbox.testPdf.filename, 'ProyectoJv_Evidencia_Estudiante_de_prueba_Unidad_1.pdf');
  const bytes = Buffer.from(await lab.sandbox.testPdf.blob.arrayBuffer());
  assert.equal(bytes.subarray(0, 5).toString(), '%PDF-'); assert.ok(bytes.length > 5000);
  assert.ok(bytes.includes(Buffer.from('Estudiante de prueba'))); assert.ok(bytes.includes(Buffer.from('Unidad 1 de 6')));
  assert.ok(bytes.includes(Buffer.from('Total del ejemplo: 594.00.')));
  if (process.env.PROYECTOJV_QA_PDF) writeFileSync(process.env.PROYECTOJV_QA_PDF, bytes);
});
