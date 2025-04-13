# 💈 BarberApp

<div align="center">
  <img src="https://res.cloudinary.com/dmhyzqdp9/image/upload/v1744507280/baberapp_lwqbxn.png" alt="Logo BarberApp"  />
  
  <p align="center">
    <strong>Uma aplicação moderna para agendamento e gerenciamento de barbearias</strong>
  </p>
  
  <p align="center">
    <a href="#demonstração">Ver Demonstração</a>
    ·
    <a href="#funcionalidades">Funcionalidades</a>
    ·
    <a href="#instalação">Instalação</a>
    ·
    <a href="#uso">Uso</a>
    ·
    <a href="#capturas-de-tela">Capturas de Tela</a>
    ·
    <a href="#tecnologias">Tecnologias</a>
  </p>
</div>

## 🌟 Visão Geral

BarberApp é uma aplicação completa projetada para otimizar o agendamento e gerenciamento de serviços de barbearia. Com uma interface elegante e funcionalidade abrangente, torna o processo de agendamento simples e eficiente tanto para clientes quanto para administradores.

## ✨ Funcionalidades

### Para Clientes
- 👤 Registro e autenticação de usuários
- 📅 Navegar e agendar horários
- 💇‍♂️ Visualizar perfis e especialidades dos barbeiros
- 🧾 Explorar serviços disponíveis com preços
- ⭐ Avaliar e comentar atendimentos concluídos
- 📱 Design responsivo para todos os dispositivos

### Para Administradores
- 📊 Painel com métricas de desempenho
- 👨‍💼 Gerenciar barbeiros e seus horários
- 📋 Gerenciar ofertas de serviços
- 📆 Visualizar e gerenciar agendamentos
- 📝 Gerar relatórios
- ⚙️ Configurar definições da aplicação

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seunome/barberapp-frontend.git
   cd barberapp-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` no diretório raiz e adicione:
   ```
   REACT_APP_API_URL=https://api-barbershop.vercel.app/api
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

## 💻 Uso

### Portal do Cliente
Navegue pelo site principal para:
- Explorar barbeiros e sua disponibilidade
- Visualizar serviços e preços
- Criar uma conta ou fazer login
- Agendar e gerenciar horários

### Portal Administrativo
Acesse o painel administrativo:
1. Fazendo login com credenciais de administrador
2. Clicando no ícone "Admin" no menu de perfil
3. Gerenciando barbeiros, serviços, agendamentos e configurações

## 📸 Capturas de Tela

<div align="center">
  <img src="screenshots/home.png" alt="Página Inicial" width="45%" />
  <img src="screenshots/appointment.png" alt="Agendamento" width="45%" />
  <br/><br/>
  <img src="screenshots/admin-dashboard.png" alt="Painel Admin" width="45%" />
  <img src="screenshots/barber-management.png" alt="Gerenciamento de Barbeiros" width="45%" />
</div>

## 🛠️ Tecnologias

- **Framework Frontend**: React.js com React Router
- **Gerenciamento de Estado**: React Context API
- **Estilização**: Tailwind CSS
- **Cliente HTTP**: Axios
- **Componentes de UI**: Headless UI, Heroicons
- **Autenticação**: JWT
- **Manipulação de Data/Hora**: date-fns
- **Notificações**: React Toastify

## 📱 Design Responsivo

O BarberApp foi projetado para proporcionar uma experiência ideal em todos os tamanhos de dispositivos:
- Computadores desktop
- Tablets
- Telefones celulares

## 🔒 Fluxo de Autenticação

A aplicação utiliza autenticação baseada em JWT com armazenamento seguro de tokens:

1. Usuário envia credenciais de login/registro
2. Servidor valida e retorna token JWT
3. Token é armazenado no localStorage do navegador
4. Token é automaticamente incluído em todas as requisições API subsequentes
5. Rotas protegidas verificam a validade do token

## 🌐 Integração com API

O BarberApp se conecta a uma API RESTful com os seguintes endpoints principais:

- `/auth`: Autenticação e registro de usuários
- `/barbeiros`: Informações e disponibilidade dos barbeiros
- `/servicos`: Catálogo de serviços e preços
- `/agendamentos`: Agendamento e gerenciamento de horários

## 🔍 Estrutura do Projeto

```
src/
├── components/     # Componentes UI reutilizáveis
├── contexts/       # Provedores de Context do React
├── hooks/          # Hooks personalizados do React
├── pages/          # Páginas da aplicação
├── services/       # Integrações com serviços da API
├── styles/         # Estilos globais
└── utils/          # Funções utilitárias
```

## 🧩 Variáveis de Ambiente

- `REACT_APP_API_URL`: URL base para a API backend

## 📝 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.

## 📞 Contato

Seu Nome - [@seunomeusuario](https://twitter.com/seunomeusuario) - email@exemplo.com

Link do Projeto: [https://github.com/seunomeusuario/barberapp-frontend](https://github.com/seunomeusuario/barberapp-frontend)

---

<div align="center">
  <p>Desenvolvido com ❤️ por Seu Nome</p>
</div>
