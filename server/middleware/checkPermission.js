const Project = require('../models/Project');
const { ROLE_PERMISSIONS } = require('../config/permissions');

const checkPermission = (requiredPermission) => async (req, res, next) => {
    try {
        const projectId = req.params.id || req.params.projectId || req.body.projectId || req.query.projectId;

        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required for permission check' });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Owner has super admin rights
        if (project.owner.equals(req.user._id)) {
            req.projectRole = 'Owner';
            return next();
        }

        const member = project.members.find(m => m.user.equals(req.user._id));

        if (!member) {
            return res.status(403).json({ message: 'Access denied: Not a member of this project' });
        }

        const userPermissions = ROLE_PERMISSIONS[member.role] || [];

        if (userPermissions.includes(requiredPermission)) {
            req.projectRole = member.role;
            next();
        } else {
            res.status(403).json({ message: `Access denied: Requires ${requiredPermission} permission` });
        }
    } catch (error) {
        console.error('Permission check error:', error);
        res.status(500).json({ message: 'Server error during permission check' });
    }
};

module.exports = checkPermission;
