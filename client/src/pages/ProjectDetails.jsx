import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Board from '../components/Kanban/Board';
import TicketModal from '../components/Ticket/TicketModal';
import InviteMemberModal from '../components/Project/InviteMemberModal';
import UpdateRoleModal from '../components/Project/UpdateRoleModal';
import ProjectSummary from '../components/Project/ProjectSummary';
import TicketList from '../components/Project/TicketList';
import ProjectTimeline from '../components/Project/ProjectTimeline';
import ProjectPages from '../components/Project/ProjectPages';
import io from 'socket.io-client';
import { API_URL } from '../config';

const ProjectDetails = () => {
    const { id, tab } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [project, setProject] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [socket, setSocket] = useState(null);

    // Sync activeTab with URL param
    const activeTab = tab || 'board';

    const handleTabChange = (newTab) => {
        navigate(`/projects/${id}/${newTab}`);
    };

    // ... useEffects for fetching data ...

    useEffect(() => {
        fetchProject();
        fetchTickets();

        // Socket setup
        const newSocket = io(API_URL);
        setSocket(newSocket);
        newSocket.emit('joinProject', id);

        return () => newSocket.close();
    }, [id]);

    // Socket Listeners for Real-time Updates
    useEffect(() => {
        if (!socket) return;

        socket.on('ticketCreated', (ticket) => {
            setTickets(prev => {
                if (prev.some(t => t._id === ticket._id)) return prev;
                return [...prev, ticket];
            });
        });

        socket.on('ticketUpdated', (updatedTicket) => {
            setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
        });

        socket.on('ticketDeleted', (ticketId) => {
            setTickets(prev => prev.filter(t => t._id !== ticketId));
        });

        return () => {
            socket.off('ticketCreated');
            socket.off('ticketUpdated');
            socket.off('ticketDeleted');
        };
    }, [socket]);

    const fetchProject = async () => {
        try {
            const { data } = await axios.get(`/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProject(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTickets = async () => {
        try {
            const { data } = await axios.get(`/api/tickets?projectId=${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setTickets(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditRole = (member) => {
        setSelectedMember(member);
        setShowUpdateRoleModal(true);
    };

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
        setShowModal(true);
    };

    const tabs = [
        { id: 'summary', label: 'Summary' },
        { id: 'list', label: 'List' },
        { id: 'board', label: 'Board' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'pages', label: 'Pages' },
    ];

    if (!project) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Header Section */}
            <div className="bg-white border border-gray-200 rounded-lg pt-6 px-6 pb-0 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setShowMembers(!showMembers)}
                                className="btn btn-secondary text-xs"
                            >
                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Team ({(project.members?.length || 0) + 1})
                            </button>
                            {showMembers && (
                                <div className="absolute top-10 right-0 w-80 bg-white border border-slate-200 rounded-md shadow-lg p-3 z-20">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Owner</div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600 font-bold">
                                            {project.owner.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-900">{project.owner.username}</span>
                                            <span className="text-xs text-slate-500">Admin (Owner)</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded mb-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Team Members</span>
                                        <button
                                            onClick={() => setShowInviteModal(true)}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                        >
                                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Invite
                                        </button>
                                    </div>
                                    {project.members?.length > 0 ? (
                                        <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
                                            {project.members?.map((m) => (
                                                <div key={m.user._id} className="flex items-center justify-between p-1 hover:bg-slate-50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-600 font-bold">
                                                            {(m.user.username?.charAt(0) || '?').toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-slate-700">{m.user.username}</span>
                                                            <span className="text-xs text-slate-500">{m.role}</span>
                                                        </div>
                                                    </div>

                                                    {/* Edit Role Button - Owner Only - STRICT CHECK */}
                                                    {(() => {
                                                        const ownerId = project.owner._id || project.owner;
                                                        const userId = user._id;
                                                        const isOwner = ownerId.toString() === userId.toString();
                                                        return isOwner;
                                                    })() && (
                                                            <button
                                                                onClick={() => handleEditRole(m)}
                                                                className="text-slate-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 ml-2"
                                                                title="Edit Role"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-xs text-slate-400 py-2">No other members yet</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setSelectedTicket(null);
                                setShowModal(true);
                            }}
                            className="btn btn-primary"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Ticket
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-6 border-b border-gray-200 mt-2">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => handleTabChange(t.id)}
                            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors duration-150 ${activeTab === t.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 relative">
                {activeTab === 'summary' && <ProjectSummary project={project} tickets={tickets} />}
                {activeTab === 'list' && <TicketList project={project} tickets={tickets} onTicketClick={handleTicketClick} />}
                {activeTab === 'board' && <Board project={project} tickets={tickets} setTickets={setTickets} onTicketClick={handleTicketClick} />}
                {activeTab === 'timeline' && <ProjectTimeline project={project} tickets={tickets} onTicketClick={handleTicketClick} />}
                {activeTab === 'pages' && <ProjectPages project={project} />}
            </div>

            {/* Create/Edit Ticket Modal */}
            {showModal && (
                <TicketModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    project={project}
                    ticket={selectedTicket}
                    onTicketUpdated={(updatedTicket) => {
                        setShowModal(false);
                        // Manual Optimistic/Immediate Update to avoid refresh
                        setTickets(prev => {
                            const exists = prev.some(t => t._id === updatedTicket._id);
                            if (exists) {
                                return prev.map(t => t._id === updatedTicket._id ? updatedTicket : t);
                            } else {
                                return [...prev, updatedTicket];
                            }
                        });
                    }}
                />
            )}

            {showUpdateRoleModal && (
                <UpdateRoleModal
                    isOpen={showUpdateRoleModal}
                    onClose={() => {
                        setShowUpdateRoleModal(false);
                        setSelectedMember(null);
                    }}
                    project={project}
                    member={selectedMember}
                    onRoleUpdated={(updatedProject) => setProject(updatedProject)}
                />
            )}

            {showInviteModal && (
                <InviteMemberModal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    project={project}
                    onMemberAdded={(updatedProject) => setProject(updatedProject)}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
