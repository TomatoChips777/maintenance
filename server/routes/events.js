const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper: Run MySQL queries as Promises
const runQuery = (query, values = []) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

router.get('/:user_id', async (req, res) => {
    const {user_id} = req.params;

    const query = `
        SELECT e.*, ep.item_name, ep.quantity
        FROM events e
        LEFT JOIN event_preparations ep ON e.id = ep.event_id
        WHERE (e.is_personal = 0 OR e.user_id = ?)
        ORDER BY e.start_datetime ASC
    `;

    try {
        const results = await runQuery(query, [user_id]);

        const eventsMap = new Map();

        results.forEach(row => {
            if (!eventsMap.has(row.id)) {
                eventsMap.set(row.id, {
                    user_id: row.user_id,
                    id: row.id,
                    event_name: row.event_name,
                    is_personal: row.is_personal,
                    start_datetime: row.start_datetime,
                    end_datetime: row.end_datetime,
                    preparations: []
                });
            }

            if (row.item_name) {
                eventsMap.get(row.id).preparations.push({
                    name: row.item_name,
                    quantity: row.quantity
                });
            }
        });

        const events = Array.from(eventsMap.values());
        return res.json(events);

    } catch (err) {
        console.error("Error fetching events:", err);
        return res.status(500).json([]);
    }
});

// // 📦 Get all events with preparations
// router.get('/', async (req, res) => {
//     const query = `
//         SELECT e.*, ep.item_name, ep.quantity
//         FROM events e
//         LEFT JOIN event_preparations ep ON e.id = ep.event_id
//         ORDER BY e.start_datetime ASC
//     `;

//     try {
//         const results = await runQuery(query);

//         const eventsMap = new Map();

//         results.forEach(row => {
//             if (!eventsMap.has(row.id)) {
//                 eventsMap.set(row.id, {
//                     user_id: row.user_id,
//                     id: row.id,
//                     event_name: row.event_name,
//                     is_personal: row.is_personal,
//                     start_datetime: row.start_datetime,
//                     end_datetime: row.end_datetime,
//                     preparations: []
//                 });
//             }

//             if (row.item_name) {
//                 eventsMap.get(row.id).preparations.push({
//                     name: row.item_name,
//                     quantity: row.quantity
//                 });
//             }
//         });

//         const events = Array.from(eventsMap.values());
//         return res.json(events);

//     } catch (err) {
//         console.error("Error fetching events:", err);
//         return res.status(500).json([]);
//     }
// });

// Create a new event
router.post('/create-event', async (req, res) => {
    const { user_id, event_name, start_datetime, end_datetime, preparations = [] ,is_personal} = req.body;
    if (!event_name || !start_datetime || !end_datetime) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    try {
        const eventResult = await runQuery(
            `INSERT INTO events (user_id, event_name, start_datetime, end_datetime, is_personal) VALUES (?, ?, ?, ?, ?)`,
            [user_id, event_name, start_datetime, end_datetime, is_personal]
        );
        const eventId = eventResult.insertId;

        const validPreps = preparations.filter(p => p.name?.trim() !== '');

        if (validPreps.length > 0) {
            const prepValues = validPreps.map(p => [eventId, p.name, p.quantity || 1]);
            await runQuery(
                `INSERT INTO event_preparations (event_id, item_name, quantity) VALUES ?`,
                [prepValues]
            );
        }
        
        req.io.emit("updateEvents");
        req.io.emit('update');
        return res.json({ success: true, message: 'Event created successfully', eventId });

    } catch (err) {
        console.error("Error creating event:", err);
        return res.status(500).json({ success: false, message: 'Failed to create event' });
    }
});

// Edit an event
router.post('/edit-event', async (req, res) => {
    const { event_id, event_name, start_datetime, end_datetime, preparations = [], is_personal } = req.body;

    if (!event_id || !event_name || !start_datetime || !end_datetime) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    try {
        await runQuery(
            `UPDATE events SET event_name = ?, start_datetime = ?, end_datetime = ?, is_personal = ? WHERE id = ?`,
            [event_name, start_datetime, end_datetime, is_personal, event_id]
        );

        await runQuery(`DELETE FROM event_preparations WHERE event_id = ?`, [event_id]);

        const validPreps = preparations.filter(p => p.name?.trim() !== '');

        if (validPreps.length > 0) {
            const prepValues = validPreps.map(p => [event_id, p.name, p.quantity || 1]);
            await runQuery(
                `INSERT INTO event_preparations (event_id, item_name, quantity) VALUES ?`,
                [prepValues]
            );
        }
        req.io.emit("updateEvents");
        req.io.emit('update');
        return res.json({ success: true, message: 'Event updated successfully' });

    } catch (err) {
        console.error("Error updating event:", err);
        return res.status(500).json({ success: false, message: 'Failed to update event' });
    }
});

router.delete('/delete-event/:id', async (req, res) => {
    const { id } = req.params;
    try {    
        await runQuery(`DELETE FROM events WHERE id = ?`, [id]);
        await runQuery(`DELETE FROM event_preparations WHERE event_id = ?`, [id]);
        req.io.emit("updateEvents");
        req.io.emit('update');
        return res.json({ success: true, message: 'Event deleted successfully' });
    } catch (err) {
        console.error("Error deleting event:", err);        
        return res.status(500).json({ success: false, message: 'Failed to delete event' });
    }
});

module.exports = router;
