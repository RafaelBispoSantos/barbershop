import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
// Corrigindo a importação do ServiceCard

import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { serviceService } from '../services/serviceService';
import ServiceCard from '../components/services/ServiceCard';
const Services = () => {
  const [loading, setLoading] = useState(true);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await serviceService.getServicesByCategory();
        setServicesByCategory(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar serviços. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  if (loading) {
    return (
      <Layout>
        <div className="w-full flex justify-center items-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-gray-300"></div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="w-full flex justify-center items-center min-h-[70vh]">
          <Alert type="error" message={error} />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
    <div className="flex justify-center w-full bg-gray-900">
      <div className="w-full max-w-6xl px-4 py-16 flex flex-col items-center">
        <div className="text-center mb-16 w-full">
          <h1 className="text-4xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Nossos Serviços
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Oferecemos uma ampla variedade de serviços de barbearia para atender todas as suas necessidades.
          </p>
        </div>
        
        {Object.keys(servicesByCategory).length === 0 ? (
          <div className="text-center my-12 py-8 bg-gray-800 rounded-lg border border-gray-700 shadow-lg max-w-4xl w-full mx-auto">
            <p className="text-gray-400 text-lg">Nenhum serviço disponível no momento.</p>
          </div>
        ) : (
          <div className="space-y-16 w-full max-w-5xl mx-auto">
            {Object.entries(servicesByCategory).map(([category, services]) => (
              <div 
                key={category} 
                id={category.toLowerCase().replace(/\s+/g, '-')} 
                className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 w-full"
              >
                <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700 text-center">
                  {category}
                </h2>
                <div className="grid grid-cols-1  gap-8 justify-items-center">
                  {services.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-16 w-full">
          <Link to="/appointment">
            <Button className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg px-8 py-4 text-lg">
              Agendar Horário
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </Layout>
  );
};

export default Services;