import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TicketCard from './TicketCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const Column = ({ id, title, tickets, onTicketClick, onEdit, onDelete }) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col w-[85vw] md:w-80 h-full max-h-full bg-gray-100/50 rounded-xl border border-gray-200">
            {/* Column Header */}
            <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-xl backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${title === 'To Do' ? 'bg-slate-400' : title === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                    {title}
                </h3>
                <span className="bg-white text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-md border border-gray-200 shadow-sm">
                    {tickets.length}
                </span>
            </div>

            {/* Tickets Area */}
            <div
                ref={setNodeRef}
                className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar"
            >
                <SortableContext items={tickets.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {tickets.map((ticket) => (
                        <TicketCard
                            key={ticket._id}
                            ticket={ticket}
                            onClick={() => onTicketClick(ticket)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </SortableContext>

                {tickets.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 text-xs text-center p-4">
                        <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Drop tickets here
                    </div>
                )}
            </div>
        </div>
    );
};

export default Column;
