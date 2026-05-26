# Epic 2 Context: Explorer la composition de l'air en immersion

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

L'élève se déplace en first-person dans un nuage de particules animées dont les proportions et le codage visuel reflètent la réalité pédagogique de l'air (N₂ dominant, O₂ minoritaire, Ar rare, CO₂ repérable dans chaque zone). Cet epic transforme le volume vide d'Epic 1 en expérience immersive navigable.

## Stories

- Story 2.1: Modéliser les quatre espèces en géométries 3D distinctes
- Story 2.2: Générer le nuage avec proportions strictes et CO₂ par zone
- Story 2.3: Animer le mouvement libre des particules
- Story 2.4: Naviguer en first-person avec contrôles tactiles tablette

## Requirements & Constraints

- Particules animées en mouvement libre dans le volume (FR2).
- Proportions strictes N₂/O₂/Ar sur 3000 particules ; 64 CO₂ supplémentaires (1 par zone, hors quota) (FR3, FR4).
- Quatre géométries distinctes ; Ar et N₂ distinguables sans ambiguïté (FR5).
- Navigation first-person tablette : joystick gauche, regard drag droite ; pas de PointerLockControls principal (FR6, NFR6).
- InstancedMesh par type de géométrie ; ombres désactivées ; 60 FPS cible, 30 minimum acceptable.
- Couleurs et dimensions depuis `scene.constants.ts` uniquement ; pas de moteur physique.
- Freeze navigation perçu ≤ 500 ms (NFR4).

## Technical Decisions

- Volume 40³ u, grille 4×4×4 (64 zones de 10³ u) via `ZoneGrid`.
- Génération : proportions floor + reste → N₂ ; CO₂ = 64 instances positionnées aléatoirement dans chaque cellule.
- Positions N₂/O₂/Ar uniformes dans le volume ; distance min 0.8 u entre particules (max 10 tentatives).
- Animation : vélocité aléatoire faible, rebond ou wrap sur parois — pédagogique, pas réaliste.
- Modules : `scene/geometries/`, `ParticleField.ts`, `ZoneGrid.ts`, `controls/FirstPersonController.ts`, `TouchRouter.ts`, `ui/VirtualJoystick.ts`.
- Mapping `instanceId → speciesId` pour sélection future (Epic 3).
- Tests unitaires prioritaires : `ZoneGrid`, proportions, mapping instanceId.
- Desktop bonus : WASD + souris (non prioritaire QA).

## UX & Interaction Patterns

- Moitié gauche écran : joystick virtuel (avancer/reculer/strafe).
- Moitié droite : drag 1 doigt pour yaw/pitch (sensibilité 0.002 rad/pixel, pitch clampé).
- Caméra hauteur ~1.6 u, vitesse 8 u/s ; `uiState === exploring` requis pour navigation.
- `TouchRouter` distingue drag (regard) du tap (réservé Epic 3).

## Cross-Story Dependencies

- Dépend d'Epic 1 (SceneManager, bootstrap, constants, déploiement).
- 2.2 dépend de 2.1 (géométries) ; 2.3 dépend de 2.2 (nuage) ; 2.4 dépend de 2.3 (nuage animé).
- Epic 3 s'appuie sur le mapping instanceId et TouchRouter ; ne pas implémenter fiches, légende, JSON pédagogique ici.
