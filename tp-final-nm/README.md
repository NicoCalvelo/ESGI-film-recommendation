# InfiniteShelf - Bibliothèque Culturelle Intelligente

TP Final React + Next.js | Découverte sans spoilers de contenus culturels (films, séries, anime, livres)

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📋 État du Projet
 
### ✅ API Routes Implémentées
 
Les 4 APIs externes sont connectées et fonctionnelles pour la recherche et l'exploration, la recherche d'utilisateurs est disponible, et le moteur de recommandations est complet :
 
#### 1. **Gutendex API** (Livres)
- **Route:** `/api/gutendex/getList`
- **Paramètres:** 
  - `page` (optionnel): Numéro de page (défaut: 1)
  - `search` (optionnel): Terme de recherche
  - `topic` (optionnel): Catégorie (ex: "Fiction")
- **Réponse:** Liste de 32 livres avec titre, auteurs, genres, popularité
 
#### 2. **TVMaze API** (Séries TV)
- **Route:** `/api/tvmaze/getList`
- **Paramètres:** 
  - `search` (requis): Terme de recherche
- **Réponse:** Résultats triés par note (rating décroissant). Limite: ~10 résultats max
- **Données:** Titre, image, genres, résumé, note, réseau diffuseur
 
#### 3. **Jikan API** (Anime)
- **Route:** `/api/jikan/getList`
- **Paramètres:**
  - `search` (optionnel): Terme de recherche
  - `page` (optionnel): Numéro de page
- **Réponse:** Liste d'animes avec titre, image, score, genres, type
 
#### 4. **Studio Ghibli API** (Films Studio Ghibli)
- **Route:** `/api/studioghibli/getList`
- **Réponse:** Tous les films du studio Ghibli avec titre, image, année, score
 
#### 5. **User Search API** (Recherche d'utilisateurs)
- **Route:** `/api/users/search`
- **Paramètres:**
  - `query` (optionnel): Terme de recherche (nom ou email)
- **Réponse:** Liste d'utilisateurs correspondants (excluant l'utilisateur actuellement connecté)

#### 6. **Recommendations API**
- **Route:** `/api/recommendations`
- **Paramètres:**
  - `source` (requis): gutendex, tvmaze, jikan, ou studioghibli
  - `userPreferences` (requis): profil de l'utilisateur
  - `limit` (optionnel): limite de résultats
- **Réponse:** Liste d'œuvres adaptées au profil. Garanti de renvoyer **au moins 5 résultats** par source grâce à un mécanisme de fallback sur les préférences communautaires calculées sur tous les profils.

#### 7. **User Comparison API**
- **Route:** `/api/recommendations/compare`
- **Paramètres:**
  - `user1` (requis) & `user2` (requis): les deux utilisateurs à comparer
  - `source` (optionnel): source média pour trouver des œuvres ponts
- **Réponse:** Score de compatibilité, genres/acteurs/réalisateurs communs et contenu "pont" conseillé pour les deux.
 
---
 
### ❌ API Routes Optionnelles (Non requises)
 
- `/api/content/[source]/[id]` - Remplacé par une gestion directe de l'API externe dans les React Server Components couplée au composant client de masquage anti-spoiler.
 
---
 
## 🗄️ Architecture - Données Locales (localStorage)
 
**Authentification:** ✅ Déjà implémentée via AuthService
- Signup/Login en localStorage
- Gestion des mots de passe sécurisée (salt + piment)
- Pas de base de données serveur
 
**Données Utilisateur (localStorage):**
```
app_users: Array<User>
├─ id, name, email, password (hashed)
└─ likes & dislikes (genres, acteurs, réalisateurs, films, séries, anime, livres)

app_current_user: User
└─ utilisateur actuellement connecté
```
 
---
 
## 🎨 Frontend & Backend - Fonctionnalités Implémentées
 
1. **Search Page (Recherche globale)**
   - Utilisation de `/api/[source]/getList` pour chercher simultanément sur les 4 APIs
   - Affichage structuré sous forme de carrousels horizontaux avec classification (films, séries, animes, livres)
   - Bouton de Like/Dislike rapide sur chaque carte

2. **Library Page (Mes Favoris)**
   - Gestion des favoris (aimés) et indésirables (non aimés) stockés localement
   - Tri par catégorie de média avec compteurs dynamiques

3. **Recommendations Page**
   - Génère des suggestions personnalisées via l'API `/api/recommendations`
   - Logique collaborative : fusionne les genres, acteurs et réalisateurs aimés pour trouver des correspondances
   - **Garantie 5+** : Si les goûts personnels n'amènent pas à 5 résultats, le système complète avec les tendances de la communauté (*"Populaire dans la communauté"*)
   - Mapping intelligent des catégories (ex. *"Adventure"* correspond à *"Adventure stories"* sur Gutendex, *"Sci-Fi"* à *"Science Fiction"*)

4. **Multi-User Comparison (Comparer avec un ami)**
   - Recherche d'utilisateurs créés localement (ou des profils mockés de la communauté)
   - Calcul d'un score de compatibilité (0-100%) basé sur les genres/acteurs/réalisateurs communs
   - Suggestion de contenus "ponts" (œuvres appréciables par les deux profils)

5. **Spoiler-Free Mode**
   - Implémenté sur les pages de détails grâce au composant interactif `SpoilerWrapper`
   - Masque par défaut (floutage) le synopsis et les résumés détaillés des livres
   - Permet de révéler le contenu en un clic, et d'activer/désactiver globalement la protection via une option persistante
 
---
 
## 🔐 Sécurité
 
**Authentification:** ✅ Sécurisée
- Mots de passe hachés avec salt + piment
- Stockage localStorage seulement
 
---
 
## 📦 Stack Technique
 
- **Frontend:** React, TypeScript, TailwindCSS, Lucide Icons
- **Backend:** Next.js API Routes (App Router)
- **External APIs:** Gutendex, TVMaze, Jikan, Studio Ghibli
- **Storage:** localStorage (clé-valeur JSON)
- **Authentication:** AuthService avec hachage sécurisé
 
---
 
## 📝 Checklist de Complétion
 
Backend :
- [x] Moteur de recommandation (`/api/recommendations`) avec fallback communautaire
- [x] API de comparaison et de contenu pont (`/api/recommendations/compare`)
- [x] API de recherche d'utilisateurs (`/api/users/search`)
- [x] Correction des APIs d'exploration (TVMaze et Gutendex modifiés pour chercher par genre/sujet et non par nom de genre)
 
Frontend :
- [x] Interface de recherche globale multi-sources
- [x] Modals d'inscription / connexion
- [x] Page de favoris et gestion des bibliothèques (Likes/Dislikes)
- [x] Page de recommandations avec affichage des scores de pertinence
- [x] Système de comparaison d'utilisateurs et de suggestion de films/séries ponts
- [x] Intégration du composant anti-spoiler interactif sur les fiches de détails
- [x] Cascade de favoris automatique (liker une œuvre ajoute ses catégories/acteurs aux favoris)
 
---

## 📚 Services Disponibles

### Backend Services:
- **AuthService** - Authentification et gestion des utilisateurs
- **UserPreferencesService** - Gestion des likes/dislikes par catégorie
- **RecommendationsService** - Moteur de recommandations et comparaison d'utilisateurs

### API Routes:
```
GET  /api/gutendex/getList
GET  /api/tvmaze/getList
GET  /api/jikan/getList
GET  /api/studioghibli/getList
POST /api/recommendations
POST /api/recommendations/compare
GET  /api/users/search
```

### Client Utilities:
- **recommendationsClient** - Fonctions pour appeler les API de recommandations depuis le frontend

---

**Prêt à utiliser (Backend):**
- ✅ Les 4 APIs content retrieval (`/api/[source]/getList`)
- ✅ Authentification (AuthService avec localStorage)
- ✅ Gestion des préférences utilisateur (UserPreferencesService)
- ✅ Recommandations (`POST /api/recommendations`)
- ✅ Comparaison d'utilisateurs (`POST /api/recommendations/compare`)
- ✅ Recherche d'utilisateurs (`GET /api/users/search`)

**À développer côté backend:**
- `/api/content/[source]/[id]` - Détails d'une œuvre avec filtre spoiler

**Persistance client-side (localStorage):**
- `app_users`: liste de tous les utilisateurs
- `app_current_user`: utilisateur connecté
- `app_user_library`: bibliothèque personnelle
- Gérer manuellement l'ajout/suppression/favori dans les composants

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




# Liste des routes :

/api/gutendex/getList?page=1

```json
{
  "count": 78580,
  "next": "https://gutendex.com/books/?page=2",
  "previous": null,
  "results": [ {book x32} ]
}
```

Book :

```json
{
  "id": <number of Project Gutenberg ID>,
  "title": <string>,
  "authors": <array of Persons>,
  "summaries": <array of strings>,
  "editors": <array of Persons>,
  "translators": <array of Persons>,
  "subjects": <array of strings>,
  "bookshelves": <array of strings>,
  "languages": <array of strings>,
  "copyright": <boolean or null>,
  "media_type": <string>,
  "formats": <Format>,
  "download_count": <number>
}
```

/api/studioghibli/getList

Retourne tout les films du studio Ghbili

/api/jikan/getList

Retourne les 25 animes les plus connus

/api/jikan/getList?query=<string>&page=<number>

Retourne une liste d'anime en fonction de la recherche

/api/users/search?query=<string>

Retourne une liste des utilisateurs correspondant à la recherche (excluant l'utilisateur connecté)