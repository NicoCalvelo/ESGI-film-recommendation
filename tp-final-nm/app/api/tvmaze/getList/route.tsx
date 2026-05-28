import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    if (!search) {
      return NextResponse.json(
        { error: 'Le paramètre de recherche est requis' },
        { status: 400 }
      );
    }

    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(search)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des séries' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const sortedData = data.sort((a: any, b: any) => {
      const ratingA = a.show?.rating?.average || 0;
      const ratingB = b.show?.rating?.average || 0;
      return ratingB - ratingA;
    });

    return NextResponse.json(sortedData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Erreur API TVMaze:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des séries' },
      { status: 500 }
    );
  }
}
