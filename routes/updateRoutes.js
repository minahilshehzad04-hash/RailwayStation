const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');

router.post('/passenger', updateController.updatePassengerInfo);
router.post('/staff', updateController.updateStaffInfo);

module.exports = router;
