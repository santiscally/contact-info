const Contact = require('../models/Contact');
const emailService = require('../services/emailService');
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

    // Enviar email
    const result = await emailService.sendPromotionalEmail(
      contact.email,
      subject,
      content
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

// @desc    Enviar WhatsApp promocional a un contacto
// @route   POST /api/promotions/whatsapp/:id
// @access  Private
const sendWhatsAppPromotion = async (req, res) => {
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

    // Enviar WhatsApp
    const result = await whatsappService.sendWhatsAppMessage(
      contact.phone,
      message
    );

    if (result.success) {
      // Actualizar fecha de último contacto
      contact.lastContact = Date.now();
      await contact.save();
      
      res.json({ success: true, messageId: result.messageId });
    } else {
      res.status(500).json({ message: 'Error al enviar WhatsApp', error: result.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { sendEmailPromotion, sendWhatsAppPromotion };