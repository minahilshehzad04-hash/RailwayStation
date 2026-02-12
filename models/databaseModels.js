const sql = require('mssql/msnodesqlv8');

const connectionString = 'Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-APJ5T8S\\SQLEXPRESS,1433;Database=RailwayStation;UID=sa;PWD=12345;Encrypt=no;';

const pool = new sql.ConnectionPool({ connectionString: connectionString });

pool.connect().then(() => {
    console.log('Connected to SQL Server');
}).catch(err => {
    console.error('Error connecting to database:', err);
});

const getPassengerInfo = async (passengerId) => {
    const request = new sql.Request(pool);
    request.input('passengerId', sql.NVarChar, passengerId);
    const result = await request.query('SELECT p_id, p_name, gender, tell_no, email, CNIC, passwordd FROM Passenger WHERE p_id = @passengerId');
    return result.recordset;
};

const getstaffInfo = async (staffId) => {
    const request = new sql.Request(pool);
    request.input('staffId', sql.NVarChar, staffId);
    const result = await request.query('SELECT staff_id, staff_fname,staff_lname, staff_position, staff_salary,staff_email,staff_password FROM staff WHERE staff_id = @staffId');
    return result.recordset;
};


const updatePassengerInfo = async (id, field, newValue) => {
    const request = new sql.Request(pool);
    request.input('id', sql.NVarChar, id);
    request.input('newValue', sql.NVarChar, newValue);

    let query;
    switch (field) {
        case 'name':
            query = `
                UPDATE Passenger
                SET p_name = @newValue
                WHERE p_id = @id
            `;
            break;
        case 'gender':
            query = `
                UPDATE Passenger
                SET gender = @newValue
                WHERE p_id = @id
            `;
            break;
        case 'telephone':
            query = `
                UPDATE Passenger
                SET tell_no = @newValue
                WHERE p_id = @id
            `;
            break;
        case 'email':
            query = `
                UPDATE Passenger
                SET email = @newValue
                WHERE p_id = @id
            `;
            break;
        case 'cnic':
            query = `
                UPDATE Passenger
                SET CNIC = @newValue
                WHERE p_id = @id
            `;
            break;
        case 'password':
            query = `
                UPDATE Passenger
                SET passwordd = @newValue
                WHERE p_id = @id
            `;
            break;
        default:
            throw new Error('Invalid field');
    }

    await request.query(query);
};


const updateStaffInfo = async (id, field, newValue) => {
    const request = new sql.Request(pool);
    request.input('id', sql.NVarChar, id);
    request.input('newValue', sql.NVarChar, newValue);

    let query;
    switch (field) {
        case 'fname':
            query = `
                UPDATE staff
                SET staff_fname = @newValue
                WHERE staff_id = @id
            `;
            break;
        case 'lname':
            query = `
                UPDATE staff
                SET staff_lname = @newValue
                WHERE staff_id = @id
            `;
            break;
        case 'position':
            query = `
                UPDATE staff
                SET staff_position = @newValue
                WHERE staff_id = @id
            `;
            break;
        case 'salary':
            query = `
                UPDATE staff
                SET staff_salary = @newValue
                WHERE staff_id = @id
            `;
            break;
        case 'email':
            query = `
                UPDATE staff
                SET staff_email = @newValue
                WHERE staff_id = @id
            `;
            break;
        case 'password':
            query = `
                UPDATE staff
                SET staff_password = @newValue
                WHERE staff_id = @id
            `;
            break;
        default:
            throw new Error('Invalid field');
    }

    await request.query(query);
};


const getAllTrains = async () => {
    const request = new sql.Request(pool);
    const result = await request.query('SELECT * FROM train');
    return result.recordset;
};

const getAllPassengers = async () => {
    const request = new sql.Request(pool);
    const result = await request.query('SELECT * FROM Passenger');
    return result.recordset;
};

const getAllPlatforms = async () => {
    const request = new sql.Request(pool);
    const result = await request.query('SELECT * FROM plat_form');
    return result.recordset;
};

const getAllStaff = async () => {
    const request = new sql.Request(pool);
    const result = await request.query('SELECT * FROM staff');
    return result.recordset;
};

module.exports = {
    getPassengerInfo,
    getstaffInfo,
    updatePassengerInfo,
    updateStaffInfo,
    getAllTrains,
    getAllPassengers,
    getAllPlatforms,
    getAllStaff
};