const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { fetchData } = require('../config/dbUtils');
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

router.post('/create-report', upload.single('image'), async (req, res) => {
  if (!req.body.user_id || !req.body.location || !req.body.description) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const { user_id, location, description, is_anonymous, status, priority, issue_type } = req.body;
    const image_path = req.file ? req.file.filename : null;
    const anonymousStatus = is_anonymous !== undefined ? is_anonymous : 0;
    const setStatus = status !== undefined ? status : 'Pending';
    const setPriority = priority !== undefined ? priority : 'Low';
    const setType = issue_type !== undefined ? issue_type : 'Others';

    // Step 1: Insert report
    const query = `
      INSERT INTO tbl_reports 
      (user_id, location, description, image_path, is_anonymous, status, priority, issue_type, report_type) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, '')
    `;
    const result = await db.queryAsync(query, [
      user_id, location, description, image_path, anonymousStatus, setStatus, setPriority, setType
    ]);

    const newReport = {
      id: result.insertId,
      user_id,
      location,
      description,
      status: setStatus,
      priority: setPriority,
      issue_type: setType,
      image_path: image_path || null
    };

    // Step 2: Create a new notification
    const notifMsg = `A new report has been submitted about ${location}.`;
    const notifResult = await db.queryAsync(
      'INSERT INTO notifications (message, title) VALUES (?, "New Report")',
      [notifMsg]
    );
    const notifId = notifResult.insertId;

    // Step 3: Get all admins and staff
    const receivers = await db.queryAsync(
      'SELECT id FROM tbl_users WHERE role="admin" OR role="staff"'
    );

    // Step 4: Insert one notification per receiver
    if (receivers.length > 0) {
      const receiverValues = receivers.map(user => [notifId, user.id, false]); // false = unread
      await db.queryAsync(
        'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
        [receiverValues]
      );
    }

    // Step 5: Emit socket events
    req.io.emit('updateReports');
    req.io.emit('createdReport', newReport);
    req.io.emit('updateNotifications');
    req.io.emit('createdReportNotification', { notifId, message: notifMsg });

    res.json({ success: true, message: 'Report submitted successfully', reportId: result.insertId });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
});

// router.post('/create-report', upload.single('image'), (req, res) => {

//     if (!req.body.user_id || !req.body.location || !req.body.description) {
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const { user_id, location, description, is_anonymous, status, priority, issue_type } = req.body;
//     const image_path = req.file ? req.file.filename : null;
//     const anonymousStatus = is_anonymous !== undefined ? is_anonymous : 0;
//     const setStatus = status !== undefined ? status : 'Pending';
//     const setPriority = priority !== undefined ? priority : 'Low';
//     const setType = issue_type !== undefined ? issue_type : 'Others';


//     const query = `INSERT INTO tbl_reports (user_id, location, description, image_path, is_anonymous,status, priority, issue_type, report_type) VALUES (?, ?, ?, ?, ?,?, ?, ?, '')`;
//     db.query(query, [user_id, location, description, image_path, anonymousStatus, setStatus, setPriority, setType], (err, result) => {
//         if (err) {
//             console.error("Error creating report:", err);
//             return res.status(500).json({ success: false, message: 'Failed to submit report' });
//         }
//         const newReport = {
//             id: result.insertId,
//             user_id,
//             location,
//             description,
//             status: "pending",
//             image_path: image_path || null
//         };

//         // Step 1: Create a new notification message
//         const notifMsg = `A new report has been submitted at ${location}.`;
//         const notifResult = await db.queryAsync(
//             'INSERT INTO notifications (message, title) VALUES (?, "New Report")',
//             [notifMsg]
//         );
//         const notifId = notifResult.insertId;

//         // Step 2: Get all admins and staff
//         const receivers = await db.queryAsync(
//             'SELECT id FROM tbl_users WHERE role="admin" OR role="staff"'
//         );

//         // Step 3: Insert notification for each receiver
//         if (receivers.length > 0) {
//             const receiverValues = receivers.map(user => [notifId, user.id, false]); // false = unread
//             await db.queryAsync(
//                 'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
//                 [receiverValues]
//             );
//         }

//         // Emit socket events
//         req.io.emit('updateReports');
//         req.io.emit('createdReport', newReport);
//         req.io.emit('updateNotifications');
//         req.io.emit('createdReportNotification', { notifId, message: notifMsg });



//         req.io.emit('updateReports');
//         req.io.emit('createdReport', newReport);
//         res.json({ success: true, message: 'Report submitted successfully', reportId: result.insertId });
//     });
// });

// Get All Reports
router.get('/', (req, res) => {
    const query = `
        SELECT r.*,
        CASE 
                WHEN r.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS reporter_name
        FROM tbl_reports r 
        JOIN tbl_users u ON r.user_id = u.id WHERE archived = 0
        ORDER BY r.created_at DESC`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

router.get('/get-user-reports/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `SELECT * FROM tbl_reports WHERE user_id = ? AND archived = 0 ORDER BY created_at DESC`;
    db.query(query, [userId], (err, rows) => {
        if (err) {
            console.error("Error fetching user reports:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch reports" });
        }
        res.json({ success: true, reports: rows });
    });
});

router.put("/admin/edit-report/:reportId", async (req, res) => {
    try {
        const { issue_type, priority, status } = req.body;
        const { reportId } = req.params;

        // Step 1: Get current report first
        const oldReportResult = await db.queryAsync(
            "SELECT user_id, location, status FROM tbl_reports WHERE id = ?",
            [reportId]
        );

        if (oldReportResult.length === 0) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        const userId = oldReportResult[0].user_id;
        const location = oldReportResult[0].location;
        const oldStatus = oldReportResult[0].status;

        // Step 2: Update report
        const updateReportQuery = `
            UPDATE tbl_reports 
            SET issue_type = ?, priority = ?, status = ? 
            WHERE id = ?
        `;
        const updateResult = await db.queryAsync(updateReportQuery, [issue_type, priority, status, reportId]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Report not updated" });
        }

        // Step 3: Only notify if status actually changed
        if (oldStatus !== status) {
            let notifMsg = "";

            switch (status) {
                case "In Progress":
                    if (oldStatus === "Resolved" || oldStatus === "Completed") {
                        notifMsg = `Your report about ${location} has been reopened and is back to In Progress.`;
                    } else {
                        notifMsg = `Your report about ${location} is now being worked on (In Progress).`;
                    }
                    break;

                case "Resolved":
                case "Completed":
                    notifMsg = `Your report about ${location} has been marked as ${status}.`;
                    break;

                case "Pending":
                    notifMsg = `Your report about ${location} has been set back to Pending.`;
                    break;

                default:
                    notifMsg = `The status of your report about ${location} has been updated to ${status}.`;
            }

            // Insert notification
            const notifInsert = await db.queryAsync(
                'INSERT INTO notifications (message, title) VALUES (?, "Report Update")',
                [notifMsg]
            );
            const notifId = notifInsert.insertId;

            await db.queryAsync(
                'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
                [notifId, userId]
            );

            // Emit socket events for notification
            req.io.emit('updateNotifications');
            req.io.emit('reportUpdatedNotification', { reportId, notifId, userId, message: notifMsg });
        }

        // Always emit updateReports so UI refreshes
        req.io.emit('updateReports');

        res.json({ success: true, message: "Report updated successfully" });

    } catch (err) {
        console.error("Error updating report:", err);
        res.status(500).json({ success: false, message: "Failed to update report" });
    }
});



// router.put("/admin/edit-report/:reportId", (req, res) => {
//     const { issue_type, priority, status } = req.body;
//     // console.log(issue_type, priority);
//     const { reportId } = req.params;
//     const updateReportQuery = "UPDATE tbl_reports SET issue_type = ?, priority = ?, status = ? WHERE id = ?";

//     db.query(updateReportQuery, [issue_type, priority, status, reportId], (err, result) => {
//         if (err) {
//             console.error("Error updating report type:", err);
//             return res.status(500).json({ success: false, message: "Failed to update report type" });
//         }

//         req.io.emit('updateReports');
//         res.json({ success: true, message: "Report updated successfully" });
//     });
// });


// router.put("/admin/edit-report-type/:reportId", (req, res) => {
//     const { report_type, category, priority, assigned_staff, status, type, item_name, contact_info, user_id, location, description, is_anonymous } = req.body;
//     const { reportId } = req.params;
//     const updateReportQuery = "UPDATE tbl_reports SET report_type = ? WHERE id = ?";

//     db.query(updateReportQuery, [report_type, reportId], (err, result) => {
//         if (err) {
//             console.error("Error updating report type:", err);
//             return res.status(500).json({ success: false, message: "Failed to update report type" });
//         }

//         if (report_type === "Maintenance Report") {
//             const maintenanceQuery = `
//                 INSERT INTO tbl_maintenance_reports (report_id, category, priority, assigned_staff) 
//                 VALUES (?, ?, ?, ?) 
//                 ON DUPLICATE KEY UPDATE 
//                 category = ?, priority = ?, assigned_staff = ?`;


//             db.query(
//                 maintenanceQuery,
//                 [reportId, category, priority, assigned_staff, category, priority, assigned_staff],
//                 (err, maintenanceResult) => {
//                     if (err) {
//                         console.error("Error updating maintenance report:", err);
//                         return res.status(500).json({ success: false, message: "Failed to update maintenance report" });
//                     }

//                     const title = `${report_type}`;
//                     // const message = `New report in ${location} about ${category} with ${priority} priority.`;
//                     const message = `New maintenance report at ${location} for ${category} (${priority} priority).`;

//                     const notificationQuery = `
//                         INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) 
//                         VALUES (?, ?, ?, ?)`;

//                     db.query(notificationQuery, [reportId, sender_id, message, title], (err) => {
//                         if (err) {
//                             console.error("Error inserting notification:", err);
//                         }
//                     });
//                     req.io.emit('update'); // Notify frontend
//                     res.json({ success: true, message: "Report updated successfully" });


//                 }
//             );
//         } else if (report_type === "Lost And Found") {
//             const lostFoundQuery = `
//                 INSERT INTO tbl_lost_found (user_id, report_id, type, category, location, description, item_name, contact_info, is_anonymous) 
//                 VALUES (?, ?, ?, ?, ?, ? , ? , ?, ?) 
//                 ON DUPLICATE KEY UPDATE 
//                 type = ?, item_name = ?, contact_info = ?`;

//             db.query(
//                 lostFoundQuery,
//                 [sender_id, reportId, type, category, location, description, item_name, contact_info, is_anonymous, type, item_name, contact_info],
//                 (err, lostFoundResult) => {
//                     if (err) {
//                         console.error("Error updating lost and found report:", err);
//                         return res.status(500).json({ success: false, message: "Failed to update lost and found report" });
//                     }

//                     const title = `${report_type}`;
//                     const message = `New ${type.toLowerCase()} item reported: "${item_name}" at ${location}.`;

//                     const notificationQuery = `
//                         INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) 
//                         VALUES (?, ?, ?, ?)`;

//                     db.query(notificationQuery, [reportId, sender_id, message, title], (err) => {
//                         if (err) {
//                             console.error("Error inserting notification:", err);
//                         }
//                     });

//                     req.io.emit('update');
//                     res.json({ success: true, message: "Report updated successfully" });
//                 }
//             );
//         } else if (report_type === "Incident Report") {

//             const incidentQuery = `
//                 INSERT INTO tbl_incident_reports (report_id, category, priority, assigned_staff) 
//                 VALUES (?, ?, ?, ?) 
//                 ON DUPLICATE KEY UPDATE 
//                 category = ?, priority = ?, assigned_staff = ?`;
//             db.query(
//                 incidentQuery,
//                 [reportId, category, priority, assigned_staff, category, priority, assigned_staff],
//                 (err, incidentResult) => {
//                     if (err) {
//                         console.error("Error updating incident report:", err);
//                         return res.status(500).json({ success: false, message: "Failed to update incident report" });
//                     }

//                     const title = `${report_type}`;
//                     const message = `New incident report: ${category} (${priority} priority) at ${location}.`;

//                     const notificationQuery = `
//                         INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) 
//                         VALUES (?, ?, ?, ?)`;

//                     db.query(notificationQuery, [reportId, sender_id, message, title], (err) => {
//                         if (err) {
//                             console.error("Error inserting notification:", err);
//                         }
//                     });
//                     req.io.emit('update'); // Notify frontend
//                     res.json({ success: true, message: "Report updated successfully" });


//                 }
//             );
//         }else {
//             req.io.emit('update');
//             res.json({ success: true, message: "Report type updated successfully" });
//         }
//     });
// });

// router.put('/report/archive-report/:id', (req, res) => {
//     const { id } = req.params;
//     const query = `UPDATE tbl_reports SET archived = 1 WHERE id = ?`;

//     db.query(query, [id], (err, result) => {
//         if (err) {
//             console.error("Error archiving report:", err);
//             return res.status(500).json({ success: false, message: "Error archiving report" });
//         }

//         if (result.affectedRows > 0) {
//             const selectQuery = `SELECT * FROM tbl_reports WHERE id = ?`;

//             db.query(selectQuery, [id], (err, rows) => {
//                 if (err) {
//                     console.error("Error retrieving report details:", err);
//                     return res.status(500).json({ success: false, message: "Error retrieving report details" });
//                 }

//                 const report = rows[0];

            
//                 req.io.emit('updateReports');
//                 return res.json({
//                     success: true,
//                     message: "Report archived successfully",
//                     affectedRow: report
//                 });
//             });
//         } else {
//             return res.status(404).json({ success: false, message: "Report not found or already archived" });
//         }
//     });
// });

router.put('/report/archive-report/:id', (req, res) => {
    const { id } = req.params;

    const query = `UPDATE tbl_reports SET archived = 1 WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error archiving report:", err);
            return res.status(500).json({ success: false, message: "Error archiving report" });
        }

        if (result.affectedRows > 0) {
            const selectQuery = `SELECT user_id, location FROM tbl_reports WHERE id = ?`;

            db.query(selectQuery, [id], async (err, rows) => {
                if (err) {
                    console.error("Error retrieving report details:", err);
                    return res.status(500).json({ success: false, message: "Error retrieving report details" });
                }

                if (rows.length === 0) {
                    return res.status(404).json({ success: false, message: "Report not found after update" });
                }

                const report = rows[0];
                const { user_id, location } = report;

                try {
                    // Create notification
                    const notifMsg = `Your report about ${location} has been archived.`;

                    const notifInsert = await db.queryAsync(
                        'INSERT INTO notifications (message, title) VALUES (?, "Report Archived")',
                        [notifMsg]
                    );
                    const notifId = notifInsert.insertId;

                    await db.queryAsync(
                        'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
                        [notifId, user_id]
                    );

                    // Emit socket events
                    req.io.emit('updateReports');
                    req.io.emit('updateNotifications');
                    req.io.emit('reportArchivedNotification', { reportId: id, notifId, userId: user_id, message: notifMsg });

                    return res.json({
                        success: true,
                        message: "Report archived successfully and user notified",
                        affectedRow: report
                    });
                } catch (notifErr) {
                    console.error("Error sending archive notification:", notifErr);
                    return res.status(500).json({ success: false, message: "Report archived but notification failed" });
                }
            });
        } else {
            return res.status(404).json({ success: false, message: "Report not found or already archived" });
        }
    });
});




router.post("/create", upload.single('image_path'), (req, res) => {
    const {
        report_type,
        category,
        priority,
        assigned_staff,
        status,
        type,
        item_name,
        contact_info,
        sender_id,
        location,
        description,
        is_anonymous,
        user_id
    } = req.body;
    const image_path = req.file ? req.file.filename : null;
    const insertReportQuery = `
        INSERT INTO tbl_reports (user_id, report_type, status, location, description, image_path)
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(insertReportQuery, [user_id, report_type, status || 'Pending', location, description, image_path], (err, result) => {
        if (err) {
            console.error("Error inserting into tbl_reports:", err);
            return res.status(500).json({ success: false, message: "Failed to create base report" });
        }

        const reportId = result.insertId;

        // Step 2: Insert into related table based on report_type
        if (report_type === "Maintenance Report") {
            const maintenanceQuery = `
                INSERT INTO tbl_maintenance_reports (report_id, category, priority, assigned_staff) 
                VALUES (?, ?, ?, ?)`;

            db.query(maintenanceQuery, [reportId, category, priority, assigned_staff], (err) => {
                if (err) {
                    console.error("Error inserting into maintenance report:", err);
                    return res.status(500).json({ success: false, message: "Failed to create maintenance report" });
                }

                req.io.emit('update');
                res.json({ success: true, message: "Maintenance report created successfully" });
            });

        } else if (report_type === "Lost And Found") {
            const lostFoundQuery = `
                INSERT INTO tbl_lost_found 
                (user_id, report_id, type, category, location, description, item_name, contact_info, is_anonymous) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(
                lostFoundQuery,
                [user_id, reportId, type, category, location, description, item_name, contact_info, is_anonymous ? 1 : 0],
                (err) => {
                    if (err) {
                        console.error("Error inserting into lost and found:", err);
                        return res.status(500).json({ success: false, message: "Failed to create lost and found report" });
                    }

                    req.io.emit('update');
                    res.json({ success: true, message: "Lost & Found report created successfully" });
                }
            );

        } else if (report_type === "Incident Report") {
            const incidentQuery = `
                INSERT INTO tbl_incident_reports (report_id, category, priority, assigned_staff) 
                VALUES (?, ?, ?, ?)`;

            db.query(incidentQuery, [reportId, category, priority, assigned_staff], (err) => {
                if (err) {
                    console.error("Error inserting into incident report:", err);
                    return res.status(500).json({ success: false, message: "Failed to create incident report" });
                }

                req.io.emit('update');
                res.json({ success: true, message: "Incident report created successfully" });
            });

        } else {
            // If it's not one of the known types
            res.json({ success: true, message: "Report created, but no specific report type handled." });
        }
    });
});

router.get('/reports-analytics', (req, res) => {
    const query = `
        SELECT r.*,
        CASE 
                WHEN r.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS reporter_name
        FROM tbl_reports r 
        JOIN tbl_users u ON r.user_id = u.id WHERE archived = 0 AND report_type = ''
        ORDER BY r.created_at DESC`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

router.get('/incident-analytics', (req, res) => {
    const query = `
        SELECT r.id,r.user_id,r.location, r.description,r.image_path,r.status,r.is_anonymous,r.created_at,r.updated_at,r.archived ,ir.*,
         CASE 
                WHEN r.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS reporter_name

        FROM tbl_reports r 
        LEFT  JOIN tbl_users u ON r.user_id = u.id LEFT JOIN tbl_incident_reports ir ON r.id = ir.report_id WHERE report_type ='Incident Report' AND r.archived = 0;`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

router.get('/maintenance-analytics', (req, res) => {
    const query = `
        SELECT r.id,r.user_id,r.location, r.description,r.image_path,r.status,r.is_anonymous,r.created_at,r.updated_at,r.archived ,mr.*,
                CASE 
                WHEN r.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS reporter_name
        FROM tbl_reports r 
        LEFT  JOIN tbl_users u ON r.user_id = u.id
        LEFT  JOIN tbl_maintenance_reports mr ON r.id = mr.report_id  WHERE report_type ='Maintenance Report' AND r.archived = 0;`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

router.get('/lost-and-found-analytics', async (req, res) => {
    const itemsQuery = `
        SELECT 
            lf.*,
            r.created_at,
            CASE WHEN lf.is_anonymous = 1 THEN 'Anonymous' ELSE u.name END AS user_name,
            COUNT(c.id) AS claim_count,
            GROUP_CONCAT(c.status) AS claim_statuses
        FROM tbl_lost_found lf
        LEFT JOIN tbl_users u ON lf.user_id = u.id 
        LEFT JOIN tbl_reports r ON lf.report_id = r.id
        LEFT JOIN (SELECT * FROM tbl_claims WHERE status != 'rejected') c ON c.item_id = lf.id
        WHERE lf.archived = 0
            AND COALESCE(r.report_type, '') != '' 
            AND lf.status = 'open' 
            AND r.archived = 0
        GROUP BY lf.id, u.name, r.created_at
        ORDER BY lf.date_reported DESC
    `;

    const analyticsQuery = `
        SELECT 'lost' AS type, COUNT(*) AS count FROM tbl_lost_found WHERE type = 'lost' AND archived = 0
        UNION ALL
        SELECT 'found' AS type, COUNT(*) AS count FROM tbl_lost_found WHERE type = 'found' AND archived = 0
        UNION ALL
        SELECT 'claimed' AS type, COUNT(*) AS count FROM tbl_lost_found WHERE status = 'claimed' AND archived = 0
        UNION ALL
        SELECT 'other' AS type, COUNT(*) AS count FROM tbl_lost_found WHERE status != 'claimed' AND archived = 0
    `;

    const claimedItemsQuery = `
        SELECT 
            lf.id AS item_id,
            lf.item_name,
            lf.type,
            lf.category,
            lf.description,
            lf.report_id,
            lf.location,
            lf.status AS item_status,
            lf.date_reported,
            r.created_at,
            CASE WHEN lf.is_anonymous = 1 THEN 'Anonymous' ELSE reporter.name END AS user_name,
            c.id AS claim_id,
            c.created_at AS claim_date,
            claimer.name AS claimer_name,
            holder.name AS holder_name,
            c.remarks   
        FROM tbl_claims c
        LEFT JOIN tbl_lost_found lf ON c.item_id = lf.id
        LEFT JOIN tbl_reports r ON lf.report_id = r.id
        LEFT JOIN tbl_users reporter ON lf.user_id = reporter.id
        LEFT JOIN tbl_users claimer ON c.claimer_id = claimer.id
        LEFT JOIN tbl_users holder ON c.holder_id = holder.id
        WHERE c.status = 'accepted' AND lf.archived = 0 
        ORDER BY c.created_at DESC
    `;

    const claimsPerItemQuery = `
        SELECT 
            c.*, 
            c.item_id,
            claimer.name AS claimer_name,
            holder.name AS holder_name
        FROM tbl_claims c
        LEFT JOIN tbl_users claimer ON c.claimer_id = claimer.id
        LEFT JOIN tbl_users holder ON c.holder_id = holder.id
        WHERE c.status != 'rejected'
    `;

    try {
        const [items, analytics, claimedItems, allClaims] = await Promise.all([
            fetchData(itemsQuery),
            fetchData(analyticsQuery),
            fetchData(claimedItemsQuery),
            fetchData(claimsPerItemQuery)
        ]);

        // Organize claims by itemId
        const claimsMap = {};
        allClaims.forEach(claim => {
            if (!claimsMap[claim.item_id]) {
                claimsMap[claim.item_id] = [];
            }
            claimsMap[claim.item_id].push(claim);
        });

        res.json({
            success: true,
            data: {
                items,
                claims_by_item: claimsMap,
                analytics_chart: analytics,
                claimed_items: claimedItems
            }
        });
    } catch (err) {
        console.error('Error fetching all data:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err });
    }
});

module.exports = router;
