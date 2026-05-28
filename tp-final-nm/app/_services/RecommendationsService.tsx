import { User } from "@/app/_interfaces/user";
import { getCurrentUser } from "@/app/_services/AuthService";

export interface RecommendationItem {
  id: string | number;
  title: string;
  source: 'gutendex' | 'tvmaze' | 'jikan' | 'studioghibli';
  score: number;
  matchReasons: string[];
  image?: string;
  genres?: string[];
}

/**
 * Analyze user preferences to find common patterns
 */
function analyzeUserPreferences(user: User): {
  likedGenres: string[];
  dislikedGenres: string[];
  likedActors: string[];
  dislikedActors: string[];
  likedDirectors: string[];
  dislikedDirectors: string[];
  genreFrequency: Record<string, number>;
  actorFrequency: Record<string, number>;
  directorFrequency: Record<string, number>;
} {
  const genreFrequency: Record<string, number> = {};
  const actorFrequency: Record<string, number> = {};
  const directorFrequency: Record<string, number> = {};

  // Count genre frequencies
  user.likes.genres.forEach((genre) => {
    genreFrequency[genre] = (genreFrequency[genre] || 0) + 2; // Higher weight for genres
  });

  user.likes.actors.forEach((actor) => {
    actorFrequency[actor] = (actorFrequency[actor] || 0) + 1.5;
  });

  user.likes.directors.forEach((director) => {
    directorFrequency[director] = (directorFrequency[director] || 0) + 1.5;
  });

  return {
    likedGenres: user.likes.genres,
    dislikedGenres: user.dislikes.genres,
    likedActors: user.likes.actors,
    dislikedActors: user.dislikes.actors,
    likedDirectors: user.likes.directors,
    dislikedDirectors: user.dislikes.directors,
    genreFrequency,
    actorFrequency,
    directorFrequency,
  };
}

/**
 * Calculate recommendation score based on content metadata
 */
function calculateMatchScore(
  contentGenres: string[],
  contentActors: string[],
  contentDirectors: string[],
  analysis: ReturnType<typeof analyzeUserPreferences>
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Check for disliked content first
  const hasDislikedGenre = contentGenres.some((g) => analysis.dislikedGenres.includes(g));
  if (hasDislikedGenre) {
    return { score: 0, reasons: ['Contient un genre rejeté'] };
  }

  const hasDislikedActor = contentActors.some((a) => analysis.dislikedActors.includes(a));
  if (hasDislikedActor) {
    return { score: 0, reasons: ['Contient un acteur rejeté'] };
  }

  // Match genres
  const matchedGenres = contentGenres.filter((g) => analysis.likedGenres.includes(g));
  if (matchedGenres.length > 0) {
    score += matchedGenres.length * 25;
    reasons.push(`Contient genres aimés: ${matchedGenres.join(', ')}`);
  }

  // Match actors
  const matchedActors = contentActors.filter((a) => analysis.likedActors.includes(a));
  if (matchedActors.length > 0) {
    score += matchedActors.length * 15;
    reasons.push(`Avec acteurs aimés: ${matchedActors.join(', ')}`);
  }

  // Match directors
  const matchedDirectors = contentDirectors.filter((d) => analysis.likedDirectors.includes(d));
  if (matchedDirectors.length > 0) {
    score += matchedDirectors.length * 15;
    reasons.push(`Avec réalisateurs aimés: ${matchedDirectors.join(', ')}`);
  }

  return { score, reasons };
}

/**
 * Generate recommendations based on user preferences and content list
 * Can accept either a User object directly or use the current user from localStorage
 */
export function generateUserRecommendations(
  contentList: any[],
  source: 'gutendex' | 'tvmaze' | 'jikan' | 'studioghibli',
  libraryItems?: (string | number)[],
  userOverride?: User // Optional user object (for server-side calls)
): RecommendationItem[] {
  const user = userOverride || getCurrentUser();
  if (!user) return [];

  const analysis = analyzeUserPreferences(user);
  const recommendations: RecommendationItem[] = [];

  contentList.forEach((content) => {
    // Skip if already in library
    if (libraryItems?.includes(content.id || content.name)) {
      return;
    }

    let genres: string[] = [];
    let actors: string[] = [];
    let directors: string[] = [];
    let title = '';
    let id: string | number = '';
    let image: string | undefined;

    // Extract data based on source
    switch (source) {
      case 'gutendex':
        title = content.title || '';
        id = content.id || '';
        genres = content.subjects ? content.subjects.slice(0, 3) : [];
        image = content.formats?.['image/jpeg'] || undefined;
        break;

      case 'tvmaze':
        title = content.show?.name || '';
        id = content.show?.id || '';
        genres = content.show?.genres || [];
        image = content.show?.image?.medium || undefined;
        break;

      case 'jikan':
        title = content.data?.title || content.title || '';
        id = content.data?.mal_id || content.id || '';
        genres = content.data?.genres?.map((g: any) => g.name) || [];
        image = content.data?.images?.jpg?.image_url || undefined;
        break;

      case 'studioghibli':
        title = content.title || '';
        id = content.id || '';
        // Use directors as a proxy for content similarity
        if (content.director) {
          directors = [content.director];
        }
        image = content.image || undefined;
        break;
    }

    if (!title) return;

    const { score, reasons } = calculateMatchScore(genres, actors, directors, analysis);

    if (score > 0) {
      recommendations.push({
        id,
        title,
        source,
        score,
        matchReasons: reasons,
        image,
        genres,
      });
    }
  });

  // Sort by score descending and return top 20
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 20);
}

/**
 * Compare two users and find common preferences or complementary recommendations
 */
export function compareUsersPreferences(user1: User, user2: User): {
  commonGenres: string[];
  commonActors: string[];
  commonDirectors: string[];
  compatibilityScore: number;
  description: string;
} {
  const analysis1 = analyzeUserPreferences(user1);
  const analysis2 = analyzeUserPreferences(user2);

  const commonGenres = analysis1.likedGenres.filter((g) => analysis2.likedGenres.includes(g));
  const commonActors = analysis1.likedActors.filter((a) => analysis2.likedActors.includes(a));
  const commonDirectors = analysis1.likedDirectors.filter((d) => analysis2.likedDirectors.includes(d));

  // Calculate compatibility score (0-100)
  const totalLikes1 = analysis1.likedGenres.length + analysis1.likedActors.length + analysis1.likedDirectors.length;
  const totalLikes2 = analysis2.likedGenres.length + analysis2.likedActors.length + analysis2.likedDirectors.length;
  const totalCommon = commonGenres.length + commonActors.length + commonDirectors.length;

  let compatibilityScore = 0;
  if (totalLikes1 > 0 && totalLikes2 > 0) {
    const avg = (totalLikes1 + totalLikes2) / 2;
    compatibilityScore = Math.round((totalCommon / avg) * 100);
  }

  let description = '';
  if (commonGenres.length > 0) {
    description += `Partagent les genres: ${commonGenres.join(', ')}. `;
  }
  if (commonActors.length > 0) {
    description += `Aiment les mêmes acteurs: ${commonActors.join(', ')}. `;
  }
  if (commonDirectors.length > 0) {
    description += `Appécient les mêmes réalisateurs: ${commonDirectors.join(', ')}. `;
  }

  if (description === '') {
    description = 'Pas de préférences communes trouvées.';
  }

  return {
    commonGenres,
    commonActors,
    commonDirectors,
    compatibilityScore: Math.min(compatibilityScore, 100),
    description,
  };
}

/**
 * Find bridge content that could connect two users' different tastes
 */
export function findBridgeContent(
  user1: User,
  user2: User,
  contentList: any[],
  source: 'gutendex' | 'tvmaze' | 'jikan' | 'studioghibli'
): RecommendationItem[] {
  const analysis1 = analyzeUserPreferences(user1);
  const analysis2 = analyzeUserPreferences(user2);

  const recommendations: RecommendationItem[] = [];

  contentList.forEach((content) => {
    let genres: string[] = [];
    let title = '';
    let id: string | number = '';

    // Extract data based on source
    switch (source) {
      case 'gutendex':
        title = content.title || '';
        id = content.id || '';
        genres = content.subjects ? content.subjects.slice(0, 3) : [];
        break;
      case 'tvmaze':
        title = content.show?.name || '';
        id = content.show?.id || '';
        genres = content.show?.genres || [];
        break;
      case 'jikan':
        title = content.data?.title || content.title || '';
        id = content.data?.mal_id || content.id || '';
        genres = content.data?.genres?.map((g: any) => g.name) || [];
        break;
      case 'studioghibli':
        title = content.title || '';
        id = content.id || '';
        break;
    }

    if (!title) return;

    // Find content that matches at least one preference from each user
    const matchesUser1 = genres.some((g) => analysis1.likedGenres.includes(g));
    const matchesUser2 = genres.some((g) => analysis2.likedGenres.includes(g));

    if (matchesUser1 && matchesUser2) {
      recommendations.push({
        id,
        title,
        source,
        score: 100,
        matchReasons: ['Pourrait plaire aux deux utilisateurs'],
        genres,
      });
    }
  });

  return recommendations.slice(0, 10);
}
