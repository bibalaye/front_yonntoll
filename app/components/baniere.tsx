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
      <div className="absolute inset-0 flex items-center justify-left">
        <div className="flex flex-col">
          <div>
            <h1 className="text-[#F2BB88] text-8xl text-center animate-fade-in-left font-babylonica">{titre}</h1>
          </div>
          <div>
            <p className="text-white text-6xl font-bold">
              {sousTitre}
            </p>
          </div>
        </div>
      </div>
      {imageAvantPlan && imageAvantPlan !== '/' && (
        <div className="absolute inset-0 flex items-center justify-end">
          <Image 
            src={imageAvantPlan} 
            alt="Image avant-plan de la banière" 
            width={450} 
            height={270} 
            className="w-2/5 h-auto animate-fade-in-right rounded-lg" 
          />
        </div>
      )}
    </div>
  );
};

export default Baniere;
