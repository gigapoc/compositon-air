import * as THREE from 'three';
import {
  CAMERA_BOUND_MARGIN,
  CAMERA_HEIGHT,
  LOOK_SENSITIVITY,
  MOVE_SPEED,
  PITCH_CLAMP_RAD,
  SCENE_HALF,
} from '../config/scene.constants.ts';
import { getUiState } from '../app/uiState.ts';
import type { JoystickOutput } from '../ui/VirtualJoystick.ts';

export class FirstPersonController {
  private yaw = 0;
  private pitch = 0;
  private readonly keys = new Set<string>();
  private getJoystick: (() => JoystickOutput) | null = null;
  private mouseLookActive = false;
  private readonly camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.yaw = camera.rotation.y;
    this.pitch = camera.rotation.x;
    this.syncCameraRotation();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  setJoystickProvider(provider: () => JoystickOutput): void {
    this.getJoystick = provider;
  }

  handleLookDrag(deltaX: number, deltaY: number): void {
    if (getUiState() !== 'exploring') return;
    this.applyLook(deltaX, deltaY);
  }

  handleMouseDown(button: number, clientX: number): void {
    if (button !== 0 || getUiState() !== 'exploring') return;
    if (clientX >= window.innerWidth / 2) {
      this.mouseLookActive = true;
    }
  }

  handleMouseMove(deltaX: number, deltaY: number): void {
    if (!this.mouseLookActive || getUiState() !== 'exploring') return;
    this.applyLook(deltaX, deltaY);
  }

  handleMouseUp(): void {
    this.mouseLookActive = false;
  }

  update(delta: number): void {
    if (getUiState() !== 'exploring') return;

    const move = new THREE.Vector3();
    const forward = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw)).normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) move.add(forward);
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) move.sub(forward);
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) move.add(right);
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) move.sub(right);

    const joystick = this.getJoystick?.() ?? { x: 0, y: 0 };
    move.addScaledVector(forward, -joystick.y);
    move.addScaledVector(right, -joystick.x);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(MOVE_SPEED * delta);
      this.camera.position.add(move);
    }

    this.camera.position.y = CAMERA_HEIGHT;
    const limit = SCENE_HALF - CAMERA_BOUND_MARGIN;
    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -limit, limit);
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -limit, limit);
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private applyLook(deltaX: number, deltaY: number): void {
    this.yaw -= deltaX * LOOK_SENSITIVITY;
    this.pitch -= deltaY * LOOK_SENSITIVITY;
    this.pitch = THREE.MathUtils.clamp(this.pitch, -PITCH_CLAMP_RAD, PITCH_CLAMP_RAD);
    this.syncCameraRotation();
  }

  private syncCameraRotation(): void {
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    this.keys.add(event.code);
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
  };
}
