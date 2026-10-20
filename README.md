# ProyectoJv

Laboratorio educativo de informática con grupos, seis unidades, exploración de una computadora, prácticas y evidencias PDF.

Repositorio: https://github.com/Jotauve24/ProyectoJv

Publicación web: GitHub Pages, desde la carpeta `docs` de la rama `main`.

Sitio: https://jotauve24.github.io/ProyectoJv/

## Continuar el proyecto

Lee primero `LEEME_PRIMERO.md` y `CONTEXTO_Y_ESTADO.md`. El código está en `proyecto/` y la guía académica original en `referencia/`.

Conserva el diseño, la PC y las funciones existentes. Las unidades solo se abren cuando el docente las libera; finalizar una unidad es una acción independiente.

## Ejecutar en desarrollo

Requisitos: Node.js 22.13 o superior y pnpm compatible con `proyecto/package.json` y su archivo de bloqueo.

Desde la carpeta del repositorio:

```powershell
cd proyecto
pnpm install --frozen-lockfile
pnpm dev
```

Abre la dirección que anuncie la terminal. Para compilar, ejecuta `pnpm build` desde `proyecto/`.

## Publicar en GitHub Pages

Genera la versión web desde la raíz del repositorio:

```powershell
node proyecto/scripts/build-pages.mjs
```

Guarda los cambios del código y de `docs/` en la rama `main`. GitHub Pages publica desde `main` y la carpeta `/docs`. El generador copia únicamente el HTML y los recursos públicos indicados; las configuraciones privadas y los archivos del servidor quedan fuera de esa salida. El PDF se descarga directamente en el navegador cuando se usa GitHub Pages.

## Estado actual

- El progreso, los grupos y las evidencias se guardan en el navegador.
- Las vistas de estudiante y docente todavía no son cuentas autenticadas.
- En GitHub Pages, los informes PDF se descargan en el navegador. La versión Vinext conserva `POST /api/evidence-pdf`.
- La descarga final desde el dispositivo del usuario y la sincronización entre dispositivos siguen pendientes de verificación o implementación, respectivamente.
- Los identificadores internos `aula-jt-*` y el formato `aula-jt-material` se conservan por compatibilidad.

El repositorio guarda el código. La publicación de la aplicación se gestiona por separado.

La revisión funcional y sus límites están documentados en [VERIFICACION_GENERAL.md](VERIFICACION_GENERAL.md). Desde `proyecto/`, `npm test` ejecuta las pruebas de regresión sin instalar dependencias adicionales.

## Recursos y licencias

Se conservan los avisos y licencias incluidos de Three.js, jsPDF y los recursos del proyecto.
