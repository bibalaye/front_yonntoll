import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Truck, Facebook, Linkedin, Instagram, Music, ShoppingCart, Youtube, Search, User, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { header } from 'framer-motion/client';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = 10;
      setIsSticky(scrollPosition > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className={`h-${isSticky ? '24' : '0'} transition-all duration-300`} />
      <header className={`bg-green-900 text-white transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''}`}>
        <div className="container mx-auto px-2 sm:px-4 lg:px-6">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center py-2 text-xs sm:text-sm space-y-2 sm:space-y-0">
            <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
              <Phone size={16} className="mr-1" />
              <span className="text-xs sm:text-sm">+221 77 345 34 12</span>
            </div>
            <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
              <Truck size={20} className="mr-1" />
              <span className="text-sm sm:text-base lg:text-lg font-extrabold">Livraison 24 h /24</span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end space-x-2 w-full sm:w-auto">
              <Facebook size={16} className="cursor-pointer" />
              <Linkedin size={16} className="cursor-pointer" />
              <Instagram size={16} className="cursor-pointer" />
              <Music size={16} className="cursor-pointer" />
              <Youtube size={16} className="cursor-pointer" />
              <div className="flex mt-2 sm:mt-0">
                <button className="bg-white text-green-700 px-2 py-1 rounded-l-full text-xs border border-green-700">FR</button>
                <button className="bg-green-600 text-white px-2 py-1 rounded-r-full text-xs border border-green-600">AN</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="bg-white text-green-800">
          <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
            <div className="flex flex-wrap items-center justify-between">
              <Link href="/" className="mb-2 sm:mb-0 flex-shrink-0">
                <Image src="/logo.png" alt="Yoonu Tool" width={80} height={40} className="w-20 sm:w-24 md:w-28 h-auto" />
              </Link>
              <nav className="hidden lg:flex lg:flex-grow lg:justify-center">
                <ul className="flex space-x-6 text-sm">
                  <li><Link href="/" className={`text-[#08651E] hover:text-green-600 ${pathname === '/' ? 'font-bold' : ''}`}>ACCUEIL</Link></li>
                  <li><Link href="/qui-sommes-nous" className={`text-[#08651E] hover:text-green-600 ${pathname === '/qui-sommes-nous' ? 'font-bold' : ''}`}>QUI SOMMES NOUS ?</Link></li>
                  <li><Link href="/produits" className={`text-[#08651E] hover:text-green-600 ${pathname === '/produits' ? 'font-bold' : ''}`}>PRODUITS</Link></li>
                  <li><Link href="/nos-fermes" className={`text-[#08651E] hover:text-green-600 ${pathname === '/nos-fermes' ? 'font-bold' : ''}`}>NOS FERMES</Link></li>
                  <li><Link href="/contact" className={`text-[#08651E] hover:text-green-600 ${pathname === '/contact' ? 'font-bold' : ''}`}>CONTACT</Link></li>
                </ul>
              </nav>
              <div className="flex items-center space-x-4 ml-auto">
                <div className="hidden md:flex items-center space-x-4">
                  <Search size={18} className="cursor-pointer" />
                  <div className="relative">
                    <ShoppingCart size={18} className="cursor-pointer" />
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      1
                    </div>
                  </div>
                </div>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-sm text-[#08651E] hover:text-green-600">
                      Se connecter
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <button onClick={toggleMenu} className="lg:hidden">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
            {isMenuOpen && (
              <nav className="lg:hidden mt-4">
                <ul className="flex flex-col space-y-2">
                  <li><Link href="/" className={`block py-2 text-[#08651E] hover:text-green-600 ${pathname === '/' ? 'font-bold' : ''}`}>ACCUEIL</Link></li>
                  <li><Link href="/qui-sommes-nous" className={`block py-2 text-[#08651E] hover:text-green-600 ${pathname === '/qui-sommes-nous' ? 'font-bold' : ''}`}>QUI SOMMES NOUS ?</Link></li>
                  <li><Link href="/produits" className={`block py-2 text-[#08651E] hover:text-green-600 ${pathname === '/produits' ? 'font-bold' : ''}`}>PRODUITS</Link></li>
                  <li><Link href="/nos-fermes" className={`block py-2 text-[#08651E] hover:text-green-600 ${pathname === '/nos-fermes' ? 'font-bold' : ''}`}>NOS FERMES</Link></li>
                  <li><Link href="/contact" className={`block py-2 text-[#08651E] hover:text-green-600 ${pathname === '/contact' ? 'font-bold' : ''}`}>CONTACT</Link></li>
                </ul>
                <div className="mt-6 flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Search size={20} className="cursor-pointer text-[#08651E]" />
                      <div className="relative">
                        <ShoppingCart size={20} className="cursor-pointer text-[#08651E]" />
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          1
                        </div>
                      </div>
                    </div>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="text-sm font-medium bg-[#08651E] text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">
                          Se connecter
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </div>
                  <SignedIn>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User size={20} className="text-[#08651E]" />
                        <span className="text-sm font-medium text-[#08651E]">Mon compte</span>
                      </div>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;