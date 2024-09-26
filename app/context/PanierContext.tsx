'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProduitPanier {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface PanierContextType {
  panier: ProduitPanier[];
  ajouterAuPanier: (produit: ProduitPanier) => void;
  retirerDuPanier: (id: number) => void;
  viderPanier: () => void;
}

const PanierContext = createContext<PanierContextType | undefined>(undefined);

export const PanierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [panier, setPanier] = useState<ProduitPanier[]>([]);

  useEffect(() => {
    const panierSauvegarde = localStorage.getItem('panier');
    if (panierSauvegarde) {
      setPanier(JSON.parse(panierSauvegarde));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(panier));
  }, [panier]);

  const ajouterAuPanier = (produit: ProduitPanier) => {
    setPanier(panierActuel => {
      const produitExistant = panierActuel.find(item => item.id === produit.id);
      if (produitExistant) {
        return panierActuel.map(item =>
          item.id === produit.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...panierActuel, { ...produit, quantity: 1 }];
    });
  };

  const retirerDuPanier = (id: number) => {
    setPanier(panierActuel => panierActuel.filter(item => item.id !== id));
  };

  const viderPanier = () => {
    setPanier([]);
  };

  return (
    <PanierContext.Provider value={{ panier, ajouterAuPanier, retirerDuPanier, viderPanier }}>
      {children}
    </PanierContext.Provider>
  );
};

export const usePanier = () => {
  const context = useContext(PanierContext);
  if (context === undefined) {
    throw new Error('usePanier doit être utilisé à l/intérieur d/un PanierProvider');
  }
  return context;
};
