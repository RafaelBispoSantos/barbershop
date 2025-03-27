import React from 'react';
import Layout from '../components/layout/Layout';
import AppointmentForm from '../components/appointments/AppointmentForm';

const Appointment = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Agendar Horário</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha seu barbeiro, data, horário e serviços para agendar seu horário na nossa barbearia.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto ">
          <AppointmentForm />
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;