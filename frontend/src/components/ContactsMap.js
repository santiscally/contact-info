import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import axios from 'axios';
import { Card, Spinner, Alert } from 'react-bootstrap';

const ContactsMap = ({ contacts }) => {
  const [contactsWithCoords, setContactsWithCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Centro del mapa (Buenos Aires)
  const defaultCenter = [-34.6037, -58.3816];
  
  useEffect(() => {
    const getCoordinates = async () => {
      setLoading(true);
      
      try {
        const contactsWithValidAddress = contacts.filter(contact => contact.address && contact.address.trim() !== '');
        
        if (contactsWithValidAddress.length === 0) {
          setContactsWithCoords([]);
          setLoading(false);
          return;
        }
        
        const contactsWithPromises = contactsWithValidAddress.map(async contact => {
          try {
            // Agregar "Buenos Aires, Argentina" a la dirección para mejorar la geocodificación
            const fullAddress = `${contact.address}, Buenos Aires, Argentina`;
            const encodedAddress = encodeURIComponent(fullAddress);
            
            // Usar Nominatim para geocodificación (servicio gratuito de OpenStreetMap)
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
            );
            
            if (response.data && response.data.length > 0) {
              const { lat, lon } = response.data[0];
              return {
                ...contact,
                coordinates: [parseFloat(lat), parseFloat(lon)]
              };
            }
            
            return null;
          } catch (err) {
            console.error(`Error geocodificando dirección para ${contact.name}:`, err);
            return null;
          }
        });
        
        const resolvedContacts = await Promise.all(contactsWithPromises);
        const validContacts = resolvedContacts.filter(contact => contact !== null);
        
        setContactsWithCoords(validContacts);
      } catch (err) {
        console.error('Error al obtener coordenadas:', err);
        setError('No se pudieron cargar las ubicaciones de los contactos en el mapa.');
      } finally {
        setLoading(false);
      }
    };
    
    getCoordinates();
  }, [contacts]);
  
  return (
    <Card className="shadow mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Mapa de Contactos</h5>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando ubicaciones...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : contactsWithCoords.length === 0 ? (
          <Alert variant="info">
            No hay contactos con direcciones válidas para mostrar en el mapa.
          </Alert>
        ) : (
          <div style={{ height: "500px", width: "100%" }}>
            <MapContainer 
              center={defaultCenter} 
              zoom={12} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {contactsWithCoords.map(contact => (
                <Marker 
                  key={contact._id} 
                  position={contact.coordinates}
                >
                  <Popup>
                    <div>
                      <h6>{contact.name}</h6>
                      <p><strong>Empresa:</strong> {contact.company}</p>
                      <p><strong>Dirección:</strong> {contact.address}</p>
                      <p><strong>Estado:</strong> {contact.status}</p>
                      <p><strong>Teléfono:</strong> {contact.phone}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ContactsMap;