import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Truck, Facebook, Linkedin, Instagram, Music, Youtube, Search, User, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = 10; // Seuil de défilement pour activer l'en-tête fixe

      setIsSticky(scrollPosition > threshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div style={{ height: isSticky ? '100px' : '0' }} /> {/* Espace réservé pour éviter le saut */}
      <header className={`bg-green-900 text-white transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''}`}>
        <div className="container mx-auto px-2 sm:px-4">
          {/* Top bar */}
          <div className="flex flex-wrap justify-between items-center py-2 text-xs sm:text-sm">
            <div className="flex items-center mb-2 sm:mb-0">
              <Phone size={16} className="mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">+221 77 345 34 12</span>
            </div>
            <div className="flex items-center mb-2 sm:mb-0">
              <Truck size={40} className="mr-1 sm:mr-2" />
              <span className="text-base sm:text-xl font-extrabold">Livraison 24 h /24</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-0 font-extrabold">
              <Facebook size={17} />
              <Linkedin size={17} />
              <Instagram size={17} />
              <Music size={17} />
              <Youtube size={17} />
              <div className="flex">
                <button className="bg-white text-green-700 px-1 sm:px-2 py-1 rounded-l-full text-xs sm:text-sm border border-green-700">FR</button>
                <button className="bg-green-600 text-white px-1 sm:px-2 py-1 rounded-r-full text-xs sm:text-sm border border-green-600">AN</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="bg-white text-green-800">
          <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-wrap justify-between items-center">
            <Link href="/" className="mb-2 sm:mb-0">
              <Image src="/logo.png" alt="Yoonu Tool" width={80} height={40} className="w-20 sm:w-24 md:w-28 h-auto" />
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-2 sm:space-x-4 lg:space-x-6 text-sm sm:text-base md:text-lg">
                <li><Link href="/" className={`text-[#08651E] text-Montserrat hover:text-green-600 ${pathname === '/' ? 'font-bold' : ''}`}>ACCUEIL</Link></li>
                <li><Link href="/qui-sommes-nous" className={`text-[#08651E] text-Montserrat hover:text-green-600 ${pathname === '/qui-sommes-nous' ? 'font-bold' : ''}`}>QUI SOMMES NOUS ?</Link></li>
                <li><Link href="/produits" className={`text-[#08651E] text-Montserrat hover:text-green-600 ${pathname === '/produits' ? 'font-bold' : ''}`}>PRODUITS</Link></li>
                <li><Link href="/nos-fermes" className={`text-[#08651E] text-Montserrat hover:text-green-600 ${pathname === '/nos-fermes' ? 'font-bold' : ''}`}>NOS FERMES</Link></li>
                <li><Link href="/contact" className={`text-[#08651E] text-Montserrat hover:text-green-600 ${pathname === '/contact' ? 'font-bold' : ''}`}>CONTACT</Link></li>
              </ul>

            </nav>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Search size={18} className="hidden sm:block" />
              <User size={18} className="hidden sm:block" />
              <div className="relative hidden sm:block">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs">
                  1
                </div>
              </div>
              <Menu size={24} className="md:hidden" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;