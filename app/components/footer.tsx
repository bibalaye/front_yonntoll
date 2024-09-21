import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Yoonu Tool</h3>
            <p className="text-sm md:text-base">Votre partenaire en outils agricoles</p>
          </div>
          <nav className="md:col-span-2">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-8">
              <li><Link href="/about" className="hover:underline text-sm md:text-base py-2 px-3 transition duration-300 ease-in-out hover:bg-green-700 rounded">À propos</Link></li>
              <li><Link href="/produits" className="hover:underline text-sm md:text-base py-2 px-3 transition duration-300 ease-in-out hover:bg-green-700 rounded">Produits</Link></li>
              <li><Link href="/contact" className="hover:underline text-sm md:text-base py-2 px-3 transition duration-300 ease-in-out hover:bg-green-700 rounded">Contact</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-green-700 text-center text-xs md:text-sm">
          <p>&copy; 2024 Yoonu Tool. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
