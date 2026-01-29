const express = require('express');
const router = express.Router();
const {
    getTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    uploadAttachment,
    addComment,
    getComments,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.route('/').get(protect, getTickets).post(protect, createTicket);
router.route('/:id').put(protect, updateTicket).delete(protect, deleteTicket);
router.post('/upload', protect, upload.single('file'), uploadAttachment);
router.route('/:id/comments').post(protect, addComment).get(protect, getComments);

module.exports = router;
