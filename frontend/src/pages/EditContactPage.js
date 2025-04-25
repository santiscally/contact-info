import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../services/api';
import ContactForm from '../components/ContactForm';

const EditContactPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await contactService.getContact(id);
        setContact(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar el contacto. Por favor, inténtalo de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await contactService.updateContact(id, formData);
      navigate('/contacts');
    } catch (err) {
      setError('Error al actualizar el contacto. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mb-4">Editar Contacto</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          {contact && (
            <ContactForm 
              contact={contact} 
              onSubmit={handleSubmit} 
              isLoading={submitting}
              isEditing={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditContactPage;