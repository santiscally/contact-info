const axios = require('axios');

// Inicialización (simplemente para mantener la compatibilidad)
const initWhatsApp = () => {
  console.log('Servicio de WhatsApp simulado inicializado');
  return true;
};

// Verificar estado (siempre devuelve que está listo)
const getWhatsAppStatus = () => {
  return {
    isReady: true,
    isInitializing: false,
    hasQR: false,
    qrCode: null
  };
};

// Enviar mensaje de WhatsApp (simulado)
const sendWhatsAppMessage = async (phoneNumber, message, contactName = '') => {
  try {
    console.log(`[SIMULACIÓN] Enviando WhatsApp a: ${phoneNumber}`);
    
    // Simulamos una respuesta exitosa
    return {
      success: true,
      messageId: `simulated_${Date.now()}`,
      message: `SIMULACIÓN: Mensaje enviado con éxito a ${phoneNumber}`
    };
  } catch (error) {
    console.error('Error en simulación de WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { 
  initWhatsApp, 
  sendWhatsAppMessage, 
  getWhatsAppStatus 
};