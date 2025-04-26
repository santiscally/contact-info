const express = require('express');
const router = express.Router();
const {
  sendEmailPromotion,
  sendWhatsAppPromotion,
  getWhatsAppStatus
} = require('../controllers/promotionController');
const { protect } = require('../middleware/auth');

// Todas las rutas de promociones requieren autenticación
router.use(protect);

router.post('/email/:id', sendEmailPromotion);
router.post('/whatsapp/:id', sendWhatsAppPromotion);
router.get('/whatsapp-status', getWhatsAppStatus);

module.exports = router;