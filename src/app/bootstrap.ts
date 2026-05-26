import { FirstPersonController } from '../controls/FirstPersonController.ts';
import { TouchRouter } from '../controls/TouchRouter.ts';
import { SceneManager } from '../scene/SceneManager.ts';
import { VirtualJoystick } from '../ui/VirtualJoystick.ts';
import '../ui/styles.css';

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
  const app = document.getElementById('app');
  const container = document.getElementById('canvas-container');
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('webgl-error');

  if (!app || !container || !loadingEl || !errorEl) {
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

  const joystick = new VirtualJoystick(app);
  const controller = new FirstPersonController(sceneManager.camera);
  controller.setJoystickProvider(() => joystick.getOutput());

  const touchRouter = new TouchRouter(sceneManager.renderer.domElement);
  touchRouter.setJoystick(joystick);
  touchRouter.setLookDragHandler(({ deltaX, deltaY }) => {
    controller.handleLookDrag(deltaX, deltaY);
  });
  touchRouter.setTapHandler(() => {
    /* Réservé Epic 3 — sélection particule */
  });

  const canvas = sceneManager.renderer.domElement;
  canvas.addEventListener('mousedown', (event) => {
    controller.handleMouseDown(event.button, event.clientX);
  });
  window.addEventListener('mouseup', () => {
    controller.handleMouseUp();
  });
  window.addEventListener('mousemove', (event) => {
    controller.handleMouseMove(event.movementX, event.movementY);
  });

  const onResize = (): void => {
    sceneManager?.resize();
  };

  window.addEventListener('resize', onResize);

  let lastTime = performance.now();

  const animate = (now: number): void => {
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    controller.update(delta);
    sceneManager?.update(delta);
    sceneManager?.render();
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}
