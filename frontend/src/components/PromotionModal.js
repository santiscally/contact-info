import React, { useState } from 'react';

const PromotionModal = ({ 
  isOpen, 
  onClose, 
  contact, 
  type = 'email', 
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    message: ''
  });

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
        subject: formData.subject,
        content: formData.content
      });
    } else {
      onSubmit({
        message: formData.message
      });
    }
  };

  if (!isOpen) return null;

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

            <form onSubmit={handleSubmit}>
              {type === 'email' ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Asunto</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">Contenido (HTML)</label>
                    <textarea
                      className="form-control"
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows="6"
                      required
                    ></textarea>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Mensaje</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    required
                  ></textarea>
                </div>
              )}

              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                  Cancelar
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;