const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Message = require('../models/Message');

// POST route for message with file upload
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Create new message
        const newMessage = new Message({
            name,
            email,
            message,
            file: req.file ? {
                filename: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size
            } : null
        });

        await newMessage.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
            data: {
                id: newMessage._id,
                name: newMessage.name,
                email: newMessage.email,
                createdAt: newMessage.createdAt
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message'
        });
    }
});

// GET all messages (for admin)
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch messages'
        });
    }
});

module.exports = router;