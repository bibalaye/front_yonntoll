'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AjouterAuPanier from '../../components/AjouterAuPanier';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '@/app/components/loader';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
  };
  subCategory: { name: string };
  stock: number;
  color?: string;
  size?: string;
  agripreneur: { farmName: string };
  images: { imageUrl: string }[];
  reviews: Review[];
}

interface Review {
  rating: number;
  createdAt: string;
  comment: string;
  helpfulVotes: number;
}

async function getProductDetails(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des détails du produit');
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du produit:", error);
    return null;
  }
}

async function getSimilarProducts(categoryId: number, productId: number): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products/similar?categoryId=${categoryId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des produits similaires');
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits similaires:", error);
    return [];
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const productData = await getProductDetails(params.id);
      if (productData) {
        setProduct(productData);
        setSelectedImage(productData.images[0]?.imageUrl || "/placeholder-image.jpg");
        const similar = await getSimilarProducts(productData.category.id, productData.id);
        setSimilarProducts(similar);
      }
    }
    fetchData();
  }, [params.id]);

  if (!product) {
    return <Loader />;
  }

  const sortedReviews = product.reviews ? [...product.reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.helpfulVotes - a.helpfulVotes;
    }
  }) : [];

  return (
    <>
      <Header />
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-4">
            {/* Images du produit */}
            <div className="w-full md:w-2/5 px-4 mb-8">
              <motion.div
                whileHover={{ scale: isZoomed ? 1 : 1.35 }}
                onClick={() => setIsZoomed(!isZoomed)}
                className="cursor-zoom-in bg-white p-4 rounded-lg shadow-lg relative overflow-hidden"
                style={{ height: '500px', width: '100%' }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-full h-full"
                  animate={isZoomed ? { scale: 2.5 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  whileHover={{ cursor: isZoomed ? 'crosshair' : 'zoom-in' }}
                  onHoverStart={() => !isZoomed && setIsZoomed(true)}
                  onHoverEnd={() => setIsZoomed(false)}
                  style={{
                    transformOrigin: isZoomed ? 'center center' : '50% 50%'
                  }}
                >
                  <motion.div
                    className="w-full h-full"
                    animate={isZoomed ? { x: 0, y: 0 } : { x: 0, y: 0 }}
                    drag={isZoomed}
                    dragConstraints={{
                      top: -250,
                      left: -250,
                      right: 250,
                      bottom: 250,
                    }}
                    dragElastic={0.05}
                  >
                    <Image
                      src={selectedImage}
                      alt="Produit"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                      quality={100}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
              <div className="flex gap-2 py-4 justify-start overflow-x-auto">
                {product.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image.imageUrl}
                    alt={`Vignette ${index + 1}`}
                    width={60}
                    height={60}
                    className="object-cover rounded-md cursor-pointer border-2 hover:border-green-500 transition duration-300"
                    onClick={() => setSelectedImage(image.imageUrl)}
                  />
                ))}
              </div>
            </div>

            {/* Détails du produit */}
            <div className="w-full md:w-3/5 px-4">
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4">SKU: {product.id}</p>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 mr-1" />
                ))}
                <span className="text-blue-600 ml-2 cursor-pointer hover:underline">
                  {product.reviews?.length || 0} évaluations
                </span>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-green-600">{product.price.toLocaleString()} XOF</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">À propos de ce produit</h3>
                <p className="text-gray-600">
                  {showFullDescription ? product.description : `${product.description.slice(0, 150)}...`}
                </p>
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-green-600 hover:underline mt-2 flex items-center"
                >
                  {showFullDescription ? (
                    <>Voir moins <FaChevronUp className="ml-1" /></>
                  ) : (
                    <>Voir plus <FaChevronDown className="ml-1" /></>
                  )}
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Spécifications:</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Catégorie: {product.category.name}</li>
                  <li>Sous-catégorie: {product.subCategory.name}</li>
                  <li>Stock disponible: {product.stock}</li>
                  {product.color && <li>Couleur: {product.color}</li>}
                  {product.size && <li>Taille: {product.size}</li>}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Politique de retour:</h3>
                <p className="text-gray-600">Retour accepté sous 14 jours dans l'emballage d'origine.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Agripreneur:</h3>
                <p className="text-gray-600">{product.agripreneur.farmName}</p>
              </div>

              <div className="flex space-x-4 mb-6">
                <AjouterAuPanier product={product} />
              </div>
            </div>
          </div>

          {/* Évaluations et avis */}
          <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Évaluations et avis</h3>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">{product.reviews?.length || 0} avis</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded p-2 text-gray-700"
              >
                <option value="recent">Plus récents</option>
                <option value="helpful">Plus utiles</option>
              </select>
            </div>
            {sortedReviews.map((review, index) => (
              <div key={index} className="border-t py-4">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                  <span className="ml-2 text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mb-2 text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500">{review.helpfulVotes} personnes ont trouvé cet avis utile</p>
              </div>
            ))}
          </div>

          {/* Produits similaires */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Produits similaires</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarProducts.map((similarProduct) => (
                <div key={similarProduct.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                  <Image
                    src={similarProduct.images && similarProduct.images.length > 0 ? similarProduct.images[0].imageUrl : "/placeholder-image.jpg"}
                    alt={similarProduct.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h4 className="text-lg font-semibold mb-2 text-gray-800 truncate">{similarProduct.name}</h4>
                  <p className="text-green-600 font-bold">{similarProduct.price.toLocaleString()} XOF</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}