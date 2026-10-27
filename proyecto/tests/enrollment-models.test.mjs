import test from 'node:test';
import assert from 'node:assert/strict';
import {ensurePreparedCatalog,subjectChoices,groupsForSubject,enrollStudent,requestedAudience,portalTarget} from '../public/enrollment-models.js';

const campus=()=>({cycles:[{id:'actual',name:'Actual',closed:false},{id:'anterior',name:'Anterior',closed:true}],courses:[{id:'a',name:'Informática empresarial'},{id:'b',name:'Contabilidad'}],groups:[
 {id:'ga',name:'Informática',course:'a',cycle:'actual',students:[],units:[{released:true,done:true}]},
 {id:'gb',name:'Contabilidad',course:'b',cycle:'actual',students:[],units:[{released:false,done:false}]}
]});

test('el catálogo de Taller aparece también para el alumno, sin liberar unidades ni duplicar datos',()=>{
 const db=campus(),before=structuredClone(db.groups);
 assert.equal(ensurePreparedCatalog(db),true);
 const taller=db.groups.find(g=>g.catalog);
 assert.equal(taller.name,'Grupo 3538884');assert.equal(taller.units.length,6);
 assert.ok(taller.units.every(u=>u.released===false&&u.done===false));
 assert.equal(taller.units[0].activityId,'computer-foundations');
 assert.deepEqual(db.groups.slice(0,2),before);
 assert.ok(subjectChoices(db,{student:true}).some(c=>c.id==='taller-informatica'));
 const saved=structuredClone(db);assert.equal(ensurePreparedCatalog(db),false);assert.deepEqual(db,saved);
});

test('la migración conserva el grupo de Taller ya creado con sus liberaciones y matrículas',()=>{
 const db=campus();db.courses.push({id:'t',name:'TALLER DE INFORMATICA'});
 db.groups.push({id:'gt',name:'Grupo propio',course:'t',cycle:'actual',students:[{id:'est',name:'Nombre existente'}],units:[{released:true,done:true,description:'Indicaciones propias'}]});
 const before=structuredClone(db.groups);ensurePreparedCatalog(db);
 assert.deepEqual(db.groups,before);assert.equal(db.courses.length,3);
});

test('el estudiante solo recibe grupos de su materia y de ciclos activos con referencias válidas',()=>{
 const db=campus();db.groups.push({id:'viejo',course:'a',cycle:'anterior'},{id:'huerfano',course:'a',cycle:'ausente'},{id:'sin-materia',course:'ausente',cycle:'actual'});
 assert.deepEqual(groupsForSubject(db,'informatica empresarial').map(g=>g.id),['ga']);
 assert.deepEqual(groupsForSubject(db,'contabilidad').map(g=>g.id),['gb']);
 db.cycles[0].closed=true;assert.deepEqual(subjectChoices(db,{student:true}),[]);
 assert.deepEqual(groupsForSubject(null,'contabilidad'),[]);
});

test('los nombres equivalentes se agrupan sin perder los grupos de ninguno de los identificadores',()=>{
 const db=campus();db.courses.push({id:'a2',name:'INFORMATICA   EMPRESARIAL'});
 db.groups.push({id:'ga2',name:'Otro grupo',course:'a2',cycle:'actual',students:[]});
 const choice=subjectChoices(db,{student:true}).find(c=>c.id==='informatica empresarial');
 assert.deepEqual(choice.courseIds,['a','a2']);assert.equal(subjectChoices(db,{student:true}).length,2);
 assert.deepEqual(groupsForSubject(db,choice.id).map(g=>g.id),['ga','ga2']);
 assert.ok(subjectChoices(db).some(c=>c.id==='taller-informatica'));
});

test('una matrícula desactualizada, de otra materia o sin nombre se rechaza antes de modificar datos',()=>{
 for(const [group,subject,name] of [['gb','informatica empresarial','Estudiante'],['ausente','contabilidad','Estudiante'],['ga','informatica empresarial','  ']]){
  const db=campus(),before=structuredClone(db);
  assert.throws(()=>enrollStudent(db,group,subject,name,()=>{throw Error('No crear identidad')}));assert.deepEqual(db,before);
 }
 const db=campus();db.cycles[0].closed=true;const before=structuredClone(db);
 assert.throws(()=>enrollStudent(db,'ga','informatica empresarial','Estudiante',()=> 'nuevo'));assert.deepEqual(db,before);
});

test('volver al mismo grupo conserva identidad; cambiar de grupo mantiene matrícula y avance separados',()=>{
 const db=campus();const first=enrollStudent(db,'ga','informatica empresarial','Ana Prueba',()=> 'ana-a');
 const same=enrollStudent(db,'ga','informatica empresarial',' ANA   PRUEBA ',()=>{throw Error('No duplicar')});
 const other=enrollStudent(db,'gb','contabilidad','Ana Prueba',()=> 'ana-b');
 assert.deepEqual(first,same);assert.notEqual(first.studentId,other.studentId);
 assert.equal(db.groups[0].students.length,1);assert.equal(db.groups[1].students.length,1);
 assert.equal(db.groups[0].units[0].released,true);assert.equal(db.groups[1].units[0].released,false);
});

test('la dirección explícita conserva el portal elegido al recargar y al pulsar Inicio',()=>{
 assert.equal(requestedAudience('https://example.com/ProyectoJv/?vista=estudiante','teacher'),'student');
 assert.equal(requestedAudience('https://example.com/ProyectoJv/?vista=docente','student'),'teacher');
 assert.equal(requestedAudience('https://example.com/ProyectoJv/','student'),'student');
 assert.equal(requestedAudience('https://example.com/ProyectoJv/',null),'welcome');
 assert.equal(portalTarget('/ProyectoJv/','student'),'/ProyectoJv/?vista=estudiante');
 assert.equal(portalTarget('/ProyectoJv/','teacher'),'/ProyectoJv/?vista=docente');
});
