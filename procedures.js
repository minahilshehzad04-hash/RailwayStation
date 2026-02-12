// procedures.js

const sql = require('mssql/msnodesqlv8');

const retrievePassengerInfo = async (pool, passengerId) => {
    try {
        const request = new sql.Request(pool);
        request.input('PassengerID', sql.NVarChar, passengerId);

        const query = `
            EXEC RetrievePassengerInfo @PassengerID;
        `;
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error('Error executing stored procedure:', err);
        throw err;
    }
};
const retrieveStaffInfo = async (pool, staffId) => {
    try {
        const request = new sql.Request(pool);
        request.input('StaffID', sql.NVarChar, staffId);

        const query = `
            EXEC RetrieveStaffInfo @StaffID;
        `;
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error('Error executing stored procedure:', err);
        throw err;
    }
};

module.exports = {
    retrievePassengerInfo,
    retrieveStaffInfo,
};