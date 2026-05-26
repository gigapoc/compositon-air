# Epic 3 Context: Comprendre chaque gaz en l'explorant

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

L'élève touche une particule pour ouvrir une fiche pédagogique en français, consulte la légende des espèces, et peut verbaliser les proportions — sans quitter l'expérience immersive. Cet epic transforme le nuage navigable d'Epic 2 en outil pédagogique interactif.

## Stories

- Story 3.1: Charger le contenu pédagogique des fiches en JSON
- Story 3.2: Ouvrir et fermer une fiche particule au touch
- Story 3.3: Afficher la légende et finaliser l'interface en français

## Requirements & Constraints

- Tap sur particule ouvre une fiche en moins de 1 s (FR7, NFR5).
- Fiches : nom, formule, proportion, texte collège 6e–3e en français (FR8).
- CO₂ : proportion réelle ~0,04 %, mention gaz trace, explication sur-représentation scène (FR8, Règle CO₂ option B).
- Légende permanente ou accessible en un geste, codage visuel des 4 espèces (FR9).
- Tous libellés UI en français, pas de sélecteur de langue v1 (FR10).
- Contraste texte/fond modale lisible (NFR7) ; touch targets suffisants (NFR6).
- `uiState` : `sheetOpen` bloque joystick et regard (FR7).

## Technical Decisions

- Contenu externalisé : `src/content/particles-fr.json` (4 ids `N2`, `O2`, `Ar`, `CO2`).
- Chargement au boot (import Vite statique ou fetch) ; validation runtime des 4 ids.
- `ParticlePicker` : Raycaster + InstancedMesh, émet `particle:selected` sur `document`.
- `ParticleSheet` : modale DOM HTML/CSS (`data-particle-sheet`), écoute l'événement, bascule `uiState`.
- `Legend` : overlay DOM, couleurs depuis `scene.constants.ts`.
- Pas de textes fiches hardcodés en TS (sauf fallback dev documenté).
- `TouchRouter` tap déjà câblé (Epic 2) — brancher le picker ; tap sans hit = no-op silencieux.

## UX & Interaction Patterns

- Tap canvas (sans drag ≥ 8 px) → raycast → fiche si hit.
- Modale fermable → retour `exploring`, navigation reprise.
- Légende compacte en paysage tablette, ne masque pas la majorité de la scène.

## Cross-Story Dependencies

- Dépend d'Epic 2 (nuage, InstancedMesh, mapping instanceId, TouchRouter, uiState).
- 3.2 dépend de 3.1 (JSON) ; 3.3 peut s'appuyer sur constants et contenu déjà chargé.
