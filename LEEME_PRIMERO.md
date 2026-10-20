# ProyectoJv — Continuar en otra cuenta

## Publicación elegida: GitHub Pages

La indicación vigente del usuario es publicar ProyectoJv en GitHub Pages. Autoriza un repositorio público, revisando antes que no incluya contraseñas, claves de API, tokens ni configuraciones privadas. El código sigue en `proyecto/`; `node proyecto/scripts/build-pages.mjs` genera `docs/`, que se publica desde `main` y `/docs`. Mantener esta publicación como destino de las próximas actualizaciones. Las instrucciones históricas sobre Sites que aparecen más abajo describen el entorno de origen.

## Qué hacer

1. Descarga este ZIP en tu computadora.
2. Entra a la otra cuenta de ChatGPT y abre un chat nuevo que permita trabajar con archivos y código.
3. Adjunta el ZIP completo. No basta con enviar el enlace de la web privada.
4. Copia el mensaje de MENSAJE_PARA_EL_OTRO_CHAT.txt.
5. El otro chat debe leer CONTEXTO_Y_ESTADO.md antes de modificar código.

El contenido del chat anterior no se transfiere automáticamente. Este paquete reúne el proyecto y las decisiones necesarias para retomarlo.

## Contenido

- proyecto/: código completo, imágenes, modelo 3D, generador de informes, dependencias declaradas y archivos de compilación.
- CONTEXTO_Y_ESTADO.md: requisitos docentes, funciones actuales, pruebas y pendientes.
- MENSAJE_PARA_EL_OTRO_CHAT.txt: mensaje listo para copiar.
- referencia/Guia_Informatica_Empresarial.docx: guía académica original aportada por el docente.
- ARCHIVOS_SHA256.json: inventario y huellas de los archivos del paquete.

## Web actual y otra cuenta

Web original: https://aula-jt-inmersiva.loftytoast3.chatgpt.site
La web sigue privada en la cuenta de origen. El ZIP no cambia su propietario ni concede acceso a otra cuenta. Si la otra cuenta no tiene acceso al proyecto original, debe crear una copia nueva, con su propio proyecto, repositorio y enlace. El manifiesto de esta copia no contiene el identificador de publicación original.

No se incluyen claves, tokens, sesiones, historial Git, node_modules ni datos privados del navegador. No se necesita una clave de generación de imágenes: las imágenes finales ya están incluidas.

## Ejecutar el código

Para un agente con el complemento Sites disponible: leer la habilidad Sites, configurar el perfil de ejecución, registrar un proyecto NUEVO de esta cuenta, instalar dependencias mediante el procedimiento de Sites, compilar y publicar conservando el carácter privado. Este proyecto usa el starter Vinext mantenido de Sites; no sustituir su integración de compilación.

Para desarrollo local fuera de Sites: instalar Node.js 22.13 o superior y una versión actual de pnpm compatible con el lockfile. Desde proyecto/ ejecutar:

    pnpm install --frozen-lockfile
    pnpm dev

En el perfil portable, el desarrollo solicita el puerto 5173; usar la dirección que anuncie la terminal. Para compilar:

    pnpm build

No basta con abrir aula.html como un archivo local: la descarga del PDF utiliza una ruta del servidor. Las herramientas, dependencias y acceso de cada cuenta pueden ser distintos; el nuevo chat deberá comprobarlos.

## Datos del docente y estudiantes

Los grupos, estudiantes, notas, actividades y liberación de unidades se guardan principalmente en el navegador. No están dentro del código ni de este ZIP. Copiar este proyecto no copia esos datos. La exportación «Compartir material» transporta material y estado de liberación, sin lista de estudiantes ni resultados; los alumnos deben importar un paquete actualizado cuando el docente libere más contenido. La sincronización automática entre dispositivos está pendiente.
