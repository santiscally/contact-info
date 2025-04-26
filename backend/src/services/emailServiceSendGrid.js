const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Plantilla de email promocional por defecto
const defaultEmailTemplate = (contactName) => {
    return `<!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple Apps - Soluciones tecnológicas para tu negocio</title>
      <style>
          /* Estilos generales */
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
          }
          
          /* Contenedor principal */
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          }
          
          /* Encabezado */
          .header {
              background-color: #4e73df;
              padding: 30px 20px;
              text-align: center;
              color: white;
          }
          
          .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
          }
          
          .header p {
              margin: 10px 0 0;
              opacity: 0.9;
              font-size: 16px;
          }
          
          /* Contenido */
          .content {
              padding: 30px 25px;
          }
          
          .intro {
              font-size: 18px;
              margin-bottom: 25px;
              text-align: center;
              font-weight: 500;
              color: #4e73df;
          }
          
          .message {
              margin-bottom: 25px;
              font-size: 16px;
              color: #555;
          }
          
          .highlight {
              font-weight: 600;
              color: #4e73df;
          }
          
          /* Beneficios */
          .benefits {
              background-color: #f8f9fc;
              border-radius: 6px;
              padding: 20px;
              margin-bottom: 25px;
          }
          
          .benefits h3 {
              color: #4e73df;
              margin-top: 0;
              margin-bottom: 15px;
              font-size: 18px;
          }
          
          .benefits ul {
              margin: 0;
              padding-left: 20px;
          }
          
          .benefits li {
              margin-bottom: 8px;
              color: #555;
          }
          
          /* CTA */
          .cta {
              text-align: center;
              margin: 30px 0;
          }
          
          .button {
              display: inline-block;
              background-color: #4e73df;
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 4px;
              font-size: 16px;
              font-weight: 600;
              transition: background-color 0.3s;
          }
          
          .button:hover {
              background-color: #2e59d9;
          }
          
          /* Pie de página */
          .footer {
              background-color: #f8f9fc;
              padding: 20px;
              text-align: center;
              color: #777;
              font-size: 14px;
              border-top: 1px solid #eee;
          }
          
          .footer a {
              color: #4e73df;
              text-decoration: none;
          }
          
          /* Responsive */
          @media screen and (max-width: 600px) {
              .container {
                  width: 100%;
                  border-radius: 0;
              }
              
              .header {
                  padding: 20px 15px;
              }
              
              .content {
                  padding: 20px 15px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <!-- Añadir instrucción para agregar a contactos -->
          <p style="font-size:12px; color:#666; text-align:center; padding:5px;">
            ¿No ves correctamente este correo? 
            <a href="mailto:${process.env.EMAIL_FROM}?subject=Agregar%20a%20contactos" style="color:#4e73df;">
              Agrega nuestra dirección a tus contactos
            </a>
          </p>
          
          <div class="header">
              <h1>Simple Apps</h1>
              <p>Soluciones tecnológicas para tu negocio</p>
          </div>
          
          <div class="content">
              <p class="intro">Creamos <span class="highlight">soluciones simples</span> para necesidades complejas</p>
              
              <div class="message">
                  <p>Hola ${contactName},</p>
                  
                  <p><strong>Simple Apps</strong> es tu aliado en tecnología, ideal para pequeños y medianos comercios. Te ayudamos a <span class="highlight">transformar</span> tus necesidades en herramientas que aumenten tu <span class="highlight">productividad.</span></p>
                  
                  <p>Ofrecemos servicios de desarrollo de software para que puedas automatizar tareas, gestionar clientes, mejorar la comunicación, controlar el inventario y mucho más.</p>
              </div>
              
              <div class="benefits">
                  <h3>¿Qué podemos hacer por ti?</h3>
                  <ul>
                      <li><strong>Automatización de procesos</strong> - Ahorra tiempo y evita errores</li>
                      <li><strong>Gestión de clientes</strong> - Organiza y aprovecha tu base de contactos</li>
                      <li><strong>Aplicaciones a medida</strong> - Desarrolladas según tus necesidades específicas</li>
                      <li><strong>Integraciones</strong> - Conecta tus sistemas existentes</li>
                      <li><strong>Soluciones en la nube</strong> - Accede desde cualquier lugar</li>
                  </ul>
              </div>
              
              <p>Reservá tu consultoría inicial <strong>sin cargo</strong> y descubrí las posibilidades para tu negocio.</p>
              
              <div class="cta">
                  <a href="https://simpleapps.com.ar" class="button">Descubrí más</a>
              </div>
          </div>
          
          <div class="footer">
              <p>© 2025 Simple Apps - Todos los derechos reservados</p>
              <p>
                  <a href="https://simpleapps.com.ar">simpleapps.com.ar</a> | 
                  <a href="mailto:${process.env.EMAIL_FROM}">${process.env.EMAIL_FROM}</a>
              </p>
              <!-- Añadir opción de desuscripción -->
              <p style="font-size:11px; color:#999;">
                  Si no deseas recibir más correos, 
                  <a href="mailto:${process.env.EMAIL_FROM}?subject=Desuscribir" style="color:#999;">
                      haz clic aquí
                  </a>
              </p>
          </div>
      </div>
  </body>
  </html>`;
};

// Enviar email promocional usando SendGrid
const sendPromotionalEmail = async (to, subject, html, contactName = '') => {
  try {
    // Si no se proporciona contenido HTML personalizado, usar la plantilla por defecto
    const emailContent = html || defaultEmailTemplate(contactName);
    
    console.log('==== DIAGNÓSTICO DE EMAIL CON SENDGRID ====');
    console.log(`Destinatario: ${to}`);
    console.log(`Remitente: ${process.env.EMAIL_FROM}`);
    console.log(`API Key configurada (primeros 5 caracteres): ${process.env.SENDGRID_API_KEY.substring(0, 5)}...`);
    
    // Crear el mensaje con formato SendGrid
    const msg = {
      to: to,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME || 'Simple Apps'
      },
      subject: subject || "Conoce nuestras soluciones tecnológicas - Simple Apps",
      html: emailContent,
      trackingSettings: {
        clickTracking: {
          enable: true
        },
        openTracking: {
          enable: true
        }
      },
      mailSettings: {
        bypassListManagement: {
          enable: false
        },
        footer: {
          enable: false
        },
        sandboxMode: {
          enable: false  // Cambiar a true para pruebas (no envía realmente)
        }
      },
      // Puedes añadir categorías para organizar tus emails
      categories: ['promocion', 'bienvenida']
    };
    
    // Enviar el email usando SendGrid
    const response = await sgMail.send(msg);
    
    console.log('Respuesta de SendGrid:');
    console.log(`Status Code: ${response[0].statusCode}`);
    console.log(`Headers: ${JSON.stringify(response[0].headers)}`);
    
    return { 
      success: true, 
      statusCode: response[0].statusCode,
      messageId: response[0].headers['x-message-id'] || 'ID no disponible'
    };
  } catch (error) {
    console.error('ERROR AL ENVIAR EMAIL CON SENDGRID:');
    console.error(error);
    
    if (error.response) {
      console.error('Error de SendGrid:');
      console.error(`Status: ${error.response.status}`);
      console.error(`Body: ${JSON.stringify(error.response.body)}`);
    }
    
    return { 
      success: false, 
      error: error.message,
      details: error.response ? error.response.body : null
    };
  }
};

module.exports = { sendPromotionalEmail };