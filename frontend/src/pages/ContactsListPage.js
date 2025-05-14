import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Badge, Tabs, Tab, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { contactService } from '../services/api';
import ContactsMap from '../components/ContactsMap';

const ContactsListPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('lista');
  const navigate = useNavigate();
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');
  const [uniqueCreators, setUniqueCreators] = useState([]);
  
  // Estado para manejar múltiples botones de WhatsApp
  const [whatsappLoading, setWhatsappLoading] = useState({});
  const [whatsappStatus, setWhatsappStatus] = useState({ 
    success: null, 
    error: null,
    contactName: null 
  });
  
  // Estado para manejar múltiples botones de Email
  const [emailLoading, setEmailLoading] = useState({});
  const [emailStatus, setEmailStatus] = useState({ 
    success: null, 
    error: null,
    contactName: null 
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await contactService.getContacts();
        setContacts(response.data);
        setFilteredContacts(response.data);
        
        // Extract unique creators for filter dropdown
        const creators = [...new Set(response.data.map(contact => 
          contact.user ? contact.user.name : 'Desconocido'
        ))];
        setUniqueCreators(creators);
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar contactos. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);
  
  // Apply filters when filter state changes
  useEffect(() => {
    let result = contacts;
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(contact => contact.status === statusFilter);
    }
    
    // Apply creator filter
    if (creatorFilter) {
      result = result.filter(contact => 
        contact.user && contact.user.name === creatorFilter
      );
    }
    
    setFilteredContacts(result);
  }, [statusFilter, creatorFilter, contacts]);
  
  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter('');
    setCreatorFilter('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      try {
        await contactService.deleteContact(id);
        // Actualizar la lista de contactos
        setContacts(contacts.filter(contact => contact._id !== id));
      } catch (err) {
        setError('Error al eliminar el contacto. Por favor, inténtalo de nuevo.');
      }
    }
  };

  // Función para manejar el envío de WhatsApp
  const handleSendWhatsApp = async (contactId, contactName) => {
    // Actualizar estado de carga para este contacto específico
    setWhatsappLoading(prev => ({ ...prev, [contactId]: true }));
    setWhatsappStatus({ success: null, error: null, contactName: null });
    
    try {
      // Mensaje predeterminado con placeholder para el nombre
      const message = `Hola {name}, somos Simple Apps. Creamos soluciones simples para necesidades complejas. ¿Podemos ayudarte con tu negocio?`;
      
      // Llamar al endpoint para obtener la URL de WhatsApp
      const response = await contactService.sendWhatsApp(contactId, { message });
      
      // Si tenemos éxito, abrimos la URL en una nueva ventana
      if (response.data && response.data.whatsappUrl) {
        window.open(response.data.whatsappUrl, '_blank');
        setWhatsappStatus({ 
          success: `WhatsApp para ${contactName} abierto correctamente`, 
          error: null,
          contactName 
        });
        
        // Actualizar la lista de contactos para reflejar la nueva fecha de último contacto
        const updatedResponse = await contactService.getContacts();
        setContacts(updatedResponse.data);
        
        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setWhatsappStatus({ success: null, error: null, contactName: null });
        }, 3000);
      } else {
        setWhatsappStatus({ 
          success: null, 
          error: 'No se pudo generar el enlace de WhatsApp',
          contactName 
        });
      }
    } catch (err) {
      setWhatsappStatus({ 
        success: null, 
        error: err.response?.data?.message || 'Error al generar el enlace de WhatsApp',
        contactName 
      });
    } finally {
      setWhatsappLoading(prev => ({ ...prev, [contactId]: false }));
    }
  };

  // Función para manejar el envío de Email
  const handleSendEmail = async (contactId, contactName, contactEmail) => {
    // Actualizar estado de carga para este contacto específico
    setEmailLoading(prev => ({ ...prev, [contactId]: true }));
    setEmailStatus({ success: null, error: null, contactName: null });
    
    try {
      // Asunto predeterminado para el email
      const subject = "Soluciones tecnológicas para tu negocio - Simple Apps";
      
      // Llamar al endpoint para enviar email
      const response = await contactService.sendEmail(contactId, { 
        subject,
        content: '' // Vacío para usar la plantilla por defecto
      });
      
      if (response.data && response.data.success) {
        setEmailStatus({ 
          success: `Email enviado correctamente a ${contactName} (${contactEmail})`, 
          error: null,
          contactName
        });
        
        // Actualizar la lista de contactos para reflejar la nueva fecha de último contacto
        const updatedResponse = await contactService.getContacts();
        setContacts(updatedResponse.data);
        
        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setEmailStatus({ success: null, error: null, contactName: null });
        }, 3000);
      } else {
        setEmailStatus({ 
          success: null, 
          error: 'Error al enviar el email',
          contactName
        });
      }
    } catch (err) {
      setEmailStatus({ 
        success: null, 
        error: err.response?.data?.message || 'Error al enviar el email',
        contactName
      });
    } finally {
      setEmailLoading(prev => ({ ...prev, [contactId]: false }));
    }
  };

  // Formato de fecha para mostrar la última fecha de contacto
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin contacto';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Obtener color de badge según estado del contacto
  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'cliente':
        return 'success';
      case 'interesado':
        return 'warning';
      case 'no mostró interés':
        return 'secondary';
      default:
        return 'info';
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Contactos</h2>
            <Button 
              variant="primary" 
              onClick={() => navigate('/contacts/new')}
              className="d-flex align-items-center"
            >
              <i className="bi bi-plus-circle me-2" style={{ fontSize: '1.1rem' }}></i>
              Nuevo Contacto
            </Button>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {whatsappStatus.error && (
            <Alert variant="danger">
              Error al enviar WhatsApp a {whatsappStatus.contactName}: {whatsappStatus.error}
            </Alert>
          )}
          {whatsappStatus.success && (
            <Alert variant="success">{whatsappStatus.success}</Alert>
          )}
          {emailStatus.error && (
            <Alert variant="danger">
              Error al enviar Email a {emailStatus.contactName}: {emailStatus.error}
            </Alert>
          )}
          {emailStatus.success && (
            <Alert variant="success">{emailStatus.success}</Alert>
          )}
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="lista" title="Lista de Contactos">
              <Card className="shadow mb-4">
                <Card.Header className="bg-light">
                  <h5 className="mb-3">Filtros</h5>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Estado:</Form.Label>
                        <Form.Select 
                          value={statusFilter} 
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="">Todos los estados</option>
                          <option value="interesado">Interesado</option>
                          <option value="no mostró interés">No mostró interés</option>
                          <option value="cliente">Cliente</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Creado por:</Form.Label>
                        <Form.Select 
                          value={creatorFilter} 
                          onChange={(e) => setCreatorFilter(e.target.value)}
                        >
                          <option value="">Todos los usuarios</option>
                          {uniqueCreators.map((creator, index) => (
                            <option key={index} value={creator}>
                              {creator}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                      <Button 
                        variant="secondary" 
                        className="mb-2"
                        onClick={handleResetFilters}
                      >
                        Limpiar filtros
                      </Button>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-3">Cargando contactos...</p>
                    </div>
                  ) : filteredContacts.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-filter-circle" style={{ fontSize: '3rem' }}></i>
                      <h4 className="mt-3">No hay contactos que coincidan con los filtros</h4>
                      <p className="text-muted">Intenta con otros criterios de búsqueda</p>
                      <Button 
                        variant="outline-secondary" 
                        onClick={handleResetFilters}
                        className="mt-2"
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="align-middle">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Empresa</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Dirección</th>
                            <th>Estado</th>
                            <th>Creado por</th>
                            <th>Último contacto</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredContacts.map(contact => (
                            <tr key={contact._id}>
                              <td>{contact.name}</td>
                              <td>{contact.company}</td>
                              <td>{contact.phone}</td>
                              <td>{contact.email}</td>
                              <td>{contact.address || 'No especificada'}</td>
                              <td>
                                <Badge bg={getStatusBadgeColor(contact.status)}>
                                  {contact.status || 'interesado'}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg="info" className="text-white">
                                  {contact.user ? contact.user.name : 'Desconocido'}
                                </Badge>
                              </td>
                              <td>
                                {contact.lastContact ? (
                                  <Badge bg="info" pill className="py-1 px-2">
                                    {formatDate(contact.lastContact)}
                                  </Badge>
                                ) : (
                                  <Badge bg="secondary" pill className="py-1 px-2">
                                    Sin contacto
                                  </Badge>
                                )}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center gap-2">
                                  {/* Botón de WhatsApp mejorado */}
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleSendWhatsApp(contact._id, contact.name)}
                                    disabled={whatsappLoading[contact._id]}
                                    title="Enviar promoción por WhatsApp"
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ width: '38px', height: '38px' }}
                                  >
                                    {whatsappLoading[contact._id] ? (
                                      <Spinner animation="border" size="sm" />
                                    ) : (
                                      <i className="bi bi-whatsapp" style={{ fontSize: '1.2rem' }}></i>
                                    )}
                                  </Button>
                                  
                                  {/* Botón de Email */}
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleSendEmail(contact._id, contact.name, contact.email)}
                                    disabled={emailLoading[contact._id]}
                                    title="Enviar promoción por Email"
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ width: '38px', height: '38px' }}
                                  >
                                    {emailLoading[contact._id] ? (
                                      <Spinner animation="border" size="sm" />
                                    ) : (
                                      <i className="bi bi-envelope" style={{ fontSize: '1.2rem' }}></i>
                                    )}
                                  </Button>
                                  
                                  {/* Botón de Editar mejorado */}
                                  <Link 
                                    to={`/contacts/edit/${contact._id}`} 
                                    className="btn btn-secondary btn-sm d-flex align-items-center justify-content-center"
                                    title="Editar contacto"
                                    style={{ width: '38px', height: '38px' }}
                                  >
                                    <i className="bi bi-pencil" style={{ fontSize: '1.2rem' }}></i>
                                  </Link>
                                  
                                  {/* Botón de Eliminar mejorado */}
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(contact._id)}
                                    title="Eliminar contacto"
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ width: '38px', height: '38px' }}
                                  >
                                    <i className="bi bi-trash" style={{ fontSize: '1.2rem' }}></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="mapa" title="Mapa de Contactos">
              {!loading && filteredContacts.length > 0 ? (
                <ContactsMap contacts={filteredContacts} />
              ) : loading ? (
                <Card className="shadow">
                  <Card.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Cargando contactos...</p>
                  </Card.Body>
                </Card>
              ) : (
                <Card className="shadow">
                  <Card.Body className="text-center py-5">
                    <i className="bi bi-map" style={{ fontSize: '3rem' }}></i>
                    <h4 className="mt-3">No hay contactos para mostrar en el mapa</h4>
                    <p className="text-muted">
                      {statusFilter || creatorFilter ? 
                        'No hay contactos que coincidan con los filtros seleccionados' : 
                        'Añade contactos con direcciones para visualizarlos'}
                    </p>
                    {(statusFilter || creatorFilter) && (
                      <Button 
                        variant="outline-secondary" 
                        onClick={handleResetFilters}
                        className="mt-2"
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactsListPage;