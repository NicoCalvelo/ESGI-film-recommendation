import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = searchParams.get('page') || '1';

    let url = 'https://api.jikan.moe/v4/anime';

    if (search) {
      url += `?query=${encodeURIComponent(search)}&page=${page}`;
    } else {
      url += `?page=${page}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des animes' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Erreur API Jikan:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des animes' },
      { status: 500 }
    );
  }
}
