import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch projects when user is authenticated
    useEffect(() => {
        if (user) {
            fetchProjects();
        } else {
            setProjects([]);
        }
    }, [user]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://project-3-project-management-app.onrender.com/api/projects', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProjects(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError(err.response?.data?.message || 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (projectData) => {
        try {
            const { data } = await axios.post('https://project-3-project-management-app.onrender.com/api/projects', projectData, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProjects((prev) => [...prev, data]);
            return { success: true, data };
        } catch (err) {
            console.error("Error creating project:", err);
            return { success: false, error: err.response?.data?.message || 'Failed to create project' };
        }
    };

    const updateProject = async (id, projectData) => {
        try {
            const { data } = await axios.put(`https://project-3-project-management-app.onrender.com/api/projects/${id}`, projectData, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProjects((prev) => prev.map((p) => (p._id === id ? data : p)));
            return { success: true, data };
        } catch (err) {
            console.error("Error updating project:", err);
            return { success: false, error: err.response?.data?.message || 'Failed to update project' };
        }
    };

    const deleteProject = async (id) => {
        try {
            await axios.delete(`https://project-3-project-management-app.onrender.com/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProjects((prev) => prev.filter((p) => p._id !== id));
            return { success: true };
        } catch (err) {
            console.error("Error deleting project:", err);
            return { success: false, error: err.response?.data?.message || 'Failed to delete project' };
        }
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            loading,
            error,
            fetchProjects,
            createProject,
            updateProject,
            deleteProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export default ProjectContext;
