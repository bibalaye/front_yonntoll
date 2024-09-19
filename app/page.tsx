'use client';

import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import LandingPage from './landingpage/page';

export default function Home() {
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
