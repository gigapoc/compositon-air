---
title: "Composition de l'air — visualisation 3D web"
status: final
created: 2026-05-26
updated: 2026-05-26
project: App Educ Morgane
sources:
  - _bmad-output/planning-artifacts/briefs/brief-App Educ Morgane-2026-05-26/brief.md
---

# PRD : Composition de l'air — visualisation 3D web

## 0. Document Purpose

Ce PRD définit les exigences produit pour **App Educ Morgane** — un site web pédagogique où des élèves de collège explorent en first-person un volume 3D représentant la composition de l'air. Il s'adresse à Lois, Morgane (enseignante porteuse du besoin) et aux workflows aval (UX, architecture, epics/stories, dev).

Le document s'appuie sur le [Product Brief final du 2026-05-26](../../briefs/brief-App%20Educ%20Morgane-2026-05-26/brief.md) et son [addendum](../../briefs/brief-App%20Educ%20Morgane-2026-05-26/addendum.md). Le vocabulaire est ancré au §3 Glossary. Les exigences fonctionnelles sont numérotées globalement (FR-1…FR-N). Les hypothèses non confirmées portent le tag `[ASSUMPTION]`. Le détail technique et les brouillons de contenu vivent dans [addendum.md](./addendum.md).

## 1. Vision

La composition de l'air reste abstraite au collège : invisible, réduite à des pourcentages sur un schéma 2D. Les élèves mémorisent « 78 % / 21 % » sans ressentir l'espace ni percevoir les gaz traces (argon, CO₂).

**App Educ Morgane** propose une expérience web autonome : l'élève se déplace en first-person dans un nuage de particules colorées en mouvement libre. Chaque espèce gaz est modélisée en boules assemblées (N₂, O₂, CO₂) ou en atome isolé (Ar), avec des proportions visuelles qui respectent la réalité pour N₂, O₂ et Ar. Le CO₂ reste repérable grâce à une règle pédagogique dédiée (au moins une particule par zone), tandis que sa proportion réelle (~0,04 %) n'apparaît que dans la fiche.

Inspiré du module Foxar « Composition de l'air », l'outil vise un besoin de classe précis — pas un clone commercial ni une simulation physique. V1 doit être utilisable en séance sur tablette via une URL publique, sans installation ni AR.

**Expérience visée :** « Je traverse un nuage ; surtout du bleu foncé et du rouge, quelques petites boules bleu clair, je peux trouver du CO₂ ; au toucher, je sais ce que c'est et sa part dans l'air. »

## 2. Target User

### 2.1 Jobs To Be Done

**Élève collège (6e → 3e)**
- **Fonctionnel :** visualiser l'air comme un mélange spatial, pas une liste de chiffres.
- **Émotionnel :** ressentir la dominance de l'azote et la rareté des gaz traces.
- **Contextuel :** utiliser une tablette en classe ou en binôme, sans compte ni installation.

**Morgane (enseignante)**
- **Fonctionnel :** lancer une activité pédagogique en moins de 2 minutes (partage d'URL).
- **Contextuel :** remplacer Foxar quand l'AR, la caméra ou l'app tierce compliquent la séance.
- **Pédagogique :** animer une exploration guidée ou autonome, tous niveaux collège.

### 2.2 Non-Users (v1)

- Élèves du primaire ou du lycée (contenu calibré 6e–3e uniquement).
- Grand public ou marché édition (pas de monétisation, pas de compte).
- Utilisateurs recherchant une simulation physique ou de l'AR.

### 2.3 Key User Journeys

**UJ-1. Léa explore le nuage d'air en séance de SVT (5e).**
- **Persona + contexte :** Léa, 12 ans, reçoit l'URL sur la tablette de classe ; la prof a expliqué que l'air est un mélange de gaz invisibles.
- **Entry state :** page web chargée, plein écran, légende minimale visible, pas d'authentification.
- **Path :** Léa avance en first-person dans le volume ; observe surtout des particules bleu foncé (N₂) et rouges (O₂) ; repère quelques petites boules bleu clair (Ar) ; cherche et trouve une particule CO₂ (C gris + 2 O rouges).
- **Climax :** elle touche une particule N₂ — une modale s'ouvre en moins d'une seconde avec nom, formule, proportion (~78 %) et texte adapté collège.
- **Resolution :** elle ferme la modale, continue l'exploration, peut comparer visuellement la rareté de l'argon et du CO₂ avec la dominance de l'azote.
- **Edge case :** si le toucher ne sélectionne aucune particule (doigt entre deux), elle retouche ou se rapproche — le système ne doit pas bloquer la navigation.

**UJ-2. Morgane lance l'activité en début de séance.**
- **Persona + contexte :** Morgane, prof SVT collège, veut une alternative légère à Foxar pour la composition de l'air.
- **Entry state :** tablette ou vidéoprojecteur ; connexion réseau établissement.
- **Path :** elle ouvre l'URL publique sur Chrome ou Safari tablette ; vérifie que la scène 3D charge ; partage l'URL aux élèves (QR code ou lien) ; donne consignes (« repérez les quatre gaz, notez les proportions »).
- **Climax :** en moins de 2 minutes, toute la classe accède à la même expérience sans installation.
- **Resolution :** elle circule, anime les échanges ; les élèves s'appuient sur les fiches particule pour verbaliser les proportions.

## 3. Glossary

- **Particule** — Représentation 3D d'une molécule ou d'un atome de gaz dans la scène. Types : Particule N₂, Particule O₂, Particule Ar, Particule CO₂.
- **Particule N₂** — Deux sphères bleu foncé fusionnées ; modèle la molécule de diazote.
- **Particule O₂** — Deux sphères rouges fusionnées ; modèle la molécule de dioxygène.
- **Particule Ar** — Une petite sphère bleu clair isolée ; modèle l'atome d'argon (gaz noble monoatomique).
- **Particule CO₂** — Un atome de carbone gris central et deux atomes d'oxygène rouges alignés ; modèle la molécule de dioxyde de carbone.
- **Scène** — Volume 3D plein écran contenant l'ensemble des Particules en mouvement libre.
- **Zone explorable** — Sous-volume de la Scène que l'élève peut atteindre en navigation first-person. `[ASSUMPTION]` : partition spatial définie en implémentation (ex. secteur cubique) — voir addendum.
- **Fiche particule** — Modale affichée au clic/touch sur une Particule : nom du gaz, formule chimique, proportion dans l'air, texte pédagogique court (vocabulaire 6e–3e).
- **Navigation first-person** — Déplacement du point de vue de l'élève à l'intérieur de la Scène, comme une promenade dans le nuage.
- **Légende** — Élément UI minimal indiquant la correspondance couleurs/formes ↔ espèces gaz.
- **Proportion stricte (scène)** — Nombre de Particules d'une espèce calibré pour refléter ~78 % N₂, ~21 % O₂, ~0,9 % Ar dans la Scène.
- **Règle CO₂ option B** — La Scène garantit ≥ 1 Particule CO₂ par Zone explorable ; la densité visuelle du CO₂ ne reflète pas la proportion réelle ; la Fiche particule CO₂ affiche ~0,04 %.

## 4. Features

### 4.1 Scène 3D immersive

**Description :** Au chargement, l'élève entre dans une Scène 3D occupant l'écran (tablette prioritaire). Le fond et l'éclairage mettent en valeur le nuage de Particules. Aucune réalité augmentée. Visualisation pédagogique simplifiée — pas de simulation physique (pas de collisions réalistes, pas de thermodynamique). Realise UJ-1, UJ-2.

**Functional Requirements :**

#### FR-1: Affichage Scène 3D plein écran

Le système affiche une Scène 3D interactive en plein écran dès le chargement de l'URL, sans authentification ni étape d'onboarding obligatoire. Realise UJ-1, UJ-2.

**Consequences (testable) :**
- La Scène occupe la viewport tablette sans barre d'application native requise.
- Le chargement initial affiche un état utilisable (Scène + Particules visibles) sur Chrome et Safari tablette récents.

**Out of Scope :**
- AR, caméra device, mode hors-ligne.

#### FR-2: Mouvement libre des Particules

Les Particules se déplacent en mouvement libre continu dans le volume de la Scène (animation pédagogique simplifiée). Realise UJ-1.

**Consequences (testable) :**
- Les Particules ne sont pas statiques après le chargement.
- Le mouvement reste lisible sur tablette (pas de flicker massif ni de densité illisible).

**Out of Scope :**
- Simulation physique réaliste (diffusion, pression, temperature).

**Notes :** Distribution aléatoire homogène dans le volume — voir addendum.

### 4.2 Particules et proportions gaz

**Description :** La Scène contient exactement quatre espèces : Particule N₂, Particule O₂, Particule Ar, Particule CO₂. Les codages couleur et forme suivent la convention du brief (CPK simplifié). N₂, O₂ et Ar respectent des Proportions strictes en scène. Le CO₂ suit la Règle CO₂ option B. Realise UJ-1.

**Functional Requirements :**

#### FR-3: Particules N₂, O₂, Ar à proportions strictes

Le système génère des Particules N₂ (~78 %), Particule O₂ (~21 %) et Particule Ar (~0,9 %) en Proportion stricte relative à l'ensemble des Particules de la Scène. Realise UJ-1.

**Consequences (testable) :**
- Particule N₂ : deux sphères bleu foncé fusionnées ; visuellement dominantes.
- Particule O₂ : deux sphères rouges fusionnées ; clairement minoritaires vs N₂ (ratio ~4 N₂ pour 1 O₂ perçu).
- Particule Ar : petite sphère bleu clair isolée ; rares mais visibles lors de l'exploration.
- Les proportions en Fiche particule affichent ~78 %, ~21 %, ~0,9 % (arrondi pédagogique ~1 % pour Ar accepté).

#### FR-4: Particule CO₂ repérable (Règle CO₂ option B)

Le système place au moins une Particule CO₂ (C gris + 2 O rouges) dans chaque Zone explorable. La densité visuelle du CO₂ en Scène ne reflète pas la proportion réelle. Realise UJ-1.

**Consequences (testable) :**
- Un élève explorant une Zone explorable peut trouver au moins une Particule CO₂ sans quitter cette zone.
- La Fiche particule CO₂ affiche ~0,04 % et qualifie le CO₂ de gaz trace, avec explication que la Scène en montre davantage pour la repérabilité.

**Out of Scope :**
- CO₂ à proportion stricte en scène (option A rejetée — voir decision log brief D12).
- Autres gaz traces (Ne, He, CH₄, polluants).

#### FR-5: Distinction visuelle Ar vs N₂

Particule Ar et Particule N₂ sont distinguables sans ambiguïté : Ar = petite sphère bleu clair isolée ; N₂ = deux sphères bleu foncé fusionnées. Realise UJ-1.

**Consequences (testable) :**
- Un observateur formé par la Légende identifie Ar et N₂ sans fiche ouverte.

### 4.3 Navigation first-person

**Description :** L'élève se déplace en Navigation first-person à l'intérieur du nuage. Les contrôles sont optimisés tablette. Le choix du mécanisme exact (joystick, double-touch, etc.) est une open question UX — voir §8. Realise UJ-1.

**Functional Requirements :**

#### FR-6: Déplacement first-person fluide

L'élève peut avancer, reculer et orienter son regard dans la Scène via des contrôles tactiles tablette. Realise UJ-1.

**Consequences (testable) :**
- Le déplacement permet d'atteindre plusieurs Zones explorables sans rechargement.
- L'interaction touch pour naviguer n'empêche pas le touch pour ouvrir une Fiche particule (distinction gestuelle ou mode explicite documentée en UX).
- Performance perçue fluide sur tablette cible (pas de saccades prolongées bloquant l'exploration).

**Notes :** `[NOTE FOR PM]` Prototyper joystick + regard au toucher en priorité — addendum.

### 4.4 Fiches particule

**Description :** Au clic ou touch sur une Particule, une Fiche particule modale s'affiche avec les informations pédagogiques de l'espèce touchée. Realise UJ-1.

**Functional Requirements :**

#### FR-7: Ouverture Fiche particule au touch

L'élève ouvre une Fiche particule en touchant (ou cliquant) une Particule sélectionnée via raycast ou mécanisme équivalent. Realise UJ-1.

**Consequences (testable) :**
- La Fiche s'affiche en moins de 1 seconde après sélection réussie.
- La Fiche est fermable et l'élève reprend la Navigation first-person.

#### FR-8: Contenu Fiche particule

Chaque Fiche particule affiche : nom du gaz, formule chimique, proportion dans l'air, texte court adapté au collège (6e–3e). Realise UJ-1.

**Consequences (testable) :**
- Quatre fiches distinctes couvrant N₂, O₂, Ar, CO₂.
- Textes en français ; vocabulaire accessible 6e minimum.
- Fiche CO₂ inclut proportion réelle ~0,04 % et mention gaz trace (cohérent Règle CO₂ option B).
- Contenu basé sur brouillon addendum — validation Morgane avant gel.

### 4.5 Interface et légende

**Description :** Interface minimaliste en français. Une Légende rappelle couleurs et formes des quatre espèces sans surcharger l'écran. Realise UJ-1, UJ-2.

**Functional Requirements :**

#### FR-9: Légende des espèces

Le système affiche une Légende permanente ou accessible en un geste, listant les quatre espèces avec leur codage visuel (couleur/forme). Realise UJ-1.

**Consequences (testable) :**
- La Légende couvre N₂, O₂, Ar, CO₂.
- La Légende reste lisible sur tablette sans masquer la majorité de la Scène.

#### FR-10: Interface en français

Tous les libellés UI, Fiches particule et Légende sont en français. Realise UJ-1, UJ-2.

**Consequences (testable) :**
- Aucune chaîne UI en anglais en v1.
- Pas de sélecteur de langue en v1.

### 4.6 Déploiement et accès

**Description :** Application web statique accessible via URL publique, utilisable en classe sans installation. Realise UJ-2.

**Functional Requirements :**

#### FR-11: Accès URL publique

Morgane et les élèves accèdent à l'application via une URL publique HTTPS, sans compte, sans téléchargement d'app native. Realise UJ-2.

**Consequences (testable) :**
- URL partageable (lien direct, QR code).
- Fonctionne sur Chrome et Safari tablette sans plugin.
- Morgane peut lancer une séance en moins de 2 minutes (chargement URL → Scène utilisable).

**Out of Scope :**
- Authentification, LMS integration, mode hors-ligne.

## 5. Non-Goals (Explicit)

- **Réalité augmentée** — hors scope v1 ; simplifie déploiement classe (D4).
- **Simulation physique** — pas de modèle moléculaire dynamique réaliste ; visualisation pédagogique uniquement (D1).
- **Bibliothèque multi-modules** — un seul module « composition de l'air », pas clone Foxar complet (D5).
- **Quiz, gamification, progression** — pas d'évaluation intégrée v1.
- **Authentification et comptes élèves** — accès anonyme par URL.
- **Mode hors-ligne** — connexion requise pour charger l'application.
- **Autres gaz traces et polluants** — quatre espèces uniquement v1 (D7).
- **Produit commercial / monétisation** — outil de classe, pas marketplace édition.
- **Internationalisation** — français seul v1 (A5).

## 6. MVP Scope

### 6.1 In Scope

- Site web responsive, **optimisé tablette**, **URL publique** (FR-11)
- Scène 3D first-person avec Particules en mouvement libre (FR-1, FR-2, FR-6)
- Quatre espèces avec codage visuel défini (FR-3, FR-4, FR-5)
- Règle CO₂ option B (FR-4)
- Clic/touch → Fiche particule (FR-7, FR-8)
- Légende minimale + UI français (FR-9, FR-10)
- Contenu pédagogique collège 6e–3e

### 6.2 Out of Scope for MVP

| Exclusion | Raison | Report |
|-----------|--------|--------|
| AR | Complexité classe, non requis pédagogiquement v1 | — |
| Simulation physique | Hors intention pédagogique | — |
| Quiz / gamification | Scope classe minimal | v2+ si besoin |
| Auth / comptes | Friction déploiement | — |
| Hors-ligne | Effort infra disproportionné v1 | — |
| Autres gaz | Focus pédagogique 4 espèces | v3 variantes |
| Fiches différenciées par niveau | v1 texte unique 6e–3e | **v2** |
| Air pollué / autres atmosphères | Extension contenu | **v3** |

## 7. Success Metrics

**Primary**

- **SM-1 : Identification des quatre gaz** — Après une séance, ≥ 80 % des élèves interrogés associent correctement couleur/forme → N₂, O₂, Ar, CO₂. Valide FR-3, FR-4, FR-5, FR-9.
- **SM-2 : Proportions verbalisées** — Élèves citent proportions approximatives : ~78 % N₂, ~21 % O₂, ~1 % Ar, trace CO₂. Valide FR-3, FR-8.
- **SM-3 : Dominance visuelle perçue** — Les élèves décrivent l'azote comme dominant et argon/CO₂ comme rares à l'exploration. Valide FR-3, FR-4.

**Secondary**

- **SM-4 : CO₂ repérable** — Dans chaque Zone explorable testée, un élève trouve une Particule CO₂ en moins de 3 minutes d'exploration guidée. Valide FR-4.
- **SM-5 : Réactivité fiche** — Fiche particule visible en < 1 s après touch réussi. Valide FR-7.
- **SM-6 : Déploiement classe** — Morgane lance l'activité (URL → classe en exploration) en < 2 min. Valide FR-11, UJ-2.

**Counter-metrics (do not optimize)**

- **SM-C1 : Fidélité physique stricte du CO₂ en scène** — Ne pas augmenter la densité CO₂ au-delà du minimum repérable par zone ; la vérité pédagogique est dans la Fiche (~0,04 %). Contrebalance tentation d'« ajouter du réalisme » visuel.
- **SM-C2 : Complexité UI** — Ne pas ajouter de menus, quiz ou onboarding multi-écrans qui allongent le time-to-explore au-delà de 2 min. Contrebalance SM-6.

## 8. Cross-Cutting NFRs

### Plateforme

- **Cible v1 :** tablettes Chrome et Safari (iPad et Android récents) ; desktop secondaire acceptable mais non optimisé.
- **Responsive :** layout utilisable en paysage tablette ; pas de casse majeure portrait.
- **Hébergement :** site statique, URL publique HTTPS — détail technique en addendum.

### Performance

- Scène interactive maintenue à framerate fluide perçu sur tablette milieu de gamme (objectif : pas de freeze > 500 ms lors de la navigation).
- Fiche particule : time-to-display < 1 s (SM-5).

### Accessibilité (v1 proportionnée)

- Touch targets suffisants pour doigt enfant/adolescent sur Particules et contrôles navigation.
- Contraste texte Fiche particule lisible sur fond modale.
- `[ASSUMPTION]` : conformité WCAG complète non exigée v1 outil de classe ; revue UX si usage élargi.

### Sécurité et vie privée

- Pas de collecte de données personnelles v1 (pas de auth, pas de analytics nominatives requis).
- URL publique en lecture seule — pas de surface admin v1.

## 9. Open Questions

1. **Contrôles first-person tablette** — Joystick virtuel vs double-touch vs zone tactile dédiée ? Décision UX avant implémentation ; recommandation : prototyper joystick + regard au toucher (addendum). Non bloquant pour cadrage FR-6.
2. **Définition implémentation « Zone explorable »** — Granularité spatiale pour la Règle CO₂ option B (taille de secteur, nombre de zones). À trancher en architecture.
3. **Validation textes Fiche particule** — Morgane valide-t-elle le brouillon addendum tel quel ou souhaite-t-elle des variantes par niveau (report v2) ?

## 10. Assumptions Index

- **A5 — Français uniquement v1** (§4.5, §5) — confirmé brief ; pas d'i18n.
- **A7 — Chrome + Safari tablette** (§8 Plateforme) — inféré des critères de succès brief.
- **A8 — Zone explorable partitionnée en implémentation** (§3 Glossary, FR-4) — précision spatiale laissée à architecture.
- **A9 — Textes fiches du addendum comme base acceptable v1** (FR-8) — validation Morgane recommandée avant gel contenu.
