const trainModel = require('../models/trainModel');

const searchTrains = async (req, res) => {
    const { startStation, endStation } = req.query;

    try {
        const trains = await trainModel.getTrainsForRoute(startStation, endStation);
        res.json(trains);
    } catch (err) {
        console.error('Error searching trains:', err);
        res.status(500).send('Error searching trains');
    }
};
const searchTrainsForRoute = async (req, res) => {
    const { startStation, endStation } = req.body;

    try {
        const trains = await trainModel.getTrainsForRoute(startStation, endStation);
        res.json(trains);
    } catch (err) {
        console.error('Error searching trains:', err);
        res.status(500).send('Error searching trains');
    }
};

module.exports = {
    searchTrains,
    searchTrainsForRoute,
};