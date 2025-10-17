const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Enable CORS for specific origin (your frontend)
app.use(cors({
    origin: 'https://www.contactus.aviyamagnus.com',  // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Use body-parser middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Temporary in-memory storage for users (Replace with a real database)
let users = {
    student: {},
    parent: {},
    tutor: {},
    admin: {}
};

// Student Registration Route
app.post('/api/register/student', (req, res) => {
    const { email, password } = req.body;
    if (users.student[email]) {
        return res.status(400).json({ success: false, message: 'Student already registered' });
    }
    users.student[email] = { email, password };
    res.status(201).json({ success: true, message: 'Student registered successfully' });
});

// Parent Registration Route
app.post('/api/register/parent', (req, res) => {
    const { email, password } = req.body;
    if (users.parent[email]) {
        return res.status(400).json({ success: false, message: 'Parent already registered' });
    }
    users.parent[email] = { email, password };
    res.status(201).json({ success: true, message: 'Parent registered successfully' });
});

// Tutor Registration Route
app.post('/api/register/tutor', (req, res) => {
    const { email, password } = req.body;
    if (users.tutor[email]) {
        return res.status(400).json({ success: false, message: 'Tutor already registered' });
    }
    users.tutor[email] = { email, password };
    res.status(201).json({ success: true, message: 'Tutor registered successfully' });
});

// Admin Registration Route
app.post('/api/register/admin', (req, res) => {
    const { email, password } = req.body;
    if (users.admin[email]) {
        return res.status(400).json({ success: false, message: 'Admin already registered' });
    }
    users.admin[email] = { email, password };
    res.status(201).json({ success: true, message: 'Admin registered successfully' });
});

// Student Login Route
app.post('/api/login/student', (req, res) => {
    const { email, password } = req.body;
    if (!users.student[email] || users.student[email].password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid student credentials' });
    }
    res.json({ success: true, message: 'Student login successful', user: users.student[email] });
});

// Parent Login Route
app.post('/api/login/parent', (req, res) => {
    const { email, password } = req.body;
    if (!users.parent[email] || users.parent[email].password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid parent credentials' });
    }
    res.json({ success: true, message: 'Parent login successful', user: users.parent[email] });
});

// Tutor Login Route
app.post('/api/login/tutor', (req, res) => {
    const { email, password } = req.body;
    if (!users.tutor[email] || users.tutor[email].password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid tutor credentials' });
    }
    res.json({ success: true, message: 'Tutor login successful', user: users.tutor[email] });
});

// Admin Login Route
app.post('/api/login/admin', (req, res) => {
    const { email, password } = req.body;
    if (!users.admin[email] || users.admin[email].password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
    res.json({ success: true, message: 'Admin login successful', user: users.admin[email] });
});

// Student Dashboard Route (Protected)
app.get('/api/dashboard/student', (req, res) => {
    if (!users.student['test@example.com']) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    res.json({ success: true, message: 'Welcome to your student dashboard!' });
});

// Parent Dashboard Route (Protected)
app.get('/api/dashboard/parent', (req, res) => {
    if (!users.parent['test@example.com']) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    res.json({ success: true, message: 'Welcome to your parent dashboard!' });
});

// Tutor Dashboard Route (Protected)
app.get('/api/dashboard/tutor', (req, res) => {
    if (!users.tutor['test@example.com']) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    res.json({ success: true, message: 'Welcome to your tutor dashboard!' });
});

// Admin Dashboard Route (Protected)
app.get('/api/dashboard/admin', (req, res) => {
    if (!users.admin['test@example.com']) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    res.json({ success: true, message: 'Welcome to your admin dashboard!' });
});
// Register routes
app.post('/api/register/student', (req, res) => { ... });
app.post('/api/register/parent', (req, res) => { ... });
app.post('/api/register/tutor', (req, res) => { ... });
app.post('/api/register/admin', (req, res) => { ... });

// Login routes
app.post('/api/login/student', (req, res) => { ... });
app.post('/api/login/parent', (req, res) => { ... });
app.post('/api/login/tutor', (req, res) => { ... });
app.post('/api/login/admin', (req, res) => { ... });

// Dashboard routes
app.get('/api/dashboard/student', (req, res) => { ... });
app.get('/api/dashboard/parent', (req, res) => { ... });
app.get('/api/dashboard/tutor', (req, res) => { ... });
app.get('/api/dashboard/admin', (req, res) => { ... });


// Start server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
