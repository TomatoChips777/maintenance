

// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const http = require('http');
// const { Server } = require('socket.io');

// const reportsRoutes = require('./routes/reports');
// const usersRoutes = require('./routes/users');
// const analytics = require('./routes/analytics');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST", "PUT", "DELETE"]
//     } 
// });

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(cors());
// app.use(express.json());

// // Pass the io instance to routes
// app.use((req, res, next) => {
//     req.io = io;
//     next();
// });

// app.use('/api/reports', reportsRoutes);
// app.use('/api/users', usersRoutes);

// app.use('/api/analytics', analytics);


// const port = 5000;
// server.listen(port, () => {
//     console.log(`Server is listening on http://localhost:${port}`);
// });

// // WebSocket connection event
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });
