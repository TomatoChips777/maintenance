const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/create-report', upload.single('image_path'), (req, res) => {
    // console.log("Received Data:", req.body);
    // console.log("Received File:", req.file);

    if (!req.body.user_id || !req.body.location || !req.body.issue_type || !req.body.description) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { user_id, location, issue_type, description } = req.body;
    const image_path = req.file ? req.file.filename : null;
    
    const query = `INSERT INTO tbl_reports (user_id, location, issue_type, description, image_path) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [user_id, location, issue_type, description, image_path], (err, result) => {
        if (err) {
            console.error("Error creating report:", err);
            return res.status(500).json({ success: false, message: 'Failed to submit report' });
        }
        // const newReport = { id: result.insertId, user_id, location, issue_type, description ,status: 'pending'};
        const newReport = { 
            id: result.insertId, 
            user_id, 
            location, 
            issue_type, 
            description,
            status: "pending",  // Initially set to 'pending'
            image_path: image_path || null // Ensure image path is added if it's not null
        };
        req.io.emit('update');
        req.io.emit('createdReport', newReport);
        res.json({ success: true, message: 'Report submitted successfully', reportId: result.insertId });
    });
});


router.put('/:reportId', upload.single('image_path'), (req, res) => {
    const { reportId } = req.params;
    const { user_id, location, issue_type, description } = req.body;
    const image_path = req.file ? req.file.filename : null;

    // Fetch the current image path from the database
    const getImageQuery = `SELECT image_path FROM tbl_reports WHERE id = ? AND user_id = ?`;
    db.query(getImageQuery, [reportId, user_id], (err, rows) => {
        if (err) {
            console.error("Error fetching existing image:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch report" });
        }

        const existingImagePath = rows[0]?.image_path;

        // Delete old image if a new one is uploaded
        if (image_path && existingImagePath) {
            const oldImagePath = path.join('uploads', existingImagePath);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update report with new data and image path
        const query = `UPDATE tbl_reports SET location = ?, issue_type = ?, description = ?, image_path = ? WHERE id = ? AND user_id = ?`;
        db.query(query, [location, issue_type, description, image_path || existingImagePath, reportId, user_id], (err, result) => {
            if (err) {
                console.error("Error updating report:", err);
                return res.status(500).json({ success: false, message: "Failed to update report" });
            }
            // req.io.emit('reportUpdated', { reportId, location, issue_type, description, imagePath: image_path || existingImagePath });
            req.io.emit('update');
            res.json({ success: true, message: "Report updated successfully" });
        });
    });
});

router.delete('/admin/report/:id', (req, res) => {
    const { id } = req.params;
    const { role } = req.body; 

    if ( role !== 'admin') {
        return res.status(400).json({ success: false, message: `Unauthorized: You cannot delete this report`  });
    }

    db.query('SELECT image_path FROM tbl_reports WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error("Error fetching report:", err);
            return res.status(500).json({ success: false, message: 'Failed to fetch report' });
        }
        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized: You cannot delete this report" });
        }

        const imagePath = rows[0].image_path;
        if (imagePath) {
            const filePath = path.join(__dirname, '../uploads', imagePath);
            
            console.log("Attempting to delete file:", filePath);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully:", filePath);
                    }
                });
            } else {
                console.warn("File not found:", filePath);
            }
        }

        db.query('DELETE FROM tbl_reports WHERE id = ?', [id], (err) => {
            if (err) {
                console.error("Error deleting report:", err);
                return res.status(500).json({ success: false, message: 'Failed to delete report' });
            }
            req.io.emit('reportDeleted', { reportId: id });
            res.json({ success: true, message: 'Report deleted successfully' });
        });
    });
});

router.delete('/report/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body; 

    if (!userId) {
        return res.status(400).json({ success: false, message: `User ID is required ${userId}`  });
    }

    db.query('SELECT image_path FROM tbl_reports WHERE id = ? AND user_id = ?', [id, userId], (err, rows) => {
        if (err) {
            console.error("Error fetching report:", err);
            return res.status(500).json({ success: false, message: 'Failed to fetch report' });
        }
        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized: You cannot delete this report" });
        }

        const imagePath = rows[0].image_path;
        if (imagePath) {
            const filePath = path.join(__dirname, '../uploads', imagePath);
            
            console.log("Attempting to delete file:", filePath);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully:", filePath);
                    }
                });
            } else {
                console.warn("File not found:", filePath);
            }
        }

        db.query('DELETE FROM tbl_reports WHERE id = ? AND user_id = ?', [id, userId], (err) => {
            if (err) {
                console.error("Error deleting report:", err);
                return res.status(500).json({ success: false, message: 'Failed to delete report' });
            }
            // req.io.emit('reportDeleted', { reportId: id });
            req.io.emit('update');
            res.json({ success: true, message: 'Report deleted successfully' });
        });
    });
});


// Get All Reports
router.get('/', (req, res) => {
    const query = `
        SELECT r.*, u.name as reporter_name 
        FROM tbl_reports r 
        JOIN tbl_users u ON r.user_id = u.id 
        ORDER BY r.created_at DESC`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `SELECT * FROM tbl_reports WHERE user_id = ? ORDER BY created_at DESC`;
    db.query(query, [userId], (err, rows) => {
        if (err) {
            console.error("Error fetching user reports:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch reports" });
        }
        res.json({ success: true, reports: rows });
    });
});


// Update Report Status
router.put('/admin/edit/:reportId', (req, res) => {
    const reportId = req.params.reportId;
    const { status } = req.body;
    const query = `UPDATE tbl_reports SET status = ? WHERE id = ?`;
    db.query(query, [status, reportId], (err, result) => {
        if (err) {
            console.error("Error updating status:", err);

            return res.status(500).json({ success: false, message: 'Failed to update status' });
        }
        req.io.emit('updatedStatus', {reportId: reportId,  status});
        req.io.emit('update');
        res.json({ success: true, message: 'Status updated successfully' });
    });
});

module.exports = router;
