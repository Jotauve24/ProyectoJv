// Las unidades comparten recursos por identificador; las matrículas y evidencias siguen en su grupo.
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const activityCatalog=Object.freeze([
 {id:'computer-foundations',title:'Conceptos generales de computadores',kind:'foundations',summary:'Historia, hardware y software, CPU, RAM, almacenamiento y Explorador. Incluye diagnóstico formativo y preparación del trabajo grupal.'},
 {id:'pc-lab',title:'Exploración de la PC',kind:'pc',summary:'La PC realista, el modelo 3D y la práctica de componentes ya existentes.'},
 {id:'internet',title:'Introducción a Internet',kind:'studio',summary:'El viaje de una página y la comprobación de fuentes.'},
 {id:'cloud',title:'Colaboración en la nube',kind:'studio',summary:'Permisos de lectura y edición en un documento compartido.'},
 {id:'word',title:'Estructura de un documento',kind:'studio',summary:'Estilos y tabla de contenido en documentos.'},
 {id:'slides',title:'Presentaciones comprensibles',kind:'studio',summary:'Composición, secuencia y recursos visuales.'},
 {id:'sheets',title:'Presupuesto con fórmulas',kind:'studio',summary:'Datos, subtotales y suma de resultados.'},
 {id:'reading',title:'Material escrito o enlace propio',kind:'reading',summary:'Utiliza las indicaciones y el enlace de esta unidad.'}
]);
export const tallerUnitDescription='Objetivo: reconocer la evolución de las computadoras, diferenciar hardware y software e interpretar las características básicas del procesador, la RAM y el almacenamiento. Organizar archivos mediante el Explorador de Windows.\n\nRecorrido: diagnóstico formativo sin calificación; seis temas con explicaciones, ejemplos y ejercicios; exploración de la PC existente; preparación del trabajo grupal y del foro.\n\nTrabajo grupal integrado: glosario de términos informáticos, línea de tiempo sobre las generaciones y avances de las computadoras, y ensayo reflexivo sobre su importancia en la sociedad, la educación, el trabajo y el ámbito profesional. Los tres componentes pertenecen al mismo trabajo.\n\nForo independiente: «Presentación y la importancia de conocer los componentes del computador». Sigue las indicaciones y criterios de tu docente en la plataforma institucional. El diagnóstico no añade una evaluación sumativa ni una ponderación propia.\n\nLos borradores y la evidencia de ProyectoJv sirven de apoyo. La colaboración, la entrega y la evaluación oficial se realizan en la plataforma indicada por tu docente. El desarrollo de segundo idioma tiene su actividad independiente.';
export const courseTemplates=Object.freeze([{id:'taller-informatica',name:'Taller de Informática (Introducción a la informática)',code:'RMES 03-304',units:[
 {title:'Conceptos generales de computadores',activityId:'computer-foundations',assignmentProfile:'taller-u1',description:tallerUnitDescription},
 {title:'Plataformas educativas vinculadas a la universidad'},
 {title:'Dispositivos internos y externos y configuración esencial'},
 {title:'Ofimática'},
 {title:'Aplicaciones y documentos en línea'},
 {title:'Aplicaciones de UMECIT'}
]}]);
export function courseTemplate(name){return normalize(name).includes('taller de informatica')?courseTemplates[0]:null}
export function activityForUnit(courseName,index,unit){
 if(unit?.activityId!==undefined)return activityCatalog.find(a=>a.id===unit.activityId)||null;
 if(index===0&&normalize(courseName).includes('informatica'))return activityCatalog.find(a=>a.id==='pc-lab');
 const ids=[null,'internet','cloud','word','slides','sheets'],patterns=[null,/internet/,/colabora|nube|workspace/,/word|documento/,/powerpoint|presentacion/,/excel|calculo/];
 return normalize(courseName).includes('informatica')&&patterns[index]?.test(normalize(unit?.title))?activityCatalog.find(a=>a.id===ids[index]):null;
}
export function unitsForCourse(course){
 const template=courseTemplate(course.name);
 return Array.from({length:6},(_,i)=>{const prepared=template?.units[i];return {title:prepared?.title||course.units?.[i]||`Unidad ${i+1}`,description:prepared?.description||'',link:'',purpose:'support',released:false,done:false,...(prepared?.activityId?{activityId:prepared.activityId,...(prepared.assignmentProfile?{assignmentProfile:prepared.assignmentProfile}:{})}:{})}});
}
export function isLaboratoryUnit(courseName,index,unit){return ['pc','foundations'].includes(activityForUnit(courseName,index,unit)?.kind)}
