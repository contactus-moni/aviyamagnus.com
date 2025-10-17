const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const app = express();

// Enable CORS
app.use(cors({
    origin: 'https://www.contactus.aviyamagnus.com',  // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Parse incoming JSON requests
app.use(bodyParser.json());

let users = {
    student: {}
};

app.post('/api/register/student', (req, res) => {
    const { email, password } = req.body;
    if (users.student[email]) {
        return res.status(400).json({ success: false, message: 'Student already registered' });
    }
    users.student[email] = { email, password };
    res.status(201).json({ success: true, message: 'Student registered successfully' });
});

app.post('/api/login/student', (req, res) => {
    const { email, password } = req.body;
    if (!users.student[email] || users.student[email].password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({ success: true, message: 'Login successful', user: users.student[email] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
