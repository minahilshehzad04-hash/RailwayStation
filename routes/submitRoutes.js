const express = require('express');
const router = express.Router();
const submitControllers = require('../controllers/submitControllers');

router.post('/station', submitControllers.handleStationSubmit);
router.post('/platform', submitControllers.handlePlatformSubmit);
router.post('/class', submitControllers.handleClassSubmit);
router.post('/lostfound', submitControllers.handleLostFoundSubmit);
router.post('/route', submitControllers.handleRouteSubmit);
router.post('/ticket', submitControllers.handleTicketSubmit);
router.post('/train', submitControllers.handleTrainSubmit);
router.post('/booking', submitControllers.handleBookingSubmit);
router.post('/passenger', submitControllers.handlePassengerSubmit);
router.post('/staff', submitControllers.handleStaffSubmit);
router.post('/trainclass', submitControllers.handleTrainClassSubmit);
router.post('/trainroute', submitControllers.handleTrainRouteSubmit);

module.exports = router;