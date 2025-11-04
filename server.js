import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve signup page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// API endpoint
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  console.log('New registration:', username, email);
  res.json({ status: 'success', message: 'Registration successful!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
