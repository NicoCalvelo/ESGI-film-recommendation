import { User } from "@/app/_interfaces/user";
import { getCurrentUser } from "@/app/_services/AuthService";

type PreferenceCategory = keyof User['likes'];

const GHIBLI_MOVIE_METADATA: Record<string, { genres: string[]; actors: string[] }> = {
  "Nausicaä of the Valley of the Wind": {
    genres: ["Animation", "Adventure", "Fantasy", "Sci-Fi"],
    actors: ["Nausicaä", "Asbel", "Kushana"]
  },
  "Castle in the Sky": {
    genres: ["Animation", "Adventure", "Fantasy", "Sci-Fi"],
    actors: ["Pazu", "Sheeta", "Muska"]
  },
  "Grave of the Fireflies": {
    genres: ["Animation", "Drama", "War"],
    actors: ["Seita", "Setsuko"]
  },
  "My Neighbor Totoro": {
    genres: ["Animation", "Family", "Fantasy"],
    actors: ["Satsuki", "Mei", "Totoro"]
  },
  "Kiki's Delivery Service": {
    genres: ["Animation", "Adventure", "Drama", "Family", "Fantasy"],
    actors: ["Kiki", "Jiji", "Osono"]
  },
  "Only Yesterday": {
    genres: ["Animation", "Drama", "Romance"],
    actors: ["Taeko", "Toshio"]
  },
  "Porco Rosso": {
    genres: ["Animation", "Comedy", "Adventure", "Romance"],
    actors: ["Porco Rosso", "Fio", "Gina"]
  },
  "Ocean Waves": {
    genres: ["Animation", "Drama", "Romance"],
    actors: ["Taku Morisaki", "Yutaka Matsuno", "Rikako Muto"]
  },
  "Pom Poko": {
    genres: ["Animation", "Comedy", "Fantasy"],
    actors: ["Shoukichi", "Okiyo", "Seizaemon"]
  },
  "Whisper of the Heart": {
    genres: ["Animation", "Drama", "Family", "Romance"],
    actors: ["Shizuku", "Seiji"]
  },
  "Princess Mononoke": {
    genres: ["Animation", "Adventure", "Fantasy", "Action"],
    actors: ["Ashitaka", "San", "Eboshi"]
  },
  "My Neighbors the Yamadas": {
    genres: ["Animation", "Comedy", "Family"],
    actors: ["Takashi", "Matsuko"]
  },
  "Spirited Away": {
    genres: ["Animation", "Adventure", "Fantasy", "Drama"],
    actors: ["Chihiro", "Haku", "Yubaba", "No-Face"]
  },
  "The Cat Returns": {
    genres: ["Animation", "Adventure", "Fantasy", "Comedy"],
    actors: ["Haru", "Baron", "Muta"]
  },
  "Howl's Moving Castle": {
    genres: ["Animation", "Adventure", "Fantasy", "Romance"],
    actors: ["Sophie", "Howl", "Calcifer"]
  },
  "Tales from Earthsea": {
    genres: ["Animation", "Adventure", "Fantasy"],
    actors: ["Arren", "Therru", "Ged"]
  },
  "Ponyo": {
    genres: ["Animation", "Adventure", "Family", "Fantasy"],
    actors: ["Sosuke", "Ponyo", "Fujimoto"]
  },
  "Arrietty": {
    genres: ["Animation", "Adventure", "Family", "Fantasy"],
    actors: ["Arrietty", "Sho", "Homily"]
  },
  "From Up on Poppy Hill": {
    genres: ["Animation", "Drama", "Romance"],
    actors: ["Umi", "Shun"]
  },
  "The Wind Rises": {
    genres: ["Animation", "Biography", "Drama", "Romance"],
    actors: ["Jiro Horikoshi", "Naoko Satomi"]
  },
  "The Tale of the Princess Kaguya": {
    genres: ["Animation", "Drama", "Fantasy"],
    actors: ["Kaguya", "Sutemaru"]
  },
  "When Marnie Was There": {
    genres: ["Animation", "Drama", "Mystery"],
    actors: ["Anna Sasaki", "Marnie"]
  },
  "The Red Turtle": {
    genres: ["Animation", "Adventure", "Drama", "Fantasy"],
    actors: ["Castaway", "Red Turtle"]
  },
  "Earwig and the Witch": {
    genres: ["Animation", "Fantasy", "Family"],
    actors: ["Earwig", "Bella Yaga", "The Mandrake"]
  },
  "The Boy and the Heron": {
    genres: ["Animation", "Adventure", "Fantasy", "Drama"],
    actors: ["Mahito", "Grey Heron", "Himi"]
  }
};

/**
 * Get current user's preferences from localStorage
 */
export function getUserPreferences(): User | null {
  return getCurrentUser();
}

/**
 * Update user preferences in localStorage
 */
function updateUserPreferences(user: User): void {
  localStorage.setItem('app_current_user', JSON.stringify(user));
}

/**
 * Add a like to a specific category
 */
export function addLike(category: PreferenceCategory, value: string): void {
  const user = getCurrentUser();
  if (!user) return;

  if (!user.likes[category].includes(value)) {
    user.likes[category].push(value);
    
    // Remove from dislikes if present
    const dislikeIndex = user.dislikes[category].indexOf(value);
    if (dislikeIndex > -1) {
      user.dislikes[category].splice(dislikeIndex, 1);
    }

    updateUserPreferences(user);

    // If we just liked a movie (films), also like its actors and categories
    if (category === "films") {
      const metadata = GHIBLI_MOVIE_METADATA[value];
      if (metadata) {
        metadata.genres.forEach((genre) => {
          addLike("genres", genre);
        });
        metadata.actors.forEach((actor) => {
          addLike("actors", actor);
        });
      }
    }
  }
}

/**
 * Remove a like from a specific category
 */
export function removeLike(category: PreferenceCategory, value: string): void {
  const user = getCurrentUser();
  if (!user) return;

  const index = user.likes[category].indexOf(value);
  if (index > -1) {
    user.likes[category].splice(index, 1);
    updateUserPreferences(user);
  }
}

/**
 * Add a dislike to a specific category
 */
export function addDislike(category: PreferenceCategory, value: string): void {
  const user = getCurrentUser();
  if (!user) return;

  if (!user.dislikes[category].includes(value)) {
    user.dislikes[category].push(value);
    
    // Remove from likes if present
    const likeIndex = user.likes[category].indexOf(value);
    if (likeIndex > -1) {
      user.likes[category].splice(likeIndex, 1);
    }

    updateUserPreferences(user);
  }
}

/**
 * Remove a dislike from a specific category
 */
export function removeDislike(category: PreferenceCategory, value: string): void {
  const user = getCurrentUser();
  if (!user) return;

  const index = user.dislikes[category].indexOf(value);
  if (index > -1) {
    user.dislikes[category].splice(index, 1);
    updateUserPreferences(user);
  }
}

/**
 * Check if a value is liked in a category
 */
export function isLiked(category: PreferenceCategory, value: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.likes[category].includes(value);
}

/**
 * Check if a value is disliked in a category
 */
export function isDisliked(category: PreferenceCategory, value: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.dislikes[category].includes(value);
}

/**
 * Get all likes for a category
 */
export function getLikes(category: PreferenceCategory): string[] {
  const user = getCurrentUser();
  if (!user) return [];
  return user.likes[category];
}

/**
 * Get all dislikes for a category
 */
export function getDislikes(category: PreferenceCategory): string[] {
  const user = getCurrentUser();
  if (!user) return [];
  return user.dislikes[category];
}

/**
 * Get count of likes in a category
 */
export function getLikesCount(category: PreferenceCategory): number {
  return getLikes(category).length;
}

/**
 * Get count of dislikes in a category
 */
export function getDislikesCount(category: PreferenceCategory): number {
  return getDislikes(category).length;
}

/**
 * Get stats for all categories
 */
export function getPreferenceStats(): Record<PreferenceCategory, { likes: number; dislikes: number }> {
  const user = getCurrentUser();
  if (!user) {
    return {
      genres: { likes: 0, dislikes: 0 },
      actors: { likes: 0, dislikes: 0 },
      directors: { likes: 0, dislikes: 0 },
      books: { likes: 0, dislikes: 0 },
      films: { likes: 0, dislikes: 0 },
      series: { likes: 0, dislikes: 0 },
      anime: { likes: 0, dislikes: 0 },
    };
  }

  return {
    genres: { likes: user.likes.genres.length, dislikes: user.dislikes.genres.length },
    actors: { likes: user.likes.actors.length, dislikes: user.dislikes.actors.length },
    directors: { likes: user.likes.directors.length, dislikes: user.dislikes.directors.length },
    books: { likes: user.likes.books.length, dislikes: user.dislikes.books.length },
    films: { likes: user.likes.films.length, dislikes: user.dislikes.films.length },
    series: { likes: user.likes.series.length, dislikes: user.dislikes.series.length },
    anime: { likes: user.likes.anime.length, dislikes: user.dislikes.anime.length },
  };
}

/**
 * Toggle like (if liked, remove; if not liked, add)
 */
export function toggleLike(category: PreferenceCategory, value: string): void {
  if (isLiked(category, value)) {
    removeLike(category, value);
  } else {
    addLike(category, value);
  }
}

/**
 * Toggle dislike (if disliked, remove; if not disliked, add)
 */
export function toggleDislike(category: PreferenceCategory, value: string): void {
  if (isDisliked(category, value)) {
    removeDislike(category, value);
  } else {
    addDislike(category, value);
  }
}
