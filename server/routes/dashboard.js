const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Dashboard Summary Endpoint
router.get('/:user_id', async (req, res) => {
  const {user_id} = req.params;
  try {
    const reportsToday = `
    SELECT COUNT(*) AS count
    FROM tbl_reports
    WHERE DATE(created_at) = CURDATE()
  `;
    const reportsTodayResult = await db.queryAsync(reportsToday);
    // Overdue Returns: Count items that are not returned and have passed their return date
    const urgentReports = `
    SELECT COUNT(*) AS count
    FROM tbl_reports
    WHERE priority = 'Urgent' AND status != 'Resolved'
    `;
    const urgentReportsResult = await db.queryAsync(urgentReports);

    // Active Borrowers: Count distinct borrowers with at least one "Pending" or "Approved" status
    const highPriorityReports = `
    SELECT COUNT(*) AS count
    FROM tbl_reports
    WHERE priority = 'High' AND status != 'Resolved'
    `;
    const highPriorityReportsResult = await db.queryAsync(highPriorityReports);

    // Available Items
    const mediumPriorityReports = `
      SELECT COUNT(*) AS count
      FROM tbl_reports
      WHERE priority = 'Medium' AND status != 'Resolved'
    `;

    const mediumPriorityReportsResult = await db.queryAsync(mediumPriorityReports);
    // Fetch recent borrowings
    const reportsFrequency = `
      SELECT *
      FROM tbl_reports
      ORDER BY created_at DESC
    `;
    const reportFrequencyResult = await db.queryAsync(reportsFrequency);

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
   SELECT * FROM tbl_reports ORDER BY created_at; 
  `;

    const eventsRaw = await db.queryAsync(eventsQuery,[user_id]);

    const eventsMap = new Map();
    eventsRaw.forEach(row => {
      if (!eventsMap.has(row.id)) {
        eventsMap.set(row.id, {
          id: row.id,
          title: row.location,
          startDate: row.created_at, // use start_datetime directly for comparison
          endDate: row.end_datetime, // use end_datetime directly for comparison
          time: `${new Date(row.created_at).toLocaleTimeString()}`,
          priority: row.priority,
          description: row.description,
        });
      }
    });

    const events = Array.from(eventsMap.values());

    const now = new Date(); // Get current time

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
    const todaysReport = events.filter(event => {
      const start = new Date(event.created_at);
      return isSameDate(now, start);
    });

    // Compose and send full dashboard data
    res.json({
      reportFrequencyResult,
      inventory,
      ongoingEvents,
      upcomingEvents,
      todaysReport,
      quickStats: {
        reportsToday: reportsTodayResult[0].count,
        urgentReports: urgentReportsResult[0].count,
        highPriorityReports: highPriorityReportsResult[0].count,
        mediumPriorityReports: mediumPriorityReportsResult[0].count,
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
