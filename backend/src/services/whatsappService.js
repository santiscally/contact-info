

const generateWhatsAppUrl = (phoneNumber, message, contactName = '') => {
  try {
    // Asegurarse de que el número de teléfono tiene el formato correcto (sin '+' ni espacios)
    const formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
    
    // Personalizar el mensaje con el nombre del contacto si está disponible
    const personalizedMessage = contactName 
      ? message.replace('{name}', contactName) 
      : message;
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(personalizedMessage);
    
    // Generar la URL de wa.me
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    return {
      success: true,
      url: whatsappUrl
    };
  } catch (error) {
    console.error('Error al generar URL de WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { 
  generateWhatsAppUrl
};