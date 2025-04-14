const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get reports analytics
router.get('/analytics', async (req, res) => {
    try {
        const queries = {
            totalReports: `SELECT COUNT(*) AS total FROM tbl_reports`,
            statusCount: `SELECT status, COUNT(*) as count FROM tbl_reports GROUP BY status`,
            reportsPerDay: `SELECT DATE(created_at) as date, COUNT(*) as count FROM tbl_reports GROUP BY DATE(created_at)`,
            reportsPerMonth: `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count FROM tbl_reports GROUP BY DATE_FORMAT(created_at, '%Y-%m')`,
            issueDistribution: `SELECT issue_type, COUNT(*) as count FROM tbl_reports GROUP BY issue_type ORDER BY count DESC`,
            latestReports: `SELECT id, location, issue_type, status, created_at FROM tbl_reports ORDER BY created_at DESC LIMIT 5`
        };

        let results = {};

        for (let key in queries) {
            results[key] = await new Promise((resolve, reject) => {
                db.query(queries[key], (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                });
            });
        }

        // make sure natin totalReports is extracted properly
        results.totalReports = results.totalReports?.[0]?.total || 0;

        // Transform statusCount into an object
        let statusObj = {};
        if (Array.isArray(results.statusCount)) {
            results.statusCount.forEach(row => {
                statusObj[row.status] = row.count;
            });
        }
        results.statusCount = statusObj || {};

        // Send analytics response
        res.json(results);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch analytics", error: err });
    }
});

module.exports = router;
