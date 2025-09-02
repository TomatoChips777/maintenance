const db = require('./db');

function fetchData(query, params = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database fetch error:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = { fetchData };
