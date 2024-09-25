import React from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';

const JoinPlatformSection: React.FC = React.memo(() => (
  <section className="w-full ">
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <div className="w-full  lg:w-1/2 bg-green-100">
      <CldImage
          src="YOONUTOLL IMAGE/umhemheesoyla7aoo1jr" // Use this sample image or upload your own via the Media Explorer
          width="800" // Transform the image: auto-crop to square aspect_ratio
          height="800"
          crop={{
            type: 'auto',
            source: true
          }} alt={'image'}    />
        
      </div>
      <div className="w-full lg:w-1/2 bg-[#F7B65C] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
        <div className="py-4 sm:py-6 md:py-8 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-montserrat font-extrabold text-white mb-4 sm:mb-6 leading-tight">
            Rejoignez Notre Plateforme pour Augmenter Vos Ventes !
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white font-montserrat font-semibold mb-4 sm:mb-6 leading-relaxed">
            Boostez vos revenus en rejoignant notre plateforme qui connecte <span className="font-extrabold">les fermiers aux clients</span>. Vendez facilement vos produits frais, bénéficiez d&apos;un service de livraison fiable et accédez à un marché plus large.
          </p>

          <div className="mt-4 sm:mt-6 md:mt-8">
            <a href="#" className="block w-full sm:inline-block sm:w-auto px-4 sm:px-6 py-3 bg-[#14A536] text-white text-base sm:text-lg md:text-xl font-montserrat font-bold rounded-3xl hover:bg-[#118F2E] transition-colors text-center">
              Rejoignez-nous
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
));

JoinPlatformSection.displayName = 'JoinPlatformSection';

export default JoinPlatformSection;