const express = require('express');
const router = express.Router();
const fetchController = require('../controllers/fetchControllers');

router.get('/trains', fetchController.fetchAllTrains);
router.get('/passengers', fetchController.fetchAllPassengers);
router.get('/platforms', fetchController.fetchAllPlatforms);
router.get('/staff', fetchController.fetchAllStaff);

module.exports = router;
