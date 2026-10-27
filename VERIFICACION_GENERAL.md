# Verificación general de ProyectoJv

Fecha: 20 de octubre de 2026. Revisión con datos sintéticos, conservando el diseño y las claves de almacenamiento existentes. Destino de publicación: GitHub Pages.

## Correcciones

- El botón de importar material desde la entrada del estudiante abría repetidamente su propio controlador. Ahora abre el formulario de importación y, al terminar, entra al grupo identificado.
- Salir del curso o cambiar de vista limpia el contexto de evidencia y la libreta activa. Las acciones posteriores del docente ya no se atribuyen al estudiante anterior. Salir también retira el nombre de la sesión; los trabajos guardados se conservan.
- La reflexión se guarda al escribir y se recupera al volver a abrir el formulario. Guardar actividad conserva otros expedientes y las reflexiones que se hayan actualizado desde otra pestaña.
- El docente puede seleccionar evidencias de ciclos archivados. Se consultan y generan informes sin modificar esos registros. Crear grupos en un ciclo finalizado queda deshabilitado con una explicación.
- La importación valida las seis unidades y sus enlaces antes de modificar el campus. Actualizar un material importado conserva estudiantes, identificadores y finalización; aplica las nuevas liberaciones y retiradas.
- Los enlaces de material aceptan HTTP/HTTPS sin credenciales. Una lectura confirmada no se registra repetidamente pulsando el mismo botón.
- Los informes PDF y el material JSON ofrecen un enlace visible para repetir la descarga. El PDF utiliza la identidad y unidad capturadas al generar el informe.
- Retirar acceso cierra tanto el laboratorio como las ventanas de lectura y evidencia que estén abiertas en otra pestaña del mismo navegador.
- La entrada del alumno lee el campus más reciente antes de registrarlo, para conservar los cambios docentes realizados mientras el formulario estaba abierto.

## Recorridos comprobados

| Vista | Comprobación | Resultado |
| --- | --- | --- |
| Docente | Crear ciclo y grupo, seleccionar ciclo, abrir grupo y volver | Correcto |
| Docente | Agregar alumnos, omitir nombres repetidos y consultar matrícula | Correcto |
| Docente | Editar título, indicaciones, propósito y enlace; rechazar enlace ejecutable | Correcto |
| Docente | Liberar y retirar unidades; impedir liberar contenido vacío | Correcto |
| Docente | Finalizar unidad sin liberar la siguiente | Correcto |
| Docente | Finalizar ciclo y consultar estudiantes y evidencias del historial | Correcto |
| Material | Abrir exportación con enlace JSON; exclusión de alumnos y contenido bloqueado | Enlace visible y estructura verificada; descarga final no confirmada |
| Estudiante | Entrada, elección de grupo, cambio de nombre, salida y reingreso | Correcto |
| Estudiante | Archivo inválido, importación válida y actualización de material | Correcto; conserva la reflexión anterior |
| Estudiante | Unidades bloqueadas, escenas y prácticas de las unidades 2 a 6 y formulario de evidencia con la identidad correspondiente | Correcto |
| Estudiante | Retirada desde otra pestaña mientras está abierto el laboratorio o una unidad de lectura | Vuelve al curso y queda bloqueada |
| Laboratorio | PC completa, piezas separadas, anterior/siguiente, seis componentes y marcas de comprensión | Correcto |
| Laboratorio | Alternar fotografía/modelo, vistas, zoom, CPU, refrigeración, separación y reinicio | Correcto en el modo compatible disponible en el navegador de prueba |
| Aprendizaje | Ocho lecciones y sus accesos; cinco preguntas con respuesta incorrecta y correctas | Correcto; resultado de prueba 4/5 y explicación por pregunta |
| Libreta | Guardar notas, recuperarlas y separarlas de la exploración docente | Correcto |
| Evidencia | Cerrar y recuperar reflexión; generación de bytes PDF, identidad, paginación y lectura visual de dos páginas | Correcto |
| Clase | Guardar título/enlace de reunión, rechazar dominio no admitido y mostrar enlace externo | Correcto; no se inició una reunión real |

## Pruebas automáticas

Desde `proyecto/`:

```sh
node --test tests/*.test.mjs
```

23 pruebas aprobadas. Cubren cierre del contexto, retirada de acceso y archivo del ciclo, conservación de registros entre pestañas, prohibición de registro en unidades bloqueadas, bytes e identidad del PDF, validación atómica de paquetes, enlaces, compatibilidad y privacidad de la exportación. Además se comprobó la sintaxis de los módulos modificados y la resolución de los recursos de la salida estática.

## Límites de esta verificación

- El navegador automatizado no confirmó la entrega de los archivos descargados ni mostró el diálogo del sistema para imprimir. El PDF se genera y se pudo renderizar desde sus bytes en una prueba independiente. La descarga final y la impresión deben comprobarse en el dispositivo de uso; no se consideran resueltas solo por mostrar un mensaje.
- El botón de voz se ejercitó, pero no se verificó auditivamente la salida. Pantalla completa mostró el aviso de compatibilidad del navegador de prueba.
- Se probaron marcos de 375 × 812 y 812 × 375, las cinco escenas, sus controles, teclado y retorno del foco. No hubo desbordamiento horizontal en los cuadros ni en sus escenas. Esto no equivale a probar todos los teléfonos, sistemas operativos o tarjetas gráficas.
- Los datos siguen siendo locales y las vistas no tienen autenticación. No hay sincronización central de estudiantes ni de unidades entre dispositivos; es necesario compartir e importar material actualizado.

Los archivos y nombres sintéticos usados en el navegador de prueba no se incorporan a la publicación.


## Segunda pasada: inmersión y recorrido completo

Se añadieron cinco escenas de apoyo: viaje de una página, permisos de colaboración, documento con estilos e índice, composición de presentaciones y presupuesto editable. Las cinco prácticas se ejercitaron con decisiones correctas y por repasar desde la vista docente. Como alumno se completaron las seis unidades: el cuestionario original alcanzó 5/5 y se comprobó su reinicio; las unidades nuevas guardaron prácticas y notas con la identidad correspondiente.

Se comprobó que cambiar la cantidad de teclados de 4 a 5 cambia el total de B/. 594.00 a B/. 619.00, y que los cambios posteriores se recuperan al reabrir la unidad. La vista de impresión incluyó el total del intento y las notas guardadas. Se renderizó el PDF de regresión con la nueva sección de prácticas, sin texto cortado.

El movimiento reducido se conserva al pasar de una unidad a otra; hay controles para avanzar sin animación. Se probaron reproducción, pausa, reinicio, pasos manuales, despliegue de indicaciones, confirmación de lectura y Escape. El cierre por teclado devuelve el foco al botón de la unidad. El modelo 3D original se volvió a recorrer después de ajustar su bucle para detenerse cuando no se muestra.

La prueba entre dos ventanas encontró una matrícula docente desactualizada. Se añadió actualización local y combinación de cambios independientes: guardar indicaciones con un editor abierto conservó al alumno inscrito desde la otra ventana. El historial conservó los tres alumnos de la materia de prueba y excluyó el ciclo finalizado de la entrada del estudiante. Una materia distinta conservó su lectura y evidencia sin recibir una escena de informática.

Las pruebas automáticas nuevas cubren selección curricular, recálculo en céntimos, validación de datos, retroalimentación, reanudación y combinación de cambios concurrentes. El total actual es de 23 pruebas, sin dependencias adicionales. Los límites de descarga, impresión, autenticación y sincronización entre dispositivos indicados arriba se mantienen.


## Revisión de logo y controles

Se verificó el regreso a Inicio mediante el logo y el enlace de Inicio desde el acceso del estudiante, el panel docente, un formulario de grupo, la PC, la actividad de Excel y el formulario de evidencia. El regreso cierra las ventanas y devuelve el foco a la marca sin borrar datos guardados. Al volver al curso de prueba se recuperaron la libreta de la PC, seis teclados con total de B/. 644.00 en Excel, la nota propia de esa unidad y la reflexión escrita en evidencia.

Se revisaron la portada a 375 px, el panel docente a 375 y 768 px y las ventanas docentes y de actividad en teléfono. Se corrigió un desbordamiento del encabezado; después de la corrección el ancho de desplazamiento coincidió con el ancho del documento en los tamaños comprobados. Los botones compactos mantienen nombres accesibles. Enter sobre el logo funciona; los estados de foco son visibles y el movimiento de controles se retira con teclado o preferencia reducida. Se comprobaron los pares de color principales, incluidas las cinco acciones de práctica, con contraste de al menos 4.5:1 en superficies planas.

La misma batería de 23 pruebas pasó después de los cambios. Se comprobó la sintaxis de los cuatro módulos modificados y la generación de Pages. No se ejecutó el inspector automático de Taste ni el cargador de contexto de Impeccable; se revisaron sus guías originales y el resultado renderizado con las herramientas disponibles. Esta revisión no cambia el pendiente de descarga e impresión final del PDF ni implementa sincronización entre dispositivos.

## Revisión del panel principal · 20 de octubre de 2026

- Se reprodujo un clic perdido en las etiquetas de la PC: `button:active` sustituía la transformación que centra el objetivo. Se conserva ahora `translate(-50%,-50%)` durante la escala en foto y modelo. Ratón sobre RAM abre la vista individual y actualiza ambas explicaciones; siguiente pieza abre SSD. La selección de piezas expone su estado pulsado.
- Búsqueda docente comprobada con «INFORMATICA», sin acento, resultado vacío y «Limpiar búsqueda». El filtro conserva el foco y no modifica grupos ni unidades.
- Las seis indicaciones comienzan contraídas y se expanden individualmente. Se liberaron U1 y U2 de un grupo sintético de ensayo; el total docente cambió a 2/6. El estudiante conserva cuatro unidades deshabilitadas y solo propone contenido liberado.
- Recorrido de alumno con nombre sintético, acceso principal a U1, selección de RAM, regreso con el logo y apertura del panel docente. En un marco de 375 px, el curso midió 360/360 px (ancho/desplazamiento) y el panel docente y su grupo 304/304 px; sin desbordamiento horizontal.
- Se repitieron las 23 pruebas Node de material, campus, evidencias y experiencias: 23 aprobadas. Los cuatro módulos modificados pasan comprobación sintáctica. La salida de Pages se genera desde el código conservado e incluye `dashboard.css`; no contiene la página de ensayo adaptable.
- Continúa pendiente verificar la entrega final del PDF y la impresión del sistema en el dispositivo del usuario. Esta revisión no cambia el almacenamiento local ni añade autenticación o sincronización entre dispositivos.

## Taller de Informática y actividades reutilizables · 25 de octubre de 2026

Se desarrolló la Unidad I de la nueva guía RMES 03-304 en el aula existente: seis temas, diagnóstico formativo sin calificación, PC conservada, ejercicios de apoyo, simulador del Explorador, trabajo grupal integrado de glosario/línea de tiempo/ensayo y foro independiente. Las otras cinco unidades tienen solo sus títulos y quedan pendientes. [TALLER_INFORMATICA_UNIDAD_I.md](TALLER_INFORMATICA_UNIDAD_I.md) detalla la correspondencia, las pruebas y los límites.

Las actividades se pueden asignar por identificador a otra materia o posición. El editor permite traer un recurso y sus indicaciones sin copiar alumnos, liberación, finalización ni evidencias. Se comprobó en navegador el traslado a U3 de otra materia, la recuperación de borradores de alumno después de recargar y el cierre del recorrido al retirar acceso en otra pestaña. Las 33 pruebas automáticas pasan y Pages se genera correctamente. El PDF incluye el diagnóstico como formativo y conserva separadas las entregas de trabajo y foro.

Los datos siguen en el navegador. La automatización no confirmó la recepción del borrador Markdown descargado; la recepción final del PDF y la impresión del sistema mantienen el pendiente anterior. No se publican los datos sintéticos ni la guía nueva como archivo.

## Accesos de estudiante y docente · 26 de octubre de 2026

Se reprodujo el acceso público de alumno con una sola opción de demostración. La plantilla de Taller estaba en la biblioteca docente y no en el catálogo del alumno. El registro inicial ahora incorpora su materia y el grupo 3538884, conservando las seis unidades bloqueadas y sin reemplazar grupos, matrículas o liberaciones existentes. La migración se realiza una sola vez.

El acceso estudiantil usa `?vista=estudiante` y el docente `?vista=docente`. Inicio, logo, cierre de ventanas, salida y recarga conservan el portal seleccionado. La entrada del alumno, sus unidades y su evidencia no presentan controles de configuración, edición, matrícula, liberación ni consulta de otros estudiantes. La evidencia estudiantil solo crea opciones de su identidad y su unidad. Los controles docentes se comprueban también en sus manejadores. La pantalla inicial mantiene ocultos el campus y el laboratorio durante la carga para evitar una aparición previa del panel docente.

La entrada del estudiante tiene selectores separados de Materia y Grupo. La materia filtra sus grupos activos; los cambios entre pestañas actualizan las opciones sin borrar el nombre escrito. El selector docente de materias sustituye el campo con sugerencias por una lista real y una opción explícita para crear otra materia. Las materias equivalentes se agrupan conservando los grupos de sus identificadores.

La importación distingue los recorridos: el docente importa unidades sin añadir una matrícula con su nombre; el alumno incluye su nombre y entra a su curso. El acceso a estudiantes desde el encabezado docente abre otra pestaña y conserva el panel original.

Pruebas realizadas con datos sintéticos: entrada a Taller, unidad bloqueada, liberación de solo U1, apertura del recorrido como alumno, evidencia personal con otro alumno en el grupo, regreso con Inicio desde evidencia, salida y recarga, creación de una materia en otra pestaña sin perder el texto de entrada, laboratorio anterior y selección de RAM, actividad de Internet, importación docente sin matrícula e importación estudiantil con entrada al curso. Se conservaron seis unidades y la independencia entre liberación y finalización.

Las 41 pruebas Node pasan. Se comprobaron sintaxis, compilación de Pages y recursos estáticos. Los anchos/desplazamientos de la entrada fueron 375/375 px en un marco de 390 px y 753/753 px en uno de 768 px; el formulario docente móvil midió 337/337 px. Se inspeccionaron las capturas de los dos roles en escritorio, teléfono y tableta. El lint de los dos recursos nuevos de acceso dio 0 FAIL y 0 WARN; no se ejecutó el inspector automático de Taste.

La separación es de interfaz y recorrido, sin autenticación de roles en servidor. Los grupos personalizados y su estado siguen guardados en el navegador: en otro dispositivo se debe cargar el material compartido. Esta corrección no añade sincronización central ni cambia el pendiente de entrega final del PDF y de la impresión del sistema. Los archivos de ensayo, sus alumnos y las páginas de prueba adaptable se excluyen de la publicación.
