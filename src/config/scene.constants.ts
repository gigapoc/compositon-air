/** Bornes et proportions de la scène — source unique de vérité. */

export const SCENE_SIZE = 40;
export const SCENE_HALF = SCENE_SIZE / 2;

export const ZONE_GRID_SIZE = 4;
export const ZONE_CELL_SIZE = SCENE_SIZE / ZONE_GRID_SIZE;
export const ZONE_COUNT = ZONE_GRID_SIZE ** 3;

export const N_TOTAL = 3000;

export const PROPORTION_N2 = 0.7808;
export const PROPORTION_O2 = 0.2095;
export const PROPORTION_AR = 0.0093;

export const COLOR_N2 = 0x1e3a5f;
export const COLOR_O2 = 0xdc2626;
export const COLOR_AR = 0x7dd3fc;
export const COLOR_CO2_C = 0x6b7280;
export const COLOR_CO2_O = 0xdc2626;

export const MAX_DEVICE_PIXEL_RATIO = 2;

export const CAMERA_HEIGHT = 1.6;
export const CAMERA_BOUND_MARGIN = 0.5;
/** Centre de la face +Z (dos à la paroi), regard vers le milieu du volume à hauteur yeux. */
export const CAMERA_INITIAL_LOOK_AT = { x: 0, y: CAMERA_HEIGHT, z: 0 } as const;
export const CAMERA_INITIAL_POSITION = {
  x: 0,
  y: CAMERA_HEIGHT,
  z: SCENE_HALF - CAMERA_BOUND_MARGIN,
} as const;

export const MOVE_SPEED = 8;
export const LOOK_SENSITIVITY = 0.002;
export const PITCH_CLAMP_RAD = (80 * Math.PI) / 180;
export const DRAG_THRESHOLD_PX = 8;

export const PARTICLE_MIN_DISTANCE = 0.8;
export const PARTICLE_PLACEMENT_ATTEMPTS = 10;
export const PARTICLE_VELOCITY_MIN = 0.3;
export const PARTICLE_VELOCITY_MAX = 1.2;
export const N_CO2 = ZONE_COUNT;

export type SpeciesId = 'N2' | 'O2' | 'Ar' | 'CO2';

export const SPECIES_IDS = ['N2', 'O2', 'Ar', 'CO2'] as const satisfies readonly SpeciesId[];

/** Compte N₂/O₂/Ar pour N_TOTAL — reste éventuel alloué au N₂. */
export function computeSpeciesCounts(total: number = N_TOTAL): Record<'N2' | 'O2' | 'Ar', number> {
  const n2 = Math.floor(total * PROPORTION_N2);
  const o2 = Math.floor(total * PROPORTION_O2);
  const ar = Math.floor(total * PROPORTION_AR);
  const remainder = total - (n2 + o2 + ar);
  return { N2: n2 + remainder, O2: o2, Ar: ar };
}
