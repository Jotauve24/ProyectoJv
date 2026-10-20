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
