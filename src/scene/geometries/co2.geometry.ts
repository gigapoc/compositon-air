import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COLOR_CO2_C, COLOR_CO2_O } from '../../config/scene.constants.ts';

/** CO₂ — atome C gris central + deux O rouges alignés. */
export function createCo2Geometry(): THREE.BufferGeometry {
  const cRadius = 0.16;
  const oRadius = 0.18;
  const bond = 0.38;

  const carbon = new THREE.SphereGeometry(cRadius, 12, 12);
  const oxygen = new THREE.SphereGeometry(oRadius, 12, 12);

  const leftO = oxygen.clone();
  leftO.translate(-bond, 0, 0);
  const rightO = oxygen.clone();
  rightO.translate(bond, 0, 0);

  const merged = mergeGeometries([carbon, leftO, rightO]);
  carbon.dispose();
  oxygen.dispose();
  leftO.dispose();
  rightO.dispose();
  if (!merged) {
    throw new Error('Échec fusion géométrie CO₂');
  }
  merged.computeBoundingSphere();
  return merged;
}

export function createCo2Material(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: COLOR_CO2_C,
    roughness: 0.45,
    metalness: 0.05,
    vertexColors: true,
  });
}

/** Matériau vertex-colored pour distinguer C et O dans CO₂. */
export function applyCo2VertexColors(geometry: THREE.BufferGeometry): void {
  const position = geometry.getAttribute('position');
  const colors = new Float32Array(position.count * 3);
  const cColor = new THREE.Color(COLOR_CO2_C);
  const oColor = new THREE.Color(COLOR_CO2_O);
  const center = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox?.getCenter(center);

  const vertex = new THREE.Vector3();
  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i);
    const dist = Math.abs(vertex.x - center.x);
    const color = dist > 0.15 ? oColor : cColor;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}
