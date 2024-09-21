import React from 'react';
import Image from 'next/image';

interface BaniereProps {
  titre: string;
  sousTitre: string;
  imageFond: string;
  imageAvantPlan: string;
}

const Baniere: React.FC<BaniereProps> = ({ titre, sousTitre, imageFond, imageAvantPlan }) => {
  return (
    <div className="relative mx-auto m-10 w-full h-72 bg-cover bg-center rounded-3xl" style={{ backgroundImage: `url('${imageFond}')` }}>
      {/* ... autres éléments ... */}
      {imageAvantPlan && imageAvantPlan !== '/' && (
        <div className="absolute inset-0 flex items-center justify-end">
          <Image 
            src={imageAvantPlan} 
            alt="Image avant-plan de la banière" 
            width={450} 
            height={270} 
            className="w-2/5 h-auto animate-fade-in-right rounded-lg" 
            loading="lazy" // Ajouter le chargement paresseux
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(Baniere); // Utiliser React.memo pour optimiser le composant
