const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Done'],
            default: 'To Do',
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        startDate: {
            type: Date,
        },
        dueDate: {
            type: Date,
        },
        attachments: [
            {
                type: String, // URL/Path to file
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
