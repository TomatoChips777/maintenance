const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper function to execute a query and return a promise
const runQuery = (query, values = []) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Get All Inventory Items
router.get('/', async (req, res) => {
    const query = `SELECT * FROM inventory_items ORDER BY created_at DESC`;

    try {
        const rows = await runQuery(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching all reports:", err);
        res.status(500).json([]);
    }
});

// Add a new item
router.post('/add-item', async (req, res) => {
    const {
        item_name,
        category,
        quantity,
        status,
        serial_number,
    } = req.body;

    // Check for required fields
    if (!item_name || !category || !quantity || !status) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const query = `
        INSERT INTO inventory_items
            (item_name, category, quantity, status, serial_number)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [item_name, category, quantity, status, serial_number || ''];

    try {
        const result = await runQuery(query, values);

        req.io.emit('updateInventory');
        req.io.emit('update');
        res.json({ success: true, message: 'Item record created successfully', borrowId: result.insertId });
    } catch (err) {
        console.error("Error creating item record:", err);
        res.status(500).json({ success: false, message: 'Failed to create item record' });
    }
});


// Update an existing item record
router.put('/update-item/:id', async (req, res) => {
    const { id } = req.params;
    const {
        item_name,
        category,
        quantity,
        status,
        serial_number,
    } = req.body;

    const query = `
        UPDATE inventory_items
        SET item_name = ?, category = ?, quantity = ?, status = ?, serial_number = ?
        WHERE id = ?
    `;
    
    const values = [
        item_name,
        category,
        quantity,
        status,
        serial_number,
        id
    ];

    try {
        await runQuery(query, values);
        req.io.emit('updateInventory');
        req.io.emit('update');
        res.json({ success: true, message: 'Item record updated successfully' });
    } catch (err) {
        console.error("Error updating item record:", err);
        res.status(500).json({ success: false, message: 'Failed to update item record' });
    }
});

module.exports = router;
