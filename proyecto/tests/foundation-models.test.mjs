import test from 'node:test';
import assert from 'node:assert/strict';
import {diagnosticQuestions,assessDiagnostic,checkFoundationPractice,foundationStorageKey,restoreFoundations,updateFolder} from '../public/foundation-models.js';

test('el diagnóstico exige respuestas válidas, orienta a temas y no devuelve una calificación', () => {
  assert.equal(assessDiagnostic({}).complete,false);
  const answers=Object.fromEntries(diagnosticQuestions.map(q=>[q.id,q.correct]));
  assert.deepEqual(assessDiagnostic(answers).review,[]);
  answers.d4=0;
  const result=assessDiagnostic(answers);
  assert.equal(result.complete,true);assert.deepEqual(result.review,['cpu']);
  assert.equal(result.feedback.find(f=>f.id==='d4').correct,false);
  assert.ok(!('score' in result)&&!('grade' in result));
  answers.d4='1';assert.equal(assessDiagnostic(answers).complete,false);
});

test('los ejercicios distinguen capacidad, núcleos, compatibilidad y almacenamiento', () => {
  assert.equal(checkFoundationPractice('cpu',{cores:'4',claim:'no'}).correct,true);
  assert.equal(checkFoundationPractice('cpu',{cores:'8',claim:'no'}).correct,false);
  assert.equal(checkFoundationPractice('ram',{total:'16',compatibility:'no'}).correct,true);
  assert.equal(checkFoundationPractice('ram',{total:'16',compatibility:'yes'}).correct,false);
  assert.equal(checkFoundationPractice('storage',{saved:'storage',technology:'hdd'}).correct,true);
  assert.equal(checkFoundationPractice('storage',{saved:'ram',technology:'hdd'}).correct,false);
});

test('copiar requiere destino y renombrar después no cambia una copia anterior', () => {
  const initial=restoreFoundations().folder;
  assert.equal(updateFolder(initial,'copy').ok,false);
  const created=updateFolder(initial,'create').folder;
  const renamed=updateFolder(created,'rename','Trabajo.docx').folder;
  const copied=updateFolder(renamed,'copy').folder;
  const final=updateFolder(copied,'rename','Revision.docx').folder;
  assert.equal(final.name,'Revision.docx');assert.equal(final.copyName,'Trabajo.docx');
  assert.equal(initial.created,false);
  for(const value of ['','../Trabajo.docx','Trabajo.pdf','Trabajo?.docx']) assert.equal(updateFolder(final,'rename',value).ok,false);
});

test('cada grupo, unidad y estudiante tiene un borrador independiente y recuperable', () => {
  const context={groupId:'g',unitIndex:0,studentId:'s'};
  const key=foundationStorageKey(context);
  assert.notEqual(key,foundationStorageKey({...context,groupId:'otro'}));
  assert.notEqual(key,foundationStorageKey({...context,unitIndex:1}));
  assert.notEqual(key,foundationStorageKey({...context,studentId:'otro'}));
  const state=restoreFoundations();state.glossary[0].definition='Definición propia';state.forum='Mi presentación';
  assert.equal(restoreFoundations(JSON.parse(JSON.stringify(state))).glossary[0].definition,'Definición propia');
  assert.equal(restoreFoundations().glossary[0].definition,'');
});

test('un borrador incompleto o dañado no marca el diagnóstico como realizado ni rompe la unidad', () => {
  const state=restoreFoundations({diagnosticDone:true,diagnostic:{d1:1},visited:['cpu','cpu','inexistente'],glossary:[null],timeline:[null],practice:[],folder:{copied:true}});
  assert.equal(state.diagnosticDone,false);assert.deepEqual(state.visited,['cpu']);
  assert.equal(state.glossary[0].term,'');assert.equal(state.timeline[0].change,'');
  assert.equal(state.folder.copied,false);assert.deepEqual(state.practice,{});
});
