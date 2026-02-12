const express = require('express');
const router = express.Router();
const path = require('path');
const profileControllers = require('../controllers/profileControllers');

// Serve PassengerProfile.html
router.get('/passenger', (req, res) => {
    res.sendFile(path.join(__dirname, '../PassengerProfile.html'));
});

// Provide passenger data
router.get('/passenger/data', profileControllers.servePassengerProfilePage);

router.get('/staff', (req, res) => {
    res.sendFile(path.join(__dirname, '../StaffProfile.html'));
});

// Provide passenger data
router.get('/staff/data', profileControllers.serveStaffProfilePage);

module.exports = router;
