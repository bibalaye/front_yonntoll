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
  <div className="max-w-sm bg-white rounded-3xl overflow-hidden shadow-md">
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
    
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold font-montserrat text-[#08651E] truncate">{product.name}</h2>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#F7B65C]' : 'text-[#D9D9D9]'}`} fill="currentColor" />
          ))}
          <span className="ml-1 text-sm text-[#08651E]">({product.rating})</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-xl font-extrabold text-[#08651E]">{product.price} f / Kg</span>
          <span className="ml-2 text-sm line-through text-[#D9482B]">{product.oldPrice} f / Kg</span>
          </div>
          <span className="text-sm text-[#08651E] truncate">Ferme : {product.agripreneur.farmName}</span>
      </div>
      <a href={`/products/${product.id}`} className="w-full bg-[#08651E] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Acheter
      </a>
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

export default ProductCard;
