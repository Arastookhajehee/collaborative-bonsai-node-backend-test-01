const { Client } = require('pg');

// Set up your database connection
const client = new Client({
    host: '127.0.0.1',       // Your PostgreSQL host, e.g., localhost
    port: 5432,             // Default PostgreSQL port
    database: 'bonsai', // Your database name
    user: 'postgres',  // Your PostgreSQL username
    password: 'gkWPnR780/N['  // Your PostgreSQL password
});

// Connect to the database
client.connect()
    .then(() => {
        console.log('Connected to the database');
        
        // Insert data into the GEOMETRIES table
        const insertQuery = `
            INSERT INTO GEOMETRIES (
                ID, designer, width, length, thickness, placementPlane, 
                duplicatePlane, orientablePlanes, meshBox, "user", color, 
                "state", parentIDs, childIDs, selected, buildOnPlane, "message", 
                designTimeStamp, modificationTimeStamp, physicalTimeStamp, 
                fabricatedTimeStamp, fabricationFail, placementGlueShift, 
                placementShift)
            VALUES 
                ('123zsvevccc45', 'Designer A', 20.0, 350.0, 20.0, 'XY', 'YZ', 'XY,YZ', 
                 'Box1', 'user1', 'red', 'active', 'p1,p2', 'c1,c2', true, 
                 'Plane1', 'No message', '2025-02-26T10:00:00', 
                 '2025-02-26T11:00:00', '2025-02-26T12:00:00', 
                 '2025-02-26T13:00:00', 'No', 'No', 'No');
        `;
        
        return client.query(insertQuery);
    })
    .then(() => {
        console.log('Data inserted successfully');
    })
    .catch((err) => {
        console.error('Error inserting data', err.stack);
    })
    .finally(() => {
        // Close the database connection
        client.end();
    });
