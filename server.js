const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// import all messageTypes
const { AskForStickIDs } = require('./messages.js');

// Determine the path for the SQLite database (GHDB.db)

// const dbPath = path.join(__dirname, 'GHDB.db');
const dbPath = "C:\\Projects\\repos\\SQLiteRhinoDBServer\\bin\\Debug\\GHDB.db";
const dbExists = fs.existsSync(dbPath);

// Open (or create) the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err);
    } else {
        console.log("Database opened successfully.");
    }
});

// If the database file does not exist, create the table
if (!dbExists) {
    db.serialize(() => {
        db.run(`
      CREATE TABLE GEOMETRIES (
        ID TEXT PRIMARY KEY,
        designer TEXT,
        width DOUBLE DEFAULT 18.0,
        length DOUBLE DEFAULT 300.0,
        thickness DOUBLE DEFAULT 18.0,
        placementPlane TEXT,
        duplicatePlane TEXT,
        orientablePlanes TEXT,
        meshBox TEXT,
        user TEXT,
        color TEXT,
        state TEXT,
        parentIDs TEXT,
        childIDs TEXT,
        selected BOOL,
        buildOnPlane TEXT,
        message TEXT,
        designTimeStamp TEXT,
        modificationTimeStamp TEXT,
        physicalTimeStamp TEXT,
        fabricatedTimeStamp TEXT,
        fabricationFail TEXT,
        placementGlueShift TEXT,
        placementShift TEXT
      )
    `, (err) => {
            if (err) {
                console.error("Error creating GEOMETRIES table:", err);
            } else {
                console.log("Table GEOMETRIES created successfully.");
            }
        });
    });
}

// Create a WebSocket server on port 12541 bound to 127.0.0.1
const wss = new WebSocket.Server({ port: 12541, host: '127.0.0.1' }, () => {
    console.log('WebSocket server is listening on ws://127.0.0.1:12541/');
});
// set the timeout to 10 minutes
// wss.timeout = 600000;

clients = []

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('Client connected.');

    ws.on('message', (message) => {
        // console.log('Received message:', message.toString());
        if (message.toString() === "ping") {
            ws.send("pong");
            return;
        }

        if (message.toString() === "update_all") {
            clients.forEach(item => {
                const requestStickIDs = new AskForStickIDs();
                item.send(requestStickIDs.toJson());               
            });
            console.log("update request sent to all");
            return;
        }


        let request;
        try {
            request = JSON.parse(message);
        } catch (e) {
            console.error("Invalid JSON received:", e);
            ws.send(JSON.stringify({ error: "Invalid JSON" }));
            return;
        }

        // If the parsed request does not contain an ID (or it is empty),
        // query all "sticks" (TimberBranch records) from the GEOMETRIES table.
        if (request.type === "UpdateAllMessageRequest") {
            db.all("SELECT ID, color, designer, placementPlane FROM GEOMETRIES", (err, rows) => {
                if (err) {
                    console.error("Error querying database:", err);
                    ws.send(JSON.stringify({ error: "Database error" }));
                } else {
                    // Send each record as a separate JSON message
                    rows.forEach((row) => {
                        // Each row is automatically converted to a JSON string.
                        row.type = "UpdateAllMessageRequest";
                        ws.send(JSON.stringify(row));
                    });
                }
            });
        }
        else if (request.type === "RequestSticks"){
            db.all("SELECT ID, color, designer, placementPlane FROM GEOMETRIES", (err, rows) => {
                if (err) {
                    console.error("Error querying database:", err);
                    ws.send(JSON.stringify({ error: "Database error" }));
                } else {
                    // Send each record as a separate JSON message
                    rows.forEach((row) => {
                        // Each row is automatically converted to a JSON string.
                        const stick_exists_in_request = request.IDs.includes(row.ID);
                        if (!stick_exists_in_request){
                            row.type = "UpdateSticks";
                            ws.send(JSON.stringify(row));
                        }
                    });
                }
            });
        }
        // (Optional) Handle other cases if needed when request.ID is present.
    });

    ws.on('close', () => {
        console.log('Client disconnected.');
    });
});

// (Optional) A function to insert data into the GEOMETRIES table.
// This is analogous to the InsertData method in the C# code.
function insertData(id, mesh, brep, plane, origin, parentId) {
    const stmt = db.prepare(`
    INSERT INTO GEOMETRIES (ID, meshBox, designer, placementPlane)
    VALUES (?, ?, ?, ?)
  `);
    stmt.run(id, mesh, brep, plane, (err) => {
        if (err) {
            console.error("Error inserting data:", err);
        } else {
            console.log("Data inserted successfully.");
        }
    });
    stmt.finalize();
}
