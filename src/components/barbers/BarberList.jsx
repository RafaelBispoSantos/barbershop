import React, { useState, useEffect } from 'react';
import { barberService } from '../../services/barberService';
import BarberCard from './BarberCard';
import Alert from '../ui/Alert';

const BarberList = () => {
  const [loading, setLoading] = useState(true);
  const [barbers, setBarbers] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoading(true);
        const data = await barberService.getAllBarbers();
        setBarbers(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar barbeiros. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBarbers();
  }, []);
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="loading-animation"></div>
      </div>
    );
  }
  
  if (error) {
    return <Alert type="error" message={error} />;
  }
  
  if (barbers.length === 0) {
    return (
      <div className="text-center my-12 py-8 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
        <p className="text-gray-400 text-lg">Nenhum barbeiro disponível no momento.</p>
      </div>
    );
  }
  
  return (
    <div className="grid-layout">
      {barbers.map((barber) => (
        <BarberCard key={barber._id} barber={barber} />
      ))}
    </div>
  );
};

export default BarberList;