// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const connectDB = require('./config/appConfig');
// dotenv.config();
// const authRoutes = require('./src/routes/authRoutes');
// const path = require('path');
// const cors = require("cors");

// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('./swagger-output.json');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/file-upload', express.static(path.join(__dirname, 'file-upload')));

// connectDB();

// // Routes
// app.use('/api/auth',authRoutes);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.listen(3000, () => console.log('Server running on http://localhost:3000'));

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/appConfig');
const authRoutes = require('./src/routes/authRoutes');
const path = require('path');
const cors = require("cors");

const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/file-upload', express.static(path.join(__dirname, 'file-upload')));

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
