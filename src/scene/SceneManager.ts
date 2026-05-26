import * as THREE from 'three';
import {
  CAMERA_INITIAL_LOOK_AT,
  CAMERA_INITIAL_POSITION,
  MAX_DEVICE_PIXEL_RATIO,
  SCENE_HALF,
  SCENE_SIZE,
  ZONE_GRID_SIZE,
} from '../config/scene.constants.ts';
import { ParticleField } from './ParticleField.ts';

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly particleField: ParticleField;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1628);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      500,
    );
    this.camera.position.set(
      CAMERA_INITIAL_POSITION.x,
      CAMERA_INITIAL_POSITION.y,
      CAMERA_INITIAL_POSITION.z,
    );
    this.camera.lookAt(
      CAMERA_INITIAL_LOOK_AT.x,
      CAMERA_INITIAL_LOOK_AT.y,
      CAMERA_INITIAL_LOOK_AT.z,
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, MAX_DEVICE_PIXEL_RATIO),
    );
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.particleField = new ParticleField();

    this.setupLights();
    this.setupVolume();
    this.particleField.init(this.scene);
  }

  private setupLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.85);
    directional.position.set(10, 20, 10);
    this.scene.add(directional);
  }

  private setupVolume(): void {
    const box = new THREE.BoxGeometry(SCENE_SIZE, SCENE_SIZE, SCENE_SIZE);
    const wireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(box),
      new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.35 }),
    );
    this.scene.add(wireframe);

    const faces = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    this.scene.add(faces);

    const grid = new THREE.GridHelper(SCENE_SIZE, ZONE_GRID_SIZE, 0x334155, 0x1e293b);
    grid.position.y = -SCENE_HALF;
    this.scene.add(grid);
  }

  update(delta: number): void {
    this.particleField.update(delta);
  }

  resize(): void {
    const { innerWidth, innerHeight } = window;
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, MAX_DEVICE_PIXEL_RATIO),
    );
    this.renderer.setSize(innerWidth, innerHeight);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.particleField.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
