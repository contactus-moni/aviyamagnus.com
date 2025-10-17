// Import express
const express = require('express');

// Create an Express app
const app = express();

// Define the port to listen on
const port = process.env.PORT || 3000;

// Create a basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
