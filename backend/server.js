const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// IMPORTANT: Middleware to read JSON data from forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));

// Use the routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const skillRoutes = require('./routes/skillRoutes');
app.use('/api/skills', skillRoutes);

const matchRoutes = require('./routes/matchRoutes');
app.use('/api/matches', matchRoutes);

const requestRoutes = require('./routes/requestRoutes');
app.use('/api/requests', requestRoutes);

// Page Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages', 'register.html')));
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages', 'dashboard.html'));
});
app.get('/matches', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages', 'matches.html'));
});
app.get('/requests', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages', 'requests.html'));
});

// Fixed single route for the community feed home page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'pages', 'home.html'));
});
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages', 'profile.html')));
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));