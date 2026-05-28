import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';
    const topic = searchParams.get('topic') || '';

    let url = `https://gutendex.com/books?page=${page}`;

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (topic) {
      url += `&topic=${encodeURIComponent(topic)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des livres' },
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
    console.error('Erreur API Gutendex:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des livres' },
      { status: 500 }
    );
  }
}
