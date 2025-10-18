const express = require("express");
const app = express();

try {
  const helmet = require("helmet");
  app.use(helmet());
} catch (err) {
  console.warn("⚠️ Helmet not found – continuing without it");
}

app.use(express.json());
app.get("/", (req, res) => res.send("Server running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


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
