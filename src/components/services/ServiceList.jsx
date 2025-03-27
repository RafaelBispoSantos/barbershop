import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import { serviceService } from '../../services/serviceService';
import Alert from '../ui/Alert';

const ServiceList = ({ onSelectService, selectedServices = [] }) => {
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
  
  const isServiceSelected = (serviceId) => {
    return selectedServices.includes(serviceId);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }
  
  if (error) {
    return <Alert type="error" message={error} />;
  }
  
  if (Object.keys(servicesByCategory).length === 0) {
    return (
      <div className="text-center my-12 py-8 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
        <p className="text-gray-400 text-lg">Nenhum serviço disponível no momento.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-12 w-full flex flex-col items-center justify-center">
      {Object.entries(servicesByCategory).map(([category, services]) => (
        <div key={category} className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700 text-center w-full">{category}</h2>
          <div className="grid  w-full place-items-center">
            {services.map((service) => (
              <div className="flex justify-center w-full" key={service._id}>
                <ServiceCard
                  service={service}
                  isSelected={isServiceSelected(service._id)}
                  onClick={() => onSelectService && onSelectService(service)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;