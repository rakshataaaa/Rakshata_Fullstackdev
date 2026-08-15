// backend/controllers/requestController.js
const db = require('../config/database');

// Send a request to another user
exports.sendRequest = async (req, res) => {
    console.log("BODY RECEIVED:", req.body); 
    const { senderId, receiverId, skillName } = req.body;

    try {
        const sql = 'INSERT INTO requests (sender_id, receiver_id, skill_name, status) VALUES (?, ?, ?, "pending")';
        await db.execute(sql, [senderId, receiverId, skillName]);
        res.status(201).json({ message: 'Request sent successfully!' });
    } catch (err) {
        console.error("Error sending request:", err);
        res.status(500).json({ error: 'Error sending request: ' + err.message });
    }
};

// Get requests received by a user
exports.getRequests = async (req, res) => {
    const userId = req.params.userId;

    try {
        const sql = `
            r.id, r.skill_name, r.status, u.name as sender_name, u.email as sender_email 
            FROM requests r 
            JOIN users u ON r.sender_id = u.id 
            WHERE r.receiver_id = ?
        `;
        // Let's write the execute statement properly
        const [requests] = await db.execute(`
            SELECT r.id, r.skill_name, r.status, u.name as sender_name, u.email as sender_email 
            FROM requests r 
            JOIN users u ON r.sender_id = u.id 
            WHERE r.receiver_id = ?
        `, [userId]);

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching requests: ' + err.message });
    }
};
// Update request status (accepted or rejected)
exports.updateRequestStatus = async (req, res) => {
    const requestId = req.params.id; // <--- Grab ID from the URL parameter
    const { status } = req.body;     // <--- Grab status from the request body

    try {
        await db.execute('UPDATE requests SET status = ? WHERE id = ?', [status, requestId]);
        res.status(200).json({ message: `Request ${status} successfully!` });
    } catch (err) {
        res.status(500).json({ error: 'Error updating request: ' + err.message });
    }
};