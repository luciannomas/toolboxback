const express = require('express');
const filesRouter = require('./routes/files');
const cors = require('cors');
const config = require('./utils/config');

const app = express();

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: config.CORS_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/files', filesRouter);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

module.exports = app; 