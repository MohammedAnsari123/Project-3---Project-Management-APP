import React, { useMemo } from 'react';
import { format, differenceInDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const ProjectTimeline = ({ project, tickets = [], onTicketClick }) => {
    // Filter tickets that have at least a due date or start date (mocking start date if missing)
    const timelineTickets = useMemo(() => {
        return tickets.filter(t => t.dueDate || t.createdAt).map(t => ({
            ...t,
            start: t.startDate ? new Date(t.startDate) : new Date(t.createdAt),
            end: t.dueDate ? new Date(t.dueDate) : addDays(new Date(t.createdAt), 3), // Default duration if no due date
        }));
    }, [tickets]);

    // Calculate Grid Range (Next 30 days or based on tickets)
    const today = new Date();
    const startDate = startOfWeek(today);
    const endDate = addDays(startDate, 14); // Show 2 weeks window

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Timeline (Gantt)</h2>
                <div className="text-xs text-gray-500">2 Weeks Window</div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto">
                <div className="min-w-[800px]">
                    {/* Header Row */}
                    <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
                        <div className="w-48 p-2 border-r border-gray-200 font-semibold text-xs text-gray-500 bg-gray-50 sticky left-0 z-20">Task</div>
                        <div className="flex-1 flex">
                            {days.map(day => (
                                <div key={day.toISOString()} className={`flex-1 min-w-[40px] p-2 text-center text-xs border-r border-gray-100 ${isSameDay(day, today) ? 'bg-blue-50 text-blue-600 font-bold' : ''}`}>
                                    <div>{format(day, 'EEE')}</div>
                                    <div>{format(day, 'd')}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ticket Rows */}
                    <div className="divide-y divide-gray-100">
                        {timelineTickets.map(ticket => {
                            // Calculate positioning
                            const totalDays = differenceInDays(endDate, startDate) + 1;
                            const startOffset = differenceInDays(ticket.start, startDate);
                            const duration = differenceInDays(ticket.end, ticket.start) + 1;

                            // Bounds Check for visualization
                            let leftPercent = (startOffset / totalDays) * 100;
                            let widthPercent = (duration / totalDays) * 100;

                            // Clip if outside window
                            if (startOffset < 0) {
                                widthPercent += leftPercent;
                                leftPercent = 0;
                            }

                            if (leftPercent < 0) leftPercent = 0;
                            if (leftPercent + widthPercent > 100) widthPercent = 100 - leftPercent;

                            const isVisible = (startOffset + duration > 0) && (startOffset < totalDays);

                            return (
                                <div key={ticket._id} className="flex hover:bg-gray-50 transition-colors h-12 group cursor-pointer" onClick={() => onTicketClick && onTicketClick(ticket)}>
                                    <div className="w-48 p-2 border-r border-gray-200 flex items-center sticky left-0 bg-white hover:bg-gray-50 z-10">
                                        <div className="truncate text-sm font-medium text-gray-700" title={ticket.title}>{ticket.title}</div>
                                    </div>
                                    <div className="flex-1 relative p-1">
                                        <div className="absolute inset-0 flex">
                                            {days.map(day => (
                                                <div key={day.toISOString()} className="flex-1 border-r border-gray-50 h-full"></div>
                                            ))}
                                        </div>

                                        {isVisible && widthPercent > 0 && (
                                            <div
                                                className={`absolute top-2 h-8 rounded shadow-sm text-xs text-white flex items-center px-2 truncate ${ticket.status === 'Done' ? 'bg-green-500' :
                                                    ticket.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'
                                                    }`}
                                                style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                                            >
                                                {widthPercent > 10 && ticket.assignee ? (
                                                    <img
                                                        src={ticket.assignee.profileImage || `https://ui-avatars.com/api/?name=${ticket.assignee.username}`}
                                                        className="w-5 h-5 rounded-full mr-1 flex-shrink-0"
                                                        alt=""
                                                    />
                                                ) : null}
                                                <span className="truncate">{ticket.title}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {timelineTickets.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No tickets to display within this range.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectTimeline;
