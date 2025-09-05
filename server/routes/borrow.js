const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get All Borrowed Items
router.get('/', async (req, res) => {
    try {
        const rows = await db.queryAsync(`SELECT * FROM borrowed_items ORDER BY created_at DESC`);
        return res.json(rows);
    } catch (err) {
        console.error("Error fetching all borrow records:", err);
        res.status(500).json([]);
    }
});

// Borrow Request (for users)
router.post('/create-borrow-request', async (req, res) => {
    const {
        borrower,
        email,
        department,
        item,
        description,
        returned_date,
    } = req.body;

    if (!borrower || !email || !department || !item || !returned_date) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const query = `
        INSERT INTO borrowed_items
        (borrower_name, email, department, item_name, description, returned_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [borrower, email, department, item, description || '', returned_date || null];

    try {
        const result = await db.queryAsync(query, values);

        const newBorrow = {
            id: result.insertId,
            borrower,
            email,
            department,
            item,
            description,
            returned_date,
        };

        // Step 1: Create a new notification
        const notifMsg = `${borrower} from ${department} submitted a borrow request for "${item}".`;
        const notifResult = await db.queryAsync(
            'INSERT INTO notifications (message, title) VALUES (?, "Borrowing")',
            [notifMsg]
        );
        const notifId = notifResult.insertId;

        // Step 2: Get all admins and staff
        const receivers = await db.queryAsync(
            'SELECT id FROM tbl_users WHERE role="admin" OR role="staff"'
        );

        // Step 3: Insert one notification_receiver per admin/staff user
        const receiverValues = receivers.map(user => [notifId, user.id, false]);  // Adding `false` for unread status
        await db.queryAsync(
            'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
            [receiverValues]
        );

        // Emit events if needed
        req.io.emit('updateBorrowing');
        req.io.emit('update');
        req.io.emit('updateNotifications');
        req.io.emit('createdBorrow', newBorrow);

        res.json({
            success: true,
            message: 'Borrow record and notification created successfully',
            borrowId: result.insertId
        });

    } catch (err) {
        console.error("Error creating borrow record or notification:", err);
        res.status(500).json({ success: false, message: 'Failed to create borrow record or notification' });
    }
});


// Borrow Record (for admins/staff)
router.post('/create-borrow', async (req, res) => {
    const {
        borrower_name,
        email,
        department,
        item_name,
        description,
        // returned_date,
        assist_by
    } = req.body;

    if (!borrower_name || !email || !department || !item_name || !assist_by) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const query = `
        INSERT INTO borrowed_items 
        (borrower_name, email, department, item_name, description, assisted_by)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        borrower_name,
        email,
        department,
        item_name,
        description || '',
        // returned_date || null,
        assist_by
    ];

    try {
        const result = await db.queryAsync(query, values);

        const newBorrow = {
            id: result.insertId,
            borrower_name,
            email,
            department,
            item_name,
            description,
            assist_by
        };

        req.io.emit('updateBorrowing');
        req.io.emit('update');
        req.io.emit('createdBorrow', newBorrow);

        res.json({
            success: true,
            message: 'Borrow record created successfully',
            borrowId: result.insertId
        });
    } catch (err) {
        console.error("Error creating borrow record:", err);
        res.status(500).json({ success: false, message: 'Failed to create borrow record' });
    }
});

// Update Borrow Record
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const {
        borrower_name,
        email,
        department,
        item_name,
        description,
        assist_by,
        status
    } = req.body;

    // Get the current time in PHT (UTC +8)
    const phtOffset = 8 * 60; // minutes
    const currentDate = new Date();
    const currentTimePHT = new Date(currentDate.getTime() + (phtOffset * 60000));
    const formattedCurrentTimePHT = currentTimePHT.toISOString().slice(0, 19).replace('T', ' ');

    const query = `
        UPDATE borrowed_items
        SET borrower_name = ?, email = ?, department = ?, item_name = ?,
            description = ?, returned_date = CASE
                WHEN ? = 'Returned' THEN ?
                WHEN ? = 'Pending' THEN NULL
                ELSE returned_date
            END,
            assisted_by = ?, status = ?
        WHERE id = ?
    `;

    const values = [
        borrower_name,
        email,
        department,
        item_name,
        description || '',
        status,
        status === 'Returned' ? formattedCurrentTimePHT : null,
        status,
        assist_by || '',
        status || 'Pending',
        id
    ];

    try {
        const result = await db.queryAsync(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Borrow record not found' });
        }

        req.io.emit('updateBorrowing');
        req.io.emit('update');
        res.json({ success: true, message: 'Borrow record updated successfully' });
    } catch (err) {
        console.error("Error updating borrow record:", err);
        res.status(500).json({ success: false, message: 'Failed to update borrow record' });
    }
});

// // Update Borrow Record
// router.put('/update/:id', async (req, res) => {
//     const { id } = req.params;
//     const {
//         borrower_name,
//         email,
//         department,
//         item_name,
//         description,
//         returned_date,
//         assist_by,
//         status
//     } = req.body;

//     const query = `
//         UPDATE borrowed_items
//         SET borrower_name = ?, email = ?, department = ?, item_name = ?,
//             description = ?, returned_date = ?, assisted_by = ?, status = ?
//         WHERE id = ?
//     `;

//     const values = [
//         borrower_name,
//         email,
//         department,
//         item_name,
//         description || '',
//         returned_date || null,
//         assist_by || '',
//         status || 'Pending',
//         id
//     ];

//     try {
//         const result = await db.queryAsync(query, values);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ success: false, message: 'Borrow record not found' });
//         }
//         req.io.emit('updateBorrowing');
//         req.io.emit('update');
//         res.json({ success: true, message: 'Borrow record updated successfully' });
//     } catch (err) {
//         console.error("Error updating borrow record:", err);
//         res.status(500).json({ success: false, message: 'Failed to update borrow record' });
//     }
// });
// // Update Borrow Record
// router.put('/update-status/:id', async (req, res) => {
//     const { id } = req.params;
//     const { status, assist_by
//     } = req.body;

//     const query = `
//         UPDATE borrowed_items SET  status = ?, assisted_by = ? WHERE id = ?`;

//     const values = [
//         status || 'Pending',
//         assist_by,
//         id
//     ];

//     try {
//         const result = await db.queryAsync(query, values);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ success: false, message: 'Borrow record not found' });
//         }
//         req.io.emit('updateBorrowing');
//         res.json({ success: true, message: 'Borrow record updated successfully' });
//     } catch (err) {
//         console.error("Error updating borrow record:", err);
//         res.status(500).json({ success: false, message: 'Failed to update borrow record' });
//     }
// });


// router.put('/update-status/:id', async (req, res) => {
//     const { id } = req.params;
//     const { status, assist_by } = req.body;

//     // Get the current time in PHT (UTC +8)
//     const phtOffset = 8 * 60; // PHT is UTC +8 hours
//     const currentDate = new Date();
//     const currentTimePHT = new Date(currentDate.getTime() + (phtOffset * 60000)); // Convert UTC to PHT

//     // Format the current time to 'YYYY-MM-DD HH:mm:ss'
//     const formattedCurrentTimePHT = currentTimePHT.toISOString().slice(0, 19).replace('T', ' ');

//     let query = `
//         UPDATE borrowed_items 
//         SET status = ?, assisted_by = ?, 
//             returned_date = CASE WHEN ? = 'Returned' THEN ? ELSE returned_date END 
//         WHERE id = ?`;

//     const values = [
//         status || 'Pending',
//         assist_by,
//         status,
//         status === 'Returned' ? formattedCurrentTimePHT : null,
//         id
//     ];

//     try {
//         const result = await db.queryAsync(query, values);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ success: false, message: 'Borrow record not found' });
//         }

//         req.io.emit('updateBorrowing');
//         req.io.emit('update');  // Emit the update event to notify clients
//         res.json({ success: true, message: 'Borrow record updated successfully' });
//     } catch (err) {
//         console.error("Error updating borrow record:", err);
//         res.status(500).json({ success: false, message: 'Failed to update borrow record' });
//     }
// });


router.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status, assist_by } = req.body;

    // Get the current time in PHT (UTC +8)
    const phtOffset = 8 * 60; // minutes
    const currentDate = new Date();
    const currentTimePHT = new Date(currentDate.getTime() + (phtOffset * 60000));

    // Format the current time to 'YYYY-MM-DD HH:mm:ss'
    const formattedCurrentTimePHT = currentTimePHT.toISOString().slice(0, 19).replace('T', ' ');

    let query = `
        UPDATE borrowed_items 
        SET status = ?, assisted_by = ?, 
            returned_date = CASE 
                WHEN ? = 'Returned' THEN ? 
                WHEN ? = 'Pending' THEN NULL 
                ELSE returned_date 
            END
        WHERE id = ?`;

    const values = [
        status || 'Pending',
        assist_by,
        status,
        status === 'Returned' ? formattedCurrentTimePHT : null,
        status,
        id
    ];

    try {
        const result = await db.queryAsync(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Borrow record not found' });
        }

        req.io.emit('updateBorrowing');
        req.io.emit('update');
        res.json({ success: true, message: 'Borrow record updated successfully' });
    } catch (err) {
        console.error("Error updating borrow record:", err);
        res.status(500).json({ success: false, message: 'Failed to update borrow record' });
    }
});

module.exports = router;
