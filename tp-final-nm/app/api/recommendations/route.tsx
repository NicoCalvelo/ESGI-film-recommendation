import { NextRequest, NextResponse } from 'next/server';
import { generateUserRecommendations } from '@/app/_services/RecommendationsService';
import { User } from '@/app/_interfaces/user';
import { getMockUsers } from '@/app/_utils/mockUsers';

function getCommunityUser(): User {
  const allUsers = getMockUsers();
  const genreCounts: Record<string, number> = {};
  const actorCounts: Record<string, number> = {};
  const directorCounts: Record<string, number> = {};
  
  const disGenreCounts: Record<string, number> = {};

  allUsers.forEach(u => {
    u.likes.genres.forEach(g => genreCounts[g] = (genreCounts[g] || 0) + 1);
    u.likes.actors.forEach(a => actorCounts[a] = (actorCounts[a] || 0) + 1);
    u.likes.directors.forEach(d => directorCounts[d] = (directorCounts[d] || 0) + 1);
    
    u.dislikes.genres.forEach(g => disGenreCounts[g] = (disGenreCounts[g] || 0) + 1);
  });

  const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
  const topActors = Object.entries(actorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
  const topDirectors = Object.entries(directorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
  const topDisGenres = Object.entries(disGenreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);

  return {
    id: 'community',
    name: 'Communauté',
    email: '',
    likes: { genres: topGenres, actors: topActors, directors: topDirectors, books: [], films: [], series: [], anime: [] },
    dislikes: { genres: topDisGenres, actors: [], directors: [], books: [], films: [], series: [], anime: [] }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, limit = 10, userPreferences, category } = body;

    if (!source || !userPreferences) {
      return NextResponse.json(
        { error: 'source et userPreferences sont requis' },
        { status: 400 }
      );
    }

    const communityUser = getCommunityUser();

    // Fetch content from the appropriate API
    let fetchedContent: any[] = [];

    switch (source) {
      case 'gutendex': {
        const userGenres: string[] = userPreferences.likes?.genres ?? [];
        const communityGenres: string[] = communityUser.likes.genres;
        
        // Find a topic to search for, preferring user genres over community genres
        const searchTopic = userGenres.length > 0 ? userGenres[0] : (communityGenres.length > 0 ? communityGenres[0] : '');
        const url = searchTopic ? `https://gutendex.com/books?topic=${encodeURIComponent(searchTopic)}` : 'https://gutendex.com/books';
        
        const gutendexResponse = await fetch(url);
        if (gutendexResponse.ok) {
          const data = await gutendexResponse.json();
          fetchedContent = data.results || [];
        }
        break;
      }

      case 'jikan': {
        const jikanResponse = await fetch('https://api.jikan.moe/v4/anime');
        if (jikanResponse.ok) {
          const data = await jikanResponse.json();
          fetchedContent = data.data || [];
        }
        break;
      }

      case 'tvmaze': {
        // TVMaze does not have a native query parameter for genres. 
        // We must fetch the shows index and filter them locally based on their associated genres.
        // /shows returns 250 shows per page, which is sufficient for local filtering.
        const tvmazeResponse = await fetch('https://api.tvmaze.com/shows');
        if (tvmazeResponse.ok) {
          const shows = await tvmazeResponse.json();
          // Wrap the results in a 'show' property to maintain compatibility with RecommendationsService
          fetchedContent = shows.map((show: any) => ({ show }));
        }
        break;
      }

      case 'studioghibli': {
        const ghibliResponse = await fetch('https://ghibliapi.dev/films');
        if (ghibliResponse.ok) {
          fetchedContent = await ghibliResponse.json();
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Source invalide. Utilisez: gutendex, tvmaze, jikan, ou studioghibli' },
          { status: 400 }
        );
    }

    if (fetchedContent.length === 0) {
      return NextResponse.json(
        { error: 'Aucun contenu trouvé pour cette source' },
        { status: 404 }
      );
    }

    const tempUser: User = userPreferences;

    // 1. Generate for current user
    const recommendations = generateUserRecommendations(
      fetchedContent,
      source as 'gutendex' | 'tvmaze' | 'jikan' | 'studioghibli',
      undefined,
      tempUser,
      category
    );

    // 2. Fallback to community if < 5 items
    if (recommendations.length < 5) {
      const communityRecommendations = generateUserRecommendations(
        fetchedContent,
        source as 'gutendex' | 'tvmaze' | 'jikan' | 'studioghibli',
        undefined,
        communityUser,
        category
      );

      const existingIds = new Set(recommendations.map((r) => r.id));
      for (const rec of communityRecommendations) {
        if (!existingIds.has(rec.id)) {
          // Add a custom reason so user knows it's from the community
          rec.matchReasons = ['Populaire dans la communauté', ...rec.matchReasons];
          recommendations.push(rec);
          existingIds.add(rec.id);
        }
      }
    }

    const limitedRecommendations = recommendations.slice(0, Math.min(limit, 20));

    return NextResponse.json(
      {
        source,
        totalRecommendations: recommendations.length,
        recommendations: limitedRecommendations,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=1800',
        },
      }
    );
  } catch (error) {
    console.error('Erreur API Recommendations:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la génération des recommandations' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // GET version for simple requests
  return NextResponse.json(
    {
      message: 'Utilisez POST /api/recommendations avec { source, userPreferences, limit }',
    },
    { status: 200 }
  );
}
