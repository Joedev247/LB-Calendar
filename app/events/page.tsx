'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EventModal from '../components/EventModal';
import { useApp } from '../../lib/context';

export default function EventsPage() {
  const { events, loadEvents, deleteEvent } = useApp();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    loadEvents();
  }, []); // Remove loadEvents from dependencies to prevent infinite loop

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'today':
        return isToday(eventDate);
      case 'upcoming':
        return eventDate >= today;
      case 'past':
        return eventDate < today;
      default:
        return true;
    }
  });

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const formatEventDate = (date: string) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) return 'Today';
    if (isTomorrow(eventDate)) return 'Tomorrow';
    if (isYesterday(eventDate)) return 'Yesterday';
    return format(eventDate, 'MMM d, yyyy');
  };

  const formatEventTime = (date: string) => {
    return format(new Date(date), 'h:mm a');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#5f4b8b] to-[#4a3a6e] overflow-hidden">
      {/* Main Container */}
      <div className="flex w-full max-h-screen">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col rounded-tl-4xl rounded-bl-4xl bg-white overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
          {/* Header Component */}
          <Header />

          {/* Content Container */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#2D2D2D]">Events</h1>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsEventModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#5D4C8E] text-white rounded-lg hover:bg-[#4a3a6e] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-6">
              {[
                { key: 'all', label: 'All Events' },
                { key: 'today', label: 'Today' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'past', label: 'Past' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === tab.key
                      ? 'bg-[#5D4C8E] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No events found</p>
                  <p className="text-sm">Create your first event to get started</p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white border border-[#E9E5F0] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          {event.project_name && (
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: event.project_color || '#5D4C8E' }}
                            >
                              {event.project_name}
                            </span>
                          )}
                        </div>
                        
                        {event.description && (
                          <p className="text-gray-600 mb-3">{event.description}</p>
                        )}

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatEventDate(event.start_date)}</span>
                          </div>
                          
                          {!event.all_day && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatEventTime(event.start_date)} - {formatEventTime(event.end_date)}
                              </span>
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-gray-400 hover:text-[#5D4C8E] hover:bg-gray-100  transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50  transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
      />
    </div>
  );
}
