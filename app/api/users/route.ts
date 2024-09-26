import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Gère les requêtes GET pour récupérer les utilisateurs avec pagination, tri et filtrage
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('_page') || '1');
    const perPage = parseInt(searchParams.get('_perPage') || '10');
    const sortField = searchParams.get('_sort') || 'id';
    const sortOrder = searchParams.get('_order') || 'ASC';
    const filter = searchParams.get('filter') ? JSON.parse(searchParams.get('filter') || '{}') : {};

    const skip = (page - 1) * perPage;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        include: {
          addresses: true,
        },
        where: filter,
        skip,
        take: perPage,
        orderBy: {
          [sortField]: sortOrder.toLowerCase(),
        },
      }),
      prisma.user.count({ where: filter }),
    ]);

    return NextResponse.json(users, {
      headers: {
        'X-Total-Count': total.toString(),
        'Access-Control-Expose-Headers': 'X-Total-Count',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des utilisateurs' }, { status: 500 });
  }
}
