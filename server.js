const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

const submitRoutes = require('./routes/submitRoutes');
const loginRoutes = require('./routes/loginRoutes');
const databaseModels = require('./models/databaseModels');
const profileRoutes = require('./routes/profileRoutes');
const updateRoutes = require('./routes/updateRoutes');
const fetchRoutes = require('./routes/fetchRoutes');
const trainRoutes = require('./routes/trainRoutes');
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '1122',
    resave: false,
    saveUninitialized: true
}));

app.use('/submit', submitRoutes);
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/update', updateRoutes);
app.use('/fetch', fetchRoutes);
app.use('/trains', trainRoutes);

app.get('/stations', async (req, res) => {
    try {
        const stations = await databaseModels.getStations();
        res.status(200).json(stations);
    } catch (err) {
        console.error('Error retrieving station records:', err);
        res.status(500).send('Error retrieving station records');
    }
});

app.get('/passenger/:id', async (req, res) => {
    const passengerId = req.params.id;
    try {
        const passengerInfo = await databaseModels.getPassengerInfo(passengerId);
        if (passengerInfo.length > 0) {
            res.status(200).json(passengerInfo);
        } else {
            res.status(404).send('Passenger not found');
        }
    } catch (err) {
        res.status(500).send('Error retrieving passenger info');
    }
});

app.get('/staff/:id', async (req, res) => {
    const staffId = req.params.id;
    try {
        const staffInfo = await databaseModels.getStaffInfo(staffId);
        if (staffInfo.length > 0) {
            res.status(200).json(staffInfo);
        } else {
            res.status(404).send('Staff member not found');
        }
    } catch (err) {
        res.status(500).send('Error retrieving staff info');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
