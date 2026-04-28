import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            <span className="block">Discover Innovation with</span>
            <span className="block text-indigo-600">Zynova</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-slate-600">
            A curated marketplace for unique and high-quality goods from independent vendors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;