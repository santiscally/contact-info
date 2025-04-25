import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const ContactsTable = ({ contacts, onDelete, onEmailPromotion, onWhatsAppPromotion }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Empresa</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Último contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No hay contactos registrados
              </td>
            </tr>
          ) : (
            contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.company}</td>
                <td>{contact.phone}</td>
                <td>{contact.email}</td>
                <td>
                  {contact.lastContact
                    ? new Date(contact.lastContact).toLocaleDateString()
                    : 'Nunca'}
                </td>
                <td>
                  <div className="btn-group">
                    <Link 
                      to={`/contacts/edit/${contact._id}`} 
                      className="btn btn-sm btn-outline-primary"
                      title="Editar"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => onDelete(contact._id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => onEmailPromotion(contact)}
                      className="btn btn-sm btn-outline-info"
                      title="Enviar Email"
                    >
                      <FaEnvelope />
                    </button>
                    <button
                      onClick={() => onWhatsAppPromotion(contact)}
                      className="btn btn-sm btn-outline-success"
                      title="Enviar WhatsApp"
                    >
                      <FaWhatsapp />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsTable;