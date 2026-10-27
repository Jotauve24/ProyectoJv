import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../../docs/', import.meta.url));
const assets = [
  'app.js', 'campus.js', 'course-guide.js', 'evidence.js', 'photolab.js',
  'student.js', 'material.js', 'interface.js', 'interface.css', 'dashboard.css', 'enrollment-models.js', 'enrollment.css', 'activity-catalog.js', 'foundation-models.js', 'foundations.js', 'foundations.css', 'logo.svg', 'campus-store.js', 'motion.js', 'unit-studio.js', 'unit-models.js', 'unit-studio.css', 'style.css', 'three.module.js', 'jspdf.umd.min.js',
  'THREE-LICENSE.txt', 'aula-pc-hero.webp', 'parts/board.webp', 'parts/cpu.webp',
  'parts/gpu.webp', 'parts/psu.webp', 'parts/ram.webp', 'parts/ssd.webp',
];

mkdirSync(output, { recursive: true });
for (const asset of assets) {
  const destination = join(output, asset);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(join(project, 'public', asset), destination);
}

const html = readFileSync(join(project, 'app/aula.html'), 'utf8');
if (!html.includes('</head>')) throw new Error('No se encontró la cabecera HTML.');
writeFileSync(join(output, 'index.html'), html.replace('</head>',
  '<meta name="proyectojv-hosting" content="github-pages"></head>'));
writeFileSync(join(output, '.nojekyll'), '');
console.log(`ProyectoJv preparado para GitHub Pages: ${output}`);
