import { prisma } from '@/app/lib/prisma';
import { UserType } from '@prisma/client';
import { clerkClient } from '@clerk/nextjs/server';

type AddUserResponse = {
  success: boolean;
  user?: any;
  error?: boolean;
  message?: string;
};

export const addUserToDatabase = async (
  clerkId: string,
  firstName: string | null,
  lastName: string | null,
  email: string,
  phoneNumber: string | null,
  imageUrl: string | null,
  userType: UserType
): Promise<AddUserResponse> => {
  try {
    console.log('Adding user to database:', { clerkId, firstName, lastName, email, phoneNumber, imageUrl, userType });
    // Validation des entrées
    if (!email.includes('@')) {
      return { success: false, message: 'Invalid email address' };
    }

    //if (phoneNumber.length < 10) {
    //  return { success: false, message: 'Phone number is too short' };
    //}

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        email,
        phoneNumber: phoneNumber ?? undefined,
        imageUrl: imageUrl ?? undefined,
      },
      create: {
        clerkId,
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        email,
        phoneNumber: phoneNumber ?? '',
        imageUrl: imageUrl ?? '',
        userType,
      },
    });
    console.log('User upserted:', user); // Log de confirmation après insertion/mise à jour

    // Après avoir créé ou mis à jour l'utilisateur
    await getUserTypeFromPrisma(clerkId);

    return { success: true, user };
  } catch (error: any) {
    if (error.code === 'P2002') { // Erreur de contrainte unique Prisma
      return { success: false, message: 'Email or clerkId already exists' };
    }

    console.error("Database error:", error);
    return { success: false, error: true };
  }
};

// Nouvelle fonction pour mettre à jour les métadonnées Clerk
async function updateClerkUserMetadata(clerkId: string, userType: UserType) {
  try {
    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: {
        user_type: userType,
      },
    });
    
    // Vérification si userType est bien ajouté dans publicMetadata
    const updatedUser = await clerkClient.users.getUser(clerkId);
    if (updatedUser.publicMetadata.user_type !== userType) {
      console.error(`Échec de la mise à jour du userType dans les métadonnées publiques pour l'utilisateur ${clerkId}`);
      throw new Error("Échec de la mise à jour des métadonnées");
    }
    console.log(`Métadonnées Clerk mises à jour pour l'utilisateur ${clerkId} usertype: ${userType}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des métadonnées Clerk:", error);
    throw error; // Propager l'erreur pour une gestion appropriée
  }
}

// Nouvelle fonction pour récupérer le UserType depuis Prisma
export const getUserTypeFromPrisma = async (clerkId: string): Promise<UserType | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { userType: true },
    });
    const userType = user?.userType ?? null;
    if (userType) {
      // Après avoir récupéré l'utilisateur
      await updateClerkUserMetadata(clerkId, userType);
    }
    return userType;
  } catch (error) {
    console.error("Erreur lors de la récupération du UserType depuis Prisma:", error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    console.log('All users retrieved:', users); // Log de confirmation après récupération
    return users;
  } catch (error: any) {
    console.error("Database error:", error);
    throw new Error('Error retrieving users from database');
  }
};
