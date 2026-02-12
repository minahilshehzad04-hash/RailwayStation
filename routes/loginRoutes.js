const express = require('express');
const router = express.Router();
const loginControllers = require('../controllers/loginControllers');

router.post('/passenger', loginControllers.handlePassengerLogin);
router.get('/passenger', loginControllers.servePassengerLoginPage);
router.post('/staff', loginControllers.handleStaffLogin);
router.get('/staff', loginControllers.serveStaffLoginPage);

module.exports = router;
