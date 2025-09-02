// server/config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
   host: process.env.MYSQL_HOST || 'localhost',
    user: "root",
    password: "",
    database: "lc-maintenance-db",
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

// const mysql = require('mysql2');

// // Create a pool to manage connections
// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST || 'mysql',
//   user: 'root',
//   password: 'rootpassword',
//   database: 'lc-its-db',
//   waitForConnections: true,  // Wait for available connection if all connections are busy
//   connectionLimit: 10,       // Max number of connections to create
//   queueLimit: 0              // Set to 0 for unlimited queue
// });

// // Create a promise pool (returns promises for queries)
// const db = pool.promise();

// // Wrapper for async/await to use the pool for queries
// db.queryAsync = (query, params) => {
//     return db.query(query, params)
//         .then(([results]) => results)  // Return just the results, not the full array
//         .catch(err => {
//             console.error("Database query failed:", err);
//             throw err;
//         });
// };

// module.exports = db;
