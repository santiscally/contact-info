const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/promotions', require('./routes/promotionRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API está funcionando...');
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});