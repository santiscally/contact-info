import React, { useState, useEffect } from 'react';

const ContactForm = ({ 
  contact = {}, 
  onSubmit, 
  isLoading = false,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    if (isEditing && contact) {
      setFormData({
        name: contact.name || '',
        company: contact.company || '',
        phone: contact.phone || '',
        email: contact.email || '',
        notes: contact.notes || ''
      });
    }
  }, [contact, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatPhoneNumber = (phone) => {
    // Si no comienza con +, asumimos que necesita el prefijo de Argentina
    if (!phone.startsWith('+')) {
      // Eliminar cualquier carácter no numérico
      let cleanNumber = phone.replace(/\D/g, '');
      
      // Si comienza con 0, quitarlo
      if (cleanNumber.startsWith('0')) {
        cleanNumber = cleanNumber.substring(1);
      }
      
      // Si comienza con 15 después del código de área (normalmente 2-4 dígitos), reordenar
      const match = cleanNumber.match(/^(\d{2,4})(15)(\d+)$/);
      if (match) {
        cleanNumber = match[1] + match[3];
      }
      
      // Añadir el prefijo de Argentina +549
      return `+549${cleanNumber}`;
    }
    
    return phone;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Formatear el número de teléfono antes de enviar
    const formattedData = {
      ...formData,
      phone: formatPhoneNumber(formData.phone)
    };
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="company" className="form-label">Empresa</label>
        <input
          type="text"
          className="form-control"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">Teléfono</label>
        <input
          type="tel"
          className="form-control"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+5491123456789"
          required
        />
        <div className="form-text">
          Formato recomendado: +549 seguido del número sin 0 y sin 15. Ejemplo: +5491123456789
        </div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="notes" className="form-label">Notas</label>
        <textarea
          className="form-control"
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ) : null}
        {isEditing ? 'Actualizar Contacto' : 'Crear Contacto'}
      </button>
    </form>
  );
};

export default ContactForm;