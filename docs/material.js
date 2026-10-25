import {activityCatalog} from './activity-catalog.js?v=1';
// Formato compatible con los paquetes originales de Aula JT.
const purposes = ['support', 'extra', 'grade'];
const text = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
const identifier = value => {
  const id = text(value, 200);
  if (!id || id.includes(':') || id !== value) throw Error('El archivo contiene un identificador de grupo, materia o ciclo no válido.');
  return id;
};

export function createMaterial(db, group) {
  const course = db.courses.find(c => c.id === group.course);
  const cycle = db.cycles.find(c => c.id === group.cycle);
  return {
    format: 'aula-jt-material', version: 1,
    group: {id: group.id, name: group.name},
    course: {id: course.id, name: course.name},
    cycle: {id: cycle.id, name: cycle.name},
    units: group.units.map(u => ({title: u.title, description: u.released === true ? u.description : '',
      link: u.released === true ? u.link : '', purpose: u.purpose || 'support', released: u.released === true,...(u.released===true&&u.activityId?{activityId:u.activityId}:{}),...(u.released===true&&u.assignmentProfile?{assignmentProfile:u.assignmentProfile}:{})})),
  };
}

export function importMaterial(db, data, studentName, uid) {
  // Validar todo antes de modificar el campus: un archivo inválido no deja datos parciales.
  if (!data || data.format !== 'aula-jt-material' || data.version !== 1 || !Array.isArray(data.units) || data.units.length !== 6)
    throw Error('El archivo no tiene el formato de un material de ProyectoJv.');
  const meta = {};
  for (const type of ['group', 'course', 'cycle']) {
    const id = identifier(data[type]?.id), name = text(data[type]?.name, 200);
    if (!name) throw Error('Faltan los datos del grupo, materia o ciclo.');
    meta[type] = {id, name};
  }
  const name = text(studentName, 100);
  if (!name) throw Error('Escribe tu nombre y apellido.');
  const units = data.units.map((u, i) => {
    if (!u || typeof u !== 'object' || Array.isArray(u) || !text(u.title, 300))
      throw Error(`Revisa el contenido de la unidad ${i + 1}.`);
    if(u.activityId!==undefined&&!activityCatalog.some(a=>a.id===u.activityId))throw Error(`La actividad preparada de la unidad ${i+1} no es válida.`);
    if(u.assignmentProfile!==undefined&&!['taller-u1','custom'].includes(u.assignmentProfile))throw Error(`La guía de trabajo de la unidad ${i+1} no es válida.`);
    const released = u.released === true, link = released ? text(u.link, 2000) : '';
    if (link) {
      let url;
      try { url = new URL(link); } catch { throw Error(`El enlace de la unidad ${i + 1} no es válido.`); }
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password)
        throw Error(`Usa un enlace HTTP o HTTPS sin credenciales en la unidad ${i + 1}.`);
    }
    return {title: text(u.title, 300), description: released ? text(u.description, 6000) : '',
      link, purpose: purposes.includes(u.purpose) ? u.purpose : 'support', released, done: false,...(released&&u.activityId?{activityId:u.activityId}:{}),...(released&&u.assignmentProfile?{assignmentProfile:u.assignmentProfile}:{})};
  });
  let cycle = db.cycles.find(c => c.id === meta.cycle.id);
  if (cycle?.closed) throw Error('Este ciclo está finalizado. Pide a tu docente el material del ciclo vigente.');
  let course = db.courses.find(c => c.id === meta.course.id);
  let group = db.groups.find(g => g.id === meta.group.id);
  if (group && !group.imported && (group.course !== meta.course.id || group.cycle !== meta.cycle.id))
    throw Error('El identificador del archivo coincide con otro grupo de este navegador.');
  if (!cycle) { cycle = {...meta.cycle, closed: false}; db.cycles.push(cycle); }
  if (!course) { course = {...meta.course, units: units.map(u => u.title)}; db.courses.push(course); }
  if (group?.imported) {
    group.name = meta.group.name; group.course = course.id; group.cycle = cycle.id;
    group.units = units.map((u, i) => ({...u, done: group.units[i]?.done === true}));
  }
  if (!group) {
    group = {...meta.group, course: course.id, cycle: cycle.id, students: [], imported: true, units};
    db.groups.push(group);
  }
  let student = group.students.find(s => s.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  if (!student) { student = {id: uid(), name}; group.students.push(student); }
  return {group, student, cycle};
}
