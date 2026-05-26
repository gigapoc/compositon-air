import {
  SCENE_HALF,
  ZONE_CELL_SIZE,
  ZONE_COUNT,
  ZONE_GRID_SIZE,
} from '../config/scene.constants.ts';

export interface ZoneIndex {
  ix: number;
  iy: number;
  iz: number;
}

export class ZoneGrid {
  readonly zoneCount = ZONE_COUNT;
  readonly gridSize = ZONE_GRID_SIZE;
  readonly cellSize = ZONE_CELL_SIZE;

  /** Retourne les indices (ix, iy, iz) pour un index linéaire 0..63. */
  decodeZoneIndex(index: number): ZoneIndex {
    if (index < 0 || index >= ZONE_COUNT) {
      throw new RangeError(`Index de zone hors limites: ${index}`);
    }
    const iz = index % ZONE_GRID_SIZE;
    const iy = Math.floor(index / ZONE_GRID_SIZE) % ZONE_GRID_SIZE;
    const ix = Math.floor(index / (ZONE_GRID_SIZE * ZONE_GRID_SIZE));
    return { ix, iy, iz };
  }

  /** Position aléatoire uniforme à l'intérieur d'une cellule de zone. */
  randomPointInZone(zoneIndex: number): { x: number; y: number; z: number } {
    const { ix, iy, iz } = this.decodeZoneIndex(zoneIndex);
    const minX = -SCENE_HALF + ix * ZONE_CELL_SIZE;
    const minY = -SCENE_HALF + iy * ZONE_CELL_SIZE;
    const minZ = -SCENE_HALF + iz * ZONE_CELL_SIZE;
    const margin = 0.3;
    const span = ZONE_CELL_SIZE - margin * 2;
    return {
      x: minX + margin + Math.random() * span,
      y: minY + margin + Math.random() * span,
      z: minZ + margin + Math.random() * span,
    };
  }

  /** Position aléatoire uniforme dans le volume global. */
  randomPointInVolume(): { x: number; y: number; z: number } {
    const margin = 0.5;
    const span = SCENE_HALF * 2 - margin * 2;
    return {
      x: -SCENE_HALF + margin + Math.random() * span,
      y: -SCENE_HALF + margin + Math.random() * span,
      z: -SCENE_HALF + margin + Math.random() * span,
    };
  }

  /** Zone contenant un point monde (clamp aux bornes). */
  zoneAtPoint(x: number, y: number, z: number): ZoneIndex {
    const clamp = (v: number) => Math.min(SCENE_HALF - 0.001, Math.max(-SCENE_HALF, v));
    const cx = clamp(x) + SCENE_HALF;
    const cy = clamp(y) + SCENE_HALF;
    const cz = clamp(z) + SCENE_HALF;
    return {
      ix: Math.min(ZONE_GRID_SIZE - 1, Math.floor(cx / ZONE_CELL_SIZE)),
      iy: Math.min(ZONE_GRID_SIZE - 1, Math.floor(cy / ZONE_CELL_SIZE)),
      iz: Math.min(ZONE_GRID_SIZE - 1, Math.floor(cz / ZONE_CELL_SIZE)),
    };
  }

  /** Itère sur tous les indices de zone 0..63. */
  allZoneIndices(): number[] {
    return Array.from({ length: ZONE_COUNT }, (_, i) => i);
  }
}
