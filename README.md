# ProyectoJv

Laboratorio educativo de informática con grupos, seis unidades, exploración de una computadora, prácticas y evidencias PDF.

Repositorio privado: https://github.com/Jotauve24/ProyectoJv

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

## Estado actual

- El progreso, los grupos y las evidencias se guardan en el navegador.
- Las vistas de estudiante y docente todavía no son cuentas autenticadas.
- Los informes PDF se generan en el cliente y se entregan mediante `POST /api/evidence-pdf`.
- La descarga final desde el dispositivo del usuario y la sincronización entre dispositivos siguen pendientes de verificación o implementación, respectivamente.
- Los identificadores internos `aula-jt-*` y el formato `aula-jt-material` se conservan por compatibilidad.

El repositorio guarda el código. La publicación de la aplicación se gestiona por separado.

## Recursos y licencias

Se conservan los avisos y licencias incluidos de Three.js, jsPDF y los recursos del proyecto.
