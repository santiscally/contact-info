import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactService } from '../services/api';
import ContactsTable from '../components/ContactsTable';
import PromotionModal from '../components/PromotionModal';

const ContactsListPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'email',
    contact: null,
    isLoading: false
  });
  const [whatsappStatus, setWhatsappStatus] = useState({
    isReady: false,
    isInitializing: false,
    hasQR: false,
    qrCode: null
  });

  useEffect(() => {
    fetchContacts();
    checkWhatsAppStatus();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getContacts();
      setContacts(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los contactos. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkWhatsAppStatus = async () => {
    try {
      const response = await contactService.getWhatsAppStatus();
      setWhatsappStatus(response.data);
    } catch (err) {
      console.error('Error al verificar estado de WhatsApp:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      try {
        await contactService.deleteContact(id);
        setContacts(contacts.filter(contact => contact._id !== id));
      } catch (err) {
        setError('Error al eliminar el contacto.');
        console.error(err);
      }
    }
  };

  const openEmailModal = (contact) => {
    setModalState({
      isOpen: true,
      type: 'email',
      contact,
      isLoading: false
    });
  };

  const openWhatsAppModal = async (contact) => {
    // Verificar estado de WhatsApp antes de abrir el modal
    await checkWhatsAppStatus();
    
    setModalState({
      isOpen: true,
      type: 'whatsapp',
      contact,
      isLoading: false
    });
  };

  const closeModal = () => {
    setModalState({
      ...modalState,
      isOpen: false
    });
  };

  const handleSendPromotion = async (data) => {
    try {
      setModalState({
        ...modalState,
        isLoading: true
      });

      let response;
      if (modalState.type === 'email') {
        response = await contactService.sendEmail(modalState.contact._id, {
          subject: data.subject,
          content: data.content
        });
      } else {
        response = await contactService.sendWhatsApp(modalState.contact._id, {
          message: data.message
        });
        
        // Si recibimos un QR, actualizar el estado
        if (response.data && response.data.needsQR) {
          setWhatsappStatus({
            isReady: false,
            isInitializing: true,
            hasQR: true,
            qrCode: response.data.qrCode
          });
          
          // No cerrar el modal en este caso para mostrar el QR
          setModalState({
            ...modalState,
            isLoading: false
          });
          
          return;
        }
      }

      // Actualizar contacto en la lista con la nueva fecha de último contacto
      fetchContacts();
      
      closeModal();
      alert(`${modalState.type === 'email' ? 'Email' : 'WhatsApp'} enviado correctamente.`);
    } catch (err) {
      const errorMsg = err.response?.data?.error || `Error al enviar ${modalState.type === 'email' ? 'email' : 'WhatsApp'}.`;
      alert(errorMsg);
      console.error(err);
      
      // Si el error es de WhatsApp, verificar el estado
      if (modalState.type === 'whatsapp') {
        checkWhatsAppStatus();
      }
    } finally {
      setModalState({
        ...modalState,
        isLoading: false
      });
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Contactos</h1>
        <Link to="/contacts/new" className="btn btn-primary">
          Nuevo Contacto
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <ContactsTable
          contacts={contacts}
          onDelete={handleDelete}
          onEmailPromotion={openEmailModal}
          onWhatsAppPromotion={openWhatsAppModal}
        />
      )}

      <PromotionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        contact={modalState.contact}
        type={modalState.type}
        onSubmit={handleSendPromotion}
        isLoading={modalState.isLoading}
        whatsappStatus={whatsappStatus}
      />
    </div>
  );
};

export default ContactsListPage;