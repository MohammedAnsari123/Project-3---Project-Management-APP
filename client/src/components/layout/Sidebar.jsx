import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';

const Sidebar = ({ closeSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const { projects } = useProjects();
    const location = useLocation();

    // Derived state from context
    const ownedProjects = projects.filter(p => p.owner._id === user?._id);
    const sharedProjects = projects.filter(p => p.owner._id !== user?._id);

    const [isMyProjectsOpen, setIsMyProjectsOpen] = useState(true);
    const [isSharedProjectsOpen, setIsSharedProjectsOpen] = useState(true);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            path: '/', label: 'Overview', icon: (
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
    ];

    const handleLinkClick = () => {
        if (closeSidebar) closeSidebar();
    }

    const [imageError, setImageError] = useState(false);

    // Reset image error state when user changes
    useEffect(() => {
        setImageError(false);
    }, [user?.profileImage]);

    return (
        <aside className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2 text-indigo-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-xl font-bold tracking-tight">BugTracker</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                    Main Menu
                </div>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={`sidebar-nav-item ${isActive(item.path) ? 'active' : 'inactive'}`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}

                {/* My Projects Section */}
                {ownedProjects.length > 0 && (
                    <div className="mt-6">
                        <button
                            onClick={() => setIsMyProjectsOpen(!isMyProjectsOpen)}
                            className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 hover:text-gray-600 focus:outline-none"
                        >
                            <span>My Projects</span>
                            <svg className={`w-3 h-3 transition-transform ${isMyProjectsOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isMyProjectsOpen && (
                            <div className="space-y-1 transition-all">
                                {ownedProjects.map((project) => (
                                    <Link
                                        key={project._id}
                                        to={`/projects/${project._id}`}
                                        onClick={handleLinkClick}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(`/projects/${project._id}`)
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full mr-3 ${isActive(`/projects/${project._id}`) ? 'bg-blue-500' : 'bg-gray-400 group-hover:bg-gray-500'
                                            }`}></div>
                                        <span className="truncate">{project.title}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Shared Projects Section */}
                {sharedProjects.length > 0 && (
                    <div className="mt-6">
                        <button
                            onClick={() => setIsSharedProjectsOpen(!isSharedProjectsOpen)}
                            className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 hover:text-gray-600 focus:outline-none"
                        >
                            <span>Shared with Me</span>
                            <svg className={`w-3 h-3 transition-transform ${isSharedProjectsOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isSharedProjectsOpen && (
                            <div className="space-y-1 transition-all">
                                {sharedProjects.map((project) => (
                                    <Link
                                        key={project._id}
                                        to={`/projects/${project._id}`}
                                        onClick={handleLinkClick}
                                        className={`group flex flex-col px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(`/projects/${project._id}`)
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-3 ${isActive(`/projects/${project._id}`) ? 'bg-blue-500' : 'bg-gray-400 group-hover:bg-gray-500'
                                                }`}></div>
                                            <span className="truncate">{project.title}</span>
                                        </div>
                                        <span className="ml-5 text-xs text-gray-400 truncate">
                                            by {project.owner.username}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* User Profile / Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                    {user?.profileImage && !imageError ? (
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            referrerPolicy="no-referrer"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
