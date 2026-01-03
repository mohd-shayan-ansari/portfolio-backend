const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes and services
const messageRoutes = require('./routes/messages');
const { testEmail } = require('./utils/emailService'); // <-- ADD THIS LINE

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log(`💾 Database: ${mongoose.connection.name}`);
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/messages', messageRoutes);

// Test email endpoint (remove in production)
app.get('/api/test-email', async (req, res) => {
    try {
        const result = await testEmail();
        if (result) {
            res.json({ success: true, message: 'Test email sent successfully' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to send test email' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'Portfolio Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            sendMessage: 'POST /api/messages',
            getMessages: 'GET /api/messages',
            testEmail: 'GET /api/test-email' // <-- ADD THIS
        }
    });
});

app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ 
        status: 'OK',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
    console.log(`📨 Messages API: http://localhost:${PORT}/api/messages`);
    console.log(`📧 Test Email: http://localhost:${PORT}/api/test-email`); // <-- ADD THIS
});