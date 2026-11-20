# CinéTrack — Catalogue de Films et Séries

## Description

CinéTrack est une application web permettant de parcourir un catalogue de films et de séries,
avec recherche, filtrage, pagination, favoris persistants et fiches détaillées.

La **partie 2** ajoute une **vraie API REST persistante** (MockAPI) ainsi qu'une
**page d'administration** complète (CRUD) et un **système de commentaires**
enregistrés côté serveur. Les données ne sont plus en lecture seule : elles sont
créées, modifiées et supprimées via `fetch` (GET, POST, PUT, DELETE).

## Aperçu du projet

L'objectif est de proposer une plateforme simple et élégante pour découvrir et
organiser ses films et séries préférés, tout en offrant une interface
d'administration permettant de gérer dynamiquement le catalogue.

---

## Fonctionnalités

### 1. Catalogue public (`index.html`)

- Grille responsive de cartes (films et séries)
- Image, titre, année, type pour chaque élément
- Design sombre moderne avec effets de survol
- Données chargées depuis **MockAPI**

### 2. Recherche, filtrage et pagination

- Barre de recherche en temps réel par titre
- Filtres par catégorie : **Tous / Films / Séries**
- Pagination avec **6 éléments par page**

### 3. Système de favoris

- Ajout / suppression via un bouton cœur sur chaque carte
- Sidebar dédiée avec compteurs automatiques (total, films, séries)
- Persistance des favoris dans le `localStorage`
- Sidebar fixe sur desktop, coulissante sur mobile

### 4. Modal de détails + commentaires

- Affichage complet : titre, type, année, durée/saisons
- Genres, réalisateurs, pays de production, description
- Lien externe « Watch now » pour visionner le contenu
- **Liste des commentaires** du titre (chargés via `GET /comments` puis filtrés)
- **Ajout de commentaire** (`POST /comments`) sans recharger la page
- Le pseudo est mémorisé dans le `localStorage`

### 5. Page d'administration (`admin.html`)

- Tableau listant tous les titres (image, titre, type, année)
- Bouton **Modifier** → ouvre un formulaire pré-rempli
- Bouton **Supprimer** → `confirm()` puis `DELETE` et retrait de la ligne
- Bouton **+ Ajouter un titre** → formulaire vierge
- **Formulaire unique** pour l'ajout (`POST`) et la modification (`PUT`)
- **Validation** de tous les champs (titre, image, type, année, durée/saisons,
  genres, réalisateurs, pays, description)
- Champs dynamiques selon le type (durée pour les films, saisons pour les séries)
- Messages de succès / erreur + mise à jour du tableau

### 6. Interface responsive

- Header fixe avec logo et recherche
- Sidebar des favoris adaptative (desktop / mobile)
- Modal fluide sur toutes les tailles d'écran

---

## Technologies utilisées

- **HTML5** — Structure sémantique
- **Tailwind CSS** (CDN + build local `src/output.css`) — Mise en page et responsive
- **JavaScript ES6 (Modules)** — Logique applicative, DOM, appels API
- **Fetch API** — Communication avec MockAPI (GET, POST, PUT, DELETE)
- **MockAPI** — API REST en ligne persistante
- **localStorage** — Favoris et mémorisation du pseudo

---

## API REST (MockAPI)

### Endpoint

https://6afaea62730c1d152f32bc04.mockapi.io/api/v1

### Ressource `contents`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | Object ID | Identifiant (renvoyé en **string** par MockAPI) |
| `title` | String | Titre du film / de la série |
| `image` | String | URL de l'affiche |
| `description` | String | Synopsis |
| `type` | String | `movie` ou `series` |
| `releaseYear` | Number | Année de sortie |
| `duration` | Number | Durée en minutes (films uniquement) |
| `seasons` | Array | Liste des saisons (séries uniquement) |
| `genres` | Array | Genres |
| `directors` | Array | Réalisateurs |
| `productionCountries` | Array | Pays de production |

### Ressource `comments`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | Object ID | Identifiant du commentaire |
| `contentId` | String | `id` du film / de la série |
| `author` | String | Nom de l'auteur |
| `text` | String | Contenu du commentaire |
| `rating` | Number | Note de 1 à 5 (bonus, non implémenté côté UI) |
| `createdAt` | Date | Date de création |

## Structure du projet
```
CinTrack/
├── index.html 
├── admin.html
├── js/
│ ├── main.js
│ ├── admin.js
│ ├── api.js
│ ├── ui.js
│ ├── validation.js
│ ├── cardes.js
│ ├── favorites.js
│ ├── filtrage.js
│ └── modal.js
├── src/
│ └── output.css
├── img/
│ ├── logo.png
│ ├── open_menu.png
│ └── arrow.png
├── package.json
├── package-lock.json
└── README.md
```
Liens

Jira : https://bouananikhalid83.atlassian.net/

Github Pages : https://khalidbouanani.github.io/Cin-Track-V2/
