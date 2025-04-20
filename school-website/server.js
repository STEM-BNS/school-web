const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/school_feedback', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name: String,
    category: String,
    subject: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for new feedback
    socket.on('new_feedback', async (feedback) => {
        try {
            const newFeedback = new Feedback(feedback);
            await newFeedback.save();
            io.emit('feedback_update', await Feedback.find().sort({ timestamp: -1 }));
        } catch (error) {
            console.error('Error saving feedback:', error);
        }
    });

    // Listen for delete feedback
    socket.on('delete_feedback', async (id) => {
        try {
            await Feedback.findByIdAndDelete(id);
            io.emit('feedback_update', await Feedback.find().sort({ timestamp: -1 }));
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    });

    // Listen for delete all feedback
    socket.on('delete_all_feedback', async () => {
        try {
            await Feedback.deleteMany({});
            io.emit('feedback_update', []);
        } catch (error) {
            console.error('Error deleting all feedback:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// API Routes
app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ timestamp: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching feedback' });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 