# JobFinder

Application de recherche d'emplois développée avec Angular 21. Elle permet de consulter des offres provenant de l'API USAJobs, gérer ses favoris avec NgRx, et suivre ses candidatures.

## Technologies

- **Angular 21.1.0** - Standalone Components
- **TypeScript 5.9.2**
- **Tailwind CSS 4.1.12**
- **NgRx 18.1.1** - Store, Effects, Devtools
- **RxJS 7.8.0**
- **JSON Server 1.0.0-beta**
- **USAJobs API**

## Architecture

```
src/app/
├── core/              # Services globaux, Guards, Interceptors, Models
├── features/          # Modules fonctionnels (lazy-loaded)
│   ├── auth/          # Authentification
│   ├── jobs/          # Recherche et détails des offres
│   ├── favorites/     # Gestion des favoris (NgRx)
│   ├── applications/  # Suivi des candidatures
│   └── profile/       # Profil utilisateur
└── shared/            # Composants, directives, pipes réutilisables
```

## Installation

### Prérequis
- Node.js v18+
- npm v9+

### Configuration

1. **Cloner le projet**
```bash
git clone https://github.com/Ibrahim-Nidam/JobFinder_Angular.git
cd JobFindr_Croise
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'API USAJobs**

Créer un fichier `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  usaJobsApi: {
    url: 'https://data.usajobs.gov/api/Search',
    apiKey: 'YOUR_API_KEY',
    userAgent: 'your@email.com'
  }
};
```

### Lancement

**Option 1 : Lancer les deux serveurs séparément**

Terminal 1 - Backend (JSON Server):
```bash
npx json-server --watch db.json --port 3000
```

Terminal 2 - Frontend (Angular):
```bash
ng serve
```

**Option 2 : Lancer les deux serveurs simultanément**
```bash
npm run dev
```

Application disponible sur `http://localhost:4200`

## Fonctionnalités

### Authentification
- Inscription et connexion
- Protection des routes avec AuthGuard
- Persistance avec SessionStorage

### Recherche d'Emplois
- Recherche par mots-clés et localisation
- Pagination et tri par date
- Détails de l'offre

### Gestion des Favoris
- Ajout/retrait des favoris
- Gestion d'état avec NgRx (Store, Effects, Selectors)
- Prévention des doublons
- Indicateurs visuels

### Suivi des Candidatures
- Ajout d'offres au suivi
- Modification du statut (en attente, accepté, refusé)
- Notes personnelles
- Toggle depuis favoris/recherche

### Profil Utilisateur
- Modification des informations
- Changement de mot de passe
- Suppression de compte

## Scripts

| Commande | Description |
|----------|-------------|
| `npm start` | Lance Angular |
| `npm run dev` | Lance Angular + JSON Server |
| `npm test` | Tests unitaires |
| `npm run build` | Build production |

## API Endpoints

**JSON Server** (`http://localhost:3000`)
- `GET/POST/PATCH/DELETE /users`
- `GET/POST/DELETE /favoritesOffers`
- `GET/POST/PATCH/DELETE /applications`

## Routes

| Route | Accès | Description |
|-------|-------|-------------|
| `/auth/login` | Public | Connexion |
| `/auth/register` | Public | Inscription |
| `/jobs/search` | Public | Recherche d'offres |
| `/jobs/details/:id` | Public | Détails d'une offre |
| `/favorites` | Protégé | Liste des favoris |
| `/applications` | Protégé | Suivi des candidatures |
| `/profile` | Protégé | Modification du profil |

## Auteur

**Ibrahim Nidam** - Février 2026