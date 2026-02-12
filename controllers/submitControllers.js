const sql = require('mssql/msnodesqlv8');
const path = require('path');
// Connection string for the SQL Server
const connectionString = 'Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-APJ5T8S\\SQLEXPRESS,1433;Database=RailwayStation;UID=sa;PWD=12345;Encrypt=no;';

// Create a pool
const pool = new sql.ConnectionPool({ connectionString: connectionString });

// Connect to the database
pool.connect().then(() => {
    console.log('Connected to SQL Server');
}).catch(err => {
    console.error('Error connecting to database:', err);
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
        res.status(200).send('Data is Inserted. Please Go back Now!!')
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
    request.input('p_id', sql.Int, p_id);
    request.query(insertQuery).then(result => {
        console.log('Booking data inserted successfully');
        res.status(200).send('Booking data inserted successfully');
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
        res.status(200).send('Passenger data inserted successfully');
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
        VALUES (@staff_id, @staff_fname, @staff_lname, @staff_position, @staff_salary, @s_id, @train_id, @s_password.@staff_email);
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
        res.status(200).send('Staff data inserted successfully');
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
