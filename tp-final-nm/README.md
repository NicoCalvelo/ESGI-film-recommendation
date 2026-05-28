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

### ✅ API Routes Implémentées (Content Retrieval)

Les 4 APIs externes sont connectées et fonctionnelles pour la recherche et l'exploration :

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

---

### ❌ API Routes Manquantes (À Implémenter)

**PRIORITÉ 1 - Recommendations:**
- `GET /api/recommendations` - Générer des recommandations basées sur la bibliothèque
- `POST /api/recommendations/compare` - Comparer deux utilisateurs et suggérer des contenus communs

**PRIORITÉ 2 - Social Features:**
- `GET /api/users/search` - Chercher d'autres utilisateurs
- `GET /api/users/[userId]/compatibility` - Score de compatibilité entre deux utilisateurs

**PRIORITÉ 3 - Content Details:**
- `GET /api/content/[source]/[id]` - Récupérer détails d'un contenu avec filtre spoilers
- Logic spoiler-free: masquer synopsis, personnages, détails narratifs

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
└─ favorites (array d'objets content)

app_current_user: User
└─ utilisateur actuellement connecté

app_user_library: Array<LibraryItem>
├─ userId, contentId, source (gutendex/tvmaze/jikan/ghibli)
├─ isFavorite, addedAt, status (watched/reading/etc)
└─ personalNotes

app_recommendations: Array<RecommendationItem>
├─ userId, recommendedContentId, score, reason
└─ createdAt
```

---

## 🎨 Frontend - Conseils d'Intégration

### Pages/Features à Développer

1. **Search Page**
   - Utiliser `/api/[source]/getList` pour chercher
   - Afficher résultats avec: titre, image, type média, genres
   - Ajouter à la bibliothèque

2. **Library Page**
   - Gérer les contenus sauvegardés en localStorage
   - CRUD: ajouter, supprimer, marquer comme favori
   - Filtrer par type de média

3. **Recommendations**
   - Nécessite: `/api/recommendations` (backend)
   - Logique simple: genres communs, tags, ambiance
   - Basé sur la bibliothèque localStorage

4. **Multi-User Comparison**
   - Chercher d'autres utilisateurs (créés localement)
   - Comparer leurs bibliothèques
   - Suggestions de contenu "pont"
   - Nécessite: `/api/users/search` + `/api/users/[id]/compatibility` (backend)

5. **Spoiler-Free Mode**
   - Toggle entre vue sûre (genres, durée, popularité) et détaillée (synopsis, perso)
   - Identifier les contenus déjà dans la bibliothèque

### État Management
Suggestion: **React Context** ou **Zustand** pour:
- Utilisateur connecté (depuis AuthService)
- Bibliothèque personnelle (depuis localStorage)
- Préférences UI (spoiler-free toggle)
- Cache des résultats de recherche

---

## 🔐 Sécurité

**Authentification:** ✅ Déjà sécurisée
- Mots de passe hachés avec salt + piment
- Stockage localStorage seulement

**À vérifier côté frontend:**
- Ne pas afficher les données sensibles en dur
- Valider les entrées utilisateur
- Nettoyer localStorage lors du logout

---

## 📦 Stack Technique

- **Frontend:** React, TypeScript
- **Backend:** Next.js API Routes
- **Styling:** CSS Modules / TailwindCSS
- **External APIs:** Gutendex, TVMaze, Jikan, Studio Ghibli
- **Storage:** localStorage (clé-valeur JSON)
- **Authentication:** AuthService avec hachage sécurisé

---

## 📝 Checklist de Complétion

Backend:
- [x] User authentication system (signup/login) - localStorage
- [ ] Recommendation algorithm API
- [ ] User search API
- [ ] User compatibility comparison API
- [ ] Spoiler-free content detail API
- [ ] Error handling & validation

Frontend:
- [ ] Search interface pour chaque API
- [ ] Library management UI (localStorage)
- [ ] Recommendations display
- [ ] User profile & comparison
- [ ] Spoiler-free toggle
- [ ] Multi-user mode UI
- [ ] Add to library button

---

## 🤝 Notes pour le Frontend Developer

**Prêt à utiliser:**
- ✅ Les 4 APIs content retrieval (`/api/[source]/getList`)
- ✅ Authentification (AuthService avec localStorage)
- ✅ Stockage de la bibliothèque personnelle (localStorage)

**À développer/implémenter côté backend:**
- `/api/recommendations` - Suggestion d'œuvres basée sur goûts utilisateur
- `/api/users/search` - Chercher d'autres utilisateurs
- `/api/users/[id]/compatibility` - Comparer deux utilisateurs
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