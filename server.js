require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');

const app = express();

// Middleware setup
app.use(cors());  // CORS setup
app.use(helmet());  // Security headers
app.use(morgan('tiny'));  // Logging HTTP requests
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Define routes
app.post('/register', authController.register);
app.post('/login', authController.login);
app.get('/dashboard', dashboardController.viewDashboard);

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Graceful shutdown
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
