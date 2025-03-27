import React from 'react';
import Layout from '../components/layout/Layout';
import BarberList from '../components/barbers/BarberList';

const Barbers = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nossos Barbeiros</h1>
          <h2 className="text-gray-400 max-w-2xl mx-auto">
            Conheça nossa equipe de profissionais altamente qualificados, 
            prontos para oferecer o melhor serviço de barbearia para você.
          </h2>
        </div>
        
        <BarberList />
      </div>
    </Layout>
  );
};

export default Barbers;