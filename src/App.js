import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Contextos
import { AuthProvider } from "./contexts/AuthContext";
import { AppointmentProvider } from "./contexts/AppointmentContext";

// Páginas Cliente
import Home from "./pages/Home";
import Barbers from "./pages/Barbers";
import BarberDetail from "./pages/BarberDetail";
import Services from "./pages/Services";
import Appointment from "./pages/Appointment";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppointmentList from "./components/appointments/AppointmentList";

// Páginas Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminBarbersList from "./pages/Admin/Barbers/BarbersList";
import AdminBarberSchedule from "./pages/Admin/Barbers/BarberSchedule";
import AdminAppointmentsList from "./pages/Admin/Appointments/AppointmentsList";
import AdminAppointmentDetail from "./pages/Admin/Appointments/AppointmentDetail";

// Componentes para rotas protegidas
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminFloatingButton from "./components/AdminFloatingButton";
import AdminServicesList from "./pages/Admin/ServicesList";
import ReportsPage from "./pages/Admin/Reports/ReportsPage";
import BarberForm from "./pages/Admin/Barbers/BarberForm";
import ServiceForm from "./pages/Admin/Reports/Services/ServiceForm";
import Settings from "./pages/Admin/Settings/Settings";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppointmentProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/barbers" element={<Barbers />} />
            <Route path="/barbers/:id" element={<BarberDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas protegidas de cliente */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/appointments"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                      Meus Agendamentos
                    </h1>
                    <AppointmentList />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Rotas de administração */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <AdminProtectedRoute>
                  <ReportsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/barbers"
              element={
                <AdminProtectedRoute>
                  <AdminBarbersList />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/barbers/:id/schedule"
              element={
                <AdminProtectedRoute>
                  <AdminBarberSchedule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/barbers/new"
              element={
                <AdminProtectedRoute>
                  <BarberForm />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/barbers/:id/edit"
              element={
                <AdminProtectedRoute>
                  <BarberForm />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/services"
              element={
                <AdminProtectedRoute>
                  <AdminServicesList />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/services/new"
              element={
                <AdminProtectedRoute>
                  <ServiceForm />
                </AdminProtectedRoute>
              }
            />

<Route path="/admin/settings" element={
            <AdminProtectedRoute>
              <Settings />
            </AdminProtectedRoute>
          } />
            <Route
              path="/admin/appointments"
              element={
                <AdminProtectedRoute>
                  <AdminAppointmentsList />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments/:id"
              element={
                <AdminProtectedRoute>
                  <AdminAppointmentDetail />
                </AdminProtectedRoute>
              }
            />

            {/* Adicione outras rotas de administração conforme necessário */}
          </Routes>
          <AdminFloatingButton />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AppointmentProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
