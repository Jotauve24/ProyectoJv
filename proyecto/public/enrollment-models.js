import {courseTemplates,courseTemplate,unitsForCourse} from './activity-catalog.js?v=1';

export const subjectKey=value=>String(value||'').trim().replace(/\s+/g,' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
const subjectIdentity=name=>courseTemplate(name)?.id||subjectKey(name);

// El catálogo también debe existir para el alumno, sin pasar por la biblioteca docente.
// Las unidades nuevas conservan su bloqueo inicial y los grupos existentes no se sustituyen.
export function ensurePreparedCatalog(db){
 if(db.preparedCatalogVersion>=1)return false;
 const cycle=db.cycles.find(c=>c.closed!==true);
 for(const template of courseTemplates){
  let course=db.courses.find(c=>subjectIdentity(c.name)===template.id);
  if(!course){course={id:'catalog-'+template.id,name:template.name,units:template.units.map(u=>u.title)};db.courses.push(course)}
  if(cycle&&!db.groups.some(g=>g.course===course.id)){
   db.groups.push({id:'catalog-group-'+template.id,name:template.id==='taller-informatica'?'Grupo 3538884':template.name,course:course.id,cycle:cycle.id,students:[],units:unitsForCourse(course),catalog:true});
  }
 }
 db.preparedCatalogVersion=1;return true;
}

export function activeStudentGroups(db){
 if(!db)return [];
 return (db.groups||[]).filter(g=>db.courses?.some(c=>c.id===g.course)&&db.cycles?.some(c=>c.id===g.cycle&&c.closed!==true));
}

export function subjectChoices(db,{student=false}={}){
 const groups=activeStudentGroups(db),choices=new Map();
 const courses=student?(db?.courses||[]).filter(c=>groups.some(g=>g.course===c.id)):[...(db?.courses||[]),...courseTemplates];
 for(const course of courses){
  const key=subjectIdentity(course.name),existing=choices.get(key);
  if(existing){if(!existing.courseIds.includes(course.id))existing.courseIds.push(course.id)}
  else choices.set(key,{id:key,name:course.name,courseIds:[course.id]});
 }
 return [...choices.values()].sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'}));
}

export function groupsForSubject(db,key){
 const choice=subjectChoices(db,{student:true}).find(c=>c.id===key);
 return choice?activeStudentGroups(db).filter(g=>choice.courseIds.includes(g.course)):[];
}

export function enrollStudent(db,groupId,subject,name,uid){
 const typed=String(name||'').trim().replace(/\s+/g,' ');
 if(!typed||typed.length>100)throw Error('Escribe tu nombre y apellido.');
 const group=groupsForSubject(db,subject).find(g=>g.id===groupId);
 if(!group)throw Error('Este grupo ya no está disponible en la materia seleccionada. Revisa la lista.');
 let student=group.students.find(s=>s.name.trim().replace(/\s+/g,' ').toLocaleLowerCase()===typed.toLocaleLowerCase());
 if(!student){student={id:uid(),name:typed};group.students.push(student)}
 return {groupId:group.id,studentId:student.id,name:student.name};
}

export function requestedAudience(url,remembered){
 const value=new URL(url,'https://proyectojv.invalid').searchParams.get('vista');
 if(value==='estudiante')return 'student';
 if(value==='docente')return 'teacher';
 return ['student','teacher'].includes(remembered)?remembered:'welcome';
}

export function portalTarget(path,audience){
 return path+({student:'?vista=estudiante',teacher:'?vista=docente'}[audience]||'');
}
