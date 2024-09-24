'use client';

import React from 'react';
import BanniereAccueil from '../components/BanniereAccueil'
import CategorySection from '../components/CategorySection';
import BannerSection from '../components/BannerSection';
import ProductSection from '../components/ProductSection';
import JoinPlatformSection from '../components/JoinPlatformSection';

const LandingPage: React.FC = () => {
  return (
    <div className="w-full">
      <BanniereAccueil />
      <CategorySection />
      <BannerSection />
      <ProductSection title="LES PLUS DEMANDÉS" />
      <JoinPlatformSection />
      <ProductSection title="NOS PRODUITS" />
    </div>
  );
}

export default LandingPage;
