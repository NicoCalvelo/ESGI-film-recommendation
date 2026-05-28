import { NextRequest, NextResponse } from 'next/server';
import { compareUsersPreferences, findBridgeContent } from '@/app/_services/RecommendationsService';
import { User } from '@/app/_interfaces/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user1, user2, source } = body;

    if (!user1 || !user2) {
      return NextResponse.json(
        { error: 'user1 et user2 sont requis' },
        { status: 400 }
      );
    }

    // Get compatibility between two users
    const compatibility = compareUsersPreferences(user1, user2);

    // If source is provided, find bridge content
    let bridgeContent: any[] = [];
    if (source) {
      let contentUrl = '';
      let fetchedContent = [];

      switch (source) {
        case 'gutendex':
          const gutendexResponse = await fetch('https://gutendex.com/books');
          if (gutendexResponse.ok) {
            const data = await gutendexResponse.json();
            fetchedContent = data.results || [];
          }
          break;

        case 'jikan':
          const jikanResponse = await fetch('https://api.jikan.moe/v4/anime');
          if (jikanResponse.ok) {
            const data = await jikanResponse.json();
            fetchedContent = data.data || [];
          }
          break;

        case 'studioghibli':
          const ghibliResponse = await fetch('https://ghibliapi.dev/films');
          if (ghibliResponse.ok) {
            fetchedContent = await ghibliResponse.json();
          }
          break;

        case 'tvmaze':
          // TVMaze not supported for bridge content without search query
          break;
      }

      if (fetchedContent.length > 0) {
        bridgeContent = findBridgeContent(user1, user2, fetchedContent, source);
      }
    }

    return NextResponse.json(
      {
        compatibility,
        bridgeContent: bridgeContent.length > 0 ? bridgeContent : 'Pas de contenu pont trouvé',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=1800',
        },
      }
    );
  } catch (error) {
    console.error('Erreur API Recommendations Compare:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la comparaison des utilisateurs' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Utilisez POST /api/recommendations/compare avec { user1, user2, source? }',
      example: {
        user1: {
          id: 'user1',
          name: 'Alice',
          email: 'alice@example.com',
          likes: {
            genres: ['Action', 'Adventure'],
            actors: [],
            directors: [],
            books: [],
            films: [],
            series: [],
            anime: [],
          },
          dislikes: {
            genres: [],
            actors: [],
            directors: [],
            books: [],
            films: [],
            series: [],
            anime: [],
          },
        },
        user2: {
          id: 'user2',
          name: 'Bob',
          email: 'bob@example.com',
          likes: {
            genres: ['Comedy', 'Adventure'],
            actors: [],
            directors: [],
            books: [],
            films: [],
            series: [],
            anime: [],
          },
          dislikes: {
            genres: [],
            actors: [],
            directors: [],
            books: [],
            films: [],
            series: [],
            anime: [],
          },
        },
        source: 'jikan',
      },
    },
    { status: 200 }
  );
}
