const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/appConfig');
dotenv.config();
const authRoutes = require('./src/routes/authRoutes');

// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('./swagger-output.json');

const app = express();
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth',authRoutes);

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

