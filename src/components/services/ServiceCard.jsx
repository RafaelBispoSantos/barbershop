import React from 'react';

import Card, { CardBody } from '../ui/Card';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDuration } from 'date-fns';

const ServiceCard = ({ service, onClick, isSelected }) => {
  return (
    <Card 
      className={`w-64 h-96 h-full transition-all duration-300 bg-gray-800 border border-gray-700 shadow-xl hover:shadow-2xl hover:transform hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-gray-500 shadow-lg' : ''
      }`} 
      onClick={onClick}
    >
      <div className="h-72 bg-gray-900 overflow-hidden rounded-t-lg">
        {service.imagem ? (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={service.imagem}
              alt={service.nome}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70"></div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <svg
              className="h-16 w-16 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9.17 17.1c.83.83 2.07.85 2.92-.01l.11-.11c.29-.29.29-.77 0-1.06a.75.75 0 00-1.06 0l-.11.11a.39.39 0 01-.27.11.41.41 0 01-.29-.12c-.12-.12-.3-.29-.5-.55-.2.26-.38.43-.5.55a.41.41 0 01-.29.12.39.39 0 01-.27-.11l-.11-.11a.75.75 0 00-1.06 0c-.29.29-.29.77 0 1.06l.11.11c.85.86 2.09.84 2.92.01zm-1.84-7.94l1.42-1.41 1.42 1.41c.78.78 2.05.78 2.83 0l1.42-1.41 1.41 1.41c.78.78 2.04.77 2.83 0 .78-.78.78-2.04 0-2.83l-1.42-1.41 1.42-1.41c.78-.78.78-2.04 0-2.83-.79-.78-2.05-.78-2.83 0L14.42 3.7 13 2.28c-.78-.78-2.04-.79-2.83 0-.78.78-.78 2.04 0 2.83l1.42 1.41-1.42 1.41c-.78.79-.78 2.05 0 2.83.79.78 2.05.78 2.83 0zm13.42 6.48l-1.42-1.41-1.41 1.41c-.79.79-2.05.79-2.83 0-.78-.78-.78-2.04 0-2.83l1.41-1.41-1.41-1.41a1.996 1.996 0 010-2.83 1.996 1.996 0 12.83 0l1.41 1.41 1.42-1.41c.78-.78 2.04-.78 2.83 0 .78.79.78 2.05 0 2.83l-1.42 1.41 1.42 1.41c.78.79.78 2.05 0 2.83-.79.79-2.05.79-2.83 0zm-18 1.83c0 1.1.9 2 2 2h8a1.99 1.99 0 002-2v-1c0-1.1-.9-2-2-2H4.24a1.99 1.99 0 00-1.99 2l-.01 1z"></path>
            </svg>
          </div>
        )}
      </div>
      <CardBody className="flex flex-col bg-gray-800 text-gray-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-white">{service.nome}</h3>
          <p className="font-bold text-gray-300 bg-gray-700 px-3 py-1 rounded-md">{formatCurrency(service.preco)}</p>
        </div>
        {service.descricao && (
          <p className="text-sm text-gray-400 mb-3 flex-grow">{service.descricao}</p>
        )}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-gray-300">Duração:</span> {formatDuration(service.duracao)}
          </p>
          {isSelected && (
            <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ServiceCard;