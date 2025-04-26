import React, { useState, useEffect } from 'react';

const PromotionModal = ({ 
  isOpen, 
  onClose, 
  contact, 
  type = 'email', 
  onSubmit,
  isLoading,
  whatsappStatus
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    message: ''
  });

  // Restablecer los estados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setShowForm(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (type === 'email') {
      onSubmit({
        subject: formData.subject || null,
        content: formData.content || null
      });
    } else {
      onSubmit({
        message: formData.message || null
      });
    }
  };

  const handleDirectSubmit = () => {
    // Enviar con la plantilla predeterminada
    if (type === 'email') {
      onSubmit({
        subject: null,
        content: null
      });
    } else {
      onSubmit({
        message: null
      });
    }
  };

  if (!isOpen) return null;

  // Mostrar QR si es necesario en caso de WhatsApp
  if (type === 'whatsapp' && whatsappStatus && !whatsappStatus.isReady && whatsappStatus.hasQR) {
    return (
      <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Escanea el código QR con WhatsApp</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              <p>Para conectar WhatsApp, escanea este código QR con tu teléfono:</p>
              
              {whatsappStatus.qrCode && (
                <div className="my-3">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappStatus.qrCode)}`} 
                    alt="WhatsApp QR Code" 
                    className="img-fluid"
                  />
                </div>
              )}
              
              <div className="alert alert-info">
                <small>Abre WhatsApp en tu teléfono &gt; Menú ⋮ &gt; Dispositivos vinculados &gt; Vincular un dispositivo</small>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {type === 'email' 
                ? 'Enviar Email Promocional' 
                : 'Enviar WhatsApp Promocional'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>
              Enviando a: <strong>{contact?.name}</strong> 
              {type === 'email' 
                ? ` (${contact?.email})` 
                : ` (${contact?.phone})`}
            </p>

            {!showForm ? (
              <div className="text-center my-4">
                <p>¿Deseas enviar la promoción con la plantilla predeterminada?</p>
                <button 
                  className="btn btn-primary me-2"
                  onClick={handleDirectSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  Enviar promoción
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForm(true)}
                >
                  Personalizar mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {type === 'email' ? (
                  <>
                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">Asunto (opcional)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Dejar vacío para usar el asunto predeterminado"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">Contenido HTML (opcional)</label>
                      <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Dejar vacío para usar la plantilla predeterminada"
                      ></textarea>
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Mensaje (opcional)</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Dejar vacío para usar el mensaje predeterminado"
                    ></textarea>
                  </div>
                )}

                <div className="d-flex justify-content-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary me-2" 
                    onClick={() => setShowForm(false)}
                  >
                    Volver
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    Enviar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;