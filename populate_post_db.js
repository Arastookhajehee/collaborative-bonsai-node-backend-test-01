const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');

// SQLite database path
const dbPath = "C:\\Projects\\repos\\SQLiteRhinoDBServer\\bin\\Debug\\GHDB.db";

// PostgreSQL connection configuration
const pgClient = new Client({
    host: '127.0.0.1',       // Your PostgreSQL host, e.g., localhost
    port: 5432,             // Default PostgreSQL port
    database: 'bonsai', // Your database name
    user: 'postgres',  // Your PostgreSQL username
    password: 'gkWPnR780/N['  // Your PostgreSQL password
});

// Function to insert data into PostgreSQL
const insertIntoPostgres = async (rows) => {
    try {
        await pgClient.connect();

        // Loop through each row from SQLite and insert it into PostgreSQL
        for (const row of rows) {
            const insertQuery = `
                INSERT INTO GEOMETRIES (
                    ID, designer, width, length, thickness, placementPlane, 
                    duplicatePlane, orientablePlanes, meshBox, "user", color, 
                    "state", parentIDs, childIDs, selected, buildOnPlane, "message", 
                    designTimeStamp, modificationTimeStamp, physicalTimeStamp, 
                    fabricatedTimeStamp, fabricationFail, placementGlueShift, 
                    placementShift)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 
                    $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 
                    $23, $24);
            `;

            // Prepare the data to be inserted, ensuring each value is correctly mapped
            const values = [
                row.ID, row.designer, row.width, row.length, row.thickness,
                row.placementPlane, row.duplicatePlane, row.orientablePlanes, 
                row.meshBox, row.user, row.color, row.state,
                row.parentIDs, row.childIDs, row.selected, row.buildOnPlane,
                row.message, row.designTimeStamp, row.modificationTimeStamp,
                row.physicalTimeStamp, row.fabricatedTimeStamp, row.fabricationFail,
                row.placementGlueShift, row.placementShift
            ];

            console.log(values);

            // Insert each row into PostgreSQL
            await pgClient.query(insertQuery, values);
        }

        console.log('Data transferred successfully to PostgreSQL');
    } catch (err) {
        console.error('Error inserting data into PostgreSQL:', err.stack);
    } finally {
        await pgClient.end();
    }
};

// Open SQLite database and fetch data
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening SQLite database:", err);
    } else {
        console.log("SQLite database opened successfully.");
    }
});

db.all("SELECT * FROM GEOMETRIES", (err, rows) => {
    if (err) {
        console.error("Error querying SQLite database:", err);
    } else {
        // Now that the data is fetched, transfer it to PostgreSQL
        insertIntoPostgres(rows);
    }
});
