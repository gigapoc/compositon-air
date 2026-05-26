# App Educ Morgane — Composition de l'air 3D

Application web 3D immersive pour explorer la composition de l'air au collège. Ouverture directe via URL, sans compte ni installation.

## Prérequis

- Node.js **20.19+** ou **22.12+** (recommandé : `nvm use` — voir `.nvmrc`)
- npm 10+

## Commandes

```bash
# Installer les dépendances
npm install

# Serveur de développement (http://localhost:5173)
npm run dev

# Build de production → dist/
npm run build

# Prévisualiser le build local
npm run preview
```

## Structure

```
src/
├── app/bootstrap.ts      # Initialisation WebGL, boucle render
├── config/scene.constants.ts
├── scene/SceneManager.ts
├── controls/             # Epic 2 — navigation
├── interaction/          # Epic 3 — sélection particules
├── ui/                   # Overlays DOM
└── content/              # JSON pédagogique
```

## Déploiement HTTPS

L'application est un site statique (`dist/`). Aucune authentification, aucune collecte de données personnelles, aucune surface admin.

### GitHub Pages (recommandé)

1. Pousser le dépôt sur GitHub.
2. **Settings → Pages → Source** : choisir **GitHub Actions**.
3. Le workflow `.github/workflows/deploy.yml` déploie automatiquement à chaque push sur `main`.
4. URL de production : `https://gigapoc.github.io/compositon-air/`

> Dépôt : `git@github.com:gigapoc/compositon-air.git`

### Alternatives

| Hébergeur | Commande / action |
|-----------|-------------------|
| **Vercel** | Importer le repo ; framework = Vite ; build = `npm run build` ; output = `dist` |
| **Netlify** | Idem ; publish directory = `dist` |

### Partage en classe

- **Lien direct** : copier l'URL HTTPS de production dans le navigateur tablette.
- **QR code** : générer un QR pointant vers l'URL (ex. [qr-code-generator.com](https://www.qr-code-generator.com/) ou outil équivalent). Afficher le QR au tableau ; les élèves scannent et ouvrent Chrome ou Safari.

**Objectif séance** : lancement en moins de 2 minutes, sans installation d'application native.

## URL de production

```
https://gigapoc.github.io/compositon-air/
```

Déployée automatiquement via GitHub Actions à chaque push sur `main` (après activation de Pages → GitHub Actions).

## Stack

- Vite 8 + TypeScript 5
- Three.js r184 (WebGL)
- Vanilla TS — pas de React, pas de backend

## Licence

Usage pédagogique — projet App Educ Morgane.
