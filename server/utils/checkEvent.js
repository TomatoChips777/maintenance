
// const db = require('../config/db');

// const runQuery = (query, values = []) => {
//   return new Promise((resolve, reject) => {
//     db.query(query, values, (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

// const checkUpcomingEvents = async (io) => {
//   const now = new Date();
//   const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

//   try {
//     const upcomingOrOngoing = await runQuery(
//       `SELECT * FROM events 
//        WHERE 
//          ((start_datetime BETWEEN ? AND ?) OR 
//          (start_datetime <= ? AND end_datetime >= ?))
//          AND (notified = FALSE OR last_modified > notified_at)  -- Check for updates to notify again
//        ORDER BY start_datetime ASC`,
//       [now, next24h, now, now]
//     );
//     if (upcomingOrOngoing.length === 0) return;

//     const personalEvents = [];
//     const publicEvents = [];

//     // Categorize events based on is_personal
//     upcomingOrOngoing.forEach(event => {
//       const start = new Date(event.start_datetime);
//       const end = new Date(event.end_datetime);
//       const name = event.event_name || "Unnamed Event";

//       const formatted = `- ${name}\n  From: ${start.toLocaleString()}\n  To:   ${end.toLocaleString()}`;

//       const eventInfo = {
//         id: event.id,
//         formatted,
//         start,
//         user_id: event.user_id,
//         is_personal: event.is_personal
//       };

//       if (event.is_personal) {
//         personalEvents.push(eventInfo);
//       } else {
//         publicEvents.push(eventInfo);
//       }
//     });

//     // Notify all admins and staff about public events
//     if (publicEvents.length > 0) {
//       const message = `Upcoming Events:\n\n` +
//         publicEvents.map(e => e.formatted).join('\n\n');

//       const notifResult = await runQuery(
//         'INSERT INTO notifications (message, title) VALUES (?, "Public Events")',
//         [message]
//       );
//       const notifId = notifResult.insertId;

//       const receivers = await runQuery(
//         'SELECT id FROM tbl_users WHERE role = "admin" OR role = "staff"'
//       );
//       const receiverValues = receivers.map(user => [notifId, user.id, false]);

//       if (receiverValues.length > 0) {
//         await runQuery(
//           'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
//           [receiverValues]
//         );
//       }

//       // Notify the owner (the user who created the event) as well
//       publicEvents.forEach(event => {
//         if (event.user_id) {
//           runQuery(
//             'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
//             [notifId, event.user_id]
//           );
//           // Emit to that user as well
//           io.to(`user_${event.user_id}`).emit("publicEventNotification", {
//             message,
//             events: [event]
//           });
//         }
//       });

//       // Emit notification for public events to all clients
//       io.emit("upcomingEventNotification", {
//         message,
//         events: publicEvents
//       });
//     }

//     // Notify individual owners of personal events
//     const ownerMap = new Map();

//     personalEvents.forEach(ev => {
//       if (!ownerMap.has(ev.user_id)) ownerMap.set(ev.user_id, []);
//       ownerMap.get(ev.user_id).push(ev.formatted);
//     });

//     for (const [user_id, eventMessages] of ownerMap.entries()) {
//       const message = `You have ${eventMessages.length} personal event(s) coming up:\n\n` +
//         eventMessages.join('\n\n');

//       const notifResult = await runQuery(
//         'INSERT INTO notifications (message, title) VALUES (?, "Your Personal Events")',
//         [message]
//       );
//       const notifId = notifResult.insertId;

//       await runQuery(
//         'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
//         [notifId, user_id]
//       );

//       io.to(`user_${user_id}`).emit("personalEventNotification", {
//         message,
//         events: personalEvents.filter(e => e.user_id === user_id)
//       });
//     }

//     // Mark events as notified
//     const allEventIds = upcomingOrOngoing.map(event => event.id);
//     if (allEventIds.length > 0) {
//       await runQuery(
//         `UPDATE events 
//          SET notified = TRUE, notified_at = NOW() 
//          WHERE id IN (${allEventIds.map(() => '?').join(',')})`,
//         allEventIds
//       );
//     }
    
//     // Trigger notification refresh
//     io.emit("updateNotifications");

//   } catch (err) {
//     console.error("Error checking upcoming/ongoing events:", err);
//   }
// };

// module.exports = { checkUpcomingEvents };


const db = require('../config/db'); // Assuming db is a connection pool

// Run Query with proper error handling
const runQuery = (query, values = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("MySQL Error:", err); // Log MySQL error
        return reject(err); // Reject the promise if there's an error
      }
      resolve(result);
    });
  });
};

// Check Upcoming Events
const checkUpcomingEvents = async (io) => {
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    // Fetch upcoming or ongoing events
    const upcomingOrOngoing = await runQuery(
      `SELECT * FROM events 
       WHERE 
         ((start_datetime BETWEEN ? AND ?) OR 
         (start_datetime <= ? AND end_datetime >= ?))
         AND (notified = FALSE OR last_modified > notified_at) 
       ORDER BY start_datetime ASC`,
      [now, next24h, now, now]
    );

    if (upcomingOrOngoing.length === 0) return;

    const personalEvents = [];
    const publicEvents = [];

    // Categorize events
    upcomingOrOngoing.forEach(event => {
      const start = new Date(event.start_datetime);
      const end = new Date(event.end_datetime);
      const name = event.event_name || "Unnamed Event";

      const formatted = `- ${name}\n  From: ${start.toLocaleString()}\n  To:   ${end.toLocaleString()}`;

      const eventInfo = {
        id: event.id,
        formatted,
        start,
        user_id: event.user_id,
        is_personal: event.is_personal
      };

      if (event.is_personal) {
        personalEvents.push(eventInfo);
      } else {
        publicEvents.push(eventInfo);
      }
    });

    // Handle public events
    if (publicEvents.length > 0) {
      const message = `Upcoming Events:\n\n` +
        publicEvents.map(e => e.formatted).join('\n\n');

      const notifResult = await runQuery(
        'INSERT INTO notifications (message, title) VALUES (?, "Public Events")',
        [message]
      );
      const notifId = notifResult.insertId;

      const receivers = await runQuery(
        'SELECT id FROM tbl_users WHERE role = "admin" OR role = "staff"'
      );
      const receiverValues = receivers.map(user => [notifId, user.id, false]);

      if (receiverValues.length > 0) {
        await runQuery(
          'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
          [receiverValues]
        );
      }

      
        // Get list of already notified user IDs (admins/staff)
const notifiedUserIds = new Set(receivers.map(user => user.id));

        publicEvents.forEach(event => {
          if (event.user_id && !notifiedUserIds.has(event.user_id)) {
             runQuery(
              'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
              [notifId, event.user_id]
            );
          }

          // Always emit notification to creator if connected
          io.to(`user_${event.user_id}`).emit("publicEventNotification", {
            message,
            events: [event]
          });
        });

      // publicEvents.forEach(event => {
      //   if (event.user_id) {
      //     runQuery(
      //       'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
      //       [notifId, event.user_id]
      //     );
      //     io.to(`user_${event.user_id}`).emit("publicEventNotification", {
      //       message,
      //       events: [event]
      //     });
      //   }
      // });

      io.emit("upcomingEventNotification", {
        message,
        events: publicEvents
      });
    }

    // Handle personal events
    const ownerMap = new Map();

    personalEvents.forEach(ev => {
      if (!ownerMap.has(ev.user_id)) ownerMap.set(ev.user_id, []);
      ownerMap.get(ev.user_id).push(ev.formatted);
    });

    for (const [user_id, eventMessages] of ownerMap.entries()) {
      const message = `You have ${eventMessages.length} personal event(s) coming up:\n\n` +
        eventMessages.join('\n\n');

      const notifResult = await runQuery(
        'INSERT INTO notifications (message, title) VALUES (?, "Your Personal Events")',
        [message]
      );
      const notifId = notifResult.insertId;

      await runQuery(
        'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
        [notifId, user_id]
      );

      io.to(`user_${user_id}`).emit("personalEventNotification", {
        message,
        events: personalEvents.filter(e => e.user_id === user_id)
      });
    }

    // Mark events as notified
    const allEventIds = upcomingOrOngoing.map(event => event.id);
    if (allEventIds.length > 0) {
      await runQuery(
        `UPDATE events 
         SET notified = TRUE, notified_at = NOW() 
         WHERE id IN (${allEventIds.map(() => '?').join(',')})`,
        allEventIds
      );
    }

    // Trigger notification refresh
    io.emit("updateNotifications");

  } catch (err) {
    console.error("Error checking upcoming/ongoing events:", err);
  }
};

module.exports = { checkUpcomingEvents };