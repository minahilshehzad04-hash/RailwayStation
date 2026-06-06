const sql = require('../mssql_shim');
const path = require('path');
// Connection string for the SQL Server
const connectionString = process.env.DATABASE_URL || 'Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-APJ5T8S\\SQLEXPRESS,1433;Database=RailwayStation;UID=sa;PWD=12345;Encrypt=no;';

// Create a pool
const pool = new sql.ConnectionPool({ connectionString: connectionString });

// Connect to the database asynchronously without blocking module load
// Use .catch to prevent unhandled rejection errors
pool.connect().catch(err => {
    // Connection failed, but that's OK - fallback will be used
    console.warn('[SubmitController] Database connection will use fallback');
});

// Function to handle station form submission
const handleStationSubmit = (req, res) => {
    const { station_id, station_name, station_city, station_address } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO station (s_id, s_name, s_city, s_address)
        VALUES (@station_id, @station_name, @station_city, @station_address);
    `;
    request.input('station_id', sql.NVarChar, station_id);
    request.input('station_name', sql.NVarChar, station_name);
    request.input('station_city', sql.NVarChar, station_city);
    request.input('station_address', sql.NVarChar, station_address);
    request.query(insertQuery).then(result => {
        console.log('Station data inserted successfully');
        res.status(200).send('Station data inserted successfully');
    }).catch(err => {
        console.error('Error inserting station data:', err);
        res.status(500).send('Error inserting station data');
    });
};

// Function to handle platform form submission
const handlePlatformSubmit = (req, res) => {
    const { platform_no, platform_name, platform_capacity, platform_feature, platform_status, s_id } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO plat_form (p_no, p_name, p_capacity, accessability_features, p_status, s_id)
        VALUES (@platform_no, @platform_name, @platform_capacity, @platform_feature, @platform_status, @s_id);
    `;
    request.input('platform_no', sql.NVarChar, platform_no);
    request.input('platform_name', sql.NVarChar, platform_name);
    request.input('platform_capacity', sql.NVarChar, platform_capacity);
    request.input('platform_feature', sql.NVarChar, platform_feature);
    request.input('platform_status', sql.NVarChar, platform_status);
    request.input('s_id', sql.NVarChar, s_id);
    request.query(insertQuery).then(result => {
        console.log('Platform data inserted successfully');
        res.status(200).send('Platform data inserted successfully');
    }).catch(err => {
        console.error('Error inserting platform data:', err);
        res.status(500).send('Error inserting platform data');
    });
};

const handleClassSubmit = (req, res) => {
    const { class_id, class_type, features, c_price } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO class (class_id, class_type, features, c_price)
        VALUES (@class_id, @class_type, @features, @c_price);
    `;
    request.input('class_id', sql.NVarChar, class_id);
    request.input('class_type', sql.NVarChar, class_type);
    request.input('features', sql.NVarChar, features);
    request.input('c_price', sql.Float, c_price);
    request.query(insertQuery).then(result => {
        console.log('Class data inserted successfully');
        res.status(200).send('Class data inserted successfully');
    }).catch(err => {
        console.error('Error inserting class data:', err);
        res.status(500).send('Error inserting class data');
    });
};

const handleLostFoundSubmit = (req, res) => {
    const { item_id, item_description, item_date, item_location, contact, p_id } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO lostAndFound (lf_id, description, lf_date, location, contact, p_id)
        VALUES (@lf_id, @description, @lf_date, @location, @contact, @p_id);
    `;
    request.input('lf_id', sql.NVarChar, item_id);
    request.input('description', sql.NVarChar, item_description);
    request.input('lf_date', sql.Date, item_date); // Assuming item_date is a date type
    request.input('location', sql.NVarChar, item_location);
    request.input('contact', sql.NVarChar, contact);
    request.input('p_id', sql.NVarChar, p_id);
    request.query(insertQuery).then(result => {
        console.log('Lost and found item data inserted successfully');
        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Report Logged - RailEase</title>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                <style>
                    :root {
                        --bg-dark: #070b19;
                        --bg-surface: #0f162e;
                        --accent: #06b6d4;
                        --accent-light: #22d3ee;
                        --text-white: #f3f4f6;
                        --text-muted: #9ca3af;
                        --border-color: rgba(255, 255, 255, 0.06);
                        --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
                        --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        background-color: var(--bg-dark);
                        color: var(--text-white);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background-image: url("/images/Platform.png");
                        background-size: cover;
                        background-position: center;
                        position: relative;
                    }

                    body::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: linear-gradient(180deg, rgba(7, 11, 25, 0.8) 0%, rgba(7, 11, 25, 0.95) 100%);
                        z-index: 1;
                    }

                    .container {
                        position: relative;
                        z-index: 10;
                        width: 90%;
                        max-width: 520px;
                        background: rgba(15, 22, 46, 0.85);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid var(--border-color);
                        border-radius: 24px;
                        padding: 40px;
                        box-shadow: var(--shadow-lg);
                        text-align: center;
                        animation: fadeIn 0.8s ease-out;
                    }

                    .success-icon {
                        font-size: 64px;
                        color: var(--accent-light);
                        margin-bottom: 24px;
                        filter: drop-shadow(0 0 12px rgba(6, 182, 212, 0.4));
                        animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }

                    h1 {
                        font-family: 'Outfit', sans-serif;
                        font-size: 30px;
                        font-weight: 800;
                        margin: 0 0 12px 0;
                        background: linear-gradient(135deg, #ffffff, var(--accent-light));
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    .subtitle {
                        color: var(--text-muted);
                        font-size: 15px;
                        margin-bottom: 32px;
                    }

                    .ticket-details {
                        background: rgba(255, 255, 255, 0.02);
                        border: 1px dashed rgba(255, 255, 255, 0.12);
                        border-radius: 16px;
                        padding: 24px;
                        margin-bottom: 32px;
                        text-align: left;
                        position: relative;
                    }

                    .ticket-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                    }

                    .ticket-row:last-child {
                        border-bottom: none;
                        padding-bottom: 0;
                    }

                    .ticket-row:first-child {
                        padding-top: 0;
                    }

                    .label {
                        color: var(--text-muted);
                        font-weight: 500;
                        font-size: 14px;
                    }

                    .value {
                        color: var(--text-white);
                        font-weight: 600;
                        font-size: 14.5px;
                        font-family: 'Outfit', sans-serif;
                    }

                    .value.highlight {
                        color: var(--accent-light);
                        font-size: 16px;
                    }

                    .btn-home {
                        font-family: 'Outfit', sans-serif;
                        font-size: 16px;
                        font-weight: 700;
                        color: #070b19;
                        background: linear-gradient(135deg, var(--accent-light), #8b5cf6);
                        border: none;
                        border-radius: 30px;
                        padding: 14px 40px;
                        cursor: pointer;
                        width: 100%;
                        transition: var(--transition-smooth);
                        box-shadow: 0 4px 20px rgba(6, 182, 212, 0.25);
                        outline: none;
                    }

                    .btn-home:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 30px rgba(6, 182, 212, 0.45);
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @keyframes scaleUp {
                        from { transform: scale(0.6); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success-icon"><i class="fa fa-search"></i></div>
                    <h1>Report Logged!</h1>
                    <p class="subtitle">Your lost & found item report has been logged successfully.</p>
                    
                    <div class="ticket-details">
                        <div class="ticket-row">
                            <span class="label">Item ID</span>
                            <span class="value highlight">${item_id}</span>
                        </div>
                        <div class="ticket-row">
                            <span class="label">Passenger ID</span>
                            <span class="value">${p_id}</span>
                        </div>
                        <div class="ticket-row">
                            <span class="label">Date Lost</span>
                            <span class="value">${item_date}</span>
                        </div>
                        <div class="ticket-row">
                            <span class="label">Last Seen</span>
                            <span class="value">${item_location}</span>
                        </div>
                        <div class="ticket-row">
                            <span class="label">Contact</span>
                            <span class="value">${contact}</span>
                        </div>
                        <div class="ticket-row">
                            <span class="label">Description</span>
                            <span class="value">${item_description}</span>
                        </div>
                    </div>

                    <button class="btn-home" onclick="window.history.back()">Go Back</button>
                </div>
            </body>
            </html>
        `);
    }).catch(err => {
        console.error('Error inserting lost and found item data:', err);
        res.status(500).send('Error inserting lost and found item data');
    });
};

const handleRouteSubmit = (req, res) => {
    const { route_id, route_name, route_distance, start_station, end_station, stops } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO ro_oute (route_id, route_name, route_ditance, start_station, end_station, stops)
        VALUES (@route_id, @route_name, @route_distance, @start_station, @end_station, @stops);
    `;
    request.input('route_id', sql.NVarChar, route_id);
    request.input('route_name', sql.NVarChar, route_name);
    request.input('route_distance', sql.NVarChar, route_distance);
    request.input('start_station', sql.NVarChar, start_station);
    request.input('end_station', sql.NVarChar, end_station);
    request.input('stops', sql.NVarChar, stops);
    request.query(insertQuery).then(result => {
        console.log('Route data inserted successfully');
        res.status(200).send('Route data inserted successfully');
    }).catch(err => {
        console.error('Error inserting route data:', err);
        res.status(500).send('Error inserting route data');
    });
};

const handleTicketSubmit = (req, res) => {
    const { ticket_id, ticket_status, ticket_issue_date, ticket_issue_time, coach_no, duration, p_id } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO ticket (ticket_no, ticket_status, ticket_issue_date, ticket_issue_time, coach_no, duration, p_id)
        VALUES (@ticket_id, @ticket_status, @ticket_issue_date, @ticket_issue_time, @coach_no, @duration, @p_id);
    `;
    request.input('ticket_id', sql.NVarChar, ticket_id);
    request.input('ticket_status', sql.NVarChar, ticket_status);
    request.input('ticket_issue_date', sql.Date, ticket_issue_date);
    request.input('ticket_issue_time', sql.Time, ticket_issue_time);
    request.input('coach_no', sql.Int, coach_no);
    request.input('duration', sql.NVarChar, duration);
    request.input('p_id', sql.NVarChar, p_id);
    request.query(insertQuery).then(result => {
        console.log('Ticket data inserted successfully');
        res.status(200).send('Ticket data inserted successfully');
    }).catch(err => {
        console.error('Error inserting ticket data:', err);
        res.status(500).send('Error inserting ticket data');
    });
};

const handleTrainSubmit = (req, res) => {
    const { train_id, train_type, train_capacity, departure_time, arrival_time, frequency, train_status, s_id } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO train (train_id, t_type, t_capacity, t_depTime, t_arrivTime, t_frequency, t_status, s_id)
        VALUES (@train_id, @train_type, @train_capacity, @departure_time, @arrival_time, @frequency, @train_status, @s_id);
    `;
    request.input('train_id', sql.NVarChar, train_id);
    request.input('train_type', sql.NVarChar, train_type);
    request.input('train_capacity', sql.Int, train_capacity);
    request.input('departure_time', sql.Time, departure_time);
    request.input('arrival_time', sql.Time, arrival_time);
    request.input('frequency', sql.Int, frequency);
    request.input('train_status', sql.NVarChar, train_status);
    request.input('s_id', sql.NVarChar, s_id);
    request.query(insertQuery).then(result => {
        console.log('Train data inserted successfully');
        res.status(200).send('Train data inserted successfully');
    }).catch(err => {
        console.error('Error inserting train data:', err);
        res.status(500).send('Error inserting train data');
    });
};

const handleBookingSubmit = (req, res) => {
    const { booking_id, boarding_date, boarding_time, seat_no, p_id } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO booking (booking_id, booking_date, boarding_date, boarding_time, seat_no, p_id)
        VALUES (@booking_id, GETDATE(), @boarding_date, @boarding_time, @seat_no, @p_id);
    `;
    request.input('booking_id', sql.NVarChar, booking_id);
    request.input('boarding_date', sql.Date, boarding_date);
    request.input('boarding_time', sql.Time, boarding_time);
    request.input('seat_no', sql.Int, seat_no);
    request.input('p_id', sql.NVarChar, p_id);
    request.query(insertQuery).then(result => {
        console.log('Booking data inserted successfully');
        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmed - RailEase</title>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                <style>
                    :root {
                        --bg-dark: #070b19;
                        --bg-surface: #0f162e;
                        --accent: #06b6d4;
                        --accent-light: #22d3ee;
                        --text-white: #f3f4f6;
                        --text-muted: #9ca3af;
                        --border-color: rgba(255, 255, 255, 0.06);
                        --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
                        --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        background-color: var(--bg-dark);
                        color: var(--text-white);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background-image: url("/images/Platform.png");
                        background-size: cover;
                        background-position: center;
                        position: relative;
                    }

                    body::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: linear-gradient(180deg, rgba(7, 11, 25, 0.8) 0%, rgba(7, 11, 25, 0.95) 100%);
                        z-index: 1;
                    }

                    .container {
                        position: relative;
                        z-index: 10;
                        width: 90%;
                        max-width: 520px;
                        background: rgba(15, 22, 46, 0.85);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid var(--border-color);
                        border-radius: 24px;
                        padding: 40px;
                        box-shadow: var(--shadow-lg);
                        text-align: center;
                        animation: fadeIn 0.8s ease-out;
                    }

                    .success-icon {
                        font-size: 64px;
                        color: var(--accent-light);
                        margin-bottom: 24px;
                        filter: drop-shadow(0 0 12px rgba(6, 182, 212, 0.4));
                        animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }

                    h1 {
                        font-family: 'Outfit', sans-serif;
                        font-size: 30px;
                        font-weight: 800;
                        margin: 0 0 12px 0;
                        background: linear-gradient(135deg, #ffffff, var(--accent-light));
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    .subtitle {
                        color: var(--text-muted);
                        font-size: 15px;
                        margin-bottom: 32px;
                    }

                    .ticket-details {
                        background: rgba(255, 255, 255, 0.02);
                        border: 1px dashed rgba(255, 255, 255, 0.12);
                        border-radius: 16px;
                        padding: 24px;
                        margin-bottom: 32px;
                        text-align: left;
                        position: relative;
                    }

                    .ticket-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                    }

                    .ticket-row:last-child {
                        border-bottom: none;
                        padding-bottom: 0;
                    }

                    .ticket-row:first-child {
                        padding-top: 0;
                    }

                    .label {
                        color: var(--text-muted);
                        font-weight: 500;
                        font-size: 14px;
                    }

                    .value {
                        color: var(--text-white);
                        font-weight: 600;
                        font-size: 14.5px;
                        font-family: 'Outfit', sans-serif;
                    }

                    .value.highlight {
                        color: var(--accent-light);
                        font-size: 16px;
                    }

                    .btn-home {
                        font-family: 'Outfit', sans-serif;
                        font-size: 16px;
                        font-weight: 700;
                        color: #070b19;
                        background: linear-gradient(135deg, var(--accent-light), #8b5cf6);
                        border: none;
                        border-radius: 30px;
                        padding: 14px 40px;
                        cursor: pointer;
                        width: 100%;
                        transition: var(--transition-smooth);
                        box-shadow: 0 4px 20px rgba(6, 182, 212, 0.25);
                        outline: none;
                    }

                    .btn-home:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 30px rgba(6, 182, 212, 0.45);
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @keyframes scaleUp {
                        from { transform: scale(0.6); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success-icon"><i class="fa fa-ticket"></i></div>
                    <h1>Booking Confirmed!</h1>
                    <p class="subtitle">Your train ticket has been reserved successfully.</p>
                    
                    <div class="ticket-details">
                        <div class="ticket-row">
                            <span class="label">Booking ID</span>
                            <span class="value highlight">${booking_id}</span>
                        </div>
                        <div class="ticket-row">
                            <span class="label">Passenger ID</span>
                            <span class="value">${p_id}</span>
                        </div>
                        <div class="ticket-row">
                            <span class="label">Seat Number</span>
                            <span class="value">${seat_no}</span>
                        </div>
                        <div class="ticket-row">
                            <span class="label">Boarding Date</span>
                            <span class="value">${boarding_date}</span>
                        </div>
                        <div class="ticket-row">
                            <span class="label">Boarding Time</span>
                            <span class="value">${boarding_time}</span>
                        </div>
                    </div>

                    <button class="btn-home" onclick="window.location.href='/'">Go to Homepage</button>
                </div>
            </body>
            </html>
        `);
    }).catch(err => {
        console.error('Error inserting booking data:', err);
        res.status(500).send('Error inserting booking data');
    });
};

const handlePassengerSubmit = (req, res) => {
    const { p_id, p_name, gender, tell_no, email, CNIC, train_id, s_id, route_id,p_password } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO Passenger (p_id, p_name, gender, tell_no, email, CNIC, train_id, s_id, route_id,passwordd)
        VALUES (@p_id, @p_name, @gender, @tell_no, @email, @CNIC, @train_id, @s_id, @route_id,@p_password);
    `;
    request.input('p_id', sql.NVarChar, p_id);
    request.input('p_name', sql.NVarChar, p_name);
    request.input('gender', sql.NVarChar, gender);
    request.input('tell_no', sql.NVarChar, tell_no);
    request.input('email', sql.NVarChar, email);
    request.input('CNIC', sql.NVarChar, CNIC);
    request.input('train_id', sql.NVarChar, train_id);
    request.input('s_id', sql.NVarChar, s_id);
    request.input('route_id', sql.NVarChar, route_id);
    request.input('p_password', sql.NVarChar, p_password);
    request.query(insertQuery).then(result => {
        console.log('Passenger data inserted successfully');
        res.redirect('/login/passenger');
    }).catch(err => {
        console.error('Error inserting passenger data:', err);
        res.status(500).send('Error inserting passenger data');
    });
};

const handleStaffSubmit = (req, res) => {
    const { staff_id, staff_fname, staff_lname, staff_position, staff_salary, s_id, train_id, s_password, staff_email } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO staff (staff_id, staff_fname, staff_lname, staff_position, staff_salary, s_id, train_id, staff_password, staff_email)
        VALUES (@staff_id, @staff_fname, @staff_lname, @staff_position, @staff_salary, @s_id, @train_id, @s_password, @staff_email);
    `;
    request.input('staff_id', sql.NVarChar, staff_id);
    request.input('staff_fname', sql.NVarChar, staff_fname);
    request.input('staff_lname', sql.NVarChar, staff_lname);
    request.input('staff_position', sql.NVarChar, staff_position);
    request.input('staff_salary', sql.Float, staff_salary);
    request.input('s_id', sql.NVarChar, s_id);
    request.input('train_id', sql.NVarChar, train_id);
    request.input('s_password', sql.NVarChar, s_password);
    request.input('staff_email', sql.NVarChar, staff_email);
    request.query(insertQuery).then(result => {
        console.log('Staff data inserted successfully');
        res.redirect('/login/staff');
    }).catch(err => {
        console.error('Error inserting staff data:', err);
        res.status(500).send('Error inserting staff data');
    });
};

const handleTrainClassSubmit = (req, res) => {
    const { train_id, class_id } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO trainClass (train_id, class_id)
        VALUES (@train_id, @class_id);
    `;
    request.input('train_id', sql.NVarChar, train_id);
    request.input('class_id', sql.NVarChar, class_id);
    request.query(insertQuery).then(result => {
        console.log('Train Class data inserted successfully');
        res.status(200).send('Train Class data inserted successfully');
    }).catch(err => {
        console.error('Error inserting train class data:', err);
        res.status(500).send('Error inserting train class data');
    });
};

const handleTrainRouteSubmit = (req, res) => {
    const { train_id, route_id } = req.body;
    const request = new sql.Request(pool);
    const insertQuery = `
        INSERT INTO trainroute (train_id, route_id)
        VALUES (@train_id, @route_id);
    `;
    request.input('train_id', sql.NVarChar, train_id);
    request.input('route_id', sql.NVarChar, route_id);
    request.query(insertQuery).then(result => {
        console.log('Train Route data inserted successfully');
        res.status(200).send('Train Route data inserted successfully');
    }).catch(err => {
        console.error('Error inserting train route data:', err);
        res.status(500).send('Error inserting train route data');
    });
};

module.exports = {
    handleStationSubmit,
    handlePlatformSubmit,
    handleClassSubmit,
    handleLostFoundSubmit,
    handleRouteSubmit,
    handleTicketSubmit,
    handleTrainSubmit,
    handleBookingSubmit,
    handlePassengerSubmit,
    handleStaffSubmit,
    handleClassSubmit,
    handleTrainClassSubmit,
    handleTrainRouteSubmit,}
