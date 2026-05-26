# Addendum — PRD App Educ Morgane

Contenu complémentaire pour architecture, UX et implémentation — ne figure pas dans le corps du PRD.

## Sources amont

- Brief : `_bmad-output/planning-artifacts/briefs/brief-App Educ Morgane-2026-05-26/brief.md`
- Addendum brief (détail visuel, fiches brouillon) : même dossier `addendum.md`

## Référence visuelle Foxar

- **N₂ :** deux sphères bleu foncé fusionnées — majoritaires (~78 %)
- **O₂ :** deux sphères rouges fusionnées — minoritaires (~21 %)
- **Ar :** petites sphères bleu clair isolées — rares (~0,9 %)
- **CO₂ :** C gris + 2 O rouges alignés — repérable (règle option B)
- Distribution : nuage aléatoire, densité homogène dans le volume
- Échelle perçue : particules « visibles » à l'échelle humaine (choix pédagogique)

## Codage couleur et formes (CPK simplifié)

| Espèce | Représentation 3D | Couleur(s) | Proportion scène | Proportion fiche |
|--------|-------------------|------------|------------------|------------------|
| N₂ | 2 sphères fusionnées | Bleu foncé | ~78 % (stricte) | ~78 % |
| O₂ | 2 sphères fusionnées | Rouge | ~21 % (stricte) | ~21 % |
| Ar | 1 petite sphère isolée | Bleu clair | ~0,9 % (stricte) | ~0,9 % |
| CO₂ | 1 C + 2 O alignés | Gris + rouge | ≥ 1 par zone | ~0,04 % (réelle) |

## Règle CO₂ (D12 — option B rejetée : proportion stricte en scène)

- Au moins une particule CO₂ par zone explorable.
- Densité visuelle **ne reflète pas** la proportion réelle.
- Fiche CO₂ : ~0,04 %, mention explicite « gaz trace » et explication pédagogique.

## Contenu fiche particule (brouillon — à valider)

### N₂ — Diazote (~78 %)
L'azote est le gaz le plus abondant dans l'air. Il est inerte : il ne brûle pas. Il dilue l'oxygène.

### O₂ — Dioxygène (~21 %)
L'oxygène est indispensable à la respiration et à la combustion. Il est **minoritaire** par rapport à l'azote.

### Ar — Argon (~0,9 %)
L'argon est un gaz noble, présent en faible quantité. C'est un **atome seul**. Les petites boules bleu clair le représentent.

### CO₂ — Dioxyde de carbone (~0,04 %)
Le dioxyde de carbone est un **gaz trace** dans l'air. Sa proportion réelle est **très faible** (~0,04 %). On en place au moins une dans chaque zone pour que tu puisses la trouver ; la scène montre plus de CO₂ que la réalité, mais la fiche indique la vraie proportion.

## Contrôles first-person tablette (open question UX)

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| Joystick virtuel | Familier jeux mobile | Occupe l'écran |
| Double-touch + drag | Moins d'UI | Moins intuitif 6e |
| Zone tactile dédiée | Précis | Courbe d'apprentissage |

**Recommandation :** prototyper joystick + regard au toucher ; tester en classe avec Morgane.

## Piste implémentation (indicative — hors PRD)

- Three.js (ou équivalent), instancing par type de particule
- Raycasting pour sélection touch/click
- Environnement 3D plein écran (pas AR)
- Hébergement statique public (Netlify, Vercel, GitHub Pages…)

## Proportions atmosphère — référence

| Gaz | % air sec | v1 scène | v1 fiche |
|-----|-----------|----------|----------|
| N₂ | ~78,08 % | Stricte | ~78 % |
| O₂ | ~20,95 % | Stricte | ~21 % |
| Ar | ~0,93 % | Stricte | ~1 % |
| CO₂ | ~0,04 % | ≥ 1/zone | ~0,04 % |
| Autres | < 0,01 % | ❌ | ❌ |

## Vision post-v1 (hors MVP)

- **v2** — fiches par niveau (6e simplifié / 4e–3e approfondi)
- **v3** — variantes (air pollué, comparaison atmosphères)
