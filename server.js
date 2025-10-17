const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Define a route for the homepage
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});

// Define a route for an API endpoint
app.get('/api/endpoint', (req, res) => {
    res.json({ success: true, message: 'This is the API endpoint' });
});

// A catch-all route to handle undefined routes
app.all('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
