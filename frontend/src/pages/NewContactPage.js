import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactService } from '../services/api';
import ContactForm from '../components/ContactForm';

const NewContactPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await contactService.createContact(formData);
      navigate('/contacts');
    } catch (err) {
      setError('Error al crear el contacto. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Nuevo Contacto</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <ContactForm 
            onSubmit={handleSubmit} 
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default NewContactPage;