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

    const [subcategories, total] = await Promise.all([
      prisma.subCategory.findMany({
        where: filter,
        skip,
        take: perPage,
        orderBy: {
          [sortField]: sortOrder.toLowerCase(),
        },
      }),
      prisma.subCategory.count({ where: filter }),
    ]);

    return NextResponse.json(subcategories, {
      headers: {
        'X-Total-Count': total.toString(),
        'Access-Control-Expose-Headers': 'X-Total-Count',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des sous-catégories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryId } = body;
    const newSubCategory = await prisma.subCategory.create({
      data: { name, categoryId },
    });
    return NextResponse.json(newSubCategory, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la sous-catégorie:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la sous-catégorie' }, { status: 500 });
  }
}
