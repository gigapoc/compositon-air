---
title: 'Epic 2 — Explorer la composition de l''air en immersion'
type: 'feature'
created: '2026-05-26'
status: 'done'
baseline_commit: 'd47abd6f5ad75bdd3fbf53e88bf784a9abd952de'
context:
  - _bmad-output/implementation-artifacts/epic-2-context.md
  - _bmad-output/implementation-artifacts/spec-1-epic-1-acceder-experience-3d.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La scène Epic 1 affiche un volume vide sans particules ni navigation. L'élève ne peut pas percevoir la composition réelle de l'air ni s'y déplacer en immersion.

**Approach:** Ajouter quatre géométries moléculaires distinctes, générer un nuage instancié (~3064 particules) avec proportions strictes et CO₂ par zone, animer le mouvement libre, puis brancher la navigation first-person tactile (joystick + regard) sur le bootstrap existant.

## Boundaries & Constraints

**Always:** InstancedMesh par espèce ; constantes depuis `scene.constants.ts` ; pas de moteur physique ; ombres désactivées ; DPR max 2 ; `TouchRouter` sépare drag/tap ; caméra ~1.6 u, vitesse 8 u/s, sensibilité 0.002 ; spinner jusqu'à `ParticleField.init()` résolu.

**Ask First:** Réduction `N_TOTAL` à 2000 si perf tablette insuffisante ; choix rebond vs wrap pour animation.

**Never:** Fiches particule, légende, JSON pédagogique, `ParticlePicker` fonctionnel (Epic 3) ; `PointerLockControls` principal tablette ; hardcoder couleurs hors constants ; backend/auth.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Boot avec nuage | WebGL OK, Epic 1 bootstrap | Spinner puis ~3064 particules visibles, wireframe volume conservé | Erreur init → message FR existant |
| Proportions | `N_TOTAL=3000` | floor proportions N₂/O₂/Ar + reste→N₂ ; exactement 64 CO₂ hors quota | Tests unitaires échouent si écart |
| CO₂ par zone | Grille 4×4×4 | 1 CO₂ par cellule, position aléatoire intra-cellule | Garanti par algorithme ZoneGrid |
| Animation | Boucle RAF active | Particules en mouvement continu, rebond/wrap aux parois | Pas de freeze > 500 ms au boot |
| Navigation tablette | `uiState=exploring`, touch | Joystick gauche déplace, drag droite oriente (pitch clampé) | Tap enregistré mais sans action pick v1 |
| Desktop bonus | Clavier/souris | WASD + souris regard optionnels | Non bloquant si absent |
| Resize | Rotation fenêtre | Caméra, renderer, joystick repositionnés | N/A |

</frozen-after-approval>

## Code Map

- `src/config/scene.constants.ts` — couleurs, proportions, N_TOTAL, MOVE_SPEED, LOOK_SENSITIVITY (existant, étendre si besoin)
- `src/scene/geometries/*.geometry.ts` — 4 géométries fusionnées N₂, O₂, Ar, CO₂
- `src/scene/ZoneGrid.ts` — partition 4×4×4, placement CO₂ par cellule, helpers position
- `src/scene/ParticleField.ts` — InstancedMesh, génération positions/proportions, animation, mapping instanceId
- `src/scene/SceneManager.ts` — intégrer ParticleField, exposer caméra/scène pour contrôles
- `src/controls/FirstPersonController.ts` — déplacement WASD/joystick, regard souris/drag
- `src/controls/TouchRouter.ts` — routage touch gauche/droite, distinction drag vs tap
- `src/ui/VirtualJoystick.ts` — joystick DOM moitié gauche
- `src/app/bootstrap.ts` — init ParticleField, contrôles, boucle update+render
- `src/ui/styles.css` — styles joystick overlay
- `src/__tests__/zoneGrid.test.ts` — tests ZoneGrid et proportions
- `package.json` — script `test` (vitest)

## Tasks & Acceptance

**Execution:**
- [x] `src/scene/geometries/n2.geometry.ts` — deux sphères bleu foncé fusionnées (#1e3a5f) — Story 2.1
- [x] `src/scene/geometries/o2.geometry.ts` — deux sphères rouges fusionnées (#dc2626) — Story 2.1
- [x] `src/scene/geometries/ar.geometry.ts` — petite sphère bleu clair (#7dd3fc) — Story 2.1
- [x] `src/scene/geometries/co2.geometry.ts` — C gris + 2 O rouges alignés — Story 2.1
- [x] `src/scene/ZoneGrid.ts` — grille 64 zones, random point in cell, index zone — Story 2.2
- [x] `src/scene/ParticleField.ts` — InstancedMesh×4, proportions, 64 CO₂, mapping instanceId — Story 2.2
- [x] `src/scene/SceneManager.ts` — brancher ParticleField, méthode update(delta) — Stories 2.2–2.3
- [x] `src/scene/ParticleField.ts` — vélocités, rebond/wrap parois, update loop — Story 2.3
- [x] `src/controls/TouchRouter.ts` — zones gauche/droite, drag vs tap — Story 2.4
- [x] `src/ui/VirtualJoystick.ts` — nipple maison moitié gauche — Story 2.4
- [x] `src/controls/FirstPersonController.ts` — joystick+WASD, regard drag/souris, pitch clamp — Story 2.4
- [x] `src/app/bootstrap.ts` — uiState exploring, init modules, delta time loop — Story 2.4
- [x] `src/ui/styles.css` — overlay joystick, touch-action none canvas — Story 2.4
- [x] `src/__tests__/zoneGrid.test.ts` + vitest config — tests ZoneGrid, proportions, mapping — Story 2.2
- [x] `package.json` — vitest devDep, script test — infra tests

**Acceptance Criteria:**
- Given scène Epic 1, when géométries créées, then N₂/O₂/Ar/CO₂ visuellement distincts avec couleurs depuis constants (FR5)
- Given ZoneGrid 4×4×4, when ParticleField.init(), then 3000 N₂/O₂/Ar aux proportions strictes + 64 CO₂ (1/zone), InstancedMesh par type, mapping instanceId disponible (FR3, FR4)
- Given nuage généré, when animation tourne, then particules mobiles avec rebond/wrap, 60 FPS cible sans ombres (FR2)
- Given uiState exploring, when touch tablette, then joystick gauche + drag droite, caméra 1.6 u / 8 u/s, plusieurs zones atteignables sans reload (FR6, NFR4, NFR6)
- Given npm test, when tests ZoneGrid/proportions, then tous passent

## Spec Change Log

## Design Notes

Géométries : utiliser `BufferGeometryUtils.mergeGeometries` (three/addons) pour fusionner sphères par molécule. Normaliser échelle (~0.6 u max) pour lisibilité tablette.

ParticleField : un InstancedMesh par espèce (4 meshes). Matrice instance mise à jour chaque frame pour animation. Conserver wireframe volume Epic 1 en arrière-plan.

FirstPersonController : yaw illimité, pitch clamp ±80°. Collision caméra : rester dans ±SCENE_HALF avec marge 0.5 u.

TouchRouter : seuil drag 8 px pour distinguer tap (Epic 3). En v1 tap = no-op silencieux.

## Verification

**Commands:**
- `npm install` — expected: deps OK incl. vitest
- `npm test` — expected: exit 0, ZoneGrid/proportions/mapping passent
- `npm run build` — expected: exit 0, dist/ généré
- `npm run preview` — expected: nuage animé + navigation fonctionnels

**Manual checks (if no CLI):**
- Dev server : particules animées visibles, joystick gauche déplace, drag droite oriente
- Atteindre 3+ zones différentes sans rechargement
- Vérifier qu'au moins un CO₂ est visible par quadrant de volume

## Suggested Review Order

**Nuage de particules**

- Génération proportions strictes + 64 CO₂ par zone via InstancedMesh
  [`ParticleField.ts:35`](../../src/scene/ParticleField.ts#L35)

- Partition volume 4×4×4 et placement aléatoire intra-cellule
  [`ZoneGrid.ts:18`](../../src/scene/ZoneGrid.ts#L18)

**Géométries moléculaires**

- Quatre espèces distinctes, couleurs depuis constants uniquement
  [`n2.geometry.ts:6`](../../src/scene/geometries/n2.geometry.ts#L6)

**Navigation first-person**

- Joystick gauche + regard drag droite, WASD bonus desktop
  [`bootstrap.ts:67`](../../src/app/bootstrap.ts#L67)

- Routage touch moitié écran, seuil drag 8 px pour tap futur
  [`TouchRouter.ts:58`](../../src/controls/TouchRouter.ts#L58)

**Intégration scène**

- Boucle delta : animation particules + déplacement caméra
  [`SceneManager.ts:88`](../../src/scene/SceneManager.ts#L88)

**Tests et config**

- Proportions, zones et total 3064 particules
  [`zoneGrid.test.ts:14`](../../src/__tests__/zoneGrid.test.ts#L14)
