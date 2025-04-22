const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get notifications for a specific user (with read/unread status)
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await db.queryAsync(`
            SELECT n.id, n.message, n.created_at, nr.is_read, n.title
            FROM notifications n
            JOIN notification_receivers nr ON n.id = nr.notification_id
            WHERE nr.user_id = ? AND nr.is_read=false
            ORDER BY n.created_at DESC
        `, [userId]);

        return res.json(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json([]);
    }
});

router.get('/get-all-notifications/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
      const notifications = await db.queryAsync(`
          SELECT n.id, n.message, n.created_at, nr.is_read, n.title
          FROM notifications n
          JOIN notification_receivers nr ON n.id = nr.notification_id
          WHERE nr.user_id = ? 
          ORDER BY n.created_at DESC
      `, [userId]);

      return res.json(notifications);
  } catch (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json([]);
  }
});

//  endpoint to mark notification as read
router.put('/:userId/notifications/:id/read', async (req, res) => {
    const { userId, id } = req.params;
    try {
      // Update the notification status for this specific user in the notification_receivers table
      await db.queryAsync('UPDATE notification_receivers SET is_read = true WHERE user_id = ? AND notification_id = ?', [userId, id]);
      req.io.emit('updateNotifications');
      res.status(200).send('Notification marked as read');
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).send('Error marking notification as read');
    }
  });
  
  

module.exports = router;
