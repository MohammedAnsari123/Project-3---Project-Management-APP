import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const ProjectPages = ({ project }) => {
    const { user } = useContext(AuthContext);
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchPages();
    }, [project._id]);

    const fetchPages = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/pages/project/${project._id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setPages(data);
            if (data.length > 0 && !selectedPage) {
                setSelectedPage(data[0]);
            }
        } catch (error) {
            console.error("Error fetching pages:", error);
        }
    };

    const handleCreatePage = () => {
        setSelectedPage(null);
        setTitle('');
        setContent('');
        setIsEditing(true);
    };

    const handleSavePage = async () => {
        try {
            if (selectedPage && selectedPage._id) {
                // Update
                const { data } = await axios.put(`http://localhost:5000/api/pages/${selectedPage._id}`, { title, content }, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPages(prev => prev.map(p => p._id === data._id ? data : p));
                setSelectedPage(data);
            } else {
                // Create
                const { data } = await axios.post(`http://localhost:5000/api/pages`, {
                    title,
                    content,
                    projectId: project._id
                }, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPages(prev => [data, ...prev]);
                setSelectedPage(data);
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving page:", error);
        }
    };

    const handleDeletePage = async (pageId) => {
        if (!window.confirm("Are you sure you want to delete this page?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/pages/${pageId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setPages(prev => prev.filter(p => p._id !== pageId));
            if (selectedPage && selectedPage._id === pageId) {
                setSelectedPage(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error deleting page:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden h-full flex min-h-[500px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4 px-2">
                    <h3 className="font-semibold text-gray-700">Pages</h3>
                    <button
                        onClick={handleCreatePage}
                        className="text-blue-600 hover:text-blue-800"
                        title="Create New Page"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-1 overflow-y-auto flex-1">
                    {pages.map(page => (
                        <div
                            key={page._id}
                            onClick={() => {
                                setSelectedPage(page);
                                setIsEditing(false);
                            }}
                            className={`px-3 py-2 rounded-md text-sm cursor-pointer flex justify-between items-center group ${selectedPage && selectedPage._id === page._id
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <span className="truncate">{page.title}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePage(page._id);
                                }}
                                className="text-gray-400 hover:text-red-500 hidden group-hover:block"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {pages.length === 0 && (
                        <div className="text-xs text-gray-400 text-center py-4">No pages yet</div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {isEditing ? (
                    <div className="max-w-3xl mx-auto space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Page Title"
                            className="w-full text-3xl font-bold border-b border-gray-300 focus:border-blue-500 outline-none pb-2 placeholder-gray-300"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your content here..."
                            className="w-full h-[400px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePage}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save Page
                            </button>
                        </div>
                    </div>
                ) : selectedPage ? (
                    <div className="max-w-3xl mx-auto group">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{selectedPage.title}</h1>
                            <button
                                onClick={() => {
                                    setTitle(selectedPage.title);
                                    setContent(selectedPage.content);
                                    setIsEditing(true);
                                }}
                                className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                        <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                            {selectedPage.content}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>Select a page or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectPages;
