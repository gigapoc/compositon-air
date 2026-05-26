# Epic 1 Context: Accéder à l'expérience 3D en classe

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Permettre à Morgane et aux élèves d'ouvrir une URL publique HTTPS et d'entrer immédiatement dans une scène 3D plein écran utilisable, sans compte ni installation. Cet epic pose le socle technique (scaffold Vite + Three.js, bootstrap, SceneManager) et la chaîne de déploiement statique pour que la séance démarre en moins de 2 minutes.

## Stories

- Story 1.1: Initialiser le projet depuis le starter template
- Story 1.2: Afficher la scène 3D plein écran au chargement
- Story 1.3: Publier l'application sur une URL publique HTTPS

## Requirements & Constraints

- Scène 3D interactive plein écran dès le chargement, sans authentification ni onboarding (FR1).
- Accès via URL publique HTTPS, partageable (lien, QR), Chrome et Safari tablette ; lancement séance < 2 min (FR11).
- Hébergement site statique ; pas de backend, pas d'auth, pas de collecte de données personnelles, pas de surface admin (NFR3, NFR8, NFR9).
- Tablettes Chrome/Safari prioritaires ; layout paysage ; desktop secondaire acceptable (NFR1, NFR2).
- Node.js 20.19+ ou 22.12+ ; Vite 8.x + TypeScript 5.x + Three.js 0.184.0 ; vanilla TS uniquement.
- Spinner DOM pendant l'initialisation ; message d'erreur WebGL en français si indisponible ; pas de crash silencieux.
- `devicePixelRatio` plafonné à 2 ; `window.resize` met à jour caméra et renderer.

## Technical Decisions

- Stack : Vite vanilla-ts + Three.js r184 — pas de React, backend, ni moteur physique.
- Structure modules : `src/{app,config,scene,controls,interaction,ui,content}/` ; constantes centralisées dans `src/config/scene.constants.ts`.
- `SceneManager` : volume cube 40×40×40 u, éclairage, caméra ; bootstrap dans `src/app/bootstrap.ts`, entrée `src/main.ts`.
- Build output `dist/` ; base path `/` ; déploiement Vercel, Netlify ou GitHub Pages (choix Lois).
- Conventions : fichiers classes en `PascalCase.ts`, constantes `SCREAMING_SNAKE`, pas de logique métier dans `main.ts`.

## UX & Interaction Patterns

- Chargement : spinner visible jusqu'à scène prête, puis disparition.
- Erreur WebGL : message plein écran en français, lisible sur tablette.
- Canvas WebGL occupe toute la viewport ; pas d'écran intermédiaire avant la scène.

## Cross-Story Dependencies

- 1.2 dépend de 1.1 (structure projet et constants).
- 1.3 dépend de 1.2 (build production charge une scène utilisable).
- Epics 2 et 3 s'appuient sur ce socle ; ne pas implémenter particules, navigation FP, fiches ou légende dans cet epic.
