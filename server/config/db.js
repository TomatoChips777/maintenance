const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lc-ticketing-db-2",
});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to MySQL");
});

module.exports = db;
