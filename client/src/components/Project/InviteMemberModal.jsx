import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const InviteMemberModal = ({ isOpen, onClose, project, onMemberAdded }) => {
    const { user } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Member');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.put(
                `https://project-3-project-management-app.onrender.com/api/projects/${project._id}/members`,
                { email, role },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            if (data.members) {
                onMemberAdded(data);
                onClose();
            } else {
                alert(data.message || 'Invitation sent successfully!');
                onClose();
            }
            setEmail('');
            setRole('Member');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to invite member');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                    <div className="absolute inset-0 bg-slate-500 opacity-75 backdrop-blur-sm"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-10">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-slate-200">
                            <h3 className="text-lg leading-6 font-medium text-slate-900">
                                Invite Team Member
                            </h3>
                        </div>

                        <div className="px-4 py-5 sm:p-6 bg-slate-50 space-y-4">
                            {error && (
                                <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="label">Email Address</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="colleague@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Role</label>
                                <select
                                    className="input"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="Admin">Admin (Full Control)</option>
                                    <option value="Manager">Manager (Manage Scope)</option>
                                    <option value="Developer">Developer (Work on Tickets)</option>
                                    <option value="Viewer">Viewer (Read Only)</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                            >
                                {loading ? 'Inviting...' : 'Invite'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberModal;
