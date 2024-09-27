import React from 'react';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductImage {
  imageUrl: string;
}

interface Product {
  images: ProductImage[];
  id: string;
  name: string;
  rating: number;
  oldPrice: number;
  description: string;
  category: { name: string };
  subCategory: { name: string };
  price: number;
  stock: number;
  agripreneur: {
    farmName: string;
  };
}

const ProductCard: React.FC<{ product: Product }> = React.memo(({ product }) => (
  <div className="max-w-[250px] xs:max-w-sm sm:max-w-sm bg-white rounded-3xl overflow-hidden shadow-md relative">
     {product.images && product.images.length > 0 ? (
                  <Image 
                  src={product.images[0].imageUrl} 
                  alt={product.name} 
                  width={400} 
                  height={300} 
                  className="w-full h-auto aspect-[4/3] object-cover sm:h-48 md:h-56 lg:h-64 xl:h-72" 
                />
                ) : (
                  <Image 
                  src="/logo.png" 
                  alt="Default Product Image" 
                  width={400} 
                  height={300} 
                  className="w-full h-auto aspect-[4/3] object-cover sm:h-48 md:h-56 lg:h-64 xl:h-72" 
                />
                )}
    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md flex items-center">
      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#F7B65C]" fill="currentColor" />
      {/* <span className="ml-1 text-xs sm:text-sm text-[#08651E] font-semibold">{product.rating}</span> */}
    </div>
    <div className="p-2 sm:p-4">
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        <div className="flex justify-between items-center space-x-2">
          <h2 className="text-[10px] truncate xs:text-xs sm:text-base font-semibold font-montserrat text-[#08651E] truncate">{product.name}</h2>
          <span className="text-[8px] xs:text-xs sm:text-sm text-[#08651E] truncate">Ferme : {product.agripreneur.farmName}</span>
        </div>
        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md flex items-center">
          <span className="ml-1 text-xs sm:text-sm text-[#08651E] font-semibold">{product.rating}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <div className="flex justify-between space-x-8">
          <span className="text-[10px] xs:text-xs sm:text-base font-extrabold text-[#08651E]">{product.price} f / Kg</span>
          <span className="text-[8px] xs:text-xs sm:text-sm line-through text-[#D9482B]">50000 f / Kg</span>
        </div>
      </div>
      <a href={`/produits/${product.id}`} className="w-full bg-[#08651E] hover:bg-green-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-lg flex items-center justify-center text-xs sm:text-sm">
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
        Acheter
      </a>
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

export default ProductCard;
