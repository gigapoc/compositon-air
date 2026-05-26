import * as THREE from 'three';
import {
  computeSpeciesCounts,
  N_CO2,
  N_TOTAL,
  PARTICLE_MIN_DISTANCE,
  PARTICLE_PLACEMENT_ATTEMPTS,
  PARTICLE_VELOCITY_MAX,
  PARTICLE_VELOCITY_MIN,
  SCENE_HALF,
  type SpeciesId,
} from '../config/scene.constants.ts';
import { applyCo2VertexColors, createCo2Geometry, createCo2Material } from './geometries/co2.geometry.ts';
import { createArGeometry, createArMaterial } from './geometries/ar.geometry.ts';
import { createN2Geometry, createN2Material } from './geometries/n2.geometry.ts';
import { createO2Geometry, createO2Material } from './geometries/o2.geometry.ts';
import { ZoneGrid } from './ZoneGrid.ts';

interface ParticleState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
}

const SPECIES_ORDER: SpeciesId[] = ['N2', 'O2', 'Ar', 'CO2'];

export class ParticleField {
  private readonly zoneGrid = new ZoneGrid();
  private readonly meshes = new Map<SpeciesId, THREE.InstancedMesh>();
  private readonly particles: ParticleState[] = [];
  private readonly speciesByGlobalIndex: SpeciesId[] = [];
  private readonly dummy = new THREE.Object3D();
  private readonly bounds = SCENE_HALF - 0.5;

  init(scene: THREE.Scene): void {
    const counts = computeSpeciesCounts(N_TOTAL);
    const placements: { speciesId: SpeciesId; position: THREE.Vector3 }[] = [];

    for (const speciesId of ['N2', 'O2', 'Ar'] as const) {
      for (let i = 0; i < counts[speciesId]; i += 1) {
        placements.push({
          speciesId,
          position: this.findPlacement(placements),
        });
      }
    }

    for (const zoneIndex of this.zoneGrid.allZoneIndices()) {
      const point = this.zoneGrid.randomPointInZone(zoneIndex);
      placements.push({
        speciesId: 'CO2',
        position: new THREE.Vector3(point.x, point.y, point.z),
      });
    }

    if (placements.filter((p) => p.speciesId === 'CO2').length !== N_CO2) {
      throw new Error(`Nombre CO₂ incorrect: attendu ${N_CO2}`);
    }

    const bySpecies: Record<SpeciesId, THREE.Vector3[]> = {
      N2: [],
      O2: [],
      Ar: [],
      CO2: [],
    };
    for (const p of placements) {
      bySpecies[p.speciesId].push(p.position);
    }

    for (const speciesId of SPECIES_ORDER) {
      const positions = bySpecies[speciesId];
      const mesh = this.createInstancedMesh(speciesId, positions.length);
      positions.forEach((pos, index) => {
        const rotation = new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        );
        this.dummy.position.copy(pos);
        this.dummy.rotation.copy(rotation);
        this.dummy.updateMatrix();
        mesh.setMatrixAt(index, this.dummy.matrix);

        this.particles.push({
          position: pos.clone(),
          velocity: this.randomVelocity(),
          rotation,
        });
        this.speciesByGlobalIndex.push(speciesId);
      });
      mesh.instanceMatrix.needsUpdate = true;
      this.meshes.set(speciesId, mesh);
      scene.add(mesh);
    }
  }

  update(delta: number): void {
    let particleIndex = 0;
    for (const speciesId of SPECIES_ORDER) {
      const mesh = this.meshes.get(speciesId);
      if (!mesh) continue;

      for (let i = 0; i < mesh.count; i += 1) {
        const state = this.particles[particleIndex];
        particleIndex += 1;

        state.position.addScaledVector(state.velocity, delta);
        this.bounce(state);

        this.dummy.position.copy(state.position);
        this.dummy.rotation.copy(state.rotation);
        this.dummy.updateMatrix();
        mesh.setMatrixAt(i, this.dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  getSpeciesFromHit(mesh: THREE.InstancedMesh, localInstanceId: number): SpeciesId | null {
    for (const [speciesId, speciesMesh] of this.meshes) {
      if (speciesMesh === mesh && localInstanceId >= 0 && localInstanceId < speciesMesh.count) {
        return speciesId;
      }
    }
    return null;
  }

  getInstanceMapping(): ReadonlyArray<{ globalIndex: number; speciesId: SpeciesId }> {
    return this.speciesByGlobalIndex.map((speciesId, globalIndex) => ({ globalIndex, speciesId }));
  }

  getTotalCount(): number {
    return this.particles.length;
  }

  getMeshes(): THREE.InstancedMesh[] {
    return SPECIES_ORDER.map((id) => this.meshes.get(id)).filter(Boolean) as THREE.InstancedMesh[];
  }

  dispose(): void {
    for (const mesh of this.meshes.values()) {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      mesh.removeFromParent();
    }
    this.meshes.clear();
    this.particles.length = 0;
    this.speciesByGlobalIndex.length = 0;
  }

  private createInstancedMesh(speciesId: SpeciesId, count: number): THREE.InstancedMesh {
    let geometry: THREE.BufferGeometry;
    let material: THREE.MeshStandardMaterial;

    switch (speciesId) {
      case 'N2':
        geometry = createN2Geometry();
        material = createN2Material();
        break;
      case 'O2':
        geometry = createO2Geometry();
        material = createO2Material();
        break;
      case 'Ar':
        geometry = createArGeometry();
        material = createArMaterial();
        break;
      case 'CO2': {
        geometry = createCo2Geometry();
        applyCo2VertexColors(geometry);
        material = createCo2Material();
        break;
      }
    }

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.frustumCulled = false;
    return mesh;
  }

  private findPlacement(existing: { position: THREE.Vector3 }[]): THREE.Vector3 {
    for (let attempt = 0; attempt < PARTICLE_PLACEMENT_ATTEMPTS; attempt += 1) {
      const point = this.zoneGrid.randomPointInVolume();
      const candidate = new THREE.Vector3(point.x, point.y, point.z);
      if (this.isFarEnough(candidate, existing)) {
        return candidate;
      }
    }
    const fallback = this.zoneGrid.randomPointInVolume();
    return new THREE.Vector3(fallback.x, fallback.y, fallback.z);
  }

  private isFarEnough(candidate: THREE.Vector3, existing: { position: THREE.Vector3 }[]): boolean {
    for (const other of existing) {
      if (candidate.distanceTo(other.position) < PARTICLE_MIN_DISTANCE) {
        return false;
      }
    }
    return true;
  }

  private randomVelocity(): THREE.Vector3 {
    const speed =
      PARTICLE_VELOCITY_MIN +
      Math.random() * (PARTICLE_VELOCITY_MAX - PARTICLE_VELOCITY_MIN);
    const dir = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
    ).normalize();
    return dir.multiplyScalar(speed);
  }

  private bounce(state: ParticleState): void {
    const { position, velocity } = state;
    if (position.x > this.bounds) {
      position.x = this.bounds;
      velocity.x = -Math.abs(velocity.x);
    } else if (position.x < -this.bounds) {
      position.x = -this.bounds;
      velocity.x = Math.abs(velocity.x);
    }
    if (position.y > this.bounds) {
      position.y = this.bounds;
      velocity.y = -Math.abs(velocity.y);
    } else if (position.y < -this.bounds) {
      position.y = -this.bounds;
      velocity.y = Math.abs(velocity.y);
    }
    if (position.z > this.bounds) {
      position.z = this.bounds;
      velocity.z = -Math.abs(velocity.z);
    } else if (position.z < -this.bounds) {
      position.z = -this.bounds;
      velocity.z = Math.abs(velocity.z);
    }
  }
}

export { computeSpeciesCounts };
