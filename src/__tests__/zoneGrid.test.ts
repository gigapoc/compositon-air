import { describe, expect, it } from 'vitest';
import {
  computeSpeciesCounts,
  N_CO2,
  N_TOTAL,
  PROPORTION_AR,
  PROPORTION_N2,
  PROPORTION_O2,
  ZONE_COUNT,
} from '../config/scene.constants.ts';
import { ZoneGrid } from '../scene/ZoneGrid.ts';

describe('computeSpeciesCounts', () => {
  it('alloue exactement N_TOTAL particules N₂/O₂/Ar', () => {
    const counts = computeSpeciesCounts(N_TOTAL);
    const sum = counts.N2 + counts.O2 + counts.Ar;
    expect(sum).toBe(N_TOTAL);
  });

  it('respecte les proportions floor avec reste vers N₂', () => {
    const counts = computeSpeciesCounts(N_TOTAL);
    expect(counts.O2).toBe(Math.floor(N_TOTAL * PROPORTION_O2));
    expect(counts.Ar).toBe(Math.floor(N_TOTAL * PROPORTION_AR));
    expect(counts.N2).toBeGreaterThanOrEqual(Math.floor(N_TOTAL * PROPORTION_N2));
  });
});

describe('ZoneGrid', () => {
  const grid = new ZoneGrid();

  it('expose 64 zones', () => {
    expect(grid.zoneCount).toBe(ZONE_COUNT);
    expect(grid.allZoneIndices()).toHaveLength(64);
  });

  it('décode et encode les indices de zone', () => {
    for (let i = 0; i < ZONE_COUNT; i += 1) {
      const { ix, iy, iz } = grid.decodeZoneIndex(i);
      expect(ix).toBeGreaterThanOrEqual(0);
      expect(iy).toBeGreaterThanOrEqual(0);
      expect(iz).toBeGreaterThanOrEqual(0);
      expect(ix).toBeLessThan(4);
      expect(iy).toBeLessThan(4);
      expect(iz).toBeLessThan(4);
    }
  });

  it('place un point aléatoire dans chaque cellule', () => {
    for (const zoneIndex of grid.allZoneIndices()) {
      const point = grid.randomPointInZone(zoneIndex);
      const zone = grid.zoneAtPoint(point.x, point.y, point.z);
      const decoded = grid.decodeZoneIndex(zoneIndex);
      expect(zone.ix).toBe(decoded.ix);
      expect(zone.iy).toBe(decoded.iy);
      expect(zone.iz).toBe(decoded.iz);
    }
  });

  it('prévoit 64 emplacements CO₂ distincts par zone', () => {
    expect(N_CO2).toBe(ZONE_COUNT);
  });
});

describe('mapping particules', () => {
  it('total rendu = N_TOTAL + N_CO2', () => {
    const counts = computeSpeciesCounts(N_TOTAL);
    const main = counts.N2 + counts.O2 + counts.Ar;
    expect(main + N_CO2).toBe(N_TOTAL + N_CO2);
  });
});
