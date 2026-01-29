const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    addMember,
    deleteProject,
    updateMemberRole,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProjects).post(protect, createProject);
router.route('/:id').get(protect, getProjectById).delete(protect, deleteProject);
router.route('/:id/members').put(protect, addMember);
router.route('/:id/members/:userId').put(protect, updateMemberRole);

module.exports = router;
