import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Card, { CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatUtils';
import { appointmentService } from '../../services/appointmentService';
import Alert from '../ui/Alert';

const AppointmentCard = ({ appointment, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({
    nota: 5,
    comentario: ''
  });
  
  const formattedDate = format(
    parseISO(appointment.data),
    "dd 'de' MMMM 'de' yyyy",
    { locale: pt }
  );
  
  const statusColors = {
    agendado: 'bg-blue-900 text-blue-200',
    confirmado: 'bg-green-900 text-green-200',
    cancelado: 'bg-red-900 text-red-200',
    concluido: 'bg-gray-700 text-gray-200'
  };
  
  const statusLabels = {
    agendado: 'Agendado',
    confirmado: 'Confirmado',
    cancelado: 'Cancelado',
    concluido: 'Concluído'
  };
  
  const handleCancelAppointment = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await appointmentService.updateAppointmentStatus(appointment._id, 'cancelado');
      
      if (onStatusChange) {
        onStatusChange(appointment._id, 'cancelado');
      }
    } catch (err) {
      setError('Erro ao cancelar agendamento. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await appointmentService.addAppointmentReview(appointment._id, review);
      
      setShowReviewForm(false);
      
      if (onStatusChange) {
        onStatusChange(appointment._id, appointment.status, true);
      }
    } catch (err) {
      setError('Erro ao enviar avaliação. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="h-full bg-gray-800 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardBody className="bg-gray-800 text-gray-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-white">
              {appointment.barbeiro.nome}
            </h3>
            <p className="text-sm text-gray-400">
              {formattedDate} às {appointment.horario}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusColors[appointment.status]}`}>
            {statusLabels[appointment.status]}
          </span>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Serviços:</h4>
          <ul className="space-y-2">
            {appointment.servicos.map((servico) => (
              <li key={servico._id} className="flex justify-between text-sm bg-gray-700 px-3 py-2 rounded-md">
                <span>{servico.nome}</span>
                <span className="text-gray-300">{formatCurrency(servico.preco)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between font-medium">
            <span>Total:</span>
            <span className="text-white">{formatCurrency(appointment.precoTotal)}</span>
          </div>
        </div>
        
        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-4"
            onClose={() => setError(null)}
          />
        )}
        
        {appointment.status === 'concluido' && !appointment.avaliacao && !showReviewForm && (
          <Button
            onClick={() => setShowReviewForm(true)}
            variant="outline"
            className="bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 transition-all duration-300"
            fullWidth
          >
            Avaliar atendimento
          </Button>
        )}
        
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mt-4 bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nota (1-5)
              </label>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReview({ ...review, nota: star })}
                    className="text-2xl focus:outline-none text-yellow-400"
                  >
                    {star <= review.nota ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comentario" className="block text-sm font-medium text-gray-300 mb-2">
                Comentário
              </label>
              <textarea
                id="comentario"
                value={review.comentario}
                onChange={(e) => setReview({ ...review, comentario: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar avaliação'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-800 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
        
        {appointment.avaliacao && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="flex items-center mb-2">
              <div className="text-yellow-400 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= appointment.avaliacao.nota ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-300">
                {appointment.avaliacao.nota}/5
              </span>
            </div>
            {appointment.avaliacao.comentario && (
              <p className="text-sm text-gray-400">{appointment.avaliacao.comentario}</p>
            )}
          </div>
        )}
      </CardBody>
      
      {appointment.status === 'agendado' && (
        <CardFooter className="bg-gray-800 border-t border-gray-700">
          <Button
            onClick={handleCancelAppointment}
            variant="danger"
            className="bg-red-900 hover:bg-red-800 text-white transition-all duration-300"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Cancelando...' : 'Cancelar agendamento'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentCard;