const sql = require('mssql/msnodesqlv8');
const path = require('path');
const fs = require('fs');

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

const handlePassengerLogin = (req, res) => {
    const { email, password } = req.body;
    const request = new sql.Request(pool);
    const query = `
        SELECT * FROM Passenger WHERE email = @Email AND passwordd = @Password;
    `;
    request.input('Email', sql.NVarChar, email);
    request.input('Password', sql.NVarChar, password);
    request.query(query).then(result => {
        if (result.recordset.length > 0) {
            const passenger = result.recordset[0];
            req.session.passengerId = passenger.p_id;
            console.log('Login successful');

            const filePath = path.join(__dirname, '../PassengerTask.html'); // Adjust this path as needed
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading PassengerTask.html:', err);
                    res.status(500).send('Error during login');
                    return;
                }

                const updatedHtml = data.replace('<span id="welcome-placeholder"></span>', `<span id="welcome-placeholder">Welcome ${passenger.p_name}</span>`);
                res.status(200).send(updatedHtml);
            });
        } else {
            console.log('Incorrect email or password');
            res.status(401).send('Incorrect email or password');
        }
    }).catch(err => {
        console.error('Error during login:', err);
        res.status(500).send('Error during login');
    });
};

const servePassengerLoginPage = (req, res) => {
    const filePath = path.join(__dirname, '../PassengerLogin.html'); // Adjust this path as needed
    res.sendFile(filePath);
};


const handleStaffLogin = (req, res) => {
    const { email, password } = req.body;
    const request = new sql.Request(pool);
    const query = `
        SELECT * FROM staff WHERE staff_email = @email AND staff_password = @password;
    `;
    request.input('email', sql.NVarChar, email);
    request.input('password', sql.NVarChar, password);
    request.query(query).then(result => {
        if (result.recordset.length > 0) {
            const staff = result.recordset[0];
            req.session.staffId = staff.staff_id;
            console.log('Login successful');
           
            const filePath = path.join(__dirname, '../StaffTask.html'); // Adjust this path as needed
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading StaffTask.html:', err);
                    res.status(500).send('Error during login');
                    return;
                }

                const updatedHtml = data.replace('<span id="welcome-placeholder"></span>', `<span id="welcome-placeholder">Welcome ${staff.staff_fname}</span>`);
                res.status(200).send(updatedHtml);
            });
        } else {
            // If no match found, send an error message
            console.log('Incorrect email or password');
            res.status(401).send('Incorrect email or password');
        }
    }).catch(err => {
        console.error('Error during login:', err);
        res.status(500).send('Error during login');
    });
};

const serveStaffLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'StaffLogin.html'));
};

module.exports = {
    handlePassengerLogin,
    servePassengerLoginPage,
    handleStaffLogin,
    serveStaffLoginPage
};