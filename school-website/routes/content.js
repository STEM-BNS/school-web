const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');

// Get content for a specific section and page
router.get('/:page/:section', async (req, res) => {
    try {
        const { page, section } = req.params;
        const content = await Content.findOne({ page, section });
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update content (requires authentication)
router.put('/:page/:section', auth, async (req, res) => {
    try {
        const { page, section } = req.params;
        const { content } = req.body;
        
        const updatedContent = await Content.findOneAndUpdate(
            { page, section },
            { 
                content,
                lastModified: Date.now(),
                modifiedBy: req.user._id
            },
            { new: true, upsert: true }
        );
        
        res.json(updatedContent);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all content for a page
router.get('/:page', async (req, res) => {
    try {
        const { page } = req.params;
        const content = await Content.find({ page });
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get modification history for a section
router.get('/:page/:section/history', auth, async (req, res) => {
    try {
        const { page, section } = req.params;
        const history = await Content.find({ page, section })
            .populate('modifiedBy', 'username')
            .sort('-lastModified');
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 