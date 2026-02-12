const express = require('express');
const trainController = require('../controllers/trainController');

const router = express.Router();

router.get('/search', trainController.searchTrains);
router.post('/search-trains', trainController.searchTrainsForRoute);
module.exports = router;