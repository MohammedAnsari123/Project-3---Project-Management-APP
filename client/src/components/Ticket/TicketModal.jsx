import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const TicketModal = ({ isOpen, onClose, project, ticket, onTicketUpdated }) => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'To Do',
        assigneeId: '',
        startDate: '',
        dueDate: '',
    });
    const [file, setFile] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'comments'

    useEffect(() => {
        if (ticket) {
            setFormData({
                title: ticket.title,
                description: ticket.description,
                priority: ticket.priority,
                status: ticket.status,
                assigneeId: ticket.assignee ? ticket.assignee._id : '',
                startDate: ticket.startDate,
                dueDate: ticket.dueDate,
            });
            fetchComments();
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                status: 'To Do',
                assigneeId: '',
                startDate: '',
                dueDate: '',
            });
            setComments([]);
        }
    }, [ticket]);

    const fetchComments = async () => {
        if (!ticket) return;
        try {
            const { data } = await axios.get(`https://project-3-project-management-app.onrender.com/api/tickets/${ticket._id}/comments`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setComments(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let uploadedFilePath = '';

            // Upload file if exists
            if (file) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                const uploadRes = await axios.post('https://project-3-project-management-app.onrender.com/api/tickets/upload', uploadData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });
                uploadedFilePath = uploadRes.data.path;
            }

            if (ticket) {
                // Update
                const updatedData = { ...formData };
                if (uploadedFilePath) {
                    updatedData.attachments = [...(ticket.attachments || []), uploadedFilePath];
                }

                const { data } = await axios.put(`https://project-3-project-management-app.onrender.com/api/tickets/${ticket._id}`, updatedData, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                onTicketUpdated(data);
            } else {
                // Create
                const newTicketData = {
                    ...formData,
                    projectId: project._id,
                    attachments: uploadedFilePath ? [uploadedFilePath] : []
                };

                const { data } = await axios.post(`https://project-3-project-management-app.onrender.com/api/tickets`, newTicketData, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                onTicketUpdated(data);
            }
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`https://project-3-project-management-app.onrender.com/api/tickets/${ticket._id}/comments`, { content: comment }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setComments([...comments, data]);
            setComment('');
        } catch (error) {
            console.error(error);
        }
    };

    // Determine permissions
    const currentMember = project?.members?.find(m => m.user._id === user._id || m.user === user._id);
    const isOwner = project?.owner?._id === user._id || project?.owner === user._id;
    // Everyone can edit EXCEPT 'Viewer'
    const canEdit = isOwner || (currentMember && currentMember.role !== 'Viewer');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                    <div className="absolute inset-0 bg-slate-500 opacity-75 backdrop-blur-sm"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full z-10">
                    {/* Modal Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                                {ticket ? (canEdit ? 'Edit Ticket' : 'Ticket Details') : 'Create New Ticket'}
                            </h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {ticket && (
                            <div className="mt-4 flex space-x-4 border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`pb-2 px-1 text-sm font-medium border-b-2 ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('comments')}
                                    className={`pb-2 px-1 text-sm font-medium border-b-2 ${activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Comments ({comments.length})
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Modal Body */}
                    <div className="px-4 py-5 sm:p-6 bg-slate-50">
                        {activeTab === 'details' ? (
                            <form id="ticketForm" onSubmit={handleSubmit} className="space-y-4">
                                {!canEdit && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-2">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-xs text-yellow-700">
                                                    You are in <strong>Viewer</strong> mode. You can view details and comments, but cannot interpret edits.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="label">Title</label>
                                    <input
                                        type="text"
                                        className="input disabled:bg-slate-100 disabled:text-slate-500"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        disabled={!canEdit}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Status</label>
                                        <select
                                            className="input disabled:bg-slate-100 disabled:text-slate-500"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            disabled={!canEdit}
                                        >
                                            <option>To Do</option>
                                            <option>In Progress</option>
                                            <option>Done</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Priority</label>
                                        <select
                                            className="input disabled:bg-slate-100 disabled:text-slate-500"
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            disabled={!canEdit}
                                        >
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Assignee</label>
                                    <select
                                        className="input disabled:bg-slate-100 disabled:text-slate-500"
                                        value={formData.assigneeId}
                                        onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                                        disabled={!canEdit}
                                    >
                                        <option value="">Unassigned</option>
                                        {project.members.map((member) => (
                                            <option key={member.user._id} value={member.user._id}>
                                                {member.user.username} ({member.role})
                                            </option>
                                        ))}
                                        <option value={project.owner._id}>{project.owner.username} (Owner)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Description</label>
                                    <textarea
                                        rows={4}
                                        className="input disabled:bg-slate-100 disabled:text-slate-500"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        disabled={!canEdit}
                                    />
                                </div>

                                <div>
                                    <label className="label">Start Date</label>
                                    <input
                                        type="date"
                                        className="input disabled:bg-slate-100 disabled:text-slate-500"
                                        value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        disabled={!canEdit}
                                    />
                                </div>
                                <div>
                                    <label className="label">Due Date</label>
                                    <input
                                        type="date"
                                        className="input disabled:bg-slate-100 disabled:text-slate-500"
                                        value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        disabled={!canEdit}
                                    />
                                </div>
                                <div>
                                    <label className="label">Attachments</label>

                                    {ticket && ticket.attachments && ticket.attachments.length > 0 && (
                                        <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {ticket.attachments.map((att, idx) => {
                                                const isImage = att.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                                const fileName = att.split('/').pop() || `Attachment ${idx + 1}`;
                                                return (
                                                    <div key={idx} className="relative group border border-slate-200 rounded-lg overflow-hidden bg-slate-100 p-1">
                                                        {isImage ? (
                                                            <a href={`https://project-3-project-management-app.onrender.com${att}`} target="_blank" rel="noopener noreferrer" className="block h-24 w-full relative">
                                                                <img
                                                                    src={`https://project-3-project-management-app.onrender.com${att}`}
                                                                    alt={fileName}
                                                                    className="w-full h-full object-cover rounded"
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                                                                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                </div>
                                                            </a>
                                                        ) : (
                                                            <a href={`https://project-3-project-management-app.onrender.com${att}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center h-24 p-2 text-center text-slate-600 hover:text-blue-600 hover:bg-slate-200 transition-colors rounded">
                                                                <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                <span className="text-xs truncate w-full" title={fileName}>{fileName}</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {canEdit && (
                                        <>
                                            <input
                                                type="file"
                                                className="input text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                            {file && <span className="text-xs text-green-600 ml-2">File selected</span>}
                                        </>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4 h-64 flex flex-col">
                                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                    {comments.map((c) => (
                                        <div key={c._id} className="flex gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {c.author.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-semibold text-slate-900">{c.author.username}</span>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-700">{c.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {comments.length === 0 && <div className="text-center text-slate-500 text-sm mt-10">No comments yet.</div>}
                                </div>
                                <div className="border-t pt-4">
                                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Write a comment..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            required
                                        />
                                        <button type="submit" className="btn btn-secondary px-4">
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    {activeTab === 'details' && (
                        <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
                            {canEdit && (
                                <button
                                    type="submit"
                                    form="ticketForm"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    {ticket ? 'Save Changes' : 'Create Ticket'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketModal;
