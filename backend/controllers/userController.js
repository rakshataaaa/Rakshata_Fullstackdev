const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Register function
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    
    // Stricter email validation (requires a proper domain extension like .com, .in, etc.)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid and complete email address (e.g. name@gmail.com).' });
    }

    try {
        // Check if email already exists in database
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email is already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await db.execute(sql, [name, email, hashedPassword]);
        
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user: ' + err.message });
    }
};

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Email not found' });
        }

        const user = rows[0];

        // Compare the submitted password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Send back user data and success response
        res.status(200).json({
            message: 'Login successful!',
            userId: user.id,
            name: user.name
        });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in: ' + err.message });
    }
};
exports.getUserProfile = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, name, email FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};