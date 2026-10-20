const preferenceKey = 'proyectojv-motion-v1';
const media = matchMedia('(prefers-reduced-motion: reduce)');
let chosen = false;
try { chosen = localStorage.getItem(preferenceKey) === 'reduced'; } catch {}
export const motionReduced = () => media.matches || chosen;
function announce() {
  document.body.dataset.motion = motionReduced() ? 'reduced' : 'full';
  window.dispatchEvent(new CustomEvent('aula-motion-change', {detail: {reduced: motionReduced()}}));
}
export function motionButton(className = '') {
  const button = document.createElement('button');
  button.type = 'button'; button.className = className;
  const sync = () => {
    button.textContent = motionReduced() ? 'Movimiento reducido' : 'Reducir movimiento';
    button.setAttribute('aria-pressed', String(motionReduced()));
    button.disabled = media.matches;
    button.title = media.matches ? 'Se respeta la preferencia de movimiento reducido de tu dispositivo.' : 'Ajusta las animaciones sin cambiar la actividad.';
  };
  button.onclick = () => {
    if (media.matches) return;
    chosen = !chosen;
    try { localStorage.setItem(preferenceKey, chosen ? 'reduced' : 'full'); } catch {}
    announce();
  };
  window.addEventListener('aula-motion-change', sync); sync();
  button.releaseMotionListener = () => window.removeEventListener('aula-motion-change', sync);
  return button;
}
media.addEventListener('change', announce);
window.addEventListener('storage', e => { if (e.key === preferenceKey) { chosen = e.newValue === 'reduced'; announce(); } });
announce();
