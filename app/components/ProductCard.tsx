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
  <div className="bg-white p-4  rounded-3xl shadow-md hover:shadow-lg transition duration-300">
    <div className="relative w-full h-48">
      <Image
        src={product.images && product.images.length > 0 ? product.images[0].imageUrl : "/placeholder-image.jpg"}
        alt={product.name}
        fill
        style={{ objectFit: "cover" }}
        className="rounded-lg"
      />
    </div>
    
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2 text-[#08651E] truncate">{product.name}</h2>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#F7B65C]' : 'text-[#D9D9D9]'}`} fill="currentColor" />
        ))}
        <span className="ml-1 text-xs text-[#08651E]">({product.rating})</span>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-sm font-extrabold text-[#08651E]">{product.price} XOF</span>
          <span className="ml-2 text-sm line-through text-[#D9482B]">{product.oldPrice} XOF</span>
        </div>
        <span className="text-sm text-[#08651E] truncate">Ferme : {product.agripreneur.farmName}</span>
      </div>
      <a href={`/produits/${product.id}`} className="w-full bg-[#08651E] hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Acheter
      </a>
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

export default ProductCard;
