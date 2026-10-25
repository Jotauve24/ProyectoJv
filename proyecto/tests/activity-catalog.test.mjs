import test from 'node:test';
import assert from 'node:assert/strict';
import {activityForUnit, unitsForCourse, isLaboratoryUnit, courseTemplate} from '../public/activity-catalog.js';
import {experienceFor} from '../public/unit-models.js';
import {createMaterial, importMaterial} from '../public/material.js';

test('Taller prepara solo la primera unidad y mantiene seis unidades bloqueadas en cada grupo', () => {
  const course={name:'TALLER DE INFORMATICA (Introducción a la informática)'};
  assert.equal(courseTemplate(course.name).code,'RMES 03-304');
  const a=unitsForCourse(course),b=unitsForCourse(course);
  assert.equal(a.length,6);
  assert.ok(a.every(u=>u.released===false&&u.done===false));
  assert.equal(a[0].activityId,'computer-foundations');
  assert.equal(a[0].assignmentProfile,'taller-u1');
  assert.ok(a.slice(1).every(u=>!u.activityId&&!u.description));
  a[0].released=true;a[0].description='Indicaciones de este grupo';
  assert.equal(b[0].released,false);
  assert.notEqual(a[0].description,b[0].description);
});

test('las referencias explícitas reutilizan una actividad en cualquier materia o posición', () => {
  assert.equal(activityForUnit('Estadística',4,{activityId:'computer-foundations'}).id,'computer-foundations');
  assert.equal(isLaboratoryUnit('Estadística',4,{activityId:'computer-foundations'}),true);
  assert.equal(experienceFor('Registros médicos',0,'Informe clínico','word').id,'word');
  assert.equal(experienceFor('Registros médicos',0,'Informe clínico'),null);
  assert.equal(activityForUnit('Informática',0,{activityId:'reading'}).kind,'reading');
  assert.equal(activityForUnit('Informática',0,{activityId:'inexistente'}),null);
  assert.equal(experienceFor('Informática',3,'Word','reading'),null);
  assert.equal(activityForUnit('Informática empresarial',0,{}).id,'pc-lab');
});

test('compartir referencias respeta el bloqueo y actualizar conserva la matrícula y finalización', () => {
  const db={cycles:[{id:'ciclo',name:'Ciclo'}],courses:[{id:'materia',name:'Taller de Informática'}],groups:[]};
  const group={id:'grupo',name:'Taller',cycle:'ciclo',course:'materia',students:[{id:'privado',name:'Nombre privado'}],units:unitsForCourse(db.courses[0])};
  db.groups.push(group);group.units[0].released=true;group.units[0].done=true;
  group.units[1].activityId='word';group.units[1].assignmentProfile='custom';
  const pack=createMaterial(db,group);
  assert.equal(pack.units[0].activityId,'computer-foundations');
  assert.equal(pack.units[0].assignmentProfile,'taller-u1');
  assert.ok(!('activityId' in pack.units[1]));
  assert.ok(!('assignmentProfile' in pack.units[1]));
  assert.ok(!JSON.stringify(pack).includes('privado'));
  assert.ok(!JSON.stringify(pack).includes('done'));
  const other={cycles:[],courses:[],groups:[]};
  const first=importMaterial(other,pack,'Estudiante',()=> 'alumno');
  first.group.units[0].done=true;
  pack.units[0].activityId='pc-lab';pack.units[0].assignmentProfile='custom';
  const again=importMaterial(other,pack,'Estudiante',()=>{throw Error('No duplicar')});
  assert.equal(again.group.students.length,1);
  assert.equal(again.group.units[0].done,true);
  assert.equal(again.group.units[0].activityId,'pc-lab');
  assert.equal(again.student.id,'alumno');
});

test('un identificador desconocido se rechaza sin importar un campus parcial', () => {
  const course={id:'materia',name:'Taller de Informática'},cycle={id:'ciclo',name:'Ciclo'};
  const group={id:'grupo',name:'Grupo',course:'materia',cycle:'ciclo',units:unitsForCourse(course)};
  const pack=createMaterial({courses:[course],cycles:[cycle]},group);
  for(const changed of [{activityId:'desconocido'},{assignmentProfile:'evaluacion-final'}]){
    const bad=structuredClone(pack);Object.assign(bad.units[5],changed);
    const db={cycles:[],courses:[],groups:[]};
    assert.throws(()=>importMaterial(db,bad,'Estudiante',()=> 'alumno'));
    assert.deepEqual(db,{cycles:[],courses:[],groups:[]});
  }
});
