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
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <motion.h1 
        className="text-8xl font-bold text-green-800 mb-4"
        animate={{ rotate: isAnimating ? 360 : 0 }}
        transition={{ duration: 1 }}
      >
        404
      </motion.h1>
      <motion.p 
        className="text-3xl text-green-600 mb-8"
        animate={{ scale: isAnimating ? 1.1 : 1 }}
        transition={{ duration: 1 }}
      >
        Oups ! Cette page est en construction. Elle sera bientôt disponible !
      </motion.p>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
          Retour à l&apos;accueil
        </Link>
      </motion.div>
    </div>
  );
}