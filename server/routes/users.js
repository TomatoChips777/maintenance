const express = require('express');
const router = express.Router();
const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Function to download and save profile picture
const downloadImage = async (url, uploadDir) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const ext = path.extname(url.split('?')[0]) || '.jpg'; // fallback to .jpg
    const fileName = Date.now() + ext;
    const filePath = path.join(uploadDir, fileName);

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, response.data);
    return fileName;
};

router.post('/login', async (req, res) => {
    const { email, name, picture, token } = req.body;

    if (!email || !name || !picture || !token) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.query('SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ?', [email], async (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (rows.length === 0) {
            // New user – insert into DB
            try {
                const profileDir = 'uploads/profile/';
                const imageFileName = await downloadImage(picture, profileDir);

                db.query(
                    'INSERT INTO tbl_users (name, email, role, image_url, token, status) VALUES (?, ?, ?, ?, ?, ?)',
                    [name, email, 'student', `profile/${imageFileName}`, token, 1],
                    (insertErr) => {
                        if (insertErr) {
                            console.error('Database insert error:', insertErr);
                            return res.status(500).json({ error: 'Internal server error' });
                        }

                        db.query('SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ?', [email], (fetchErr, newUser) => {
                            if (fetchErr) {
                                console.error('Database fetch error:', fetchErr);
                                return res.status(500).json({ error: 'Internal server error' });
                            }
                            return res.json(newUser[0]);
                        });
                    }
                );
            } catch (downloadErr) {
                console.error('Image download error:', downloadErr);
                return res.status(500).json({ error: 'Failed to download profile picture' });
            }
        } else {
            // Existing user – check if any data is missing and update if needed
            const user = rows[0];
            const updates = [];
            const params = [];

            if (!user.name && name) {
                updates.push('name = ?');
                params.push(name);
            }

            if ((!user.image_url || user.image_url.trim() === '') && picture) {
                try {
                    const profileDir = 'uploads/profile/';
                    const imageFileName = await downloadImage(picture, profileDir);
                    updates.push('image_url = ?');
                    params.push(`profile/${imageFileName}`);
                } catch (downloadErr) {
                    console.error('Image download error:', downloadErr);
                    return res.status(500).json({ error: 'Failed to download profile picture' });
                }
            }

            if (!user.token && token) {
                updates.push('token = ?');
                params.push(token);
            }

            if (updates.length > 0) {
                const updateQuery = `UPDATE tbl_users SET ${updates.join(', ')} WHERE email = ?`;
                params.push(email);

                db.query(updateQuery, params, (updateErr) => {
                    if (updateErr) {
                        console.error('Update error:', updateErr);
                        return res.status(500).json({ error: 'Error updating missing fields' });
                    }

                    // Return updated user
                    db.query('SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ?', [email], (fetchErr, updatedUser) => {
                        if (fetchErr) {
                            console.error('Fetch after update error:', fetchErr);
                            return res.status(500).json({ error: 'Error fetching updated user' });
                        }

                        return res.json(updatedUser[0]);
                    });
                });
            } else {
                return res.json(user); // Nothing to update
            }
        }
    });
});
router.post('/get-current-user', (req, res) => {
    const { id, email } = req.body;

    if (!id && !email) {
        return res.status(400).json({ error: 'ID or email is required' });
    }

    const query = id ? 'SELECT id, name, email, role, image_url, token FROM tbl_users WHERE id = ?' : 'SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ?';
    const param = id ? id : email;

    db.query(query, [param], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json(rows[0]);
    });
});

router.get('/get-all-users', (req, res) => {
    const query = 'SELECT * FROM tbl_users ';
    db.query(query, (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.json(rows);
    });
});

router.put('/update-user/:userId', (req, res) => {
    const userId = req.params.userId;
    const { name, email, role } = req.body;

    const updateQuery = 'UPDATE tbl_users SET name = ?, email = ?, role = ? WHERE id = ?';
    db.query(updateQuery, [name, email, role, userId], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User updated successfully' });
    });
});

router.put('/activate-deactivate-user/:userId', (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (status !== 0 && status !== 1) {
        return res.status(400).json({ success: false, message: 'Invalid status value. Use 1 or 0.' });
    }

    const query = 'UPDATE tbl_users SET status = ? WHERE id = ?';

    db.query(query, [status, userId], (err, result) => {
        if (err) {
            console.error('Error updating status:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: `User status updated to ${status === 1 ? 'active' : 'inactive'}` });
    });
});

router.post('/add-user', (req, res) => {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    db.query('SELECT id FROM tbl_users WHERE email = ?', [email], (err, rows) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (rows.length > 0) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const insertQuery = 'INSERT INTO tbl_users (name, email, role) VALUES (?, ?, ?)';
        db.query(insertQuery, [name, email, role ], (insertErr, result) => {
            if (insertErr) {
                console.error('Insert error:', insertErr);
                return res.status(500).json({ success: false, message: 'Failed to create user' });
            }

            return res.status(200).json({ success: true, message: 'User created successfully' });
        });
    });
});

module.exports = router;