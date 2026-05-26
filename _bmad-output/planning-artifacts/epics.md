---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: complete
completedAt: 2026-05-26
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-App Educ Morgane-2026-05-26/prd.md
  - _bmad-output/planning-artifacts/architecture.md
---

# App Educ Morgane - Epic Breakdown

## Overview

Ce document décompose les exigences du PRD et de l'architecture en epics et user stories implémentables pour **App Educ Morgane** — visualisation 3D web de la composition de l'air pour le collège.

## Requirements Inventory

### Functional Requirements

FR1: Afficher une Scène 3D interactive en plein écran dès le chargement de l'URL, sans authentification ni onboarding obligatoire (FR-1).

FR2: Animer les Particules en mouvement libre continu dans le volume de la Scène, de façon lisible sur tablette (FR-2).

FR3: Générer des Particules N₂ (~78 %), O₂ (~21 %) et Ar (~0,9 %) en proportion stricte relative à l'ensemble des particules de la Scène (FR-3).

FR4: Placer au moins une Particule CO₂ dans chaque Zone explorable ; la densité visuelle du CO₂ en scène ne reflète pas la proportion réelle ; la fiche CO₂ affiche ~0,04 % (FR-4, Règle CO₂ option B).

FR5: Distinguer visuellement Particule Ar (petite sphère bleu clair isolée) et Particule N₂ (deux sphères bleu foncé fusionnées) sans ambiguïté (FR-5).

FR6: Permettre à l'élève de se déplacer en navigation first-person (avancer, reculer, orienter le regard) via contrôles tactiles tablette, sans bloquer le touch pour ouvrir une fiche (FR-6).

FR7: Ouvrir une Fiche particule en touchant/cliquant une Particule sélectionnée (raycast ou équivalent), en moins de 1 seconde ; fiche fermable ; reprise de la navigation (FR-7).

FR8: Afficher dans chaque Fiche particule : nom du gaz, formule chimique, proportion dans l'air, texte court adapté collège 6e–3e ; quatre fiches distinctes (N₂, O₂, Ar, CO₂) en français ; fiche CO₂ avec proportion réelle et mention gaz trace (FR-8).

FR9: Afficher une Légende permanente ou accessible en un geste, listant les quatre espèces avec codage visuel (couleur/forme), lisible sans masquer la majorité de la Scène (FR-9).

FR10: Afficher tous les libellés UI, fiches et légende en français ; pas de sélecteur de langue en v1 (FR-10).

FR11: Accéder à l'application via une URL publique HTTPS, sans compte ni app native ; partageable (lien, QR) ; Chrome et Safari tablette ; lancement séance en moins de 2 minutes (FR-11).

### NonFunctional Requirements

NFR1: Cible v1 — tablettes Chrome et Safari (iPad et Android récents) ; desktop secondaire acceptable, non optimisé.

NFR2: Layout responsive utilisable en paysage tablette ; pas de casse majeure en portrait.

NFR3: Hébergement en site statique avec URL publique HTTPS.

NFR4: Scène interactive à framerate fluide perçu sur tablette milieu de gamme ; pas de freeze > 500 ms lors de la navigation.

NFR5: Fiche particule affichée en moins de 1 seconde après touch réussi (SM-5).

NFR6: Touch targets suffisants pour doigt enfant/adolescent sur particules et contrôles de navigation.

NFR7: Contraste texte des fiches particule lisible sur fond modale.

NFR8: Pas de collecte de données personnelles v1 (pas d'auth, pas d'analytics nominatives requises).

NFR9: URL publique en lecture seule ; pas de surface admin v1.

### Additional Requirements

- **Starter template (Epic 1, Story 1)** : `npm create vite@latest app-educ-morgane -- --template vanilla-ts` puis `npm install three@0.184.0` ; Node.js 20.19+ ou 22.12+.
- Stack : Vite 8.x + TypeScript 5.x + Three.js r184 ; vanilla TS (pas React/Next.js).
- Pas de base de données, pas d'API REST, pas d'auth, pas de moteur physique (Rapier/Cannon).
- **InstancedMesh** par géométrie fusionnée (N₂, O₂, Ar, CO₂) pour performance tablette.
- Volume scène : cube 40×40×40 u ; grille zones **4×4×4 = 64** cellules de 10×10×10 u.
- Génération particules : N_total = 3000 (N₂/O₂/Ar par proportions strictes) + **64 CO₂** (1 par zone, hors quota 3000).
- Positions aléatoires uniformes ; rejet collision visuelle (distance min 0,8 u, max 10 tentatives).
- Animation : vélocité faible ; rebond/wrap sur parois — pédagogique, pas physique.
- **Contrôles tablette** : moitié gauche = joystick virtuel ; moitié droite = drag regard (si `uiState === exploring`) ; tap canvas = raycast fiche ; modale ouverte = désactive joystick et regard.
- Caméra : hauteur ~1,6 u ; vitesse 8 u/s ; sensibilité regard 0,002 rad/pixel ; desktop bonus WASD+souris.
- **uiState** : `exploring` | `sheetOpen` — bloque navigation quand fiche ouverte.
- Contenu pédagogique : `src/content/particles-fr.json` (4 espèces `N2`, `O2`, `Ar`, `CO2`) ; validation Morgane avant gel.
- Constantes centralisées : `src/config/scene.constants.ts` (proportions, couleurs, bornes) — pas de magic numbers dispersés.
- Séparation canvas WebGL / UI DOM (modale, légende, joystick) ; événements custom `particle:selected`.
- Performance : `devicePixelRatio` cap à 2 ; ombres désactivées ; antialias selon tests ; cible 60 FPS (30 min acceptable).
- Chargement : spinner DOM jusqu'à `ParticleField.init()` ; erreur WebGL = message français plein écran.
- Déploiement : build `dist/` ; Vercel / Netlify / GitHub Pages ; base path `/` ; CI optionnelle (GitHub Actions).
- Structure modules : `scene/`, `controls/`, `interaction/`, `ui/`, `content/`, `config/`.
- Tests unitaires prioritaires : `ZoneGrid`, proportions, mapping `instanceId`.
- Anti-patterns : pas de textes fiches hardcodés en TS ; pas de `PointerLockControls` principal tablette ; pas de backend v1.

### UX Design Requirements

_Aucune spécification UX formelle séparée._ Les exigences d'interaction proviennent du PRD (FR-6, FR-9) et de l'architecture (joystick + regard, routage touch documenté). Une spec UX dédiée pourra compléter les stories de navigation si créée ultérieurement.

### FR Coverage Map

FR1: Epic 1 — Scène 3D plein écran au chargement
FR2: Epic 2 — Mouvement libre des particules
FR3: Epic 2 — Proportions strictes N₂, O₂, Ar
FR4: Epic 2 — CO₂ repérable (≥1 par zone)
FR5: Epic 2 — Distinction visuelle Ar vs N₂
FR6: Epic 2 — Navigation first-person tablette
FR7: Epic 3 — Ouverture fiche au touch
FR8: Epic 3 — Contenu fiches pédagogiques
FR9: Epic 3 — Légende des espèces
FR10: Epic 3 — Interface en français
FR11: Epic 1 — Accès URL publique HTTPS

## Epic List

### Epic 1: Accéder à l'expérience 3D en classe
Morgane et les élèves ouvrent une URL publique et entrent immédiatement dans une scène 3D plein écran utilisable, sans compte ni installation.
**FRs couverts :** FR1, FR11
**NFRs clés :** NFR1, NFR2, NFR3, NFR8, NFR9
**Notes :** Scaffold Vite + Three.js ; `SceneManager` + bootstrap ; déploiement statique HTTPS ; spinner chargement ; message erreur WebGL en français.

### Epic 2: Explorer la composition de l'air en immersion
L'élève se déplace en first-person dans un nuage de particules animées dont les proportions et le codage visuel reflètent la réalité pédagogique (dont CO₂ repérable par zone).
**FRs couverts :** FR2, FR3, FR4, FR5, FR6
**NFRs clés :** NFR4, NFR6
**Notes :** `ParticleField`, `ZoneGrid`, géométries fusionnées, `InstancedMesh`, `FirstPersonController`, `TouchRouter`, `VirtualJoystick` ; budget perf 3000+64 instances.

### Epic 3: Comprendre chaque gaz en l'explorant
L'élève touche une particule pour ouvrir une fiche pédagogique en français, consulte la légende, et verbalise les proportions — sans quitter l'expérience immersive.
**FRs couverts :** FR7, FR8, FR9, FR10
**NFRs clés :** NFR5, NFR7
**Notes :** `ParticlePicker`, `ParticleSheet`, `particles-fr.json`, `Legend` ; `uiState` sheetOpen ; validation contenu Morgane.

## Epic 1: Accéder à l'expérience 3D en classe

Morgane et les élèves ouvrent une URL publique et entrent immédiatement dans une scène 3D plein écran utilisable, sans compte ni installation.

### Story 1.1: Initialiser le projet depuis le starter template

En tant que **développeur**,
je veux un projet Vite + TypeScript + Three.js structuré selon l'architecture,
afin de poser une base cohérente pour toute l'équipe et les agents IA.

**Acceptance Criteria:**

**Given** un environnement Node.js 20.19+ ou 22.12+
**When** le projet est créé avec `npm create vite@latest app-educ-morgane -- --template vanilla-ts` et `npm install three@0.184.0`
**Then** le dépôt contient la structure `src/{app,config,scene,controls,interaction,ui,content}/` conforme à l'architecture
**And** `src/config/scene.constants.ts` existe avec les constantes de base (bornes volume, `N_TOTAL`, proportions, couleurs hex)
**And** `npm run dev` et `npm run build` s'exécutent sans erreur
**And** aucune dépendance React, backend ou moteur physique n'est ajoutée

### Story 1.2: Afficher la scène 3D plein écran au chargement

En tant qu'**élève**,
je veux voir une scène 3D immersive dès l'ouverture de la page,
afin de commencer l'exploration sans étape préalable ni compte.

**Acceptance Criteria:**

**Given** l'application chargée sur une tablette Chrome ou Safari en paysage
**When** l'URL est ouverte sans authentification
**Then** un canvas WebGL occupe la viewport en plein écran (FR1)
**And** `SceneManager` affiche un volume 3D borné (cube 40×40×40) avec éclairage et caméra initialisés
**And** un spinner DOM s'affiche pendant l'initialisation puis disparaît une fois la scène prête
**And** si WebGL est indisponible, un message d'erreur en français s'affiche en plein écran (pas de crash silencieux)
**And** `window.resize` met à jour caméra et renderer ; `devicePixelRatio` est plafonné à 2

### Story 1.3: Publier l'application sur une URL publique HTTPS

En tant que **Morgane (enseignante)**,
je veux partager une URL HTTPS stable avec ma classe,
afin de lancer une séance en moins de 2 minutes sans installation (FR11).

**Acceptance Criteria:**

**Given** un build de production `npm run build` produisant `dist/`
**When** l'application est déployée sur un hébergeur statique (Vercel, Netlify ou GitHub Pages) avec HTTPS
**Then** l'URL racine `/` est accessible et charge la scène utilisable (FR11, NFR3)
**And** l'URL est partageable (lien direct et QR code documenté dans le README)
**And** aucune authentification ni plugin n'est requis sur Chrome/Safari tablette
**And** aucune collecte de données personnelles ni surface admin n'est exposée (NFR8, NFR9)
**And** le README documente les commandes build, preview et l'URL de production

---

## Epic 2: Explorer la composition de l'air en immersion

L'élève se déplace en first-person dans un nuage de particules animées dont les proportions et le codage visuel reflètent la réalité pédagogique (dont CO₂ repérable par zone).

### Story 2.1: Modéliser les quatre espèces en géométries 3D distinctes

En tant qu'**élève**,
je veux reconnaître chaque gaz par sa forme et ses couleurs,
afin de les distinguer visuellement avant même d'ouvrir une fiche (FR5).

**Acceptance Criteria:**

**Given** la scène Epic 1 opérationnelle
**When** les géométries sont créées dans `src/scene/geometries/`
**Then** Particule N₂ = deux sphères bleu foncé fusionnées (`#1e3a5f`)
**And** Particule O₂ = deux sphères rouges fusionnées (`#dc2626`)
**And** Particule Ar = une petite sphère bleu clair isolée (`#7dd3fc`)
**And** Particule CO₂ = atome C gris central + deux O rouges alignés
**And** un observateur formé par la légende future peut distinguer Ar et N₂ sans ambiguïté (FR5)
**And** les couleurs et dimensions proviennent de `scene.constants.ts` uniquement

### Story 2.2: Générer le nuage avec proportions strictes et CO₂ par zone

En tant qu'**élève**,
je veux un nuage où l'azote domine, l'oxygène est minoritaire, l'argon est rare, et le CO₂ est trouvable partout,
afin de ressentir les proportions réelles tout en pouvant repérer le dioxyde de carbone (FR3, FR4).

**Acceptance Criteria:**

**Given** `ZoneGrid` partitionnant le volume en grille 4×4×4 (64 zones de 10×10×10 u)
**When** `ParticleField.init()` génère les instances
**Then** exactement `N_TOTAL` (3000) particules N₂/O₂/Ar sont réparties selon les proportions strictes (≈78 % / ≈21 % / ≈0,9 %)
**And** exactement 64 particules CO₂ sont placées (1 par zone, position aléatoire dans chaque cellule), hors quota des 3000 (FR4)
**And** chaque zone contient au moins une Particule CO₂ repérable (SM-4 par construction)
**And** les particules sont rendues via `InstancedMesh` par type de géométrie (performance tablette)
**And** un mapping `instanceId → speciesId` (`N2`, `O2`, `Ar`, `CO2`) est disponible pour la sélection future
**And** des tests unitaires couvrent `ZoneGrid`, les proportions et le mapping instanceId

### Story 2.3: Animer le mouvement libre des particules

En tant qu'**élève**,
je veux voir les particules se déplacer en continu dans le volume,
afin de percevoir l'air comme un mélange dynamique et non une image figée (FR2).

**Acceptance Criteria:**

**Given** le nuage généré (Story 2.2)
**When** la boucle d'animation tourne
**Then** les particules ne sont pas statiques après le chargement (FR2)
**And** chaque particule a une vélocité initiale aléatoire faible avec rebond ou wrap sur les parois du cube (animation pédagogique, pas de physique réaliste)
**And** le mouvement reste lisible sur tablette (pas de flicker massif ni densité illisible)
**And** les ombres Three.js restent désactivées ; le framerate cible 60 FPS (30 minimum acceptable sur tablette milieu de gamme)

### Story 2.4: Naviguer en first-person avec contrôles tactiles tablette

En tant qu'**élève**,
je veux me déplacer et orienter mon regard dans le nuage avec des gestes tactiles naturels,
afin d'explorer plusieurs zones sans recharger la page (FR6).

**Acceptance Criteria:**

**Given** le nuage animé et `uiState === exploring`
**When** l'élève utilise la tablette
**Then** la moitié gauche de l'écran affiche un joystick virtuel (avancer / reculer / strafe) (FR6, NFR6)
**And** la moitié droite permet le drag 1 doigt pour orienter le regard (yaw/pitch clampé, sensibilité 0,002 rad/pixel)
**And** la caméra est à hauteur ~1,6 u avec vitesse de déplacement 8 u/s
**And** l'élève peut atteindre plusieurs zones explorables sans rechargement
**And** la navigation ne provoque pas de freeze > 500 ms perçu (NFR4)
**And** `TouchRouter` distingue drag (regard) du tap (réservé à la sélection — implémentée Epic 3) ; pas de `PointerLockControls` comme mécanisme principal tablette
**And** le desktop secondaire accepte WASD + souris (bonus, non prioritaire QA)

---

## Epic 3: Comprendre chaque gaz en l'explorant

L'élève touche une particule pour ouvrir une fiche pédagogique en français, consulte la légende, et verbalise les proportions — sans quitter l'expérience immersive.

### Story 3.1: Charger le contenu pédagogique des fiches en JSON

En tant que **Morgane**,
je veux que les textes des fiches soient modifiables sans toucher au code 3D,
afin de valider et ajuster le contenu pédagogique avant la séance (FR8).

**Acceptance Criteria:**

**Given** le fichier `src/content/particles-fr.json` avec les 4 espèces
**When** l'application démarre
**Then** le contenu est chargé (fetch ou import Vite statique) avant l'affichage des fiches
**And** chaque entrée contient `id`, `name`, `formula`, `proportionLabel`, `body` en français (vocabulaire 6e–3e)
**And** les 4 `id` requis (`N2`, `O2`, `Ar`, `CO2`) sont présents avec validation runtime minimale
**And** la fiche CO₂ inclut `proportionLabel` ~0,04 % et un texte qualifiant le CO₂ comme gaz trace et expliquant la sur-représentation visuelle en scène (FR8, Règle CO₂ option B)
**And** aucun texte de fiche n'est hardcodé dans le TypeScript (sauf fallback dev documenté)

### Story 3.2: Ouvrir et fermer une fiche particule au touch

En tant qu'**élève**,
je veux toucher une particule pour voir ses informations et fermer la fiche pour continuer à explorer,
afin de relier ce que je vois à ce que j'apprends (FR7, FR8).

**Acceptance Criteria:**

**Given** le nuage interactif et le JSON chargé (Stories 2.2, 3.1)
**When** l'élève effectue un tap sur le canvas (sans drag de navigation)
**Then** `ParticlePicker` exécute un raycast et, en cas de hit, émet `particle:selected` avec le `speciesId` (FR7)
**And** `ParticleSheet` affiche la modale DOM avec nom, formule, proportion et texte de l'espèce touchée en moins de 1 seconde (FR7, FR8, NFR5)
**And** `uiState` passe à `sheetOpen` et désactive joystick et regard (FR7)
**When** l'élève ferme la modale
**Then** `uiState` repasse à `exploring` et la navigation first-person reprend
**And** un tap sans hit ne ouvre pas de modale et ne bloque pas la navigation (pas de feedback négatif bruyant)
**And** le contraste texte/fond de la modale est lisible (NFR7)

### Story 3.3: Afficher la légende et finaliser l'interface en français

En tant qu'**élève**,
je veux une légende claire des couleurs et formes pendant mon exploration,
afin d'identifier les quatre gaz sans aide extérieure (FR9, FR10).

**Acceptance Criteria:**

**Given** les quatre géométries visuelles en scène
**When** l'élève consulte l'interface
**Then** une `Legend` liste N₂, O₂, Ar et CO₂ avec leur codage visuel (couleur/forme) (FR9)
**And** la légende est permanente ou accessible en un geste, lisible en paysage tablette sans masquer la majorité de la scène (FR9, NFR2)
**And** tous les libellés UI (légende, boutons modale, messages système) sont en français sans chaîne anglaise en v1 (FR10)
**And** aucun sélecteur de langue n'est affiché
**And** les touch targets de la légende et des contrôles respectent NFR6
