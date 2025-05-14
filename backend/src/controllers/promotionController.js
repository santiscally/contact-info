const Contact = require('../models/Contact');
const emailService = require('../services/emailServiceSendGrid');
const whatsappService = require('../services/whatsappService');

// @desc    Enviar email promocional a un contacto
// @route   POST /api/promotions/email/:id
// @access  Private
const sendEmailPromotion = async (req, res) => {
  try {
    const { subject, content } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    // Verificar que el contacto pertenece al usuario
    if (contact.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Enviar email - Si no se proporciona contenido, se usará la plantilla por defecto
    const result = await emailService.sendPromotionalEmail(
      contact.email,
      subject,
      content,
      contact.name // Pasamos el nombre del contacto para personalizar la plantilla
    );

    if (result.success) {
      // Actualizar fecha de último contacto
      contact.lastContact = Date.now();
      await contact.save();
      
      res.json({ success: true, messageId: result.messageId });
    } else {
      res.status(500).json({ message: 'Error al enviar email', error: result.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
// @desc    Generar URL de WhatsApp para un contacto
// @route   POST /api/promotions/whatsapp/:id
// @access  Private
const generateWhatsAppUrl = async (req, res) => {
  try {
    const { message } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    // Verificar que el contacto pertenece al usuario
    if (contact.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Mensaje predeterminado si no se proporciona uno
    const defaultMessage = `Hola {name}, somos Simple Apps. Creamos soluciones simples para necesidades complejas. Descubre cómo podemos ayudarte a transformar tu negocio.`;
    
    // Generar URL de WhatsApp
    const result = whatsappService.generateWhatsAppUrl(
      contact.phone,
      message || defaultMessage,
      contact.name // Para personalizar el mensaje con el nombre
    );

    if (result.success) {
      // Actualizar fecha de último contacto
      contact.lastContact = Date.now();
      await contact.save();
      
      res.json({ success: true, whatsappUrl: result.url });
    } else {
      res.status(500).json({ message: 'Error al generar URL de WhatsApp', error: result.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { 
  sendEmailPromotion, 
  generateWhatsAppUrl
};