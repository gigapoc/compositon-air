import { SceneManager } from '../scene/SceneManager.ts';

const WEBGL_ERROR_MESSAGE =
  'Votre navigateur ou appareil ne peut pas afficher la scène 3D. ' +
  'Essayez Chrome ou Safari sur une tablette récente, ou mettez à jour votre navigateur.';

function showWebGlError(messageEl: HTMLElement, loadingEl: HTMLElement): void {
  loadingEl.hidden = true;
  loadingEl.setAttribute('aria-busy', 'false');
  messageEl.hidden = false;
  const paragraph = messageEl.querySelector('p');
  if (paragraph) {
    paragraph.textContent = WEBGL_ERROR_MESSAGE;
  }
}

function hideLoading(loadingEl: HTMLElement): void {
  loadingEl.hidden = true;
  loadingEl.setAttribute('aria-busy', 'false');
}

function isWebGlAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

export function bootstrap(): void {
  const container = document.getElementById('canvas-container');
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('webgl-error');

  if (!container || !loadingEl || !errorEl) {
    console.error('Éléments DOM requis introuvables.');
    return;
  }

  if (!isWebGlAvailable()) {
    showWebGlError(errorEl, loadingEl);
    return;
  }

  let sceneManager: SceneManager | null = null;

  try {
    sceneManager = new SceneManager(container);
  } catch (error) {
    console.error('Échec initialisation WebGL:', error);
    showWebGlError(errorEl, loadingEl);
    return;
  }

  hideLoading(loadingEl);

  const onResize = (): void => {
    sceneManager?.resize();
  };

  window.addEventListener('resize', onResize);

  const animate = (): void => {
    sceneManager?.render();
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}
