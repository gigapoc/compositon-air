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
export const CAMERA_INITIAL_POSITION = { x: 0, y: CAMERA_HEIGHT, z: 8 } as const;

export const MOVE_SPEED = 8;
export const LOOK_SENSITIVITY = 0.002;

export type SpeciesId = 'N2' | 'O2' | 'Ar' | 'CO2';
