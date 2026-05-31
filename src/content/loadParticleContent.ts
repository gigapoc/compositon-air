import { SPECIES_IDS, type SpeciesId } from '../config/scene.constants.ts';
import rawContent from './particles-fr.json';

export interface ParticleSpeciesContent {
  id: SpeciesId;
  name: string;
  formula: string;
  proportionLabel: string;
  body: string;
}

export interface AirCompositionContent {
  title: string;
  paragraphs: string[];
}

export interface ParticlesContent {
  species: ParticleSpeciesContent[];
  airComposition: AirCompositionContent;
}

const DEV_FALLBACK_AIR_COMPOSITION: AirCompositionContent = {
  title: 'Description',
  paragraphs: ['Contenu indisponible.'],
};

const DEV_FALLBACK: ParticlesContent = {
  species: SPECIES_IDS.map((id) => ({
    id,
    name: id,
    formula: id,
    proportionLabel: '—',
    body: 'Contenu indisponible.',
  })),
  airComposition: DEV_FALLBACK_AIR_COMPOSITION,
};

function isSpeciesId(value: unknown): value is SpeciesId {
  return typeof value === 'string' && (SPECIES_IDS as readonly string[]).includes(value);
}

function parseSpeciesEntry(entry: unknown): ParticleSpeciesContent | null {
  if (!entry || typeof entry !== 'object') return null;
  const record = entry as Record<string, unknown>;
  if (
    !isSpeciesId(record.id) ||
    typeof record.name !== 'string' ||
    typeof record.formula !== 'string' ||
    typeof record.proportionLabel !== 'string' ||
    typeof record.body !== 'string'
  ) {
    return null;
  }
  return {
    id: record.id,
    name: record.name,
    formula: record.formula,
    proportionLabel: record.proportionLabel,
    body: record.body,
  };
}

export function validateParticlesContent(data: unknown): ParticlesContent {
  if (!data || typeof data !== 'object') {
    throw new Error('Contenu particules invalide : racine attendue.');
  }
  const speciesRaw = (data as { species?: unknown }).species;
  if (!Array.isArray(speciesRaw)) {
    throw new Error('Contenu particules invalide : tableau species attendu.');
  }

  const byId = new Map<SpeciesId, ParticleSpeciesContent>();
  for (const entry of speciesRaw) {
    const parsed = parseSpeciesEntry(entry);
    if (parsed) {
      byId.set(parsed.id, parsed);
    }
  }

  for (const id of SPECIES_IDS) {
    if (!byId.has(id)) {
      throw new Error(`Contenu particules incomplet : id manquant « ${id} ».`);
    }
  }

  const airCompositionRaw = (data as { airComposition?: unknown }).airComposition;
  if (!airCompositionRaw || typeof airCompositionRaw !== 'object') {
    throw new Error('Contenu particules invalide : airComposition attendu.');
  }
  const airRecord = airCompositionRaw as Record<string, unknown>;
  if (typeof airRecord.title !== 'string') {
    throw new Error('Contenu particules invalide : airComposition.title attendu.');
  }
  if (!Array.isArray(airRecord.paragraphs) || !airRecord.paragraphs.every((p) => typeof p === 'string')) {
    throw new Error('Contenu particules invalide : airComposition.paragraphs attendu.');
  }

  return {
    species: SPECIES_IDS.map((id) => byId.get(id)!),
    airComposition: {
      title: airRecord.title,
      paragraphs: airRecord.paragraphs as string[],
    },
  };
}

export function loadParticleContent(): ParticlesContent {
  try {
    return validateParticlesContent(rawContent);
  } catch (error) {
    console.error('Échec chargement contenu particules, fallback dev utilisé:', error);
    return DEV_FALLBACK;
  }
}

export function getSpeciesContent(
  content: ParticlesContent,
  speciesId: SpeciesId,
): ParticleSpeciesContent | undefined {
  return content.species.find((s) => s.id === speciesId);
}
