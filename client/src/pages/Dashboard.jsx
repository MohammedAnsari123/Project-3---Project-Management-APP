import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { projects, createProject, updateProject, deleteProject } = useProjects();
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [projectForm, setProjectForm] = useState({ title: '', description: '' });

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && currentProject) {
                // Update Project
                await updateProject(currentProject._id, projectForm);
            } else {
                // Create Project
                await createProject(projectForm);
            }
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProject = async (projectId, e) => {
        e.preventDefault(); // Prevent link navigation
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await deleteProject(projectId);
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setProjectForm({ title: '', description: '' });
        setShowModal(true);
    };

    const openEditModal = (project, e) => {
        e.preventDefault(); // Prevent link navigation
        setIsEditing(true);
        setCurrentProject(project);
        setProjectForm({ title: project.title, description: project.description });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        sessionStorage.removeItem('editProject'); // Cleanup just in case
        setIsEditing(false);
        setCurrentProject(null);
        setProjectForm({ title: '', description: '' });
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium text-slate-900">Your Projects</h2>
                    <p className="mt-1 text-sm text-slate-500">Manage your projects and track issues.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Link
                        key={project._id}
                        to={`/projects/${project._id}`}
                        className="card group hover:shadow-md transition-all duration-200 block relative"
                    >
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-2">
                                    {project.owner._id !== user._id ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            Shared
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    )}
                                    {/* Action Buttons */}
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => openEditModal(project, e)}
                                            className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                                            title="Edit Project"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteProject(project._id, e)}
                                            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                                            title="Delete Project"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {project.title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                                {project.description}
                            </p>
                        </div>
                        <div className="card-footer bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                            <span>Created by {project.owner.username}</span>
                            <span>{project.members.length + 1} Members</span>
                        </div>
                    </Link>
                ))}

                {/* Empty State / Create New Card */}
                {projects.length === 0 && (
                    <button
                        onClick={openCreateModal}
                        className="relative block w-full border-2 border-slate-300 border-dashed rounded-lg p-12 text-center hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg
                            className="mx-auto h-12 w-12 text-slate-400"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                            />
                        </svg>
                        <span className="mt-2 block text-sm font-medium text-slate-900">Create a new project</span>
                    </button>
                )}
            </div>

            {/* Create/Edit Project Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background Overlay */}
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                            onClick={closeModal}
                        >
                            {/* Blueish-gray overlay to match theme */}
                            <div className="absolute inset-0 bg-slate-500 opacity-75 backdrop-blur-sm"></div>
                        </div>

                        {/* Modal Panel */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-10">
                            <form onSubmit={handleCreateProject}>
                                <div className="card-header bg-white">
                                    <h3 className="text-lg leading-6 font-medium text-slate-900">
                                        {isEditing ? 'Edit Project' : 'Create New Project'}
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="title" className="label">Project Title</label>
                                            <input
                                                type="text"
                                                id="title"
                                                className="input"
                                                placeholder="e.g. Website Redesign"
                                                value={projectForm.title}
                                                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="description" className="label">Description</label>
                                            <textarea
                                                id="description"
                                                rows={3}
                                                className="input"
                                                placeholder="Brief description of the project..."
                                                value={projectForm.description}
                                                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-slate-50 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        {isEditing ? 'Update Project' : 'Create Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
