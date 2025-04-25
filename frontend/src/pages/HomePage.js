import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container">
      <div className="jumbotron text-center py-5">
        <h1 className="display-4">PYME Contacts</h1>
        <p className="lead">
          Sistema de gestión de contactos para promocionar tu emprendimiento
        </p>
        <hr className="my-4" />
        <p>
          Administra tus contactos de PYMEs y envía promociones por correo electrónico y WhatsApp.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg me-2">
          Registrarse
        </Link>
        <Link to="/login" className="btn btn-outline-primary btn-lg">
          Iniciar Sesión
        </Link>
      </div>
      
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h3>Gestión de Contactos</h3>
              <p>
                Registra y organiza todos tus contactos de PYMEs en un solo lugar.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h3>Email Marketing</h3>
              <p>
                Envía correos promocionales a tus contactos con un solo clic.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h3>WhatsApp Directo</h3>
              <p>
                Comunícate directamente con tus contactos a través de WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;