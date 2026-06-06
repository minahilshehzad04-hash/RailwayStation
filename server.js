const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

try {
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

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

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
            res.status(500).json({ error: 'Error retrieving station records', message: err.message });
        }
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error', message: err.message });
    });

    const server = app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

} catch (err) {
    console.error('FATAL ERROR during server initialization:', err);
    console.error(err.stack);
    process.exit(1);
}
