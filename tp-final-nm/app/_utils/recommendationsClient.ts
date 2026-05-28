import { User } from "@/app/_interfaces/user";
import { RecommendationItem } from "@/app/_services/RecommendationsService";

/**
 * Fetch recommendations for the current user from a specific source
 */
export async function fetchRecommendations(
  source: 'gutendex' | 'tvmaze' | 'jikan' | 'studioghibli',
  userPreferences: User,
  limit: number = 10
): Promise<RecommendationItem[]> {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source,
        userPreferences,
        limit,
      }),
    });

    if (!response.ok) {
      console.error('Erreur API recommendations:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error);
    return [];
  }
}

/**
 * Compare two users and get compatibility + bridge content
 */
export async function compareUsers(
  user1: User,
  user2: User,
  source?: 'gutendex' | 'tvmaze' | 'jikan' | 'studioghibli'
) {
  try {
    const response = await fetch('/api/recommendations/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user1,
        user2,
        source,
      }),
    });

    if (!response.ok) {
      console.error('Erreur API compare:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la comparaison des utilisateurs:', error);
    return null;
  }
}
