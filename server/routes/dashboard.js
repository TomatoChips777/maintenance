const express = require('express');
const router = express.Router();
const db = require('../config/db'); // adjust if your db config is elsewhere

// Dashboard Summary Endpoint
router.get('/:user_id', async (req, res) => {
  const {user_id} = req.params;
  try {
    const borrowedTodayQuery = `
    SELECT COUNT(*) AS count
    FROM borrowed_items
    WHERE DATE(borrow_date) = CURDATE()
  `;
    const borrowedTodayResult = await db.queryAsync(borrowedTodayQuery);
    // Overdue Returns: Count items that are not returned and have passed their return date
    const overdueReturnsQuery = `
SELECT COUNT(*) AS count
FROM borrowed_items
WHERE status != 'Returned' AND returned_date < CURDATE()
`;
    const overdueReturnsResult = await db.queryAsync(overdueReturnsQuery);

    // Active Borrowers: Count distinct borrowers with at least one "Pending" or "Approved" status
    const activeBorrowersQuery = `
    SELECT COUNT(DISTINCT borrower_name) AS count
    FROM borrowed_items
    WHERE status != 'Returned'
    `;
    const activeBorrowersResult = await db.queryAsync(activeBorrowersQuery);

    // Available Items
    const availableItemsQuery = `
      SELECT SUM(quantity) AS available
      FROM inventory_items
      WHERE status = 'new' OR status = 'used' OR status = 'restored'
    `;
    const availableItemsResult = await db.queryAsync(availableItemsQuery);
    // Fetch recent borrowings
    const borrowQuery = `
      SELECT item_name, borrower_name, borrow_date, returned_date,status
      FROM borrowed_items
      ORDER BY created_at DESC LIMIT 5
    `;
    const borrowings = await db.queryAsync(borrowQuery);

    const borrowersRankingQuery = `
      SELECT borrower_name, COUNT(*) AS borrow_count FROM borrowed_items GROUP BY borrower_name ORDER BY borrow_count DESC LIMIT 10; 
    `;
    const borrowersRankingResult = await db.queryAsync(borrowersRankingQuery);

    const assistFrequencyQuery = `
      SELECT assisted_by, COUNT(*) AS assist_count
      FROM borrowed_items
      WHERE assisted_by IS NOT NULL AND assisted_by != ''
      GROUP BY assisted_by
      ORDER BY assist_count DESC
      LIMIT 10;
    `;
    const assistFrequencyResult = await db.queryAsync(assistFrequencyQuery);


    const inventoryQuery = `
      SELECT item_name AS item, status, category, quantity AS total, quantity AS available
      FROM inventory_items
      ORDER BY created_at DESC
    `;
    const inventory = await db.queryAsync(inventoryQuery);

    // Fetch ongoing and upcoming events with preparations
    // const eventsQuery = `
    //   SELECT e.id, e.event_name, e.start_datetime, e.end_datetime,
    //          ep.item_name, ep.quantity
    //   FROM events e
    //   LEFT JOIN event_preparations ep ON e.id = ep.event_id
    //   WHERE e.start_datetime <= NOW() AND e.end_datetime >= NOW() -- ongoing events
    //      OR e.start_datetime >= NOW() -- upcoming events
    //   ORDER BY e.start_datetime ASC
    // `;
    const eventsQuery = `
  SELECT e.id, e.event_name, e.start_datetime, e.end_datetime,
         ep.item_name, ep.quantity
  FROM events e
  LEFT JOIN event_preparations ep ON e.id = ep.event_id
  WHERE (
    (e.start_datetime <= NOW() AND e.end_datetime >= NOW())
    OR e.start_datetime >= NOW()
  )
  AND (
    e.is_personal = 0 OR e.user_id = ?
  )
  ORDER BY e.start_datetime ASC
`;

    const eventsRaw = await db.queryAsync(eventsQuery,[user_id]);

    const eventsMap = new Map();
    eventsRaw.forEach(row => {
      if (!eventsMap.has(row.id)) {
        eventsMap.set(row.id, {
          id: row.id,
          title: row.event_name,
          startDate: row.start_datetime, // use start_datetime directly for comparison
          endDate: row.end_datetime, // use end_datetime directly for comparison
          time: `${new Date(row.start_datetime).toLocaleTimeString()} - ${new Date(row.end_datetime).toLocaleTimeString()}`,
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

    const now = new Date(); // Get current time

    // // Separate events into ongoing and upcoming
    // const ongoingEvents = events.filter(event => {
    //   const eventStart = new Date(event.startDate);
    //   const eventEnd = new Date(event.endDate);

    //   // Check if the event is ongoing (current time should be between start and end)
    //   return now >= eventStart && now <= eventEnd;
    // });

    // const upcomingEvents = events.filter(event => {
    //   const eventStart = new Date(event.startDate);
    //   return eventStart > now; // Check if the event is upcoming (start time is after now)
    // });

    const isSameDate = (a, b) => a.toDateString() === b.toDateString();

    const ongoingEvents = events.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return (now >= start && now <= end) || isSameDate(now, start);
    });

    const upcomingEvents = events.filter(event => {
      const start = new Date(event.startDate);
      return start > now && !isSameDate(now, start);
    });
    const todayEvents = events.filter(event => {
      const start = new Date(event.startDate);
      return isSameDate(now, start);
    });

    // Compose and send full dashboard data
    res.json({
      borrowings,
      inventory,
      ongoingEvents,
      upcomingEvents,
      todayEvents,
      quickStats: {
        borrowedToday: borrowedTodayResult[0].count,
        overdueReturns: overdueReturnsResult[0].count,
        activeBorrowers: activeBorrowersResult[0].count,
        availableItems: availableItemsResult[0].available,
      },
      borrowersRanking: borrowersRankingResult,
      assistFrequency: assistFrequencyResult
    });

  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
