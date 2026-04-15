const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/appConfig');
const authRoutes = require('./src/routes/authRoutes');
const path = require('path');
const cors = require("cors");
const loggerMiddleware = require('./src/middlewares/loggerMiddleware');
const logger = require('./src/logs/logger');

const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/file-upload', express.static(path.join(__dirname, 'file-upload')));
//logger test
app.use(loggerMiddleware);
app.get('/', (req, res) => {
  res.send('LOGGER WORKING FINE');
});

// TEST LOGGER ROUTE
app.get('/error', (req, res) => {
  try {
    throw new Error('Test error');
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Something went wrong');
  }
});

connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Swagger (safe loading)
try {
  const swaggerFile = require('./swagger-output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
} catch (err) {
  console.log(" Swagger file not found. Run: node swagger.js");
}

// Start server (ONLY ONCE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});
