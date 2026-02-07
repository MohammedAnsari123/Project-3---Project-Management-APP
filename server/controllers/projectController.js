const Project = require('../models/Project');
const User = require('../models/User');
const { sendInvitationEmail, sendAddedNotification } = require('../utils/emailService');

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {

        const projects = await Project.find({
            $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
        })
            .populate('owner', 'username email')
            .populate('members.user', 'username email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'username email')
            .populate('members.user', 'username email');

        if (project) {
            // Check if user is member or owner
            const isMember =
                project.owner.equals(req.user._id) ||
                project.members.some((member) => member.user._id.equals(req.user._id));

            if (isMember) {
                res.json(project);
            } else {
                res.status(401).json({ message: 'Not authorized to view this project' });
            }
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    const { title, description } = req.body;

    try {
        const project = new Project({
            title,
            description,
            owner: req.user._id,
            members: [],
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private
const addMember = async (req, res) => {
    const { email, role } = req.body;

    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to add members' });
            }

            const userToAdd = await User.findOne({ email });

            if (!userToAdd) {
                // User does not exist - Send Invitation Email
                const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/register?email=${email}`;
                const emailSent = await sendInvitationEmail(email, project.title, inviteLink);

                if (emailSent) {
                    return res.json({ message: `User not found. Invitation sent to ${email}` });
                } else {
                    return res.status(500).json({ message: 'User not found and failed to send invitation email.' });
                }
            }

            // Check if user is already a member
            if (project.members.some(member => member.user.toString() === userToAdd._id.toString())) {
                return res.status(400).json({ message: 'User already in project' });
            }

            // Add user with role
            project.members.push({
                user: userToAdd._id,
                role: role || 'Member'
            });

            const updatedProject = await project.save();

            // Notify existing user
            await sendAddedNotification(email, project.title);

            const projectWithMembers = await Project.findById(updatedProject._id)
                .populate('owner', 'username email')
                .populate('members.user', 'username email');

            res.json(projectWithMembers);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.owner.toString() !== req.user._id.toString()) {
                return res
                    .status(401)
                    .json({ message: 'Not authorized to delete' });
            }

            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update member role
// @route   PUT /api/projects/:id/members/:userId
// @access  Private
const updateMemberRole = async (req, res) => {
    const { role } = req.body;
    const { id, userId } = req.params;

    try {
        const project = await Project.findById(id);

        if (project) {
            // Only Owner or Admin can update roles
            // We can rely on middleware or check here. 
            // For now, strict check: Owner only unless we expand logic
            if (project.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update roles' });
            }

            const memberIndex = project.members.findIndex(
                (m) => m.user.toString() === userId
            );

            if (memberIndex === -1) {
                return res.status(404).json({ message: 'Member not found in project' });
            }

            project.members[memberIndex].role = role;

            const updatedProject = await project.save();

            const projectWithMembers = await Project.findById(updatedProject._id)
                .populate('owner', 'username email')
                .populate('members.user', 'username email');

            res.json(projectWithMembers);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    addMember,
    updateMemberRole,
    deleteProject,
};
