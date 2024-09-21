'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';


export default function NotFound() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <motion.h1 
          className="text-6xl sm:text-8xl font-extrabold text-green-800 mb-2 sm:mb-4"
          animate={{ rotate: isAnimating ? 360 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          404
        </motion.h1>
        <motion.p 
          className="text-xl sm:text-3xl text-green-600 mb-8"
          animate={{ scale: isAnimating ? 1.05 : 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          Oups ! Cette page est en construction. Elle sera bientôt disponible !
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link href="/" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg text-lg sm:text-xl">
            Retour à l&apos;accueil
          </Link>
        </motion.div>
      </div>
    </div>
  );
}