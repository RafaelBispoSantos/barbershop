import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { formatCurrency } from '../../../utils/formatUtils';
import Alert from '../../../components/ui/Alert';
import Button from '../../../components/ui/Button';

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    revenueByMonth: [],
    servicesByPopularity: [],
    barberPerformance: []
  });
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  // Simula busca de dados para os relatórios
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Em uma implementação real, você faria uma requisição à API aqui
        // Por enquanto, vamos gerar dados fictícios para demonstração
        
        // Espera um pequeno tempo para simular a busca de dados
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dados de faturamento simulados
        const revenueData = [
          { month: 'Janeiro', revenue: 4500 },
          { month: 'Fevereiro', revenue: 5100 },
          { month: 'Março', revenue: 6200 },
          { month: 'Abril', revenue: 5800 },
          { month: 'Maio', revenue: 7500 },
          { month: 'Junho', revenue: 9200 }
        ];
        
        // Dados de serviços populares simulados
        const servicesData = [
          { name: 'Corte Tradicional', count: 78, revenue: 2730 },
          { name: 'Barba Completa', count: 65, revenue: 1625 },
          { name: 'Corte Degradê', count: 54, revenue: 2160 },
          { name: 'Combo (Corte + Barba)', count: 42, revenue: 2310 },
          { name: 'Tratamento Capilar', count: 23, revenue: 1840 }
        ];
        
        // Dados de desempenho dos barbeiros simulados
        const barberData = [
          { name: 'Carlos Oliveira', appointments: 47, revenue: 3290, rating: 4.8 },
          { name: 'Ricardo Alves', appointments: 52, revenue: 3640, rating: 4.6 },
          { name: 'André Martins', appointments: 38, revenue: 2660, rating: 4.9 },
          { name: 'Paulo Santos', appointments: 43, revenue: 3010, rating: 4.7 }
        ];
        
        setReportData({
          revenueByMonth: revenueData,
          servicesByPopularity: servicesData,
          barberPerformance: barberData
        });
        
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados dos relatórios. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'revenue':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Faturamento Mensal</h3>
            <div className="bg-white rounded-lg shadow p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mês</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.revenueByMonth.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                      {formatCurrency(reportData.revenueByMonth.reduce((acc, item) => acc + item.revenue, 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'services':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Serviços Mais Populares</h3>
            <div className="bg-white rounded-lg shadow p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.servicesByPopularity.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{item.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'barbers':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Desempenho dos Barbeiros</h3>
            <div className="bg-white rounded-lg shadow p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barbeiro</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Atendimentos</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avaliação</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.barberPerformance.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{item.appointments}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        <div className="flex items-center justify-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span>{item.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Relatórios</h1>
        
        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}
        
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="form-input"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="form-input"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Relatório
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="form-input"
              >
                <option value="revenue">Faturamento</option>
                <option value="services">Serviços</option>
                <option value="barbers">Barbeiros</option>
              </select>
            </div>
            
            <div>
              <Button onClick={() => setLoading(true)} disabled={loading}>
                {loading ? 'Carregando...' : 'Gerar Relatório'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Conteúdo do relatório */}
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-barber"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderReportContent()}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;