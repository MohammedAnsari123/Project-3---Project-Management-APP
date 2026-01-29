const ROLES = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    DEVELOPER: 'Developer',
    VIEWER: 'Viewer'
};

const PERMISSIONS = {
    MANAGE_PROJECT: 'manage_project', // Delete, Update Project Settings
    MANAGE_MEMBERS: 'manage_members', // Add/Remove members
    MANAGE_TICKETS: 'manage_tickets', // Create/Delete tickets
    UPDATE_TICKETS: 'update_tickets', // Move columns, edit details
    COMMENT: 'comment',
    READ: 'read'
};

const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        PERMISSIONS.MANAGE_PROJECT,
        PERMISSIONS.MANAGE_MEMBERS,
        PERMISSIONS.MANAGE_TICKETS,
        PERMISSIONS.UPDATE_TICKETS,
        PERMISSIONS.COMMENT,
        PERMISSIONS.READ
    ],
    [ROLES.MANAGER]: [
        PERMISSIONS.MANAGE_MEMBERS,
        PERMISSIONS.MANAGE_TICKETS,
        PERMISSIONS.UPDATE_TICKETS,
        PERMISSIONS.COMMENT,
        PERMISSIONS.READ
    ],
    [ROLES.DEVELOPER]: [
        PERMISSIONS.UPDATE_TICKETS,
        PERMISSIONS.COMMENT,
        PERMISSIONS.READ
    ],
    [ROLES.VIEWER]: [
        PERMISSIONS.READ
    ]
};

module.exports = { ROLES, PERMISSIONS, ROLE_PERMISSIONS };
