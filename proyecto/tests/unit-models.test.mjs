import test from 'node:test';
import assert from 'node:assert/strict';
import {guideUnits} from '../public/course-guide.js';
import {experienceFor, calculateBudget, assessPractice, restoreStudioState} from '../public/unit-models.js';

test('las unidades 2 a 6 de la guía abren su actividad correcta, sin aplicarla a otras materias', () => {
  const ids = ['internet', 'cloud', 'word', 'slides', 'sheets'];
  ids.forEach((id, n) => {
    assert.equal(experienceFor('Informática empresarial', n + 1, guideUnits[n + 1].title)?.id, id);
    assert.equal(experienceFor('Contabilidad', n + 1, guideUnits[n + 1].title), null);
  });
  assert.equal(experienceFor('Informática empresarial', 2, 'Derecho mercantil'), null);
  assert.equal(experienceFor('Informática empresarial', 0, guideUnits[0].title), null);
  assert.equal(experienceFor('Informática empresarial', 8, ''), null);
});

test('los subtotales se recalculan con céntimos, conservan ceros y reflejan los cambios de datos', () => {
  const rows = [{quantity: '4', price: '25'}, {quantity: '2', price: '160'}, {quantity: '3', price: '58'}];
  assert.deepEqual(calculateBudget(rows), {valid: true, totals: [100, 320, 174], total: 594});
  rows[0] = {quantity: '3', price: '0.10'}; rows[1] = {quantity: '0', price: '160'};
  assert.deepEqual(calculateBudget(rows), {valid: true, totals: [0.3, 0, 174], total: 174.3});
});

test('la hoja rechaza vacíos, negativos, cantidades fraccionarias y datos fuera de rango', () => {
  for (const bad of [{quantity: '', price: '2'}, {quantity: '-1', price: '2'}, {quantity: '2.5', price: '2'}, {quantity: '1001', price: '2'}, {quantity: '2', price: 'Infinity'}, {quantity: '2', price: '-1'}]) {
    assert.equal(calculateBudget([bad, {quantity: 0, price: 0}, {quantity: 0, price: 0}]).valid, false);
  }
  assert.equal(calculateBudget([]).valid, false);
});

test('la retroalimentación distingue una fuente verificable de la apariencia o la publicidad', () => {
  assert.equal(assessPractice('internet', {source: 'library'}).correct, true);
  for (const source of ['ad', 'chain', '']) assert.equal(assessPractice('internet', {source}).correct, false);
});

test('la práctica de permisos comprueba cada tarea y no premia dar edición a todos', () => {
  assert.equal(assessPractice('cloud', {ana: 'viewer', luis: 'editor'}).correct, true);
  assert.equal(assessPractice('cloud', {ana: 'editor', luis: 'editor'}).correct, false);
  assert.equal(assessPractice('cloud', {ana: 'viewer', luis: 'viewer'}).correct, false);
});

test('el índice necesita estilos y actualización; las diapositivas necesitan foco y una comparación pertinente', () => {
  assert.equal(assessPractice('word', {styles: false, contents: true}).correct, false);
  assert.equal(assessPractice('word', {styles: true, contents: false}).correct, false);
  assert.equal(assessPractice('word', {styles: true, contents: true}).correct, true);
  assert.equal(assessPractice('slides', {layout: 'focused', visual: 'decoration'}).correct, false);
  assert.equal(assessPractice('slides', {layout: 'crowded', visual: 'bars'}).correct, false);
  assert.equal(assessPractice('slides', {layout: 'focused', visual: 'bars'}).correct, true);
});

test('la fórmula del presupuesto suma subtotales y rechaza mezclar precios con cantidades', () => {
  const item = experienceFor('Informática', 5, 'Microsoft Excel'), state = structuredClone(item.defaults);
  state.formula = 'inputs'; assert.equal(assessPractice('sheets', state).correct, false);
  state.formula = 'sum'; assert.equal(assessPractice('sheets', state).correct, true);
  state.rows[0].quantity = ''; assert.equal(assessPractice('sheets', state).correct, false);
});

test('reanudar una unidad conserva sus datos sin compartir objetos ni aceptar pasos fuera del recorrido', () => {
  const item = experienceFor('Informática', 5, 'Microsoft Excel');
  const saved = {step: 99, controls: {...structuredClone(item.defaults), rows: [{quantity: '6', price: '2'}, {quantity: '0', price: '0'}, {quantity: '1', price: '3'}]}};
  const resumed = restoreStudioState(item, saved); assert.equal(resumed.step, 2); assert.equal(resumed.controls.rows[0].quantity, '6');
  resumed.controls.rows[0].quantity = '8'; assert.equal(saved.controls.rows[0].quantity, '6');
  assert.equal(item.defaults.rows[0].quantity, '4'); assert.equal(restoreStudioState(item, {step: -8}).step, 0);
});
