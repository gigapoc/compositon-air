# Addendum — Détail technique et pédagogique

Contenu complémentaire pour PRD / architecture — ne figure pas dans le brief exécutif.

## Référence visuelle Foxar (capture fournie)

- **Titre module :** « Composition de l'air »
- **N₂ :** deux sphères bleu foncé fusionnées — **majoritaires** (~78 %)
- **O₂ :** deux sphères rouges fusionnées — **minoritaires** (~21 %, ratio ~4 N₂ pour 1 O₂)
- **Ar :** **petites sphères bleu clair isolées**, dispersées — visibles mais rares (~0,9 %)
- **CO₂ :** C gris central + 2 O rouges, alignés (~0,04 % réel ; affichage v1 voir règle ci-dessous)
- **Distribution :** nuage aléatoire dans tout le volume, densité homogène
- **Échelle perçue :** particules « visibles » à l'échelle humaine (choix pédagogique, pas échelle réelle)

## Codage couleur et formes (convention CPK simplifiée)

| Espèce | Représentation 3D | Couleur(s) | Proportion scène | Proportion fiche |
|--------|-------------------|------------|------------------|------------------|
| N₂ | 2 sphères fusionnées | Bleu foncé | ~78 % (stricte) | ~78 % |
| O₂ | 2 sphères fusionnées | Rouge | ~21 % (stricte) | ~21 % |
| Ar | 1 petite sphère isolée | Bleu clair | ~0,9 % (stricte) | ~0,9 % |
| CO₂ | 1 C + 2 O alignés | Gris + rouge | **≥ 1 par zone** | **~0,04 % (réelle)** |

**Distinction Ar vs N₂ :** argon monoatomique (petite boule bleu clair) ; azote diatomique (deux boules bleu foncé).

## Règle CO₂ (décision D12 — option B)

- La scène garantit **au moins une particule CO₂ par zone explorable** (définir « zone » en implémentation : ex. volume cubique de N mètres ou secteur de spawn).
- La **densité visuelle ne reflète pas** la proportion réelle.
- La fiche CO₂ affiche explicitement **~0,04 %** et précise que le CO₂ est un **gaz trace** — sa rareté réelle explique pourquoi on en voit peu comparé à N₂/O₂.
- N₂, O₂, Ar restent à proportions strictes.

## Contenu fiche particule (brouillon)

### N₂ — Diazote (~78 %)
L'azote est le gaz le plus abondant dans l'air. Il est inerte : il ne brûle pas. Il dilue l'oxygène.

### O₂ — Dioxygène (~21 %)
L'oxygène est indispensable à la respiration et à la combustion. Il est **minoritaire** par rapport à l'azote.

### Ar — Argon (~0,9 %)
L'argon est un gaz noble, présent en faible quantité. C'est un **atome seul**. Les petites boules bleu clair le représentent.

### CO₂ — Dioxyde de carbone (~0,04 %)
Le dioxyde de carbone est un **gaz trace** dans l'air. Sa proportion réelle est **très faible** (~0,04 %). On en place au moins une dans chaque zone pour que tu puisses la trouver ; la scène montre plus de CO₂ que la réalité, mais la fiche indique la vraie proportion.

## Piste implémentation (indicative)

- Three.js (ou équivalent), instancing par type
- Raycasting pour sélection touch/click
- First-person controls tablette — **open question UX**
- Environnement 3D plein écran (pas AR)
- Hébergement statique public (Netlify, Vercel, GitHub Pages…)

## Contrôles first-person (open question)

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| Joystick virtuel | Familier jeux mobile | Occupe l'écran |
| Double-touch + drag | Moins d'UI | Moins intuitif 6e |
| Zone tactile dédiée | Précis | Courbe d'apprentissage |

Recommandation PRD : prototyper joystick + regard au toucher ; tester en classe.

## Proportions atmosphère — référence

| Gaz | % air sec | v1 scène | v1 fiche |
|-----|-----------|----------|----------|
| N₂ | ~78,08 % | Stricte | ~78 % |
| O₂ | ~20,95 % | Stricte | ~21 % |
| Ar | ~0,93 % | Stricte | ~1 % |
| CO₂ | ~0,04 % | ≥ 1/zone | ~0,04 % |
| Autres | < 0,01 % | ❌ | ❌ |
