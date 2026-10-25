<div align="center">
  <img src="./docs/aula-pc-hero.webp" width="760" alt="Laboratorio educativo interactivo ProyectoJv" />
  <h1>ProyectoJv</h1>
  <p><strong>Laboratorio educativo interactivo de informática</strong></p>
  <p>Grupos, seis unidades, prácticas guiadas, exploración visual de una computadora y evidencias PDF.</p>
  <p>
    <a href="https://jotauve24.github.io/ProyectoJv/">
      <img src="https://img.shields.io/badge/ABRIR_LABORATORIO-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Abrir ProyectoJv" />
    </a>
    <img src="https://img.shields.io/badge/ESTADO-FUNCIONAL-16A34A?style=for-the-badge" alt="Estado funcional" />
    <img src="https://img.shields.io/badge/PRIVACIDAD-DATOS_LOCALES-111827?style=for-the-badge" alt="Datos locales" />
  </p>
</div>

## Qué ofrece

- Seis unidades sobre informática, Internet, colaboración, documentos, presentaciones y hojas de cálculo.
- Experiencias visuales y prácticas con progreso independiente por estudiante y grupo.
- Liberación y retiro de unidades desde la vista docente.
- Exploración fotográfica de componentes y una escena 3D educativa.
- Generación de evidencias PDF directamente en el navegador.
- Navegación por teclado, adaptación móvil y compatibilidad con movimiento reducido.

> ProyectoJv es un recurso de apoyo educativo. No sustituye la plataforma académica institucional ni autentica identidades. Los datos y el progreso de la publicación en GitHub Pages se conservan en el navegador del usuario.

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
- Las unidades 2 a 6 incluyen escenas interactivas de Internet, colaboración, documentos, presentaciones y hojas de cálculo, con prácticas y notas por estudiante.
- El logo JV y el botón Inicio permiten volver a la portada conservando el trabajo guardado.
- La portada sigue la referencia oscura del usuario; los controles incluyen iconos, pulsación, foco y adaptación móvil.
- Las animaciones tienen pasos controlables, pausa y movimiento reducido. Se conservan las reglas de liberación del docente.
- Las vistas de estudiante y docente todavía no son cuentas autenticadas.
- En GitHub Pages, los informes PDF se descargan en el navegador. La versión Vinext conserva `POST /api/evidence-pdf`.
- La descarga final desde el dispositivo del usuario y la sincronización entre dispositivos siguen pendientes de verificación o implementación, respectivamente.
- Los identificadores internos `aula-jt-*` y el formato `aula-jt-material` se conservan por compatibilidad.

La aplicación pública está disponible en [GitHub Pages](https://jotauve24.github.io/ProyectoJv/) y se genera desde la carpeta `docs/`.

La revisión funcional y sus límites están documentados en [VERIFICACION_GENERAL.md](VERIFICACION_GENERAL.md). Desde `proyecto/`, `npm test` ejecuta las pruebas de regresión sin instalar dependencias adicionales.

## Recursos y licencias

Se conservan los avisos y licencias incluidos de Three.js, jsPDF y los recursos del proyecto.
