# ProyectoJv

Design direction: a navy entrance with large white, blue and violet lettering, based on the user’s supplied visual reference. The learning and instructor screens keep white and aluminum surfaces, blue primary controls and a dark 3D stage. The model, rather than decorative imagery, is the focus of the lab. System type preserves native readability on Apple and other devices. Instructor workflow is cycle > variable number of groups > one subject per group > students > exactly six units.

Design references consulted:
- https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- https://www.apple.com/mac/
- https://brilliant.org/
- https://github.com/mrdoob/three.js

The design skills are used as reference guidance without global installation. The immersive revision used the original UI/UX Pro Max Python search scripts locally with public, generic design queries, and reviewed Anthropic frontend-design. No project data or credentials are sent to those repositories. SVG icons and the computer geometry are authored for this project. The Three.js scene includes a CPU projection fallback for devices without WebGL. It is a stylized teaching model, not a scanned or manufacturer-specific CAD model.

This is a browser-local supplemental learning tool. It does not implement authenticated accounts, central student data, grades or a shared live 3D session. Group materials can be exported without rosters, distributed through an LMS and imported on a student's device. Evidence PDFs report local observed interactions, practice responses, and explicitly self-reported reading and comprehension. They do not certify identity, authorship or official grades. Use classifications are support, extra credit and graded activity; the teacher assesses the resulting evidence in their LMS.

Student walkthrough revision: explicit student/instructor entry, identify group and name before activity, six-unit course screen, unavailable-content states, contextual Explore/Practice/Evidence guidance, explicit next action after the practice result, a simplified identity-locked evidence form, and return-to-course controls. These are local presentation views, not authorization roles. CPU cooling can be hidden to reveal the chip, with a dedicated close-up and a note explaining the educational view.

Latest visual review: the opening image was generated specifically for this Site and optimized as a local WebP. It is illustrative; the actual learning objects remain procedural Three.js geometry. Every component now has a smooth camera focus, the CPU label is projected correctly in the software renderer, fans rotate gently, and the separated pieces reassemble in sequence. Motion follows `prefers-reduced-motion`. Text and touch controls were enlarged after a complete learner walkthrough. Student guidance resumes from browser-local completion and practice records.

Additional primary references: https://threejs.org/docs/pages/AnimationMixer.html, https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html and https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion. Camera and assembly motion use simple frame-time easing; AnimationMixer was researched but is unnecessary for these procedural transforms.

Academic reference: the instructor supplied the Informática Empresarial guide (BAN-03 405, Banca y Finanzas). The demo course now follows its six unit themes. Support summaries and suggested exercises are authored for this app; official dates, grade weights and required LMS submissions are not imported. Existing edited unit content is preserved during the demo migration.

Realistic explorer: the same opening PC is reused as an interactive image with component hotspots. Six separately generated cutouts based on that PC provide individual examination and a separated-pieces view. This photographic visual is not represented as a rotatable CAD model; the procedural Three.js model remains available as a separate mode.

PDF transport: the maintained Vinext version retains POST /api/evidence-pdf with signature, size and origin validation. GitHub Pages builds the PDF in the browser and exposes a visible local download link; both versions keep the printable report. Guided steps and practice decisions now appear alongside the original activities. A generated regression PDF was rendered and reviewed, but final download delivery and the system print dialog remain unconfirmed in browser automation.

Unit release policy: each new or previously unmarked unit is locked until its group instructor explicitly uses Liberar unidad. Release and completion are independent. Instructors can withdraw access; completing one unit does not release another. Student cards and unit entry both check the strict released flag. Local cross-tab storage updates close a withdrawn unit. Material exports omit instructions and resource links for locked units and carry release flags; importing an updated pack refreshes previously imported group units while retaining roster and evidence identities. These controls remain browser-local presentation controls, not authenticated server authorization or cross-device synchronization.


## Revisión inmersiva · 20 de octubre de 2026

Audiencia: estudiantes universitarios y docentes de Informática Empresarial. Se conserva la PC aprobada y la tipografía nativa. La identidad visual se apoya en blanco `#ffffff`, superficie `#f8fafc`, texto `#192a40`, texto secundario `#53677f`, azul de acción `#1666d3` y escenario `#0f233c`. Los acentos por tema distinguen las escenas sin convertir el color en el único indicador de estado.

La escena específica de cada tema ocupa el área principal; la explicación del paso y una práctica breve quedan al lado en escritorio y debajo en teléfono. Las unidades siguen una secuencia real de tres pasos. Las indicaciones completas del docente se despliegan cuando se necesitan. Se eliminó una etiqueta de orientación redundante al revisar las capturas.

| Unidad | Experiencia | Interacción significativa |
| --- | --- | --- |
| 1 | PC realista y modelo 3D existentes | Selección, piezas, acercamiento y cuestionario conservados |
| 2 | Navegador, DNS y servidor | Seguir la solicitud y evaluar fuentes de ejemplo |
| 3 | Documento y participantes | Asignar permisos de lectura y edición según la tarea |
| 4 | Documento e índice | Aplicar estilos y actualizar la tabla de contenido |
| 5 | Tres momentos de una presentación | Comparar composición y elegir un recurso visual pertinente |
| 6 | Presupuesto editable | Recalcular subtotales y total y elegir la fórmula adecuada |

Se consultaron las reglas de movimiento, accesibilidad y rendimiento de UI/UX Pro Max; sus recomendaciones automáticas de tipografía infantil no se ajustaron a este público y se mantuvo la identidad existente. La revisión de frontend-design reforzó escenas ligadas al contenido, texto breve y movimiento como respuesta a una acción. No se añadieron dependencias de animación: SVG, CSS y controles nativos bastan para estas escenas.

Las secuencias se reproducen una vez, se pueden pausar y se detienen al cerrar o abandonar la pestaña. El movimiento reducido permite avanzar manualmente. Se probaron los cinco escenarios a 375 px, una vista horizontal de 812 px y escritorio, además de Tab, Enter, Escape y retorno del foco. Las notas y decisiones se guardan por alumno y unidad; las vistas previas docentes no crean expedientes.


## Marca, acceso y acabado · 20 de octubre de 2026

El usuario aportó una captura de EON Reality como guía de letras, colores y orden. La portada toma su encabezado azul noche, el título grande a la izquierda, los acentos azul y violeta y la secuencia de acciones debajo. La imagen de la PC de ProyectoJv se conserva y ocupa la escena principal. No se utilizan marcas, imágenes, textos ni funciones de terceros de esa captura.

El logo JV es un SVG propio y funciona como enlace de Inicio. El encabezado, la entrada del alumno y las ventanas de actividad y evidencia comparten esa acción. El regreso cambia la vista sin recargar, cierra las ventanas abiertas y limpia el contexto de registro; conserva identidad local, matrículas, datos de la práctica, notas y reflexión guardados. El enlace `./` queda como destino si se abre en otra pestaña.

Las guías se leyeron desde sus repositorios originales, sin instalarlas globalmente:

- [Taste](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md), blob `433d92105c76671250013e0312d82cb413f552bc`: escala tipográfica, composición y crítica visual; se eliminaron números y distintivos decorativos de los accesos.
- [Impeccable](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/SKILL.md), blob `7da92d6e902cd1bf001f05a80f7592b61d6381f4`: refinamiento acotado, contraste, legibilidad y estados. Se consultaron Bolder y Craft floor. El cargador de contexto no está instalado; se utilizó directamente este documento.
- [Emil Kowalski · Design Engineering](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md), blob `62ce902af8dd32c590ea7203e9ab2edb1d6ef81a`: respuesta de pulsación de 140 ms, curva de salida y retirada del movimiento de interacción al usar teclado o movimiento reducido.

La referencia explícita del usuario prevalece sobre recomendaciones genéricas contrarias al violeta, al énfasis de palabras y a conservar la tipografía nativa. La PC se mantiene como imagen central; no se añadieron fotografías de relleno ni nuevas bibliotecas. Las guías se aplicaron como revisión del proyecto existente. No se ejecutaron el sorteo de direcciones ni el inspector automático de Taste: la verificación visual se hizo con el navegador disponible en escritorio, teléfono y tableta. No se atribuye una puntuación automática ni una ejecución completa de esos inspectores.

| Antes | Después | Motivo |
| --- | --- | --- |
| Logo de portada como texto sin destino | Símbolo JV y palabra ProyectoJv con enlace a Inicio | Orientación y regreso desde cualquier vista |
| Título y controles con poco contraste visual | Portada azul noche, título grande y dos acciones principales | Seguir la referencia aprobada y hacer visible la entrada |
| Botones sin un acabado común | Iconos SVG, bordes, pulsación y foco coherentes | Reconocer acciones y respuesta de la interfaz |
| Encabezado docente demasiado ancho en teléfono | Acciones compactas con nombres accesibles | Conservar todos los controles sin desplazamiento horizontal |
| Efectos de entrada repetidos en accesos | Una entrada breve del título y controles inmediatos por teclado | Evitar retrasos al volver al aula |

Los colores principales comprobados incluyen `#0d1629` de fondo, `#f5f6ff` de texto, `#65b8ff` y `#b294ff` de énfasis, `#aa8bff` en la acción de entrada y `#10172a` para su texto. Las parejas planas revisadas superan 4.5:1; el fondo fotográfico se revisó visualmente. El texto de cuerpo en teléfono es de 16 px. Las unidades y sus reglas de liberación mantienen el comportamiento anterior.

## Panel principal y etiquetas de la PC · 20 de octubre de 2026

Se conserva la portada aprobada, la PC y el espacio claro de trabajo. El panel docente reduce la altura de su bloque visual y reutiliza la fotografía del equipo. La búsqueda filtra grupos y materias sin distinguir acentos y anuncia los resultados; cada tarjeta muestra por separado unidades liberadas y finalizadas. Las indicaciones se consultan con un desplegable nativo y los botones de grupo tienen nombres accesibles únicos. El curso del estudiante propone una unidad disponible sin abrir contenido bloqueado y mantiene visibles sus seis unidades.

| Antes | Después | Motivo |
| --- | --- | --- |
| Las etiquetas centradas de la PC heredaban una escala que quitaba su desplazamiento | La pulsación conserva el centrado en foto y modelo 3D | Evitar que el objetivo se mueva y pierda el clic |
| Grupos bajo un bloque visual alto, con cifras poco legibles | Bloque compacto con la PC original, resumen y búsqueda | Encontrar el grupo y reconocer su disponibilidad |
| Seis explicaciones completas abiertas a la vez | Indicaciones desplegables con acciones siempre visibles | Recorrer las unidades con menos desplazamiento |
| Lista de unidades sin una acción inicial destacada | Acceso a una unidad liberada y recorrido de tres pasos | Orientar al estudiante sin cambiar las reglas de acceso |

No fue necesario crear recursos en Blender: se corrigió la interacción del equipo conservado. Los cambios siguen las guías Taste, Impeccable y Emil ya documentadas: jerarquía por tarea, controles reales y movimiento breve que conserva la posición de los objetivos. Las pruebas utilizan identidades sintéticas en la vista de ensayo; no se copian matrículas a la publicación.

## Recorrido de Taller · 25 de octubre de 2026

Se aplica `design-taste-frontend` v2 y su capítulo de pantallas de aplicación a un módulo del aula existente. Se omite el sorteo de una identidad nueva: se conservan la tipografía nativa, la marca, los blancos/aluminio/azul y la PC aprobada. Pregunta del módulo: «¿Qué debo comprender y preparar en esta primera unidad?». La navegación de temas, los ejemplos y la práctica ocupan el foco; los campos del trabajo usan controles nativos y guardado local explícito.

El elemento propio del curso es el mismo equipo explicado desde seis temas, con regreso al recorrido. La animación enseña el paso del dato al archivo; se puede avanzar manualmente, reproducir o pausar y se respeta movimiento reducido. No se aplica un mínimo de animaciones de una portada a esta pantalla de estudio. Las imágenes son la PC y sus recortes existentes; no se incorporaron fotografías de terceros ni recursos nuevos de Blender.

ROUND 1
Seen in one second: El título de la unidad y los temas a la izquierda, con lectura y PC a la derecha.
Idea (one sentence): Relacionar cada concepto con el mismo equipo y con el trabajo que preparará el estudiante.
Live thing: Hitos seleccionables, recorrido del dato al archivo, PC original, comprobaciones y simulador de archivos.
Layout words by section: inicio=lectura/imagen / temas=lectura/ejemplo/práctica / trabajo=formulario / foro=borrador.
Scores: design 7 · usability 7 · creativity 7 · content 8 → overall 7.1 (autocrítica manual).
Caps applied: Se usan las reglas de aplicación; no se aplican mínimos de fotografías o movimiento de una portada. No hay puntuación de inspector automático.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Tableta de 768 px: dos botones «Mi evidencia» compiten encima de la lectura. Se elimina el botón repetido del módulo; se conserva el del encabezado.
2. Tableta de 768 px: la lista lateral resta ancho a los párrafos. Se pliega a un selector nativo hasta 960 px; en escritorio conserva su columna.
3. Primera pantalla de escritorio: la fotografía del equipo no ofrece una acción cercana antes del diagnóstico. Se añade «Explorar la PC de la unidad» junto a la imagen, con regreso al recorrido.

Además se corrigieron los enlaces de ampliación: CPU y almacenamiento abren sus fuentes específicas; historia y Explorador conservan las suyas.

La revisión usa el navegador gestionado y sus capturas, junto a `lint.mjs --app`: 0 FAIL y 0 WARN en los tres archivos de interfaz nuevos. No se ejecuta `inspect.mjs`, que abre un navegador propio ajeno al flujo de vista previa gestionada; no se atribuyen sus mediciones al examen manual. Los límites pendientes de descarga están documentados en la verificación.

ROUND 2
Seen in one second: El nombre de la unidad, el tema activo y el equipo del laboratorio.
Idea (one sentence): Estudiar los seis conceptos y aplicarlos al mismo equipo y al trabajo de la unidad.
Live thing: El acceso directo a la PC y las prácticas contextualizadas permanecen en el recorrido existente.
Layout words by section: inicio=lectura/imagen/acción / temas=lectura/ejemplo/práctica / trabajo=formulario / foro=borrador.
Scores: design 7.5 · usability 8 · creativity 7 · content 8.5 → overall 7.6 (autocrítica manual).
Caps applied: Reglas de pantallas de aplicación; no se afirma ejecución del inspector automático.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Captura del primer acceso público: el desplazamiento heredado puede dejar el diagnóstico delante del título. Se fija la apertura y el cambio de tema al principio del aula, conservando la marca y el retorno.
2. Captura de escritorio: el diagnóstico completo es largo. Se conservan las preguntas claras y el acceso libre a los temas; no se impone contestarlo para abrir contenido.
3. Captura adaptable: la lectura exige desplazamiento en un teléfono. Se conserva cuerpo de 16 px y navegación plegada, en vez de reducir las letras para encajar más texto.

La publicación de la primera revisión pasó las 33 pruebas de GitHub y el despliegue de Pages. Se comprobó en el enlace público la biblioteca, los seis temas y el nuevo acceso a la PC; las capturas finales se revisaron con los ajustes de navegación y con controles nativos visibles.
