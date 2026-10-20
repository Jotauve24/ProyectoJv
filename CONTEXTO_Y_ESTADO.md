# Contexto y estado de ProyectoJv

Fecha del traspaso: 20 de octubre de 2026, zona America/Panama.

Nombre vigente indicado por el usuario: **ProyectoJv** (anteriormente Aula JT). Esta edición actualiza la marca de la interfaz, los informes PDF, la vista de impresión y las descargas de material. Conserva los identificadores internos `aula-jt-*`, los eventos `aula-*` y el formato `aula-jt-material` para mantener la compatibilidad con el progreso y los paquetes anteriores. El enlace de la web de origen es histórico; esta edición del paquete no modifica esa publicación.
Código de origen: commit f8a06358f468e02605cf546e4477c8fb572a1174. Ese commit se publicó correctamente en la web original.

## Objetivo y usuario

El docente es Jair Valdés. Desea un material de apoyo educativo sencillo e inmersivo. A veces una práctica puede pedirse para nota o puntos extras; la evaluación oficial y la entrega final se hacen en su plataforma educativa institucional. ProyectoJv no debe presentarse como sustituto de esa plataforma ni como certificador de identidad o dominio.

Cada ciclo puede tener seis grupos, menos o más. Cada grupo tiene una materia y sus propios estudiantes. Cada curso tiene exactamente seis unidades. Al terminar el ciclo, conservar el historial y permitir crear otros grupos y materias. No fijar un límite de seis grupos.

Regla más reciente y prioritaria: las unidades permanecen bloqueadas hasta que el docente pulsa «Liberar unidad» en su grupo. «Finalizar unidad» es independiente: no debe liberar la unidad siguiente. El docente puede usar «Retirar acceso». No desbloquear por completar un cuestionario, por el número de unidad ni por contener material.

## Diseño aprobado

Interfaz clara, moderna, con blancos, aluminio, azules y tipografía nativa; inspiración en la sobriedad visual de Apple. El estudiante debe entender desde el inicio qué hacer y dónde pulsar. Hay vistas «Soy estudiante» y «Soy docente», pero aún NO son roles autenticados con contraseña.

Al usuario le encanta la PC del panel principal. Conservar esa imagen y el mismo acabado visual dentro del aula del estudiante. La vista «PC realista» reutiliza la imagen del equipo y tiene etiquetas, seis recortes individuales, una vista de piezas separadas y explicaciones sincronizadas. Son imágenes de apoyo, no un modelo CAD rotatorio. «Modelo 3D» conserva una escena Three.js diferente, geométrica y giratoria. No llamar 3D real a la fotografía ni prometer que se generó una malla a partir de ella.

La CPU debe verse. El modelo 3D puede ocultar la refrigeración para revelar el procesador y explica que es una vista educativa. Hay acercamiento suave de piezas, separación y reensamblaje, ventiladores y respeto de movimiento reducido. El modo compatible sin WebGL es una proyección por software de la misma geometría, con limitaciones visuales.

## Recorrido del estudiante

Entrada → elegir grupo y escribir nombre → seis unidades → abrir solo una unidad liberada → explorar y leer → práctica → reflexión → evidencia PDF → subir el archivo a la plataforma del docente. El nombre se identifica localmente sin autenticación. Mantener controles docentes separados visualmente. El progreso se organiza por grupo, unidad y estudiante. El regreso a una unidad retoma la fase correspondiente a los registros locales.

## Materia de ejemplo y guía

La referencia adjunta es la guía de Informática Empresarial, código BAN-03 405, para Licenciatura en Banca y Finanzas. Sus seis temas se reflejan en el curso de demostración:

1. Conceptos básicos de informática.
2. Introducción a Internet.
3. Herramientas colaborativas en la nube.
4. Documentos con Microsoft Word.
5. Presentaciones con Microsoft PowerPoint.
6. Hojas de cálculo con Microsoft Excel.

El laboratorio visual y el cuestionario de cinco preguntas pertenecen a la unidad 1. Las unidades 2 a 6 contienen objetivos, resúmenes, ejercicios sugeridos y pautas de reflexión; todavía no tienen simuladores propios de Word, Excel o PowerPoint. La unidad 1 también dispone de lecciones sobre periféricos, evolución, finanzas y vocabulario en inglés. No trasladar automáticamente fechas ni porcentajes de evaluación de la guía a la web. Preservar las indicaciones oficiales del docente en la plataforma.

## Liberación implementada

- Cada nueva unidad lleva released:false. Un campo ausente también significa bloqueada.
- El panel docente permite liberar y retirar acceso por grupo y unidad.
- El estudiante ve «Bloqueada» y no ve las indicaciones mientras no se libera.
- La entrada de unidad y el inicio de registros comprueban released === true.
- Un cambio de almacenamiento en otra pestaña del mismo navegador actualiza el listado o cierra la unidad retirada.
- No se puede liberar una unidad vacía sin indicaciones o enlace, salvo el laboratorio incorporado de informática.
- Compartir material incluye el estado released y omite indicaciones/enlaces de unidades bloqueadas.
- Volver a importar material de un grupo previamente importado actualiza sus unidades sin sustituir los identificadores de estudiantes ni sus evidencias.

Son controles de presentación con datos locales. No constituyen autorización segura en servidor. La sincronización automática docente-alumno entre dispositivos y las cuentas reales siguen pendientes. No afirmar que ya existe publicación central de unidades para todos los alumnos.

## Informe PDF y limitación conocida

El usuario informó repetidamente que no podía descargar el informe. No basta con comprobar que se generó una URL o un mensaje de éxito.

El PDF se construye en public/evidence.js con jsPDF. Resume estudiante, grupo, materia, ciclo, unidad, propósito, actividades, respuestas, resultados, notas y reflexión. Explicita que las marcas de lectura/comprensión son autodeclaradas y que no es una calificación ni un certificado oficial.

El proyecto se migró de estático a Vinext para implementar POST /api/evidence-pdf. El cliente envía los bytes del PDF por formulario a la misma web. El servidor valida origen, tamaño y firma PDF y responde con Content-Disposition: attachment y Cache-Control: no-store. No guarda los PDFs ni crea un expediente central. Los botones de descarga ya no enlazan a blob:. También existe una vista de impresión con «Imprimir / Guardar como PDF».

Validado: generación de un informe real, bytes y nombre de archivo de la respuesta HTTP, casos de origen no permitido, firma inválida y exceso de tamaño. Se renderizó e inspeccionó el PDF de prueba. NO quedó confirmada la descarga final en el dispositivo del usuario: la automatización de navegador tuvo limitaciones de protocolo/descarga. Mantener esta verificación como pendiente y no prometer que el problema está definitivamente resuelto sin una prueba real del botón en la publicación.

## Otras funciones y límites

El enlace de clase en vivo abre Meet, Zoom o Teams. No hay aula 3D multiusuario sincronizada, grabación interna ni videollamada propia. El Site original es privado, accesible por la cuenta propietaria. Publicarlo en otra cuenta no migra automáticamente alumnos, permisos ni la URL original.

## Mapa del código

- app/aula.html: documento principal de la aplicación.
- app/route.ts: respuesta HTML de la ruta raíz.
- app/api/evidence-pdf/route.ts: entrega HTTP del PDF.
- public/student.js: entrada, listado de unidades, guía y controles de estudiante.
- public/campus.js: ciclos, grupos, materias, estudiantes, unidades, liberación e importación/exportación.
- public/course-guide.js: contenido de apoyo basado en la guía académica.
- public/photolab.js: fotografía interactiva y piezas individuales.
- public/app.js: Three.js, contenidos, cuestionario, notas y clase en vivo.
- public/evidence.js: registros locales, PDF y vista de impresión.
- public/style.css: estilos y diseño adaptable.
- public/parts/: seis recortes realistas.
- public/aula-pc-hero.webp: PC aprobada del panel principal.
- public/three.module.js y THREE-LICENSE.txt: dependencia local Three.js.
- public/jspdf.umd.min.js: jsPDF local con aviso de licencia.
- DESIGN.md: decisiones y referencias.
- vite.config.ts, build/, scripts/: integración Vinext/Sites mantenida.

Claves de almacenamiento local: aula-jt-campus-v1, aula-jt-evidence-v1, aula-jt-learning-<grupo>:<unidad>:<estudiante>, aula-jt-meeting. La identidad de la vista estudiante utiliza sessionStorage aula-jt-student. No modificar esos espacios de nombres sin una migración que conserve los datos existentes.

## Verificación ya realizada

Compilación Vinext exitosa; comprobación sintáctica de los módulos; recorrido estudiante hasta informe; selección de componentes y alternancia de vistas; seis unidades bloqueadas al inicio; liberación de una sola unidad; retirada de acceso; independencia entre finalización y liberación; exportación sin contenido reservado ni listas de alumnos. Los datos usados fueron sintéticos y no forman parte de este paquete.

## Prioridades al retomar

1. Leer el código y conservar el diseño y los flujos aprobados.
2. Comprobar la descarga real del PDF, incluido el comportamiento de la web privada, sus formularios y la vista integrada.
3. Para uso real con estudiantes de distintos dispositivos, diseñar cuentas, roles y almacenamiento compartido antes de afirmar que las liberaciones son globales.
4. Mantener la herramienta como apoyo a la plataforma institucional.

## Repositorio actual

Por indicación del usuario, la continuidad de ProyectoJv se conserva por ahora en el repositorio privado https://github.com/Jotauve24/ProyectoJv, rama `main`. Esta decisión no publica la aplicación ni modifica la web de origen. La carpeta local indicada por el usuario es `C:\Users\samte\Documents\IA\ProyectoJv_Proyecto_Completo_2026-10-20\ProyectoJv`; esa ruta está en su equipo y no es accesible directamente desde el entorno de trabajo del asistente.

## Publicación actual de ProyectoJv

Publicada el 20 de octubre de 2026 en https://proyectojv.ambersun65.chatgpt.site, con acceso privado del propietario. El identificador de Sites es `appgprj_6ad7a3f37e1481919f0a262a0d4f0828` y se conserva en `proyecto/.openai/hosting.json`; reutilizarlo para actualizar esta misma web. El repositorio de GitHub permanece privado.

Se compiló correctamente el proyecto Vinext conservado. La revisión en navegador confirmó la entrada del estudiante, las cinco unidades bloqueadas después de liberar solo la primera y la visualización de la PC. Se corrigieron los permisos de ejecución de los cuatro scripts de shell de instalación y compilación; su contenido permanece igual. La descarga final del PDF todavía debe comprobarse en el dispositivo del usuario: el navegador de revisión no confirmó el evento de descarga.

## Publicación desde otra cuenta

El proyecto original pertenece a la cuenta de origen. Esta copia no lleva credenciales, historial Git ni su project_id de despliegue. No reutilizar ni inventar identificadores Sites. Si no hay acceso autorizado al original, registrar un proyecto nuevo en la cuenta nueva y guardar allí su ID. No hacer pública la copia por defecto. Seguir la habilidad Sites disponible en el nuevo entorno; las rutas internas de herramientas de esta sesión no son portables.
