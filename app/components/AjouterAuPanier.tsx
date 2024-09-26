'use client';

import React, { useState } from 'react';
import { usePanier } from '@/app/context/PanierContext';
import Modal from 'react-modal';
import Image from 'next/image';

interface Product {
  quantity: number;
  id: number;
  name: string;
  price: number;
  images: { imageUrl: string }[];
  agripreneur: any;
  stock: number;
  category: any;
  subCategory: any;
}

interface AjouterAuPanierProps {
  product: Product;
}

const AjouterAuPanier: React.FC<AjouterAuPanierProps> = ({ product }) => {
  const { ajouterAuPanier } = usePanier();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [remainingStock, setRemainingStock] = useState(product.stock-1);
  const [message, setMessage] = useState('');

  const handleAjouterAuPanier = () => {
    ajouterAuPanier({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setQuantity(1);
    setRemainingStock(product.stock);
    setMessage('');
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
      const newRemainingStock = product.stock - newQuantity;
      setRemainingStock(newRemainingStock);
      setMessage('');
      
      if (newRemainingStock === 0) {
        setMessage(`Le produit "${product.name}" est à court de stock.`);
      }
    } else if (newQuantity > product.stock) {
      setMessage(`La quantité demandée dépasse le stock disponible.`);
    }
  };

  return (
    <>
      <button
        onClick={handleAjouterAuPanier}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Ajouter au panier
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Panier"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-green-600">✓ Ajouté au panier</h2>
          <div className="flex mb-4">
            <Image
              src={product.images[0]?.imageUrl || "/placeholder-image.jpg"}
              alt={product.name}
              width={100}
              height={100}
              className="object-cover rounded-md mr-4"
            />
            <div>
              <p className="font-semibold mb-1">{product.name}</p>
              <p className="text-green-600 font-bold">{product.price} Fcfa</p>
              <p className="text-gray-600">Stock disponible: {remainingStock}</p>
              <div className="flex items-center mt-2">
                <label htmlFor="quantity" className="mr-2">Quantité:</label>
                <div className="flex items-center">
                  <button
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-l"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    className="border text-center w-12"
                    value={quantity}
                    min="1"
                    max={remainingStock}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  />
                  <button
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-r"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              {message && <p className="text-red-500 mt-2">{message}</p>}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={closeModal}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Continuer mes achats
            </button>
            <button
              onClick={() => window.location.href = '/panier'}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-500"
            >
              Voir le panier
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AjouterAuPanier;
