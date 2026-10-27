import test from 'node:test';
import assert from 'node:assert/strict';
import {createMaterial, importMaterial} from '../public/material.js';

const campus = () => ({cycles: [], courses: [], groups: []});
const packet = () => ({format: 'aula-jt-material', version: 1,
  group: {id: 'grupo-1', name: 'Grupo de prueba'}, course: {id: 'materia-1', name: 'Informática'},
  cycle: {id: 'ciclo-1', name: 'Ciclo de prueba'},
  units: Array.from({length: 6}, (_, i) => ({title: `Unidad ${i + 1}`, description: 'Indicaciones',
    link: '', purpose: 'support', released: i === 0}))});

test('un archivo incompleto se rechaza sin dejar grupos, materias ni ciclos parciales', () => {
  for (const invalid of [null, {}, {...packet(), units: [null]}, {...packet(), units: [...packet().units.slice(0, 5), null]}]) {
    const db = campus(), before = structuredClone(db);
    assert.throws(() => importMaterial(db, invalid, 'Estudiante', () => 'alumno-1'));
    assert.deepEqual(db, before);
  }
});

test('los enlaces ejecutables o con credenciales se rechazan antes de modificar el campus', () => {
  for (const link of ['javascript:alert(1)', 'data:text/html,prueba', 'https://usuario:clave@example.com/']) {
    const data = packet(), db = campus(); data.units[0].link = link;
    assert.throws(() => importMaterial(db, data, 'Estudiante', () => 'alumno-1'));
    assert.deepEqual(db, campus());
  }
});

test('actualizar material conserva la identidad, la matrícula y la finalización; solo libera unidades explícitas', () => {
  const db = campus(), data = packet();
  const first = importMaterial(db, data, 'Estudiante', () => 'alumno-1');
  first.group.units[0].done = true;
  data.group.name = 'Grupo actualizado'; data.units[0].released = false; data.units[1].released = true;
  const again = importMaterial(db, data, 'ESTUDIANTE', () => { throw Error('No debe duplicar al estudiante'); });
  assert.equal(again.student.id, 'alumno-1'); assert.equal(again.group.students.length, 1);
  assert.equal(again.group.id, first.group.id); assert.equal(again.group.name, 'Grupo actualizado');
  assert.equal(again.group.units[0].done, true); assert.equal(again.group.units[0].released, false);
  assert.equal(again.group.units[0].description, ''); assert.equal(again.group.units[1].released, true);
  assert.equal(db.groups.length, 1); assert.equal(db.cycles.length, 1); assert.equal(db.courses.length, 1);
});

test('compartir material excluye alumnos, progreso y contenidos bloqueados', () => {
  const db = campus(), {group} = importMaterial(db, packet(), 'Nombre privado de prueba', () => 'alumno-1');
  group.units[1].description = 'Contenido reservado'; group.units[1].link = 'https://example.com/reservado';
  group.units[0].done = true;
  const pack = createMaterial(db, group), json = JSON.stringify(pack);
  assert.equal(pack.units.length, 6); assert.equal(pack.units[0].description, 'Indicaciones');
  assert.equal(pack.units[1].description, ''); assert.equal(pack.units[1].link, '');
  assert.ok(!json.includes('Nombre privado')); assert.ok(!json.includes('alumno-1')); assert.ok(!json.includes('done'));
});

test('importar material propio conserva las indicaciones docentes que todavía no están liberadas', () => {
  const db = campus(), {group} = importMaterial(db, packet(), 'Estudiante', () => 'alumno-1');
  group.imported = false; group.units[1].description = 'Borrador del docente';
  importMaterial(db, createMaterial(db, group), 'Estudiante', () => 'otro');
  assert.equal(group.units[1].description, 'Borrador del docente');
});

test('un paquete antiguo sin released permanece bloqueado y un ciclo archivado no se reabre', () => {
  const data = packet(), db = campus(); delete data.units[0].released;
  const {group, cycle} = importMaterial(db, data, 'Estudiante', () => 'alumno-1');
  assert.equal(group.units[0].released, false); cycle.closed = true;
  const before = structuredClone(db);
  assert.throws(() => importMaterial(db, data, 'Otro estudiante', () => 'alumno-2'));
  assert.deepEqual(db, before);
});

test('el docente importa material sin matricularse y conserva la matrícula al actualizarlo', () => {
  const db=campus(),data=packet();
  const first=importMaterial(db,data,'',()=>{throw Error('No debe crear un alumno docente');},{enroll:false});
  assert.equal(first.student,null);assert.equal(first.group.students.length,0);
  importMaterial(db,data,'Estudiante',()=> 'alumno-1');
  data.units[0].description='Material actualizado';
  const again=importMaterial(db,data,'',()=>{throw Error('No debe crear otro alumno');},{enroll:false});
  assert.equal(again.group.students.length,1);assert.equal(again.group.students[0].id,'alumno-1');
  assert.equal(again.group.units[0].description,'Material actualizado');
});
