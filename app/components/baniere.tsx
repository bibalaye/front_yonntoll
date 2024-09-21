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
    <div className="relative mx-auto my-6 sm:my-8 md:my-10 lg:my-12 xl:my-16 w-full h-64 sm:h-80 md:h-96 lg:h-112 xl:h-128 bg-cover bg-center rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl" style={{ backgroundImage: `url('${imageFond}')` }}>
      <div className="absolute inset-0 flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-gradient-to-r from-black/50 to-transparent">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 leading-tight">{titre}</h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white max-w-2xl lg:max-w-3xl xl:max-w-4xl leading-relaxed">{sousTitre}</p>
      </div>
      {imageAvantPlan && imageAvantPlan !== '/' && (
        <div className="absolute inset-y-0 right-0 flex items-center justify-end w-1/2 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5">
          <div className="relative w-full h-full">
            <Image 
              src={imageAvantPlan} 
              alt="Image avant-plan de la banière" 
              layout="fill"
              objectFit="contain"
              objectPosition="right center"
              className="animate-fade-in-right rounded-lg" 
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Baniere);
