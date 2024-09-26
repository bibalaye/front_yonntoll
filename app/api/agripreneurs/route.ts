import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('_page') || '1');
    const perPage = parseInt(searchParams.get('_perPage') || '10');
    const sortField = searchParams.get('_sort') || 'id';
    const sortOrder = searchParams.get('_order') || 'ASC';
    const filter = searchParams.get('filter') ? JSON.parse(searchParams.get('filter') || '{}') : {};

    const skip = (page - 1) * perPage;

    const [agripreneurs, total] = await Promise.all([
      prisma.agripreneur.findMany({
        include: {
          user: true,
          products: true,
        },
        where: filter,
        skip,
        take: perPage,
        orderBy: {
          [sortField]: sortOrder.toLowerCase(),
        },
      }),
      prisma.agripreneur.count({ where: filter }),
    ]);

    return NextResponse.json(agripreneurs, {
      headers: {
        'X-Total-Count': total.toString(),
        'Access-Control-Expose-Headers': 'X-Total-Count',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des agripreneurs:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des agripreneurs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, farmName, description,accountName,accountNumber,bankName } = body;

    const existingAgripreneur = await prisma.agripreneur.findUnique({
      where: { userId },
    });

    if (existingAgripreneur) {
      return NextResponse.json({ error: 'L\'utilisateur est déjà un agripreneur' }, { status: 400 });
    }

    const newAgripreneur = await prisma.agripreneur.create({
      data: {
        userId,
        farmName,
        description,
        accountName,
        accountNumber,
        bankName
      }
    });

    return NextResponse.json(newAgripreneur);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'agripreneur:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'ajout de l\'agripreneur' }, { status: 500 });
  }
}
