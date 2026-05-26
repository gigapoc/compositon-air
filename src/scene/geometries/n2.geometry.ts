import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COLOR_N2 } from '../../config/scene.constants.ts';

/** N₂ — deux sphères bleu foncé fusionnées. */
export function createN2Geometry(): THREE.BufferGeometry {
  const radius = 0.22;
  const separation = 0.28;
  const sphere = new THREE.SphereGeometry(radius, 12, 12);
  const left = sphere.clone();
  left.translate(-separation / 2, 0, 0);
  const right = sphere.clone();
  right.translate(separation / 2, 0, 0);
  const merged = mergeGeometries([left, right]);
  left.dispose();
  right.dispose();
  sphere.dispose();
  if (!merged) {
    throw new Error('Échec fusion géométrie N₂');
  }
  merged.computeBoundingSphere();
  return merged;
}

export function createN2Material(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: COLOR_N2, roughness: 0.45, metalness: 0.05 });
}
