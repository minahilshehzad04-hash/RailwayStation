const path = require('path');
const fs = require('fs');
const databaseModels = require('../models/databaseModels');

const servePassengerProfilePage = async (req, res) => {
    if (!req.session.passengerId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const passengerInfo = await databaseModels.getPassengerInfo(req.session.passengerId);
        if (passengerInfo.length > 0) {
            const passenger = passengerInfo[0];
            res.status(200).json(passenger);
        } else {
            res.status(404).json({ error: 'Passenger not found' });
        }
    } catch (err) {
        console.error('Error retrieving passenger info:', err);
        res.status(500).json({ error: 'Error retrieving passenger info' });
    }
};

const serveStaffProfilePage = async (req, res) => {
    if (!req.session.staffId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const staffInfo = await databaseModels.getstaffInfo(req.session.staffId);
        if (staffInfo.length > 0) {
            const staff = staffInfo[0];
            res.status(200).json(staff);
        } else {
            res.status(404).json({ error: 'Staff not found' });
        }
    } catch (err) {
        console.error('Error retrieving staff info:', err);
        res.status(500).json({ error: 'Error retrieving staff info' });
    }
};

module.exports = {
    servePassengerProfilePage,
    serveStaffProfilePage
};
