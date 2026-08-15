const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const db = require('../config/database');

// Matches frontend fetch('/api/requests', { method: 'POST', ... })
router.post('/', requestController.sendRequest);

// Matches frontend fetch(`/api/requests/${userId}`)
router.get('/:userId', requestController.getRequests);

// Matches frontend fetch(`/api/requests/${requestId}`, { method: 'PUT', ... })
router.put('/:id', requestController.updateRequestStatus);

module.exports = router;