---
title: 'Epic 1 — Accéder à l''expérience 3D en classe'
type: 'feature'
created: '2026-05-26'
status: 'done'
baseline_commit: 'NO_VCS'
context:
  - _bmad-output/implementation-artifacts/epic-1-context.md
  - _bmad-output/planning-artifacts/architecture.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le projet n'a pas encore de code applicatif. Morgane et les élèves ne peuvent pas ouvrir une URL et entrer dans une scène 3D plein écran sans installation ni compte.

**Approach:** Scaffolder Vite + TypeScript + Three.js à la racine du workspace, implémenter le bootstrap et SceneManager pour une scène 3D bornée plein écran avec gestion chargement/erreurs, puis préparer build statique et documentation de déploiement HTTPS (GitHub Pages par défaut, alternatives documentées).

## Boundaries & Constraints

**Always:** Vite 8 vanilla-ts + Three.js 0.184.0 ; structure `src/{app,config,scene,controls,interaction,ui,content}/` ; `scene.constants.ts` avec bornes volume, `N_TOTAL`, proportions, couleurs hex ; pas de React/backend/physique ; UI et messages en français ; `devicePixelRatio` max 2 ; base path `/`.

**Ask First:** Choix hébergeur final si GitHub Pages ne convient pas (Vercel/Netlify) ; modification des constantes de scène (N_TOTAL, proportions) hors valeurs architecture.

**Never:** Particules, InstancedMesh, navigation first-person, fiches, légende, JSON pédagogique complet (Epics 2–3) ; auth, analytics, backend ; PointerLockControls tablette ; hardcoder textes fiches dans le TS.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Boot réussi | Navigateur WebGL OK, URL `/` | Canvas plein écran, cube 40³ visible, spinner puis disparition | N/A |
| WebGL absent | `WebGLRenderer` échoue ou contexte null | Message français plein écran, pas de canvas vide | Pas de crash silencieux |
| Resize | Rotation/redimensionnement fenêtre | Caméra aspect + renderer size mis à jour | N/A |
| Build prod | `npm run build` | `dist/` généré sans erreur | Échec build = corriger avant deploy |
| Preview local | `npm run preview` | Même comportement que prod sur localhost | N/A |

</frozen-after-approval>

## Code Map

- `package.json` — dépendances Vite, TS, Three.js ; scripts dev/build/preview
- `vite.config.ts` — config build statique, base `/`
- `index.html` — canvas container, spinner DOM, zone erreur WebGL
- `src/main.ts` — point d'entrée minimal, délègue à bootstrap
- `src/app/bootstrap.ts` — init WebGL, SceneManager, spinner, boucle render
- `src/config/scene.constants.ts` — bornes volume, N_TOTAL, proportions, couleurs
- `src/scene/SceneManager.ts` — scène Three.js, caméra, lumières, volume 40³
- `src/ui/styles.css` — plein écran, spinner, message erreur
- `.github/workflows/deploy.yml` — CI build + deploy GitHub Pages (optionnel si repo GitHub)
- `README.md` — commandes, déploiement, URL prod placeholder, QR doc

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html` — scaffold Vite vanilla-ts + three@0.184.0 à la racine — base Story 1.1
- [x] `src/config/scene.constants.ts` — constantes SCENE_SIZE, N_TOTAL, proportions N2/O2/Ar, couleurs hex — source unique vérité
- [x] Dossiers vides `src/{controls,interaction,ui/content}` + stubs `.gitkeep` si besoin — structure architecture
- [x] `src/scene/SceneManager.ts` — cube 40³ (wireframe ou faces légères), PerspectiveCamera, lumières, resize + DPR cap 2 — Story 1.2
- [x] `src/app/bootstrap.ts` — détection WebGL, spinner, loop RAF, gestion erreur FR — Story 1.2
- [x] `src/main.ts` — import bootstrap uniquement — pattern architecture
- [x] `src/ui/styles.css` — viewport plein écran, spinner centré, `.webgl-error` — UX chargement
- [x] `.github/workflows/deploy.yml` — npm ci, build, deploy Pages — Story 1.3
- [x] `README.md` — build, preview, déploiement HTTPS, partage lien/QR, pas d'auth — Story 1.3

**Acceptance Criteria:**
- Given Node 20.19+, when `npm install && npm run dev && npm run build`, then aucune erreur et structure `src/` conforme
- Given URL ouverte sans auth, when WebGL disponible, then canvas plein écran avec scène 3D bornée et spinner qui disparaît
- Given WebGL indisponible, when page charge, then message français plein écran sans crash
- Given resize fenêtre, when événement resize, then renderer et caméra mis à jour avec DPR ≤ 2
- Given `npm run build`, when déployé sur hébergeur statique HTTPS, then `/` charge la scène ; README documente deploy et partage

## Spec Change Log

- **2026-05-26 — revue patch** : `BASE_PATH` pour GitHub Pages project sites ; grille `ZONE_GRID_SIZE` corrigée ; `.nvmrc` ajouté pour Node 22.

## Suggested Review Order

**Bootstrap et cycle de vie**

- Point d'entrée minimal qui délègue tout au bootstrap applicatif
  [`main.ts:1`](../../src/main.ts#L1)

- Détection WebGL, spinner et boucle render avec gestion d'erreur FR
  [`bootstrap.ts:35`](../../src/app/bootstrap.ts#L35)

**Scène 3D**

- Volume 40³, caméra initiale, DPR plafonné et resize
  [`SceneManager.ts:15`](../../src/scene/SceneManager.ts#L15)

**Constantes et déploiement**

- Source unique des bornes, proportions et couleurs de scène
  [`scene.constants.ts:3`](../../src/config/scene.constants.ts#L3)

- Base path dynamique pour GitHub Pages vs hébergeurs racine
  [`vite.config.ts:3`](../../vite.config.ts#L3)

- CI build + deploy avec `BASE_PATH` injecté
  [`deploy.yml:28`](../../.github/workflows/deploy.yml#L28)

## Design Notes

SceneManager v1 : représenter le volume par un `BoxGeometry` wireframe ou faces semi-transparentes légères — suffisant pour Epic 1 sans particules. Caméra initiale à l'intérieur du cube (~hauteur 1.6 u, position (0, 1.6, 8) regardant le centre) prépare Epic 2 navigation.

Déploiement : GitHub Actions + Pages comme chemin par défaut (gratuit, HTTPS). README mentionne Vercel/Netlify en alternative sans config obligatoire.

## Verification

**Commands:**
- `npm install` — expected: lockfile/deps OK
- `npm run build` — expected: exit 0, `dist/index.html` présent
- `npm run preview` — expected: serveur local, scène visible (smoke test manuel)

**Manual checks (if no CLI):**
- Ouvrir dev server : spinner visible brièvement puis scène ; canvas occupe 100% viewport
- Désactiver WebGL (DevTools) : message erreur français affiché
