import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ProjectSummary = ({ project, tickets = [] }) => {
    // Calculate Stats
    const totalTickets = tickets.length;
    const todoTickets = tickets.filter(t => t.status === 'To Do').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const doneTickets = tickets.filter(t => t.status === 'Done').length;

    // Recent Activity
    const recentActivity = [...tickets]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

    // Chart Data
    const statusData = [
        { name: 'To Do', value: todoTickets, color: '#9CA3AF' },
        { name: 'In Progress', value: inProgressTickets, color: '#3B82F6' },
        { name: 'Done', value: doneTickets, color: '#10B981' },
    ];

    const priorityData = [
        { name: 'Low', count: tickets.filter(t => t.priority === 'Low').length },
        { name: 'Medium', count: tickets.filter(t => t.priority === 'Medium').length },
        { name: 'High', count: tickets.filter(t => t.priority === 'High').length },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <h2 className="text-xl font-bold text-gray-900">Project Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stats Cards */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Tickets</h3>
                    <div className="mt-2 flex items-baseline">
                        <p className="text-3xl font-bold text-gray-900">{totalTickets}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">In Progress</h3>
                    <div className="mt-2 flex items-baseline">
                        <p className="text-3xl font-bold text-blue-600">{inProgressTickets}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completed</h3>
                    <div className="mt-2 flex items-baseline">
                        <p className="text-3xl font-bold text-green-600">{doneTickets}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Team Size</h3>
                    <div className="mt-2 flex items-baseline">
                        <p className="text-3xl font-bold text-gray-900">{project.members.length + 1}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Updates */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Updates</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {recentActivity.length > 0 ? (
                            recentActivity.map(ticket => (
                                <div key={ticket._id} className="flex items-start pb-3 border-b border-gray-100 last:border-0">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {ticket.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${ticket.status === 'Done' ? 'bg-green-100 text-green-800' :
                                            ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Priority Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Priority Breakdown</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8">
                                {priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={
                                        entry.name === 'High' ? '#EF4444' :
                                            entry.name === 'Medium' ? '#F59E0B' :
                                                '#10B981'
                                    } />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProjectSummary;
