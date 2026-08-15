const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const db = require('../config/database');
// Existing routes...
router.post('/add', skillController.addSkill);
router.get('/:userId', skillController.getSkills);

// ADD THESE NEW ROUTES FOR EDIT AND DELETE:
router.put('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

module.exports = router;