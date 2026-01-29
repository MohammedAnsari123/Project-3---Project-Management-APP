const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const Comment = require('../models/Comment');

// @desc    Get all tickets for a project
// @route   GET /api/tickets?projectId=...
// @access  Private
const getTickets = async (req, res) => {
    const { projectId } = req.query;

    if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
    }

    try {
        const tickets = await Ticket.find({ project: projectId })
            .populate('assignee', 'username email profileImage')
            .populate('project');

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
    const { title, description, priority, status, projectId, assigneeId } =
        req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const ticket = new Ticket({
            title,
            description,
            priority,
            status,
            project: projectId,
            assignee: assigneeId || null,
            startDate: req.body.startDate,
            dueDate: req.body.dueDate,
        });

        const createdTicket = await ticket.save();

        const populatedTicket = await Ticket.findById(createdTicket._id)
            .populate('assignee', 'username email profileImage');

        // Emit socket event
        const io = req.app.get('io');
        io.to(projectId).emit('ticketCreated', populatedTicket);

        res.status(201).json(populatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket (status, drag-drop, etc)
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (ticket) {
            ticket.title = req.body.title || ticket.title;
            ticket.description = req.body.description || ticket.description;
            ticket.priority = req.body.priority || ticket.priority;
            ticket.status = req.body.status || ticket.status;
            ticket.assignee = req.body.assigneeId || ticket.assignee;
            ticket.startDate = req.body.startDate || ticket.startDate;
            ticket.dueDate = req.body.dueDate || ticket.dueDate;
            if (req.body.attachments) {
                ticket.attachments = req.body.attachments;
            }

            const updatedTicket = await ticket.save();

            const filledTicket = await Ticket.findById(updatedTicket._id)
                .populate('assignee', 'username email profileImage');

            // Emit socket event
            const io = req.app.get('io');
            io.to(ticket.project.toString()).emit('ticketUpdated', filledTicket);

            res.json(filledTicket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (ticket) {
            const projectId = ticket.project.toString();
            await ticket.deleteOne();

            // Emit socket event
            const io = req.app.get('io');
            io.to(projectId).emit('ticketDeleted', req.params.id);

            res.json({ message: 'Ticket removed' });
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload attachment
// @route   POST /api/tickets/upload
// @access  Private
const uploadAttachment = (req, res) => {
    if (req.file) {
        res.json({
            path: `/uploads/${req.file.filename}`,
            filename: req.file.originalname,
        });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
};

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
const addComment = async (req, res) => {
    const { content } = req.body;

    try {
        const ticket = await Ticket.findById(req.params.id);

        if (ticket) {
            const comment = new Comment({
                content,
                author: req.user._id,
                ticket: ticket._id,
            });

            await comment.save();

            const filledComment = await Comment.findById(comment._id).populate(
                'author',
                'username email profileImage'
            );

            res.status(201).json(filledComment);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comments for a ticket
// @route   GET /api/tickets/:id/comments
// @access  Private
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ ticket: req.params.id })
            .populate('author', 'username email profileImage')
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    uploadAttachment,
    addComment,
    getComments,
};
