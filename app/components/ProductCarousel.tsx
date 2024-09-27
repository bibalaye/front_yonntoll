import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface Product {
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  farm: string;
  image: string;
  
}

function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(0);
    
    useEffect(() => {
      function handleResize() {
        setWindowWidth(window.innerWidth);
      }
      
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }
    }, []);
  
    return windowWidth;
  }

const ProductCarousel: React.FC<{ products: Product[] }> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = useWindowWidth();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (products?.length || 1));
  }, [products]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (products?.length || 1)) % (products?.length || 1));
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="relative mx-2 sm:mx-4 md:mx-6 lg:mx-10 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] bg-[#CDEED6] p-4 sm:p-6 md:p-8 rounded-3xl">
      <div className="flex flex-col sm:flex-row justify-center items-center w-full h-full space-y-4 sm:space-y-0 sm:space-x-2 md:space-x-4 pb-4">
        {products.slice(currentIndex, currentIndex + (windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3)).map((product, index) => (
          <div key={index} className="w-full xs:w-3/4 sm:w-1/2 lg:w-1/3 h-auto p-2 mx-auto flex justify-center">
            <div className="transform transition-all duration-300 hover:scale-105 w-full max-w-sm">
              <ProductCard product={product} isInCarousel={true} />
            </div>
          </div>
        ))}
      </div>
      <button 
        className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 sm:p-2 shadow-md"
        onClick={prevSlide}
        aria-label="Produit précédent"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
      </button>
      <button 
        className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 sm:p-2 shadow-md"
        onClick={nextSlide}
        aria-label="Produit suivant"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
      </button>
      <div className="flex justify-center mt-4">
        {products.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mx-0.5 sm:mx-1 ${i === currentIndex ? 'bg-green-600' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
