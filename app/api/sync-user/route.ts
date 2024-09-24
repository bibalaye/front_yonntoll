
import { addUserToDatabase } from '@/app/utils/userService';
import { NextResponse } from 'next/server';

// Gère les requêtes POST
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse le corps de la requête

    const { clerkId, firstName, lastName, email, phoneNumber, imageUrl } = body;

    // Ajoute l'utilisateur à la base de données
    const user = await addUserToDatabase(clerkId, firstName, lastName, email, phoneNumber, imageUrl, 'CLIENT');
    if (user) {
      console.log('User successfully synced to database:', user); // Log de la réponse Prisma
    }

    // Réponse réussie
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user with database:', error);
    return NextResponse.json({ success: false, message: 'Error syncing user to database' }, { status: 500 });
  }
}
