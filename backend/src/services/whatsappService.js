const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let isReady = false;

const initWhatsApp = () => {
  // Crear cliente de WhatsApp
  client = new Client();

  // Generar QR para autenticación
  client.on('qr', (qr) => {
    console.log('QR GENERADO: Escanea con tu dispositivo WhatsApp');
    qrcode.generate(qr, { small: true });
  });

  // Evento de conexión
  client.on('ready', () => {
    console.log('Cliente WhatsApp conectado y listo');
    isReady = true;
  });

  // Iniciar cliente
  client.initialize();
};

// Enviar mensaje de WhatsApp
const sendWhatsAppMessage = async (phoneNumber, message) => {
  if (!isReady) {
    return { success: false, error: 'Cliente WhatsApp no inicializado o no listo' };
  }

  try {
    // Formato internacional requerido por WhatsApp-web.js
    // Ejemplo: 34612345678 (sin + ni espacios)
    // Asegurar que el número no tenga el símbolo + ni otros caracteres no numéricos
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    
    // Número con formato para WhatsApp-web.js
    const chatId = `${formattedNumber}@c.us`;
    
    // Enviar mensaje
    const result = await client.sendMessage(chatId, message);
    
    return { success: true, messageId: result.id.id };
  } catch (error) {
    console.error('Error al enviar mensaje WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { initWhatsApp, sendWhatsAppMessage };