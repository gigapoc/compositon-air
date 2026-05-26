import * as THREE from 'three';
import { COLOR_AR } from '../../config/scene.constants.ts';

/** Ar — petite sphère bleu clair isolée. */
export function createArGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(0.18, 12, 12);
  geometry.computeBoundingSphere();
  return geometry;
}

export function createArMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: COLOR_AR, roughness: 0.4, metalness: 0.05 });
}
