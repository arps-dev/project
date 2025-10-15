require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('./config/db');
const authRoutes = require('./routes/auth');
const ingredientRoutes = require('./routes/ingredients');
const orderRoutes = require('./routes/orders');
const stockChecker = require('./cron/stockChecker');

const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || '*' }
});

// attach io to app so routes can emit
app.set('io', io);

app.use(cors({ origin: process.env.FRONTEND_URL || '*' , credentials: true}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
});

// start cron job
stockChecker.start();
