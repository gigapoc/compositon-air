import { describe, expect, it } from 'vitest';
import { SPECIES_IDS } from '../config/scene.constants.ts';
import {
  loadParticleContent,
  validateParticlesContent,
} from '../content/loadParticleContent.ts';
import rawContent from '../content/particles-fr.json';

describe('validateParticlesContent', () => {
  it('accepte le fichier particles-fr.json avec les 4 ids requis', () => {
    const content = validateParticlesContent(rawContent);
    expect(content.species).toHaveLength(4);
    expect(content.species.map((s) => s.id)).toEqual([...SPECIES_IDS]);
  });

  it('rejette un contenu sans les 4 espèces', () => {
    expect(() =>
      validateParticlesContent({ species: [{ id: 'N2', name: 'x', formula: 'N₂', proportionLabel: '78', body: 'y' }] }),
    ).toThrow(/incomplet/);
  });

  it('charge le contenu CO₂ avec proportion trace et mention sur-représentation', () => {
    const content = loadParticleContent();
    const co2 = content.species.find((s) => s.id === 'CO2');
    expect(co2?.proportionLabel).toMatch(/0,04/);
    expect(co2?.body.toLowerCase()).toContain('gaz trace');
    expect(co2?.body.toLowerCase()).toContain('scène');
  });
});
