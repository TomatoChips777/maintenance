const express = require('express');
const router = express.Router();
const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const bcrypt = require('bcryptjs');

// Function to download and save profile picture
const downloadImage = async (url, uploadDir) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const ext = path.extname(url.split('?')[0]) || '.jpg';
    const fileName = Date.now() + ext;
    const filePath = path.join(uploadDir, fileName);

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

    try {
        const rows = await db.queryAsync('SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ? AND status = 1', [email]);

        if (rows.length === 0) {
            const profileDir = 'uploads/profile/';
            const imageFileName = await downloadImage(picture, profileDir);

            await db.queryAsync(
                'INSERT INTO tbl_users (name, email, role, image_url, token, status) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, 'user', `profile/${imageFileName}`, token, 1]
            );

            const newUser = await db.queryAsync('SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ?', [email]);
            return res.json(newUser[0]);
        } else {
            const user = rows[0];
            const updates = [];
            const params = [];

            if (!user.name && name) {
                updates.push('name = ?');
                params.push(name);
            }

            if ((!user.image_url || user.image_url.trim() === '') && picture) {
                const profileDir = 'uploads/profile/';
                const imageFileName = await downloadImage(picture, profileDir);
                updates.push('image_url = ?');
                params.push(`profile/${imageFileName}`);
            }

            if (!user.token && token) {
                updates.push('token = ?');
                params.push(token);
            }

            if (updates.length > 0) {
                const updateQuery = `UPDATE tbl_users SET ${updates.join(', ')} WHERE email = ?`;
                params.push(email);
                await db.queryAsync(updateQuery, params);
            }

            return res.json(user);
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/get-current-user', async (req, res) => {
    const { id, email } = req.body;

    if (!id && !email) {
        return res.status(400).json({ error: 'ID or email is required' });
    }

    try {
        const query = id
            ? 'SELECT id, name, email, role, image_url, token FROM tbl_users WHERE id = ? AND status= 1'
            : 'SELECT id, name, email, role, image_url, token FROM tbl_users WHERE email = ? AND status= 1';

        const rows = await db.queryAsync(query, [id || email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json(rows[0]);
    } catch (err) {
        console.error('Get current user error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-all-users', async (req, res) => {
    try {
        const rows = await db.queryAsync('SELECT * FROM tbl_users');
        return res.json(rows);
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// router.put('/update-user/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const { name, email, role,status } = req.body;

//     try {
//         const result = await db.queryAsync(
//             'UPDATE tbl_users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?',
//             [name, email, role, status, userId]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         res.json({ success: true, message: 'User updated successfully' });
//     } catch (err) {
//         console.error('Update user error:', err);
//         res.status(500).json({ success: false, message: 'Database error' });
//     }
// });

router.put('/activate-deactivate-user/:userId', async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (status !== 0 && status !== 1) {
        return res.status(400).json({ success: false, message: 'Invalid status value. Use 1 or 0.' });
    }

    try {
        const result = await db.queryAsync('UPDATE tbl_users SET status = ? WHERE id = ?', [status, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        req.io.emit("updateUser");
        res.json({ success: true, message: `User status updated to ${status === 1 ? 'active' : 'inactive'}` });
    } catch (err) {
        console.error('Activate/Deactivate error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// router.post('/add-user', async (req, res) => {
//     const { name, email, role } = req.body;

//     if (!name || !email || !role) {
//         return res.status(400).json({ success: false, message: 'Missing required fields' });
//     }

//     try {
//         const rows = await db.queryAsync('SELECT id FROM tbl_users WHERE email = ?', [email]);

//         if (rows.length > 0) {
//             return res.status(409).json({ success: false, message: 'User already exists' });
//         }

//         await db.queryAsync(
//             'INSERT INTO tbl_users (name, email, role) VALUES (?, ?, ?)',
//             [name, email, role]
//         );

//         return res.status(200).json({ success: true, message: 'User created successfully' });
//     } catch (err) {
//         console.error('Add user error:', err);
//         res.status(500).json({ success: false, message: 'Failed to create user' });
//     }
// });


router.post('/manual-signin', async (req, res) => {
    const { email, password, name, picture, token } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const rows = await db.queryAsync('SELECT id, name, email, role, image_url, token, password FROM tbl_users WHERE email = ? AND status = 1', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = rows[0];

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If password is correct, send user info
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image_url: user.image_url,
            token: user.token,
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// router.post('/register', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: 'Missing required fields' });
//     }

//     try {
//         // Hash the password before saving to the database
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Save the user to the database
//         await db.queryAsync(
//             'INSERT INTO tbl_users (email, password) VALUES ( ?, ?)',
//             [email, hashedPassword]
//         );

//         return res.status(201).json({ success: true, message: 'User registered successfully' });
//     } catch (err) {
//         console.error('Register error:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

router.post('/add-user', async (req, res) => {
    const { email, password, name, picture } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await db.queryAsync('SELECT id FROM tbl_users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle profile image download and save if provided
        let imageFileName = null;
        if (picture) {
            const profileDir = 'uploads/profile/';
            imageFileName = await downloadImage(picture, profileDir);
        }

        // Insert the new user into the database with the hashed password
        await db.queryAsync(
            'INSERT INTO tbl_users (name, email, password, image_url) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, imageFileName ? `profile/${imageFileName}` : null]
        );

    
        return res.json({ success: true, message: 'User added successfully' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/update-user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { name, email, role, status, password } = req.body;

    try {
        // If password is provided, hash it
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Prepare the fields to update
        const updates = [];
        const params = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }

        if (email) {
            updates.push('email = ?');
            params.push(email);
        }

        if (role) {
            updates.push('role = ?');
            params.push(role);
        }

        if (status !== undefined) {
            updates.push('status = ?');
            params.push(status);
        }

        if (hashedPassword) {
            updates.push('password = ?');
            params.push(hashedPassword);
        }

        // Only update if there's at least one field to update
        if (updates.length > 0) {
            const updateQuery = `UPDATE tbl_users SET ${updates.join(', ')} WHERE id = ?`;
            params.push(userId);
            const result = await db.queryAsync(updateQuery, params);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            req.io.emit("updateUser");
            return res.json({ success: true, message: 'User updated successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }
        
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

module.exports = router;
