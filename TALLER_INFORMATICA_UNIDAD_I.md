# Taller de Informática · Unidad I

Implementación del 25 de octubre de 2026 sobre ProyectoJv existente. Materia: Taller de Informática (Introducción a la informática), RMES 03-304. Referencia: guía FO-DOC-05 aportada por el docente, páginas 2–4 y 16. El documento fuente no se incorpora a la publicación.

## Acceso docente

Desde «Abrir espacio docente» → «Actividades preparadas» se puede abrir la vista previa o crear un grupo de Taller. La plantilla conserva exactamente seis unidades: solo la primera tiene contenido desarrollado y todas nacen bloqueadas. Para un grupo existente: «Editar» → «Actividad preparada» → «Conceptos generales de computadores», y «Usar indicaciones de Taller I» si corresponde a esta guía.

Para reutilizar actividades entre materias, abrir «Editar» en la unidad de destino y elegir «Traer actividad de otra unidad», o seleccionar directamente un recurso de la biblioteca. Guardar conserva la matrícula, la finalización y la liberación del grupo de destino. Las actividades se resuelven por un identificador compartido y pueden usarse en cualquier posición; las indicaciones docentes se conservan por unidad. Una actualización del recurso compartido beneficia a las unidades que lo referencian.

## Correspondencia con la guía

| Punto de la Unidad I | Desarrollo y actividad | Reutilización |
| --- | --- | --- |
| Historia de las computadoras | Lectura, cinco hitos seleccionables, generaciones, avances e impacto; comprobación y reflexión | Amplía el material de evolución ya existente |
| Hardware y software | Sistemas informáticos, clasificación, periféricos; recorrido animado del dato al archivo | Abre la PC realista y el modelo geométrico originales |
| Procesador: tipos, clases y capacidades | Núcleos, hilos, GHz, arquitecturas, compatibilidad y comparación ilustrativa | Explicación y recorte del procesador conservados |
| RAM: tipos, clases y capacidades | Volatilidad, GB, DDR4/DDR5, DIMM/SO-DIMM, MT/s y cálculo de capacidad | Pieza RAM y laboratorio originales |
| Disco duro: tipos, clases y capacidades | HDD frente a SSD, SATA/NVMe/M.2, GB/TB y conservación del archivo | SSD de la PC, con explicación adicional del HDD solicitado |
| Explorador de Windows | Rutas, carpetas, archivos, extensiones, copiar/mover; ejercicio de crear, renombrar y copiar | Simulador educativo nuevo, sin acceso a archivos reales |
| Diagnóstico inicial | Siete preguntas, retroalimentación y temas sugeridos | Formativo; sin nota, ponderación ni examen sumativo final |
| Trabajo grupal | Un borrador integrado con glosario, línea de tiempo y ensayo reflexivo | Un solo trabajo; campos editables y exportación Markdown |
| Foro | Una participación de presentación y reflexión sobre los componentes | Independiente del trabajo grupal |

El glosario y el foro en inglés pertenecen al desarrollo de segundo idioma. No se añadieron como tareas extra de la Unidad I. No se trasladan fechas ni porcentajes a ProyectoJv; las instrucciones y la evaluación oficiales corresponden a la plataforma institucional.

Para próximas unidades, Word puede reutilizarse en Ofimática; Internet, colaboración y presentaciones aportan recursos para Aplicaciones y documentos en línea. Es una correspondencia de recursos disponibles, no un desarrollo ni una liberación de esas unidades.

## Datos y compatibilidad

- `activity-catalog.js` relaciona materias y recursos mediante `activityId`; `assignmentProfile` mantiene las indicaciones propias de Taller separadas de otras materias.
- `foundation-models.js` concentra contenido y comprobaciones; `foundations.js` monta el recorrido en el aula existente y `foundations.css` limita sus estilos a esa actividad.
- Los borradores nuevos se guardan en `proyectojv-foundations-v1:<grupo>:<unidad>:<estudiante>`. Las claves antiguas y los registros de las otras unidades se conservan.
- La vista previa docente no guarda borradores de alumno. Consultar un tema no acredita dominio ni dispara calificaciones.
- La exportación de material conserva referencias solo de unidades explícitamente liberadas. Omite alumnos, resultados y contenido/referencias de las bloqueadas; la importación valida antes de modificar datos y conserva matrículas y finalización existentes.
- No hay edición grupal en tiempo real ni sincronización automática entre dispositivos. Los borradores sirven para organizar aportes; el trabajo y el foro se entregan en la plataforma institucional.

## Verificación

33 pruebas Node aprobadas: regresiones anteriores y casos nuevos de reutilización por materia/posición, plantillas aisladas, referencias bloqueadas, importación atómica, diagnóstico sin calificación, capacidades, compatibilidad de RAM, copia frente a cambio de nombre, separación y restauración de borradores y PDF de Taller sin exigencia de examen final.

Recorrido en navegador con datos sintéticos: creación de Taller, seis unidades inicialmente bloqueadas, liberación solo de U1, acceso del alumno, diagnóstico incompleto/completo, sugerencia de repaso de CPU, consulta de temas, práctica correcta de RAM, carpeta y copia, borradores de trabajo y foro, salida/recarga/reanudación. La actividad se trasladó a U3 de otra materia sin copiar acceso ni matrícula. Retirar acceso cerró la unidad en otra pestaña. Se verificó el acceso y regreso desde la PC original.

Se inspeccionaron escritorio, teléfono de 390 px y tableta de 768 px. El contenido medido en teléfono fue 339/339 px y el recorrido de tableta 701/701 px (ancho/desplazamiento). La revisión encontró un botón de evidencia duplicado y navegación de tableta demasiado estrecha; se eliminó la repetición y se plegó la navegación hasta 960 px. La comprobación sintáctica y la compilación estática de Pages pasan; no se añadieron dependencias.

Se generó un PDF de prueba de dos páginas y se inspeccionó su primera página renderizada: incluye diagnóstico y apuntes, distingue trabajo y foro y no añade examen final. La descarga Markdown crea un archivo y enlace repetible, pero el navegador de prueba no confirmó su entrega al dispositivo. La descarga final del PDF y la impresión del sistema conservan su pendiente previo. No se consideran resueltas por generar bytes o un enlace.

## Fuentes de apoyo enlazadas

Contenido redactado para la actividad, sin copiar capítulos de terceros. La guía determina su alcance. Recursos primarios para ampliar:

- [Computer History Museum · Timeline of Computers](https://www.computerhistory.org/timeline/computers/)
- [Microsoft · Explorador de archivos](https://support.microsoft.com/es-es/windows/experience/fileexplorer/file-explorer-in-windows)
- [Intel · Frecuencia de CPU](https://www.intel.com/content/www/us/en/gaming/resources/cpu-clock-speed.html)
- [Intel · RAM y compatibilidad](https://www.intel.com/content/www/us/en/gaming/resources/how-much-ram-gaming.html)
- [Kingston · HDD, SSD, SATA y NVMe](https://www.kingston.com/es/ssd/ssd-faq)
