const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve signup page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// API endpoint for form submission (optional)
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Here you can save to DB or perform any logic
  console.log('New registration:', username, email);

  res.json({ status: 'success', message: 'Registration successful!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
