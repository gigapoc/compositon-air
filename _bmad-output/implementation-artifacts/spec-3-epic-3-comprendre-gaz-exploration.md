---
title: 'Epic 3 — Comprendre chaque gaz en l''explorant'
type: 'feature'
created: '2026-05-27'
status: 'done'
baseline_commit: '25c7aa5a9145d0a44081a4173ce06e6eba96277d'
context:
  - _bmad-output/implementation-artifacts/epic-3-context.md
  - _bmad-output/implementation-artifacts/spec-2-epic-2-explorer-composition-air-immersion.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le nuage Epic 2 est navigable mais opaque pédagogiquement — l'élève voit des particules sans accès aux informations sur chaque gaz ni à une légende.

**Approach:** Externaliser le contenu en JSON français, brancher un raycast touch/click via `ParticlePicker`, afficher une modale `ParticleSheet` qui bloque la navigation, et ajouter une `Legend` permanente avec libellés UI entièrement en français.

## Boundaries & Constraints

**Always:** Contenu depuis `particles-fr.json` ; événement `particle:selected` ; `uiState` sheetOpen bloque navigation ; couleurs légende depuis `scene.constants.ts` ; tap sans hit = silence ; contraste modale lisible ; touch targets ≥ 44 px.

**Ask First:** Ajustements textes fiches par Morgane ; légende repliée vs permanente si retour UX classe.

**Never:** Textes fiches hardcodés en TS (sauf fallback dev) ; `PointerLockControls` ; backend ; i18n ; géométrie 3D dans UI modules.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Boot contenu | WebGL OK | JSON chargé, 4 ids validés avant affichage fiches | Erreur validation → console + fallback dev si présent |
| Tap hit | exploring, tap sans drag, raycast hit | `particle:selected`, modale < 1 s, uiState sheetOpen | N/A |
| Tap miss | exploring, tap vide | Pas de modale, navigation intacte | No-op silencieux |
| Fermeture fiche | sheetOpen, bouton/overlay fermer | uiState exploring, navigation reprise | N/A |
| Sheet ouverte | sheetOpen, touch canvas | Pas de regard/joystick/pick | TouchRouter consulte uiState |
| Légende | exploring | 4 espèces + codage visuel FR, compacte paysage | N/A |

</frozen-after-approval>

## Code Map

- `src/content/particles-fr.json` — textes pédagogiques 4 espèces (FR8)
- `src/content/loadParticleContent.ts` — chargement + validation runtime ids
- `src/interaction/ParticlePicker.ts` — raycast InstancedMesh, émet `particle:selected`
- `src/ui/ParticleSheet.ts` — modale DOM, écoute événement, uiState
- `src/ui/Legend.ts` — overlay légende 4 espèces
- `src/app/bootstrap.ts` — orchestration contenu, picker, sheet, legend
- `src/controls/TouchRouter.ts` — respect uiState exploring pour tap/drag
- `src/ui/styles.css` — styles modale, légende, contraste NFR7
- `src/__tests__/particleContent.test.ts` — validation contenu JSON

## Tasks & Acceptance

**Execution:**
- [x] `src/content/particles-fr.json` — 4 espèces FR avec CO₂ gaz trace — Story 3.1
- [x] `src/content/loadParticleContent.ts` — load + validate SPECIES_IDS — Story 3.1
- [x] `src/__tests__/particleContent.test.ts` — tests validation — Story 3.1
- [x] `src/interaction/ParticlePicker.ts` — raycast + CustomEvent — Story 3.2
- [x] `src/ui/ParticleSheet.ts` — modale fermable, uiState — Story 3.2
- [x] `src/controls/TouchRouter.ts` — gate uiState exploring — Story 3.2
- [x] `src/app/bootstrap.ts` — wire picker/sheet/content/legend, click desktop — Story 3.2–3.3
- [x] `src/ui/Legend.ts` — légende permanente FR — Story 3.3
- [x] `src/ui/styles.css` — styles sheet + legend + touch targets — Story 3.3

**Acceptance Criteria:**
- Given `particles-fr.json` avec 4 espèces, when boot, then contenu chargé et validé, CO₂ ~0,04 % + gaz trace (FR8)
- Given nuage + JSON, when tap sans drag sur particule, then fiche < 1 s, uiState sheetOpen, navigation bloquée (FR7, NFR5)
- Given fiche ouverte, when fermeture, then exploring et navigation reprise (FR7)
- Given tap sans hit, when exploring, then pas de modale (FR7)
- Given scène active, when UI visible, then légende 4 espèces FR, pas de chaîne anglaise v1 (FR9, FR10)

## Spec Change Log

## Design Notes

`ParticlePicker.pick(clientX, clientY)` normalise les coords canvas, raycast sur `particleField.getMeshes()`, résout `speciesId` via `getSpeciesFromHit`. Événement :

```typescript
document.dispatchEvent(new CustomEvent('particle:selected', { detail: { speciesId } }));
```

## Verification

**Commands:**
- `npm run test` — expected: tous les tests passent
- `npm run build` — expected: compilation TS + build Vite OK

**Manual checks:**
- Tap particule ouvre fiche FR ; fermer reprend navigation ; légende visible en paysage

## Suggested Review Order

**Orchestration**

- Point d'entrée : contenu, picker, fiche et légende câblés au boot
  [`bootstrap.ts:61`](../../src/app/bootstrap.ts#L61)

**Sélection particule**

- Raycast InstancedMesh et événement `particle:selected`
  [`ParticlePicker.ts:28`](../../src/interaction/ParticlePicker.ts#L28)

**Fiche pédagogique**

- Modale DOM, uiState sheetOpen, fermeture reprend l'exploration
  [`ParticleSheet.ts:74`](../../src/ui/ParticleSheet.ts#L74)

**Contenu JSON**

- Textes FR externalisés, validation runtime des 4 ids
  [`loadParticleContent.ts:51`](../../src/content/loadParticleContent.ts#L51)

**Légende & styles**

- Codage visuel 4 espèces depuis constants, UI française
  [`Legend.ts:16`](../../src/ui/Legend.ts#L16)

- Contraste modale, touch targets 44 px, layout paysage tablette
  [`styles.css:132`](../../src/ui/styles.css#L132)

**Tests & config**

- Validation contenu CO₂ gaz trace
  [`particleContent.test.ts:22`](../../src/__tests__/particleContent.test.ts#L22)

- Import JSON TypeScript activé
  [`tsconfig.json:18`](../../tsconfig.json#L18)
