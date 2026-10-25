// Contenido compartido del recorrido. Los ejemplos de salud son ficticios y no usan expedientes reales.
export const foundationTopics=[
 {id:'history',title:'Historia de las computadoras',intro:'La evolución del computador cambia la forma de procesar, conservar y comunicar información.',paragraphs:[
 'Una computadora recibe datos, sigue instrucciones y produce resultados. Los sistemas informáticos combinan equipos, programas, datos, personas y procedimientos. Por eso, una aplicación de registro no resuelve por sí sola un problema: también necesita datos correctos y una forma responsable de trabajar.',
 'La clasificación por generaciones resume cambios tecnológicos. Sus fechas son aproximadas y se superponen; no todos los equipos ni países cambiaron al mismo tiempo. En el recorrido puedes comparar válvulas, transistores, circuitos integrados y microprocesadores, y relacionarlos con usos posteriores de las computadoras.',
 'Al preparar la línea de tiempo, explica qué cambió y para qué sirvió. Una fecha aislada no explica un avance: relaciona tamaño, consumo, confiabilidad o capacidad de procesamiento con una tarea. Separa un hecho histórico comprobado de tu reflexión sobre su impacto.'
 ],example:'En un servicio de salud, pasar de recuentos manuales a registros digitales puede facilitar la búsqueda y el cálculo de estadísticas. La exactitud y la confidencialidad siguen dependiendo de cómo se registran y utilizan los datos.',prompt:'Elige un avance de la línea de tiempo y explica qué tarea académica o profesional facilita.'},
 {id:'hardware',title:'Hardware y software',intro:'Reconoce qué parte del sistema puedes tocar y qué instrucciones hacen que funcione.',paragraphs:[
 'El hardware es la parte física del equipo: procesador, memoria, unidades de almacenamiento, placa madre, teclado y pantalla. Hay componentes internos y dispositivos externos. El software reúne los programas y las instrucciones que utiliza ese hardware.',
 'El software de sistema administra el equipo; un sistema operativo coordina memoria, archivos y dispositivos. El software de aplicación permite realizar tareas como redactar un informe o trabajar con una hoja de cálculo. Un archivo de datos, como un informe guardado, no es por sí mismo una pieza de hardware ni una aplicación.',
 'Los dispositivos de entrada permiten introducir datos, como el teclado o un escáner. Los de salida presentan resultados, como la pantalla o una impresora. Algunos cumplen varias funciones: una pantalla táctil recibe acciones y muestra información. La CPU y la RAM son componentes internos, no periféricos de entrada o salida.',
 'En la PC interactiva puedes observar seis componentes y leer sus funciones. La imagen realista y el modelo geométrico son recursos diferentes. La separación de piezas es una representación educativa; no indica cómo desmontar un equipo real.'
 ],example:'Para redactar un informe: el teclado introduce el texto, una aplicación lo organiza, la CPU ejecuta instrucciones, la RAM mantiene el trabajo activo y el almacenamiento conserva el archivo guardado.',prompt:'Clasifica los elementos del ejemplo y explica cómo trabajan juntos.'},
 {id:'cpu',title:'Procesador',intro:'Interpreta núcleos, hilos, frecuencia y compatibilidad sin confundirlos con almacenamiento.',paragraphs:[
 'La CPU interpreta y ejecuta instrucciones y realiza operaciones. Coordina su trabajo con la memoria y otros componentes. Un núcleo es una unidad de procesamiento; ciertos diseños pueden atender varios hilos de ejecución por núcleo. El número de hilos y el de núcleos no significan lo mismo.',
 'La frecuencia, expresada en GHz, indica ciclos por segundo. La capacidad para resolver una tarea también depende del diseño, la memoria, la refrigeración y el programa utilizado. No es correcto ordenar cualquier procesador por un solo número de GHz.',
 'Existen familias y arquitecturas diferentes, por ejemplo x86-64 y Arm, y diseños orientados a equipos de escritorio, portátiles o servidores. Deben ser compatibles con la placa, el sistema y las aplicaciones. La potencia, el consumo y la posibilidad de ampliación dependen del modelo concreto.',
 'En esta unidad, interpretar una ficha significa explicar cada dato y reconocer lo que no permite concluir. La capacidad de un procesador no se expresa como los GB de un disco. Compara especificaciones y necesidades; evita convertir una marca o una cifra aislada en una garantía de rendimiento.'
 ],example:'Una ficha ilustrativa puede indicar 4 núcleos, 8 hilos y una frecuencia base de 3 GHz. Esos datos describen características distintas; no significan 8 núcleos ni 3 GB de almacenamiento.',prompt:'Explica qué información aporta cada dato y qué comprobarías antes de usarlo en otro equipo.'},
 {id:'ram',title:'Memoria RAM',intro:'Distingue la memoria de trabajo del espacio donde guardas los archivos.',paragraphs:[
 'La RAM mantiene temporalmente datos e instrucciones de las tareas activas. Su contenido es volátil: se pierde al retirar la energía. Guardar un documento requiere escribirlo en un medio de almacenamiento; dejarlo abierto no equivale a guardarlo.',
 'La capacidad suele expresarse en GB. En los ejemplos puedes comparar 8, 16 y 32 GB para comprender cantidades, sin que constituyan requisitos o recomendaciones de compra. La memoria que necesita un trabajo depende del sistema, las aplicaciones y los datos.',
 'DDR4 y DDR5 son generaciones distintas de memoria. También existen formatos de módulo diferentes, como DIMM y SO-DIMM, y equipos con memoria integrada. Generación, formato, capacidad y tasa de transferencia describen aspectos diferentes. La tasa suele indicarse en MT/s; no la confundas con la capacidad en GB.',
 'Una ampliación exige verificar la documentación de la placa y del equipo: generación admitida, ranuras, formato y capacidad máxima. Una memoria no se vuelve compatible por tener más GB. En esta práctica interpretarás una ficha y comprobarás cuánta memoria suman módulos compatibles.'
 ],example:'Dos módulos compatibles de 8 GB suman 16 GB de capacidad. No convierten automáticamente una placa DDR4 en DDR5 ni duplican por sí solos la velocidad de un programa.',prompt:'Calcula la capacidad del ejemplo y distingue capacidad, generación y formato.'},
 {id:'storage',title:'Disco duro y almacenamiento',intro:'Compara HDD y SSD, sus capacidades y la manera de conservar un archivo.',paragraphs:[
 'El disco duro HDD utiliza platos magnéticos y piezas móviles. Una unidad SSD de memoria flash no necesita platos giratorios. Ambos son medios de almacenamiento no volátil: pueden conservar archivos cuando el equipo está apagado. La PC del laboratorio muestra un SSD; por eso aquí también se explica el HDD que pide la guía.',
 'Puedes comparar tecnología, capacidad y conexión. Hay HDD y SSD que utilizan SATA; muchas unidades SSD se comunican por PCIe mediante NVMe. M.2 describe un formato: no significa por sí solo que la unidad sea NVMe. El equipo debe admitir el formato y el protocolo utilizados.',
 'La capacidad suele indicarse en GB o TB y la velocidad de transferencia puede expresarse en MB/s. En la convención decimal de capacidades comerciales, 1 TB equivale a 1000 GB. Algunas herramientas muestran cantidades basadas en unidades binarias, por lo que la cifra puede verse diferente.',
 'Capacidad, rapidez y conservación son preguntas distintas. Un disco con más espacio no reemplaza la RAM. Tener una copia en una carpeta del mismo disco tampoco protege frente a la pérdida de esa unidad. Para información profesional sigue la política institucional de respaldo y acceso.'
 ],example:'Guardar una práctica en Documentos la conserva en una ubicación. Copiarla a otra carpeta del mismo disco crea otra copia local, pero ambas dependen de esa unidad.',prompt:'Selecciona el medio que conserva un archivo al apagar el equipo y justifica la diferencia con la RAM.'},
 {id:'explorer',title:'Explorador de Windows',intro:'Aprende a reconocer una ruta y a organizar archivos antes de entregar un trabajo.',paragraphs:[
 'El Explorador de archivos permite buscar y administrar carpetas y archivos. Puedes abrirlo con Windows + E. El panel de navegación ayuda a elegir una ubicación, la barra de direcciones muestra dónde estás y el área de contenido presenta sus elementos. La apariencia varía entre versiones de Windows.',
 'Una carpeta organiza elementos; un archivo contiene información. La extensión, por ejemplo .docx o .pdf, ayuda a reconocer el formato. Cambiar la extensión no convierte un documento. Usa un nombre descriptivo y comprueba la ubicación, el contenido y el formato antes de entregar.',
 'Crear una carpeta establece un lugar de organización. Cambiar nombre modifica su identificación; copiar conserva el original y genera otra copia; mover cambia la ubicación. Eliminar puede enviar un elemento a la Papelera o tener otro comportamiento según el destino y la configuración: compruébalo antes de hacerlo.',
 'En el ejercicio se utiliza un explorador educativo con archivos ficticios. Crea la carpeta de la unidad, cambia el nombre del ejemplo y cópialo al destino. Después realiza estos pasos en tu equipo con una práctica propia. Ninguna acción del simulador modifica los archivos reales de Windows.'
 ],example:'Ruta de ejemplo: Documentos / Taller de Informática / Unidad I / Borrador_Unidad_I.docx. Cada nivel indica una ubicación dentro del anterior.',prompt:'Crea la carpeta, renombra el archivo y distingue el original de la copia de entrega.'}
];
export const historyMilestones=[
 {id:'valves',period:'Décadas de 1940 y 1950',name:'Primera generación · válvulas',change:'Equipos electrónicos de gran tamaño, con elevado consumo y calor.',impact:'Automatizar cálculos antes realizados a mano.',technology:'Válvulas'},
 {id:'transistors',period:'Décadas de 1950 y 1960',name:'Segunda generación · transistores',change:'Componentes más pequeños y menor consumo que las válvulas.',impact:'Equipos más confiables para tareas científicas y administrativas.',technology:'Transistores'},
 {id:'circuits',period:'Desde la década de 1960',name:'Tercera generación · circuitos integrados',change:'Varios componentes electrónicos se integran en un chip.',impact:'Mayor integración y desarrollo de familias de sistemas.',technology:'Circuitos integrados'},
 {id:'microprocessors',period:'Desde 1971',name:'Cuarta generación · microprocesadores',change:'La función de la CPU se integra en un chip; se extienden las microcomputadoras.',impact:'Facilitar la expansión de computadoras personales.',technology:'Microprocesador'},
 {id:'connected',period:'Etapa contemporánea',name:'Sistemas conectados y procesamiento avanzado',change:'Conectividad, movilidad y nuevas aplicaciones, incluida la inteligencia artificial.',impact:'Acceso y colaboración a distancia, con nuevas responsabilidades sobre los datos.',technology:'Sistemas conectados'}
];
export const diagnosticQuestions=[
 {id:'d1',topic:'hardware',question:'¿Cuál describe un sistema informático?',options:['Solo la computadora física','Equipos, programas, datos, personas y procedimientos','Únicamente la conexión a Internet'],correct:1,explanation:'El sistema incluye recursos técnicos y la forma en que las personas los utilizan.'},
 {id:'d2',topic:'history',question:'¿Qué tecnología identifica a la segunda generación en la clasificación didáctica habitual?',options:['Transistores','Microprocesadores','Pantallas táctiles'],correct:0,explanation:'Los transistores sustituyeron progresivamente a las válvulas en esa clasificación.'},
 {id:'d3',topic:'hardware',question:'¿Cuál es software?',options:['Un teclado','Una aplicación de edición de texto','Un módulo de RAM'],correct:1,explanation:'Una aplicación contiene instrucciones; el teclado y la RAM son partes físicas.'},
 {id:'d4',topic:'cpu',question:'Una CPU de 4 núcleos y 8 hilos, ¿tiene necesariamente 8 núcleos físicos?',options:['Sí','No','Los hilos son espacio de disco'],correct:1,explanation:'Los núcleos y los hilos describen características diferentes.'},
 {id:'d5',topic:'ram',question:'¿Qué ocurre con los datos que solo estaban en RAM al apagar el equipo?',options:['Siempre se guardan en el disco','Se pierden al desaparecer la alimentación','Se convierten en archivos PDF'],correct:1,explanation:'La RAM es volátil. Para conservar el trabajo es necesario guardarlo.'},
 {id:'d6',topic:'storage',question:'¿Qué tienen en común un HDD y un SSD?',options:['Son lo mismo que la RAM','Pueden conservar archivos sin alimentación','Ambos necesitan platos giratorios'],correct:1,explanation:'Ambos almacenan archivos; el mecanismo físico es distinto.'},
 {id:'d7',topic:'explorer',question:'Al copiar un archivo a otra carpeta, ¿qué pasa con el original?',options:['Se elimina siempre','Permanece en su ubicación','Cambia automáticamente de formato'],correct:1,explanation:'Copiar conserva el original. Mover cambia su ubicación.'}
];
export function assessDiagnostic(answers={}){
 const complete=diagnosticQuestions.every(q=>Number.isInteger(answers[q.id])&&answers[q.id]>=0&&answers[q.id]<q.options.length);
 const review=foundationTopics.filter(t=>diagnosticQuestions.some(q=>q.topic===t.id&&answers[q.id]!==q.correct)).map(t=>t.id);
 return {complete,review,feedback:diagnosticQuestions.map(q=>({id:q.id,correct:answers[q.id]===q.correct,explanation:q.explanation}))};
}
export function checkFoundationPractice(topic,answers={}){
 if(topic==='hardware')return {correct:answers.keyboard==='hardware'&&answers.app==='software'&&answers.report==='data',explanation:'El teclado es hardware; la aplicación es software; el informe guardado contiene datos.'};
 if(topic==='cpu')return {correct:answers.cores==='4'&&answers.claim==='no',explanation:'La ficha tiene 4 núcleos y 8 hilos. Su frecuencia aislada no permite comparar cualquier CPU.'};
 if(topic==='ram')return {correct:Number(answers.total)===16&&answers.compatibility==='no',explanation:'8 + 8 = 16 GB. DDR4 y DDR5 requieren plataformas compatibles; tener más capacidad no cambia la generación admitida.'};
 if(topic==='storage')return {correct:answers.saved==='storage'&&answers.technology==='hdd',explanation:'El archivo guardado permanece en el almacenamiento; el HDD utiliza platos magnéticos.'};
 if(topic==='history')return {correct:answers.first==='valves'&&answers.next==='microprocessors',explanation:'Las válvulas preceden al transistor y al circuito integrado; el microprocesador llega después de estos avances.'};
 return {correct:false,explanation:'Revisa las indicaciones del ejercicio.'};
}
export function foundationStorageKey(context){return 'proyectojv-foundations-v1:'+ [context.groupId,context.unitIndex,context.studentId].join(':')}
export function restoreFoundations(value={}){
 const obj=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 const record=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 const diagnostic={...record(obj.diagnostic)};
 const folder=record(obj.folder),essay=record(obj.essay);
 return {
  page:typeof obj.page==='string'?obj.page:'start',
  visited:[...new Set(Array.isArray(obj.visited)?obj.visited.filter(id=>foundationTopics.some(t=>t.id===id)):[])],
  diagnostic,diagnosticDone:obj.diagnosticDone===true&&assessDiagnostic(diagnostic).complete,
  notes:typeof obj.notes==='string'?obj.notes.slice(0,4000):'',practice:structuredClone(record(obj.practice)),
  folder:{created:folder.created===true,name:typeof folder.name==='string'?folder.name.slice(0,80):'Practica.docx',copied:folder.created===true&&folder.copied===true,copyName:typeof folder.copyName==='string'?folder.copyName.slice(0,80):String(folder.name||'Practica.docx').slice(0,80)},
  glossary:Array.isArray(obj.glossary)?obj.glossary.slice(0,30).map(value=>{const r=record(value);return {term:String(r.term||'').slice(0,100),definition:String(r.definition||'').slice(0,700),example:String(r.example||'').slice(0,500)}}):['Informática','Hardware','Software','Sistema informático','Procesador','Memoria RAM','Disco duro HDD','Unidad SSD','Archivo'].map(term=>({term,definition:'',example:''})),
  timeline:Array.isArray(obj.timeline)?obj.timeline.slice(0,8).map(value=>{const r=record(value);return {period:String(r.period||'').slice(0,100),change:String(r.change||'').slice(0,700),impact:String(r.impact||'').slice(0,700)}}):historyMilestones.map(m=>({period:m.period,change:'',impact:''})),
  essay:Object.fromEntries(['idea','argument','example','conclusion','sources'].map(k=>[k,String(essay[k]||'').slice(0,2500)])),
  forum:typeof obj.forum==='string'?obj.forum.slice(0,4000):''
 };
}
export function updateFolder(folder,action,value=''){
 const next={...folder};
 if(action==='create')next.created=true;
 else if(action==='rename'){
  const name=String(value).trim();
  if(!name||name.length>80||/[<>:"/\\|?*\u0000-\u001f]/.test(name)||!name.toLowerCase().endsWith('.docx'))return {ok:false,folder,feedback:'Usa un nombre de archivo válido y conserva la extensión .docx. Cambiar la extensión no convierte el formato.'};
  next.name=name;
 }else if(action==='copy'){
  if(!folder.created)return {ok:false,folder,feedback:'Crea primero la carpeta Unidad I para tener un destino.'};
  next.copied=true;next.copyName=folder.name;
 }else return {ok:false,folder,feedback:'La operación no está disponible.'};
 return {ok:true,folder:next,feedback:action==='copy'?'Copia creada en Unidad I. El original permanece en Documentos.':action==='rename'?'Cambió el nombre del original; las copias previas conservan el suyo.':'Carpeta Unidad I creada dentro de Taller de Informática.'};
}
