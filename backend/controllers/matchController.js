// backend/controllers/matchController.js
const matchingService = require('../services/matchingService');

exports.getMatches = async (req, res) => {
    try {
        const matches = await matchingService.findMatches(req.params.userId);
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};