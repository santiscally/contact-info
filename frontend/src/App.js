import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactsListPage from './pages/ContactsListPage';
import NewContactPage from './pages/NewContactPage';
import EditContactPage from './pages/EditContactPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Componente de ruta protegida
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main className="pb-5">
        <Routes>
          {/* Redireccionar desde la raíz a la lista de contactos */}
          <Route path="/" element={<Navigate to="/contacts" replace />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/contacts" 
            element={
              <PrivateRoute>
                <ContactsListPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/contacts/new" 
            element={
              <PrivateRoute>
                <NewContactPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/contacts/edit/:id" 
            element={
              <PrivateRoute>
                <EditContactPage />
              </PrivateRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/contacts" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;