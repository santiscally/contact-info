import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

const ContactForm = ({ contact, onSubmit, isLoading, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    company: contact?.company || '',
    phone: contact?.phone || '',
    email: contact?.email || '',
    address: contact?.address || '',
    notes: contact?.notes || '',
    status: contact?.status || 'interesado'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Empresa</Form.Label>
        <Form.Control
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Dirección</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Calle y altura"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Estado</Form.Label>
        <Form.Select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="interesado">Interesado</option>
          <option value="no mostró interés">No mostró interés</option>
          <option value="cliente">Cliente</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Observaciones</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            {isEditing ? 'Actualizando...' : 'Guardando...'}
          </>
        ) : (
          isEditing ? 'Actualizar Contacto' : 'Guardar Contacto'
        )}
      </Button>
    </Form>
  );
};

export default ContactForm;