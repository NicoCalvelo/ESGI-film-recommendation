import { NextRequest, NextResponse } from 'next/server';
import { searchMockUsers, getMockUsers } from '@/app/_utils/mockUsers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const excludeId = searchParams.get('excludeId') || undefined;

    if (!query) {
      // return first 5 mock users excluding current
      const users = getMockUsers().filter((u) => u.id !== excludeId).slice(0, 5);
      return NextResponse.json({ users }, { status: 200 });
    }

    const results = searchMockUsers(query, excludeId);

    return NextResponse.json({ users: results }, { status: 200 });
  } catch (error) {
    console.error('Erreur API users/search:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de la recherche d\'utilisateurs' }, { status: 500 });
  }
}
