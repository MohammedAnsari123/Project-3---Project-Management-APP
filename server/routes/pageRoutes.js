const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all pages for a project
// @route   GET /api/pages/project/:projectId
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
    try {
        const pages = await Page.find({ project: req.params.projectId }).sort({ updatedAt: -1 });
        res.json(pages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new page
// @route   POST /api/pages
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, content, projectId } = req.body;

    try {
        const page = await Page.create({
            title,
            content,
            project: projectId,
            author: req.user._id,
        });
        res.status(201).json(page);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a page
// @route   PUT /api/pages/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        page.title = req.body.title || page.title;
        page.content = req.body.content || page.content;

        const updatedPage = await page.save();
        res.json(updatedPage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a page
// @route   DELETE /api/pages/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found' });
        }

        await page.deleteOne();
        res.json({ message: 'Page removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
