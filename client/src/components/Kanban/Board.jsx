import React, { useState, useEffect, useContext } from 'react';
import { DndContext, closestCorners, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import Column from './Column';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import io from 'socket.io-client';

const Board = ({ project, tickets, setTickets, onTicketClick }) => {
    const [columns, setColumns] = useState(['To Do', 'In Progress', 'Done']);
    const { user } = useContext(AuthContext);
    const [activeId, setActiveId] = useState(null);



    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id; // Could be a container (status) or another item

        const activeTicket = tickets.find(t => t._id === activeId);
        let newStatus = activeTicket.status;

        if (columns.includes(overId)) {
            newStatus = overId;
        } else {
            const overTicket = tickets.find(t => t._id === overId);
            if (overTicket) {
                newStatus = overTicket.status;
            }
        }

        if (activeTicket.status !== newStatus) {
            // Optimistic update
            setTickets(prev => prev.map(t => t._id === activeId ? { ...t, status: newStatus } : t));

            try {
                await axios.put(`/api/tickets/${activeId}`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
            } catch (error) {
                console.error('Update failed', error);
                // Ideally trigger a refresh from parent or revert state manually
            }
        }
    };

    const handleEditTicket = (ticket) => {
        onTicketClick(ticket); // Re-use the existing click handler which opens the modal
    };

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) return;
        try {
            await axios.delete(`/api/tickets/${ticketId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Socket usually handles the update, but we can do optimistic update too
            setTickets(prev => prev.filter(t => t._id !== ticketId));
        } catch (error) {
            console.error('Failed to delete ticket', error);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 p-4 h-full overflow-x-auto snap-x snap-mandatory md:snap-none">
                {columns.map((col) => (
                    <div key={col} className="snap-center shrink-0">
                        <Column
                            id={col}
                            title={col}
                            tickets={tickets.filter(t => t.status === col)}
                            onTicketClick={onTicketClick}
                            onEdit={handleEditTicket}
                            onDelete={handleDeleteTicket}
                        />
                    </div>
                ))}
            </div>
            <DragOverlay>
                {activeId ? (
                    <div className="p-4 bg-white shadow-lg rounded-lg border border-blue-500 w-72">
                        Dragging...
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default Board;
