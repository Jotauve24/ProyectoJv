const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const experiences = [
  null,
  {id: 'internet', accent: '#1666d3', light: '#edf5ff', tag: 'Internet', label: 'Sigue el viaje de una página',
    intro: 'De una dirección escrita en el navegador a una página que puedes consultar.', time: '4–6 min',
    match: /internet|navegacion/, steps: [
      ['Encuentra la dirección', 'El navegador consulta DNS para conocer la dirección del servidor. El nombre del sitio ayuda a las personas; la dirección IP permite localizarlo.'],
      ['Solicita la información', 'El navegador envía una solicitud HTTPS. El cifrado protege el intercambio, pero no garantiza que lo publicado sea verdadero.'],
      ['Construye la página', 'El servidor responde con recursos. El navegador interpreta su estructura, estilos y scripts; después puedes evaluar la información que ves.']],
    challenge: '¿Qué fuente elegirías para preparar un informe empresarial?',
    defaults: {source: ''}},
  {id: 'cloud', accent: '#087f81', light: '#eaf8f7', tag: 'Colaboración', label: 'Trabaja sobre una misma versión',
    intro: 'Conecta personas, permisos y cambios en un documento compartido.', time: '4–6 min',
    match: /nube|colaborativ/, steps: [
      ['Un archivo compartido', 'Un enlace lleva al mismo documento. Evita enviar una copia nueva cada vez que alguien hace una corrección.'],
      ['El permiso necesario', 'Un lector consulta. Un editor modifica. Asigna acceso de acuerdo con la tarea y revisa con quién compartes el archivo.'],
      ['Cambios e historial', 'Las herramientas colaborativas pueden sincronizar cambios y conservar versiones. Revisa el historial antes de recuperar una versión anterior.']],
    challenge: 'Ana revisa el informe; Luis debe corregirlo. Asigna el permiso necesario a cada uno.',
    defaults: {ana: 'editor', luis: 'viewer'}},
  {id: 'word', accent: '#1859bb', light: '#edf3ff', tag: 'Documentos', label: 'Dale estructura a tus ideas',
    intro: 'Transforma un texto suelto en un documento que se puede recorrer.', time: '4–6 min',
    match: /word|document/, steps: [
      ['Una estructura clara', 'Ordena el documento en secciones y subsecciones antes de ajustar el aspecto de cada párrafo.'],
      ['Estilos que organizan', 'Título 1 identifica secciones principales y Título 2 las subsecciones. Poner texto en negrita no equivale a aplicar un estilo de título.'],
      ['Un índice actualizado', 'La tabla de contenido utiliza los títulos con estilo. Actualízala después de cambiar títulos, secciones o páginas.']],
    challenge: 'Prepara un documento con secciones reconocibles y una tabla de contenido que las refleje.',
    defaults: {styles: false, contents: false}},
  {id: 'slides', accent: '#ab4429', light: '#fff1eb', tag: 'Presentaciones', label: 'Construye una historia visual',
    intro: 'Una idea por diapositiva. Un recurso visual que ayude a explicarla.', time: '4–6 min',
    match: /powerpoint|presentacion/, steps: [
      ['Abre con una pregunta', 'Define qué necesita comprender tu audiencia. La primera diapositiva presenta el problema y el propósito.'],
      ['Muestra una evidencia', 'Selecciona datos y una representación que ayude a compararlos. Evita llenar la diapositiva con todos los párrafos del informe.'],
      ['Cierra con una decisión', 'Conecta la evidencia con una conclusión. Ensaya la explicación y comprueba que el texto se lea desde lejos.']],
    challenge: 'Necesitas comparar gastos de tres áreas. Elige una composición y un apoyo visual adecuados.',
    defaults: {layout: 'crowded', visual: 'decoration'}},
  {id: 'sheets', accent: '#157344', light: '#eaf7ef', tag: 'Hojas de cálculo', label: 'Observa cómo cambian los números',
    intro: 'Edita un dato y sigue el efecto de las fórmulas hasta el total.', time: '5–7 min',
    match: /excel|calculo/, steps: [
      ['Datos en su lugar', 'Cada fila representa un producto. Cantidad y precio son datos de entrada; el total de cada fila es un resultado.'],
      ['Una fórmula por fila', 'En D2, =B2*C2 multiplica cantidad por precio. Las siguientes filas usan sus propias referencias.'],
      ['Un total que responde', '=SUMA(D2:D4) reúne los subtotales. Si cambias una cantidad o un precio, los resultados se recalculan.']],
    challenge: 'Modifica una cantidad o un precio y selecciona la fórmula que suma los subtotales.',
    defaults: {rows: [{name: 'Teclados', quantity: '4', price: '25'}, {name: 'Monitores', quantity: '2', price: '160'}, {name: 'Discos SSD', quantity: '3', price: '58'}], formula: ''}},
];
export function experienceFor(courseName, unitIndex, title) {
  const item = experiences[unitIndex];
  return normalize(courseName).includes('informatica') && item?.match.test(normalize(title)) ? item : null;
}
export function calculateBudget(rows) {
  if (!Array.isArray(rows) || rows.length !== 3) return {valid: false, error: 'Completa las tres filas del ejemplo.'};
  const totals = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i], quantity = Number(row.quantity), price = Number(row.price);
    if (String(row.quantity).trim() === '' || String(row.price).trim() === '' || !Number.isFinite(quantity) || !Number.isInteger(quantity) || quantity < 0 || quantity > 1000 || !Number.isFinite(price) || price < 0 || price > 100000)
      return {valid: false, error: `Revisa la fila ${i + 2}: cantidad entera entre 0 y 1000 y precio entre 0 y 100000.`};
    const cents = Math.round(price * 100);
    totals.push(quantity * cents);
  }
  return {valid: true, totals: totals.map(cents => cents / 100), total: totals.reduce((sum, cents) => sum + cents, 0) / 100};
}
export function assessPractice(id, state) {
  if (id === 'internet') return {correct: state.source === 'library', answer: {library: 'Biblioteca universitaria con autor, fecha y referencias', ad: 'Anuncio sin autor', chain: 'Mensaje reenviado sin fuentes'}[state.source] || 'Sin selección', feedback: state.source === 'library' ? 'Elegiste una fuente con datos verificables. Contrasta sus afirmaciones con otras fuentes y revisa su propósito.' : 'Busca autoría, fecha y referencias. La apariencia de una página o el uso de HTTPS no bastan para verificar sus afirmaciones.'};
  if (id === 'cloud') return {correct: state.ana === 'viewer' && state.luis === 'editor', answer: `Ana: ${state.ana === 'viewer' ? 'lectora' : 'editora'}. Luis: ${state.luis === 'editor' ? 'editor' : 'lector'}.`, feedback: state.ana === 'viewer' && state.luis === 'editor' ? 'Ana puede revisar y Luis puede corregir. Cada persona tiene el permiso que requiere su tarea.' : 'Ana solo necesita lectura. Luis necesita edición para realizar las correcciones.'};
  if (id === 'word') return {correct: state.styles === true && state.contents === true, answer: `Estilos: ${state.styles ? 'aplicados' : 'sin aplicar'}. Tabla de contenido: ${state.contents ? 'actualizada' : 'sin actualizar'}.`, feedback: state.styles && state.contents ? 'Las secciones tienen estilos y aparecen en la tabla de contenido. Al cambiar el documento, recuerda actualizarla otra vez.' : 'Primero aplica estilos a las secciones. Después actualiza la tabla de contenido para que use esa estructura.'};
  if (id === 'slides') return {correct: state.layout === 'focused' && state.visual === 'bars', answer: `${state.layout === 'focused' ? 'Una idea por diapositiva' : 'Todo en una diapositiva'}; ${state.visual === 'bars' ? 'gráfico de barras' : 'imagen decorativa'}.`, feedback: state.layout === 'focused' && state.visual === 'bars' ? 'La composición concentra el mensaje y las barras permiten comparar las tres áreas. Ensaya cómo explicarás la diferencia.' : 'Reduce cada diapositiva a una idea y utiliza barras para comparar categorías. Una imagen decorativa no explica las diferencias entre gastos.'};
  if (id === 'sheets') {
    const budget = calculateBudget(state.rows);
    return {correct: budget.valid && state.formula === 'sum', answer: budget.valid ? `Fórmula: ${state.formula === 'sum' ? '=SUMA(D2:D4)' : state.formula === 'inputs' ? '=SUMA(B2:C4)' : 'sin seleccionar'}. Total del ejemplo: ${budget.total.toFixed(2)}.` : 'Datos por revisar', feedback: !budget.valid ? budget.error : state.formula === 'sum' ? 'Sumaste los subtotales de D2 a D4. Compara el total con tus datos y comprueba una fila multiplicando cantidad por precio.' : 'Suma D2:D4. El rango B2:C4 contiene cantidades y precios; sumarlos entre sí no produce el gasto total.'};
  }
  throw Error('Actividad no disponible.');
}
export function restoreStudioState(experience, saved) {
  const base = structuredClone(experience.defaults);
  if (!saved || typeof saved !== 'object') return {step: 0, controls: base};
  const controls = saved.controls || {};
  for (const key of Object.keys(base)) {
    if (key === 'rows') {
      if (Array.isArray(controls.rows) && controls.rows.length === 3) base.rows = base.rows.map((row, i) => ({...row, quantity: String(controls.rows[i]?.quantity ?? row.quantity).slice(0, 12), price: String(controls.rows[i]?.price ?? row.price).slice(0, 12)}));
    } else if (typeof base[key] === 'boolean') base[key] = controls[key] === true;
    else if (typeof controls[key] === 'string') base[key] = controls[key].slice(0, 40);
  }
  return {step: Number.isInteger(saved.step) ? Math.max(0, Math.min(2, saved.step)) : 0, controls: base};
}
