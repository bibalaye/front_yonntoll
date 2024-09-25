import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Gère les requêtes GET pour récupérer tous les utilisateurs
export async function GET() {
  try {
    const agripreneurs = await prisma.agripreneur.findMany({
      include: {
        user: true,
        products: true,
      },
    });
    return NextResponse.json(agripreneurs);
  } catch (error) {
    console.error('Error fetching agripreneur:', error);
    return NextResponse.json({ error: 'Error fetching agripreneur' }, { status: 500 });
  }
}

// Gère les requêtes POST pour ajouter un agripreneur
export async function POST(req: Request) {
  try {
    const { userId, farmName, description } = await req.json();

    // Vérifier si l'utilisateur est déjà un agripreneur
    const existingAgripreneur = await prisma.agripreneur.findUnique({
      where: { userId },
    });

    if (existingAgripreneur) {
      return NextResponse.json({ error: 'L\'utilisateur est déjà un agripreneur' }, { status: 400 });
    }

    const newAgripreneur = await prisma.agripreneur.create({
      data: {
        userId, // Utiliser directement userId
        farmName,
        description
      }
    });

    return NextResponse.json(newAgripreneur);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'agripreneur:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'ajout de l\'agripreneur' }, { status: 500 });
  }
}
