const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const db = require('../config/database');
// This needs to handle requests like GET /api/matches/1
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Clean and safe query to find matching peers
        const [matches] = await db.execute(`
            SELECT DISTINCT u.id as peer_id, u.name as peer_name, s.skill_name 
            FROM skills s
            JOIN users u ON s.user_id = u.id
            WHERE s.skill_type = 'teach' 
              AND s.user_id != ? 
              AND s.skill_name IN (
                  SELECT skill_name FROM skills WHERE user_id = ? AND skill_type = 'learn'
              )
        `, [userId, userId]);

        res.status(200).json(matches);
    } catch (err) {
        console.error("Database Error in GET /api/matches:", err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;