import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TicketCard = ({ ticket, onClick, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: ticket._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'bg-red-50 text-red-700 border-red-100';
            case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'Low': return 'bg-green-50 text-green-700 border-green-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`
                bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-indigo-200 transition-all duration-200 group
                ${isDragging ? 'shadow-lg ring-2 ring-indigo-500 ring-opacity-50' : ''}
            `}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                    </span>
                    {/* Action Buttons for Ticket */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(ticket); }}
                            className="p-0.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                            title="Edit Ticket"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(ticket._id); }}
                            className="p-0.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                            title="Delete Ticket"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {ticket.assignee && (
                    <div className="flex items-center gap-1.5" title={ticket.assignee.username}>
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold border border-white shadow-sm">
                            {ticket.assignee.profileImage ? (
                                <img src={ticket.assignee.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (ticket.assignee?.username?.charAt(0) || '?').toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-500 font-medium truncate max-w-[80px]">
                            {ticket.assignee.username}
                        </span>
                    </div>
                )}
            </div>

            <h4 className="text-sm font-medium text-gray-900 mb-1 leading-snug group-hover:text-indigo-600 transition-colors">
                {ticket.title}
            </h4>

            {ticket.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {ticket.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400">
                    {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>

                {ticket.attachments && ticket.attachments.length > 0 && (
                    <div className="flex items-center text-xs text-gray-400 gap-1" title={`${ticket.attachments.length} attachments`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>{ticket.attachments.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketCard;
