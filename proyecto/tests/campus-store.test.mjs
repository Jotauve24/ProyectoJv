import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeCampus} from '../public/campus-store.js';

const initial = () => ({cycles: [{id: 'ciclo', name: 'Ciclo', closed: false}], courses: [{id: 'curso', name: 'Informática'}],
  groups: [{id: 'grupo', cycle: 'ciclo', course: 'curso', students: [], units: Array.from({length: 6}, (_, i) => ({title: `Unidad ${i + 1}`, description: '', released: false, done: false}))}]});

test('retirar acceso conserva alumnos matriculados desde otra pestaña, incluso con un editor abierto', () => {
  const base = initial(); base.groups[0].units[0].released = true;
  const local = structuredClone(base), remote = structuredClone(base);
  local.groups[0].units[0].released = false; remote.groups[0].students.push({id: 'alumno', name: 'Estudiante de prueba'});
  const merged = mergeCampus(base, local, remote);
  assert.equal(merged.groups[0].students[0].id, 'alumno'); assert.equal(merged.groups[0].units[0].released, false);
  assert.equal(remote.groups[0].units[0].released, true); assert.equal(local.groups[0].students.length, 0);
});

test('conserva cambios independientes de unidades, grupos nuevos e historial del ciclo', () => {
  const base = initial(), local = structuredClone(base), remote = structuredClone(base);
  local.groups[0].units[1].description = 'Nueva indicación'; remote.groups[0].units[1].released = true;
  remote.cycles[0].closed = true; remote.groups.push({...structuredClone(remote.groups[0]), id: 'otro-grupo'});
  const merged = mergeCampus(base, local, remote);
  assert.equal(merged.groups.length, 2); assert.equal(merged.cycles[0].closed, true);
  assert.equal(merged.groups[0].units[1].released, true); assert.equal(merged.groups[0].units[1].description, 'Nueva indicación');
});

test('el campo editado explícitamente prevalece y los demás campos conservan la actualización remota', () => {
  const base = initial(), local = structuredClone(base), remote = structuredClone(base);
  local.groups[0].units[0].title = 'Edición actual'; remote.groups[0].units[0].title = 'Edición anterior'; remote.groups[0].units[2].done = true;
  const merged = mergeCampus(base, local, remote);
  assert.equal(merged.groups[0].units[0].title, 'Edición actual'); assert.equal(merged.groups[0].units[2].done, true);
});
