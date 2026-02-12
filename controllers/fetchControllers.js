const databaseModels = require('../models/databaseModels');

const fetchAllTrains = async (req, res) => {
    try {
        const trains = await databaseModels.getAllTrains();
        res.status(200).json(trains);
    } catch (err) {
        console.error('Error retrieving train records:', err);
        res.status(500).send('Error retrieving train records');
    }
};

const fetchAllPassengers = async (req, res) => {
    try {
        const passengers = await databaseModels.getAllPassengers();
        res.status(200).json(passengers);
    } catch (err) {
        console.error('Error retrieving passenger records:', err);
        res.status(500).send('Error retrieving passenger records');
    }
};

const fetchAllPlatforms = async (req, res) => {
    try {
        const platforms = await databaseModels.getAllPlatforms();
        res.status(200).json(platforms);
    } catch (err) {
        console.error('Error retrieving platform records:', err);
        res.status(500).send('Error retrieving platform records');
    }
};

const fetchAllStaff = async (req, res) => {
    try {
        const staff = await databaseModels.getAllStaff();
        res.status(200).json(staff);
    } catch (err) {
        console.error('Error retrieving staff records:', err);
        res.status(500).send('Error retrieving staff records');
    }
};

module.exports = {
    fetchAllTrains,
    fetchAllPassengers,
    fetchAllPlatforms,
    fetchAllStaff
};
