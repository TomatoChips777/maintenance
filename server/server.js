
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const nodemailer = require('nodemailer');
const usersRoutes = require('./routes/users');
const chatbot = require('./routes/chatbot');
const borrow = require('./routes/borrow');
const inventory = require('./routes/inventory');
const events = require('./routes/events');
const notifications = require('./routes/notifications');
const dashboard = require('./routes/dashboard');
const cors = require('cors');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    } 
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/users', usersRoutes);
app.use('/api/chatbot', chatbot);
app.use('/api/borrow-items',borrow );
app.use('/api/inventory', inventory);
app.use('/api/events', events);
app.use('/api/notifications', notifications);
app.use('/api/dashboard', dashboard);
app.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        name: 'example.com',
        port: 465,
        secure: true,
        auth: {
          user: 'goldenpaper777@gmail.com',
          pass: 'zqyw sufs jjdu euno',
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      
    await transporter.sendMail({
      from: "goldenpaper777@gmail.com",
      to: to,
      subject: subject,
      text: message,
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Email failed to send.' });
  }
});

const { checkUpcomingEvents } = require('./utils/checkEvent');
// setInterval(() => checkUpcomingEvents(io), 60 * 60 * 1000);
setInterval(() => checkUpcomingEvents(io), 10 * 1000);


const port = 5000;
server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
