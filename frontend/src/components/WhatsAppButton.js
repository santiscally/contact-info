import React, { useState } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { contactService } from '../services/api';

const WhatsAppButton = ({ contactId, contactName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSendWhatsApp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mensaje personalizado - puedes permitir la personalización desde un formulario
      const message = `Hola {name}, somos Simple Apps. Creamos soluciones simples para necesidades complejas. ¿Podemos ayudarte con tu negocio?`;
      
      // Llamar al endpoint para obtener la URL de WhatsApp
      const response = await contactService.sendWhatsApp(contactId, { message });
      
      // Si tenemos éxito, abrimos la URL en una nueva ventana
      if (response.data && response.data.whatsappUrl) {
        window.open(response.data.whatsappUrl, '_blank');
        setSuccess(true);
        
        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('No se pudo generar el enlace de WhatsApp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al generar el enlace de WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-3">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">WhatsApp abierto correctamente</Alert>}
      
      <Button 
        variant="success" 
        className="d-flex align-items-center" 
        onClick={handleSendWhatsApp}
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Preparando WhatsApp...
          </>
        ) : (
          <>
            <i className="bi bi-whatsapp me-2"></i>
            Enviar WhatsApp
          </>
        )}
      </Button>
    </div>
  );
};

export default WhatsAppButton;