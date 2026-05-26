import { FirstPersonController } from '../controls/FirstPersonController.ts';
import { TouchRouter } from '../controls/TouchRouter.ts';
import { loadParticleContent } from '../content/loadParticleContent.ts';
import { ParticlePicker } from '../interaction/ParticlePicker.ts';
import { SceneManager } from '../scene/SceneManager.ts';
import { Legend } from '../ui/Legend.ts';
import { ParticleSheet } from '../ui/ParticleSheet.ts';
import { VirtualJoystick } from '../ui/VirtualJoystick.ts';
import { DRAG_THRESHOLD_PX } from '../config/scene.constants.ts';
import { getUiState } from './uiState.ts';
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

  const particleContent = loadParticleContent();

  let sceneManager: SceneManager | null = null;

  try {
    sceneManager = new SceneManager(container);
  } catch (error) {
    console.error('Échec initialisation WebGL:', error);
    showWebGlError(errorEl, loadingEl);
    return;
  }

  hideLoading(loadingEl);

  new Legend(app);
  const sheet = new ParticleSheet(app, particleContent);
  const picker = new ParticlePicker(
    sceneManager.camera,
    sceneManager.particleField,
    sceneManager.renderer.domElement,
  );

  const joystick = new VirtualJoystick(app);
  const controller = new FirstPersonController(sceneManager.camera);
  controller.setJoystickProvider(() => joystick.getOutput());

  const handlePick = (clientX: number, clientY: number): void => {
    if (getUiState() !== 'exploring' || sheet.isOpen()) return;
    picker.pick(clientX, clientY);
  };

  const touchRouter = new TouchRouter(sceneManager.renderer.domElement);
  touchRouter.setJoystick(joystick);
  touchRouter.setLookDragHandler(({ deltaX, deltaY }) => {
    controller.handleLookDrag(deltaX, deltaY);
  });
  touchRouter.setTapHandler((clientX, clientY) => {
    handlePick(clientX, clientY);
  });

  const canvas = sceneManager.renderer.domElement;
  let mouseDown: { x: number; y: number } | null = null;

  canvas.addEventListener('mousedown', (event) => {
    controller.handleMouseDown(event.button, event.clientX);
    if (event.button === 0 && getUiState() === 'exploring') {
      mouseDown = { x: event.clientX, y: event.clientY };
    }
  });
  window.addEventListener('mouseup', (event) => {
    controller.handleMouseUp();
    if (mouseDown && event.button === 0 && getUiState() === 'exploring') {
      const dx = event.clientX - mouseDown.x;
      const dy = event.clientY - mouseDown.y;
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) {
        handlePick(event.clientX, event.clientY);
      }
    }
    mouseDown = null;
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
