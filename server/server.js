
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    } 
});
const nodemailer = require('nodemailer');
const usersRoutes = require('./routes/users');
const cors = require('cors');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);

app.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
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

const port = 5000;
server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

// WebSocket connection event
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
