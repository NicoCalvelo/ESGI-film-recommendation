import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = 'https://ghibliapi.dev/films';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des films Studio Ghibli' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Erreur API Studio Ghibli:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des films Studio Ghibli' },
      { status: 500 }
    );
  }
}
