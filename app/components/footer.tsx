import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold mb-2">Yoonu Tool</h3>
            <p className="text-sm">Votre partenaire en outils agricoles</p>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/about" className="hover:underline">À propos</Link></li>
              <li><Link href="/produits" className="hover:underline">Produits</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mt-4 text-center text-sm">
          <p>&copy; 2024 Yoonu Tool. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
