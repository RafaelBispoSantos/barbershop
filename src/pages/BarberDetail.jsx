import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BarberProfile from '../components/barbers/BarberProfile';

const BarberDetail = () => {
  const { id } = useParams();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <BarberProfile />
      </div>
    </Layout>
  );
};

export default BarberDetail;