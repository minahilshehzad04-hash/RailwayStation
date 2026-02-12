const databaseModels = require('../models/databaseModels');

const updatePassengerInfo = async (req, res) => {
    const { id, field, newValue } = req.body;

    try {
        await databaseModels.updatePassengerInfo(id, field, newValue);
        res.status(200).json({ message: 'Passenger details updated successfully' });
    } catch (err) {
        console.error('Error updating passenger info:', err);
        res.status(500).json({ error: 'Error updating passenger info' });
    }
};

const updateStaffInfo = async (req, res) => {
    const { id, field, newValue } = req.body;

    try {
        await databaseModels.updateStaffInfo(id, field, newValue);
        res.status(200).json({ message: 'Staff details updated successfully' });
    } catch (err) {
        console.error('Error updating staff info:', err);
        res.status(500).json({ error: 'Error updating staff info' });
    }
};

module.exports = {
    updatePassengerInfo,
    updateStaffInfo,
};
