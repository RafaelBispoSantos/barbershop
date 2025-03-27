import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import BarberList from '../components/barbers/BarberList';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-transparent z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/images/backgrounds/barber-hero.jpg')", 
            opacity: 0.3
          }}
        ></div>
        
        <div className="container mx-auto px-4 py-32 relative z-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              Seu estilo começa com um bom corte
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Agende seu horário na melhor barbearia da cidade. Cortes modernos, ambiente agradável e profissionais experientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/appointment">
                <Button className="px-8 py-4 text-base bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 transition-all duration-300 shadow-xl">Agende Agora</Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="px-8 py-4 text-base border-2 border-gray-400 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300">
                  Nossos Serviços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Serviços Destaque */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Serviços Exclusivos</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Oferecemos os melhores serviços de barbearia com profissionais qualificados e produtos de alta qualidade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Serviço 1 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl hover:transform hover:-translate-y-2 transition-all duration-300 border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Corte Clássico</h3>
              <p className="text-gray-400 mb-6">
                Corte tradicional com técnicas modernas para realçar seu estilo pessoal.
              </p>
              <Link to="/services">
                <Button variant="outline" className="bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-300" fullWidth>Ver detalhes</Button>
              </Link>
            </div>
            
            {/* Serviço 2 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl hover:transform hover:-translate-y-2 transition-all duration-300 border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Barba Completa</h3>
              <p className="text-gray-400 mb-6">
                Modelagem, hidratação e finalização da barba com produtos premium.
              </p>
              <Link to="/services">
                <Button variant="outline" className="bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-300" fullWidth>Ver detalhes</Button>
              </Link>
            </div>
            
            {/* Serviço 3 */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl hover:transform hover:-translate-y-2 transition-all duration-300 border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Tratamento VIP</h3>
              <p className="text-gray-400 mb-6">
                Experiência completa com corte, barba, massagem facial e bebida.
              </p>
              <Link to="/services">
                <Button variant="outline" className="bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-300" fullWidth>Ver detalhes</Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link to="/services">
              <Button className="bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 transition-all duration-300 shadow-xl px-8 py-4">Ver Todos os Serviços</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Nossa Equipe */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Nossa Equipe</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Conheça nossos barbeiros profissionais, especialistas em diferentes estilos e técnicas.
            </p>
          </div>
          
          <BarberList />
          
          <div className="text-center mt-16">
            <Link to="/barbers">
              <Button className="bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 transition-all duration-300 shadow-xl px-8 py-4">Conhecer Todos os Barbeiros</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">Pronto para Renovar seu Visual?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300">
            Agende agora mesmo seu horário e experimente o melhor serviço de barbearia da cidade.
          </p>
          <Link to="/appointment">
            <Button className="px-10 py-4 text-lg bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-xl">
              Agendar Horário
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;