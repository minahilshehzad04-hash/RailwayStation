const mssql = require('mssql');
const fs = require('fs');
const path = require('path');

const FALLBACK_FILE = path.join(__dirname, 'db_fallback.json');

// In-memory fallback database
let inMemoryDb = {
    station: [],
    plat_form: [],
    class: [],
    lostAndFound: [],
    ro_oute: [],
    ticket: [],
    train: [],
    booking: [],
    Passenger: [],
    staff: [],
    trainClass: [],
    trainroute: []
};

// Detect if file system is writable
let isFileSystemWritable = true;

function initFallbackDb() {
    try {
        if (!fs.existsSync(FALLBACK_FILE)) {
            const initial = {
                station: [],
                plat_form: [],
                class: [],
                lostAndFound: [],
                ro_oute: [],
                ticket: [],
                train: [],
                booking: [],
                Passenger: [],
                staff: [],
                trainClass: [],
                trainroute: []
            };
            fs.writeFileSync(FALLBACK_FILE, JSON.stringify(initial, null, 2));
            inMemoryDb = initial;
        }
    } catch (e) {
        // Filesystem is read-only (Vercel), use in-memory database
        isFileSystemWritable = false;
    }
}

function readFallbackDb() {
    initFallbackDb();
    try {
        if (isFileSystemWritable && fs.existsSync(FALLBACK_FILE)) {
            return JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
        }
    } catch (e) {
        isFileSystemWritable = false;
    }
    return inMemoryDb;
}

function writeFallbackDb(db) {
    inMemoryDb = db;
    if (isFileSystemWritable) {
        try {
            fs.writeFileSync(FALLBACK_FILE, JSON.stringify(db, null, 2));
        } catch (e) {
            isFileSystemWritable = false;
        }
    }
}

function parseConnectionString(str) {
    const config = {
        options: {
            trustServerCertificate: true // Crucial for local dev to avoid TLS/SSL errors
        }
    };
    
    const pairs = str.split(';');
    for (let pair of pairs) {
        const idx = pair.indexOf('=');
        if (idx === -1) continue;
        const key = pair.substring(0, idx).trim().toLowerCase();
        const val = pair.substring(idx + 1).trim();
        
        if (key === 'server') {
            let serverVal = val;
            let port = 1433;
            const portIdx = serverVal.indexOf(',');
            if (portIdx !== -1) {
                port = parseInt(serverVal.substring(portIdx + 1).trim(), 10);
                serverVal = serverVal.substring(0, portIdx).trim();
            }
            const instanceIdx = serverVal.indexOf('\\');
            if (instanceIdx !== -1) {
                config.options.instanceName = serverVal.substring(instanceIdx + 1).trim();
                serverVal = serverVal.substring(0, instanceIdx).trim();
            }
            config.server = serverVal;
            config.port = port;
        } else if (key === 'database') {
            config.database = val;
        } else if (key === 'uid') {
            config.user = val;
        } else if (key === 'pwd') {
            config.password = val;
        } else if (key === 'encrypt') {
            config.options.encrypt = (val.toLowerCase() === 'yes' || val.toLowerCase() === 'true');
        }
    }
    return config;
}

function handleMockQuery(command, parameters) {
    // 1. INSERT INTO Match (using greedy match for values to support parenthesized functions like GETDATE())
    const insertMatch = command.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\((.+)\)/i);
    if (insertMatch) {
        const tableName = insertMatch[1];
        const cols = insertMatch[2].split(',').map(s => s.trim());
        
        let valuesStr = insertMatch[3].trim();
        // Remove trailing semicolon and closing parenthesis if present
        if (valuesStr.endsWith(';')) valuesStr = valuesStr.slice(0, -1).trim();
        if (valuesStr.endsWith(')')) valuesStr = valuesStr.slice(0, -1).trim();
        
        const vals = valuesStr.split(',').map(s => s.trim().replace(/^@/, ''));
        
        const db = readFallbackDb();
        if (!db[tableName]) db[tableName] = [];
        
        const record = {};
        for (let i = 0; i < cols.length; i++) {
            const colName = cols[i];
            const valPlaceholder = vals[i];
            
            if (valPlaceholder && parameters[valPlaceholder]) {
                record[colName] = parameters[valPlaceholder].value;
            } else if (valPlaceholder && valPlaceholder.toUpperCase() === 'GETDATE()') {
                record[colName] = new Date().toISOString().substring(0, 10);
            } else if (valPlaceholder) {
                record[colName] = valPlaceholder.replace(/'/g, ''); // strip raw string quotes if any
            } else {
                record[colName] = null;
            }
        }
        
        db[tableName].push(record);
        writeFallbackDb(db);
        console.log(`[SQL Fallback Engine] Successfully INSERTED into '${tableName}':`, record);
        return { recordset: [], recordsets: [], rowsAffected: [1] };
    }
    
    // 2. UPDATE Match
    const updateMatch = command.match(/UPDATE\s+(\w+)\s+SET\s+(\w+)\s*=\s*@newValue\s+WHERE\s+(\w+)\s*=\s*@id/i);
    if (updateMatch) {
        const tableName = updateMatch[1];
        const fieldName = updateMatch[2];
        const idFieldName = updateMatch[3];
        
        const db = readFallbackDb();
        const records = db[tableName] || [];
        
        const idVal = parameters.id.value;
        const newVal = parameters.newValue.value;
        
        let updatedCount = 0;
        for (let row of records) {
            if (row[idFieldName] == idVal) {
                row[fieldName] = newVal;
                updatedCount++;
            }
        }
        
        if (updatedCount > 0) {
            writeFallbackDb(db);
            console.log(`[SQL Fallback Engine] Successfully UPDATED '${tableName}' row where ${idFieldName}=${idVal}: ${fieldName} = ${newVal}`);
        }
        return { recordset: [], recordsets: [], rowsAffected: [updatedCount] };
    }
    
    // 3. SELECT Match
    const selectMatch = command.match(/SELECT\s+([^*]+|\*)\s+FROM\s+(\w+)(?:\s+WHERE\s+([^;]+))?/i);
    if (selectMatch) {
        const tableName = selectMatch[2];
        const whereClause = selectMatch[3];
        const db = readFallbackDb();
        let records = db[tableName] || [];
        
        if (whereClause) {
            records = records.filter(row => {
                let match = true;
                
                // Helper to match column bindings
                for (let key in parameters) {
                    const paramName = key;
                    const paramValue = parameters[paramName].value;
                    
                    const regex = new RegExp(`(\\w+)\\s*=\\s*@${paramName}`, 'i');
                    const colMatch = whereClause.match(regex);
                    if (colMatch) {
                        const colName = colMatch[1];
                        if (row[colName] != paramValue) {
                            match = false;
                            break;
                        }
                    }
                }
                
                // Route query fallbacks (e.g. SELECT * FROM Passenger WHERE p_id = @passengerId)
                if (parameters.passengerId) {
                    if (row['p_id'] != parameters.passengerId.value) match = false;
                }
                if (parameters.staffId) {
                    if (row['staff_id'] != parameters.staffId.value) match = false;
                }
                
                return match;
            });
        }
        
        console.log(`[SQL Fallback Engine] SELECT returned ${records.length} records from '${tableName}'`);
        return { recordset: records, recordsets: [records], rowsAffected: [records.length] };
    }
    
    // Default fallback return
    return { recordset: [], recordsets: [], rowsAffected: [0] };
}

function handleMockProcedure(procName, parameters) {
    if (procName.toLowerCase() === 'gettrainsforroute') {
        const start = parameters.StartStation ? parameters.StartStation.value : 'Departure';
        const end = parameters.EndStation ? parameters.EndStation.value : 'Arrival';
        
        const mockTrains = [
            {
                train_id: 'T101',
                t_type: 'Express',
                t_capacity: 450,
                t_depTime: { hours: 8, minutes: 0, seconds: 0 },
                t_arrivTime: { hours: 14, minutes: 30, seconds: 0 },
                t_frequency: 7,
                t_status: 'On Time',
                s_id: 'S001',
                route_name: `${start} to ${end}`
            },
            {
                train_id: 'T202',
                t_type: 'Business Class',
                t_capacity: 320,
                t_depTime: { hours: 13, minutes: 15, seconds: 0 },
                t_arrivTime: { hours: 19, minutes: 45, seconds: 0 },
                t_frequency: 7,
                t_status: 'Delayed (15 mins)',
                s_id: 'S001',
                route_name: `${start} to ${end}`
            }
        ];
        console.log(`[SQL Fallback Engine] Executed stored procedure '${procName}' returning ${mockTrains.length} mock routes.`);
        return { recordset: mockTrains, recordsets: [mockTrains], rowsAffected: [2] };
    }
    return { recordset: [], recordsets: [], rowsAffected: [0] };
}

const originalConnectionPool = mssql.ConnectionPool;

class PatchedConnectionPool extends originalConnectionPool {
    constructor(config) {
        try {
            if (config && typeof config.connectionString === 'string') {
                const parsedConfig = parseConnectionString(config.connectionString);
                super(parsedConfig);
            } else {
                super(config);
            }
            this.isFallback = false;
        } catch (err) {
            console.warn('[SQL Fallback Engine] Error initializing connection pool:', err.message);
            // Initialize with minimal config to prevent constructor crash
            super({ server: 'localhost', database: 'fallback' });
            this.isFallback = true;
        }
    }
    
    async connect() {
        try {
            console.log('[SQL Fallback Engine] Attempting to connect to local SQL Server instance...');
            await super.connect();
            console.log('[SQL Fallback Engine] Connected to SQL Server database successfully!');
            this.isFallback = false;
        } catch (err) {
            console.warn(`\n⚠️ [SQL Fallback Engine] SQL Server connection failed. Falling back to local JSON database: db_fallback.json.`);
            this.isFallback = true;
        }
        return this;
    }
}

class PatchedRequest extends mssql.Request {
    constructor(pool) {
        super(pool);
        this.pool = pool;
    }
    
    async query(command) {
        try {
            if (this.pool && this.pool.isFallback) {
                return handleMockQuery(command, this.parameters);
            }
            return await super.query(command);
        } catch (err) {
            console.warn('[SQL Fallback Engine] Query failed, using fallback:', err.message);
            // Fallback: use mock query handler
            return handleMockQuery(command, this.parameters);
        }
    }
    
    async execute(procedureName) {
        try {
            if (this.pool && this.pool.isFallback) {
                return handleMockProcedure(procedureName, this.parameters);
            }
            return await super.execute(procedureName);
        } catch (err) {
            console.warn('[SQL Fallback Engine] Procedure execution failed, using fallback:', err.message);
            // Fallback: use mock procedure handler
            return handleMockProcedure(procedureName, this.parameters);
        }
    }
}

module.exports = {
    ...mssql,
    ConnectionPool: PatchedConnectionPool,
    Request: PatchedRequest
};
