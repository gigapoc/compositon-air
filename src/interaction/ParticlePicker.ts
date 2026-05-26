import * as THREE from 'three';
import type { SpeciesId } from '../config/scene.constants.ts';
import type { ParticleField } from '../scene/ParticleField.ts';

export interface ParticlePickDetail {
  speciesId: SpeciesId;
}

export const PARTICLE_SELECTED_EVENT = 'particle:selected';

export class ParticlePicker {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly particleField: ParticleField;
  private readonly canvas: HTMLCanvasElement;

  constructor(
    camera: THREE.PerspectiveCamera,
    particleField: ParticleField,
    canvas: HTMLCanvasElement,
  ) {
    this.camera = camera;
    this.particleField = particleField;
    this.canvas = canvas;
  }

  pick(clientX: number, clientY: number): SpeciesId | null {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = this.particleField.getMeshes();
    const hits = this.raycaster.intersectObjects(meshes, false);

    for (const hit of hits) {
      const mesh = hit.object as THREE.InstancedMesh;
      const instanceId = hit.instanceId;
      if (instanceId === undefined) continue;
      const speciesId = this.particleField.getSpeciesFromHit(mesh, instanceId);
      if (speciesId) {
        this.emitSelected(speciesId);
        return speciesId;
      }
    }

    return null;
  }

  private emitSelected(speciesId: SpeciesId): void {
    document.dispatchEvent(
      new CustomEvent<ParticlePickDetail>(PARTICLE_SELECTED_EVENT, {
        detail: { speciesId },
      }),
    );
  }
}
