const paths = {
  home: '<path d="m3 10 9-7 9 7v10H6a3 3 0 0 1-3-3Z"/><path d="M9 20v-7h6v7"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
  book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/><path d="M12 5v15M6 8h3m6 0h3"/>',
  board: '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5m-5 0h10M7 8h5m-5 4h10"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4"/>',
  edit: '<path d="m14 5 5 5M4 20l5-1L20 8a2 2 0 0 0-5-5L4 14Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
  unlock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8-1m-4 10v2"/>',
  play: '<path d="m8 4 12 8-12 8Z"/>',
  reset: '<path d="M4 5v6h6M4 11a8 8 0 1 1 1 7"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4m-6 8 6 4"/>',
};

function homeTarget(){return location.pathname+({student:'?vista=estudiante',teacher:'?vista=docente'}[document.body.dataset.audience]||'')}
function updateHomeLinks(){document.querySelectorAll('a[data-project-home]').forEach(a=>a.href=homeTarget())}
window.addEventListener('aula-audience-changed',updateHomeLinks);

export function uiIcon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.7');
  svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
  svg.classList.add('ui-icon'); svg.innerHTML = paths[name] || paths.arrow;
  return svg;
}

export function brandLink(className = '') {
  const a = document.createElement('a');
  a.className = 'project-brand ' + className; a.href = homeTarget(); a.dataset.projectHome = '';
  a.setAttribute('aria-label', 'ProyectoJv · Ir a Inicio'); a.title = 'Ir a Inicio';
  const image = document.createElement('img'); image.src = 'logo.svg'; image.alt = ''; image.width = 44; image.height = 44;
  const word = document.createElement('span'); word.className = 'brand-words'; word.append('Proyecto');
  const initials = document.createElement('b'); initials.textContent = 'Jv'; word.append(initials);
  a.append(image, word); return a;
}

export function homeLink(className = '') {
  const a = document.createElement('a'); a.href = homeTarget(); a.dataset.projectHome = '';
  a.className = 'smallbtn home-control ' + className; a.append(uiIcon('home'));
  const label = document.createElement('span'); label.textContent = 'Inicio'; a.append(label);
  return a;
}

export function decorateAction(button, text = button.textContent) {
  if (button.querySelector('.ui-icon') || button.classList.contains('close')) return button;
  let icon;
  if (/^(?:\+\s*)?(Nuevo|Nueva|Crear)/i.test(text)) icon = 'plus';
  else if (/^(Importar)/i.test(text)) icon = 'upload';
  else if (/^(Descargar|Preparar|Generar|Mi evidencia)/i.test(text)) icon = 'download';
  else if (/^(Compartir)/i.test(text)) icon = 'share';
  else if (/^(Editar|Cambiar)/i.test(text)) icon = 'edit';
  else if (/Bloqueada|Contenido pendiente/.test(text)) icon = 'lock';
  else if (/^(Liberar)/i.test(text)) icon = 'unlock';
  else if (/^(Guardar|Confirmar|Comprobar|Finalizar|Ya lo)/i.test(text)) icon = 'check';
  else if (/^(Reproducir|Iniciar recorrido)/i.test(text)) icon = 'play';
  else if (/^(Reiniciar)/i.test(text)) icon = 'reset';
  else if (/^(Volver|Cerrar|Salir|‹)/i.test(text)) icon = 'back';
  else if (/^(Abrir|Entrar|Comenzar|Gestionar|Explorar|Ver mis|Laboratorio|Estudiar)/i.test(text)) icon = 'arrow';
  if (icon) { button.classList.add('ui-action'); if (/^[+‹]\s*/.test(text)) button.textContent = text.replace(/^[+‹]\s*/, ''); button.prepend(uiIcon(icon)); }
  return button;
}

function brandDialog(dialog) {
  if (dialog.querySelector('[data-project-home]')) return;
  const bar = document.createElement('div'); bar.className = 'dialog-brandbar';
  bar.append(brandLink(), homeLink()); (dialog.querySelector('form') || dialog).prepend(bar);
}

document.addEventListener('click', event => {
  const link = event.target.closest?.('a[data-project-home]');
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault(); window.dispatchEvent(new Event('aula-home-request'));
});
document.addEventListener('keydown', event => {
  if (['Tab', 'Enter', ' ', 'Escape'].includes(event.key)) document.body.dataset.uiInput = 'keyboard';
});
document.addEventListener('pointerdown', () => { document.body.dataset.uiInput = 'pointer'; }, {passive: true});
document.querySelectorAll('dialog').forEach(brandDialog);
const evidenceButton = document.querySelector('#evidencebutton');
if (evidenceButton) decorateAction(evidenceButton, 'Descargar evidencia');
new MutationObserver(records => {
  for (const record of records) {
    if (record.target === evidenceButton) decorateAction(evidenceButton, 'Descargar evidencia');
    for (const node of record.addedNodes) {
    if (node.nodeType !== 1) continue;
    if (node.matches('dialog')) brandDialog(node);
    node.querySelectorAll('dialog').forEach(brandDialog);
    }
  }
}).observe(document.body, {childList: true, subtree: true});

