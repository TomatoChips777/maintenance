// server/config/db.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lc-its-db",
});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to MySQL");
});

// Wrapper for async/await
db.queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = db;
