---
title: "Composition de l'air — visualisation 3D web"
status: final
created: 2026-05-26
updated: 2026-05-26
project: App Educ Morgane
---

# Product Brief : Composition de l'air — visualisation 3D web

## Executive Summary

**App Educ Morgane** est un site web pédagogique où les élèves de collège **se déplacent en first-person** dans un espace 3D rempli de particules représentant la composition de l'air. Chaque espèce est modélisée en boules colorées assemblées, en mouvement libre. N₂, O₂ et Ar respectent les **proportions réelles** ; le CO₂ est **repérable** (au moins une particule par zone) avec la **proportion réelle (~0,04 %)** indiquée uniquement dans la fiche.

Inspiré du module Foxar « Composition de l'air » (N₂ bleu foncé, O₂ rouge, Ar en petites sphères bleu clair), l'outil est une **expérience web autonome** sans AR, optimisée **tablette**, déployée sur **URL publique**. Au clic, l'élève consulte une fiche : nom, formule, rôle, proportion.

V1 utilisable en séance par la classe de Morgane — outil de classe, pas produit commercial. Clarté pédagogique, pas simulation physique.

## The Problem

La composition de l'air reste **abstraite** au collège : invisible, réduite à des pourcentages 2D. Les élèves mémorisent « 78 % / 21 % » sans **ressentir** l'espace ni percevoir les **gaz traces** (argon, CO₂).

- **Élèves (6e → 3e)** — chiffres du cours déconnectés de la réalité spatiale.
- **Morgane** — Foxar excellent mais lourd (AR, caméra, app tierce, contraintes de classe).

**Coût :** l'élève récite sans visualiser la dominance de l'azote, la minorité de l'oxygène, ni la rareté de l'argon et du CO₂.

## The Solution

Site web 3D sur tablette (URL publique) :

1. Volume 3D de particules en mouvement libre (visualisation pédagogique).
2. Répartition : N₂ bleu foncé (~78 %), O₂ rouge (~21 %), Ar petites sphères bleu clair (~0,9 %), CO₂ C gris + 2 O rouges (repérable, proportion réelle en fiche).
3. **Navigation first-person** dans la scène.
4. **Clic/touch** → fiche : nom, formule, proportion, texte adapté collège.

**Expérience visée :** « Je traverse un nuage ; surtout du bleu foncé et du rouge, quelques petites boules bleu clair, je peux trouver du CO₂ ; au toucher, je sais ce que c'est et sa part dans l'air. »

## What Makes This Different

| vs. Foxar | vs. schéma 2D |
|-----------|---------------|
| Web autonome, pas d'AR | Immersion spatiale |
| Focus composition de l'air | Proportions visibles, gaz traces inclus |
| URL publique, zéro installation | Contrôle pédagogique total |

**Avantage honnête :** exécution ciblée pour un besoin de classe, inspirée d'un modèle validé — pas d'innovation technique.

## Who This Serves

**Élève collège (6e → 3e)** — tablette, seul ou binôme. Succès : nommer N₂, O₂, Ar, CO₂, citer proportions approximatives, expliquer l'air comme mélange spatial.

**Morgane (enseignante)** — partage l'URL, anime la séance. Succès : lancement en < 2 min, support tous niveaux collège.

## Success Criteria

| Critère | Mesure |
|---------|--------|
| Gaz identifiés | N₂, O₂, Ar, CO₂ — couleur/forme ↔ gaz après une séance |
| Proportions | ~78 % N₂ / ~21 % O₂ / ~1 % Ar / trace CO₂ (arrondi pédagogique) |
| Dominance visuelle | Azote dominant, argon et CO₂ perçus comme rares |
| CO₂ repérable | Au moins une particule CO₂ trouvable par zone explorée |
| Fiche au clic | < 1 s — nom, formule, proportion réelle |
| Navigation | First-person fluide sur tablette |
| Déploiement | URL publique, Chrome/Safari tablette, sans installation |

## Scope

### In — v1

- Web responsive, **optimisé tablette**, **URL publique**
- Scène 3D **first-person**
- Quatre espèces, modèle boules :
  - **N₂** — 2 sphères bleu foncé (~78 %, proportion stricte)
  - **O₂** — 2 sphères rouges (~21 %, proportion stricte)
  - **Ar** — petite sphère bleu clair isolée (~0,9 %, proportion stricte)
  - **CO₂** — C gris + 2 O rouges — **≥ 1 par zone**, proportion réelle **uniquement en fiche**
- Mouvement libre (animation pédagogique simplifiée)
- Clic/touch → modale : nom, formule, %, texte court
- Interface **français**, vocabulaire 6e → 3e
- Légende minimale (couleurs / formes)

### Out — v1

- AR, autres gaz traces, simulation physique
- Quiz, gamification, auth, hors-ligne
- Bibliothèque multi-modèles Foxar

## Vision

- **v2** — fiches par niveau (6e simplifié / 4e–3e approfondi)
- **v3** — variantes (air pollué, comparaison atmosphères) si besoin

Outil de classe ciblé ; portfolio possible de visualisations 3D web pour les sciences au collège.

## Open Questions

- **Contrôles first-person tablette** — joystick virtuel vs double-touch ? (décision UX, voir addendum)
