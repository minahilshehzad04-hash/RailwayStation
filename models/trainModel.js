const sql = require('mssql/msnodesqlv8');

const connectionString = 'Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-APJ5T8S\\SQLEXPRESS,1433;Database=RailwayStation;UID=sa;PWD=12345;Encrypt=no;';

const pool = new sql.ConnectionPool({ connectionString: connectionString });

const getTrainsForRoute = async (startStation, endStation) => {
    try {
        await pool.connect();
        const request = new sql.Request(pool);
        request.input('StartStation', sql.NVarChar, startStation);
        request.input('EndStation', sql.NVarChar, endStation);
        const result = await request.execute('GetTrainsForRoute');
        return result.recordset;
    } catch (err) {
        console.error('Error executing stored procedure:', err);
        throw err;
    } finally {
        pool.close();
    }
};

module.exports = {
    getTrainsForRoute
};