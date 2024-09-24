'use client';

import React, { useEffect } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import LandingPage from './landingpage/page';
import ListUser from './components/ListUser'; // Importer le nouveau composant
import { useAuth, useUser } from '@clerk/nextjs'; 
import '@/styles/globals.css';

export default function Home() {
  const { isSignedIn } = useAuth(); // Vérifie si l'utilisateur est connecté
  const { user } = useUser(); // Récupère les informations de l'utilisateur connecté

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch('/api/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerkId: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.primaryEmailAddress?.emailAddress || '', // Adresse email principale
              phoneNumber: user.primaryPhoneNumber?.phoneNumber || '', // Numéro de téléphone principal
              imageUrl: user.imageUrl || '', // URL de l'image de l'utilisateur
            }),
          });
  
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              console.log('User synced successfully!');
            } else {
              console.error('Failed to sync user:', data.message);
            }
          } else {
            const errorText = await response.text();
            console.error('Error syncing user:', errorText);
          }
        } catch (error) {
          console.error('Error syncing user with database:', error);
        }
      }
    };
  
    syncUser();
  }, [isSignedIn, user]); // Exécuter l'effet lorsqu'un utilisateur est connecté

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <LandingPage />
      
      </main>
      <Footer />
    </div>
  );
}