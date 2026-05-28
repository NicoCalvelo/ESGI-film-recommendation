import { NextRequest, NextResponse } from 'next/server';
import { generateUserRecommendations } from '@/app/_services/RecommendationsService';
import { User } from '@/app/_interfaces/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, limit = 10, userPreferences } = body;

    if (!source || !userPreferences) {
      return NextResponse.json(
        { error: 'source et userPreferences sont requis' },
        { status: 400 }
      );
    }

    // Fetch content from the appropriate API
    let contentUrl = '';
    let fetchedContent = [];

    switch (source) {
      case 'gutendex':
        contentUrl = 'https://gutendex.com/books';
        const gutendexResponse = await fetch(contentUrl);
        if (gutendexResponse.ok) {
          const data = await gutendexResponse.json();
          fetchedContent = data.results || [];
        }
        break;

      case 'jikan':
        contentUrl = 'https://api.jikan.moe/v4/anime';
        const jikanResponse = await fetch(contentUrl);
        if (jikanResponse.ok) {
          const data = await jikanResponse.json();
          fetchedContent = data.data || [];
        }
        break;

      case 'tvmaze':
        return NextResponse.json(
          { 
            recommendations: [],
            message: 'TVMaze requires a search query. Use /api/tvmaze/getList?search=<query>' 
          },
          { status: 200 }
        );

      case 'studioghibli':
        contentUrl = 'https://ghibliapi.dev/films';
        const ghibliResponse = await fetch(contentUrl);
        if (ghibliResponse.ok) {
          fetchedContent = await ghibliResponse.json();
        }
        break;

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

    // Since we're on server-side, we'll create a temporary user object from preferences
    // and use it to generate recommendations
    const tempUser: User = userPreferences;

    // Since we're on server-side, we need to pass the user data explicitly
    // to the generateUserRecommendations function
    const recommendations = generateUserRecommendations(
      fetchedContent,
      source as 'gutendex' | 'tvmaze' | 'jikan' | 'studioghibli',
      undefined,
      tempUser
    );

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
  // GET version for simple requests (client should use POST for better control)
  return NextResponse.json(
    {
      message: 'Utilisez POST /api/recommendations avec { source, userPreferences, limit }',
      example: {
        source: 'jikan',
        userPreferences: {
          id: 'user123',
          name: 'John',
          email: 'john@example.com',
          likes: {
            genres: ['Action', 'Adventure'],
            actors: [],
            directors: [],
            books: [],
            films: [],
            series: [],
            anime: ['Anime'],
          },
          dislikes: {
            genres: ['Horror'],
            actors: [],
            directors: [],
            books: [],
            films: [],
            series: [],
            anime: [],
          },
        },
        limit: 10,
      },
    },
    { status: 200 }
  );
}
