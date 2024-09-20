'use client';

import React from 'react';
import Image from 'next/image';
import Header from '../components/header';
import Footer from '../components/footer';
import Baniere from '../components/baniere';

const Section = ({ title, content, imageSrc, imageAlt, reverse = false }: {
  title: string;
  content: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}) => (
  <section className={`py-12`}>
    <div className={`container mx-auto px-4 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
      <div className="md:w-1/2 mb-8 md:mb-0 md:px-4">
        <h2 className="text-4xl font-Montserrat font-bold mb-4">{title}</h2>
        <p className="text-3xl font-Montserrat tracking-wide leading-relaxed">{content}</p>
      </div>
      <div className="md:w-1/2">
        <Image src={imageSrc} alt={imageAlt} width={500} height={300} layout="responsive"  />
      </div>
    </div>
  </section>
);

export default function QuiSommesNous() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Baniere 
          titre=""
          sousTitre="Qui Sommes-Nous"
          imageFond="/baniere1.png"
          imageAvantPlan="/iPad Pro 2020.png"
        />
        <Section 
          title="À propos de YOONU TOOL"
          content="Nous fournissons aux acheteurs une plateforme complète pour trouver des fournisseurs vérifiés, tout en aidant les fournisseurs à élargir leurs opportunités commerciales et à obtenir une reconnaissance internationale. Notre mission est de faciliter les connexions entre les acheteurs et les fournisseurs dans les secteurs de l'alimentation et de l'agriculture, en favorisant un système mondial plus efficace, durable et sûr."
          imageSrc="/MacBook Air (2022).png"
          imageAlt="À propos de YOONU TOOL"
        />

        <Section 
          title="Notre Objectif"
          content="Améliorer le paysage alimentaire et agricole en permettant des liens directs entre les fournisseurs et les acheteurs. Nos solutions innovantes permettent aux entreprises de transformer leurs stratégies marketing, commerciales et opérationnelles, améliorant ainsi l'efficacité globale. Food Farm Hub sert de marché unique pour les secteurs de l'alimentation et de l'agriculture, offrant une plateforme complète pour trouver des fournisseurs vérifiés et élargir les opportunités commerciales."
          imageSrc="/Rectangle 24.png"
          imageAlt="Notre Objectif"
          reverse={true}
        />

        <Section 
          title="Nos Missions"
          content="Faciliter les connexions entre les acheteurs et les fournisseurs dans les secteurs de l'alimentation et de l'agriculture, en favorisant un système mondial plus efficace, durable et sûr. Nous nous engageons à améliorer le paysage alimentaire et agricole en permettant des liens directs entre les fournisseurs et les acheteurs, transformant ainsi les stratégies marketing, commerciales et opérationnelles des entreprises pour une meilleure efficacité globale."
          imageSrc="/Rectangle 25.png"
          imageAlt="Nos Missions"
        />
        <Baniere 
          titre=""
          sousTitre=""
          imageFond="/quisomenous.png"
          imageAvantPlan="/"
        />
      </main>
      <Footer />
    </div>
  );
}