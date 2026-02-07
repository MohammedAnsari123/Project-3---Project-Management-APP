const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config(); // Load env vars BEFORE importing config files that might use them

const connectDB = require('./config/db');
const passport = require('./config/passport'); // Import passport config

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Socket.io connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinProject', (projectId) => {
        socket.join(projectId);
        console.log(`User joined project: ${projectId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/pages', require('./routes/pageRoutes'));

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
