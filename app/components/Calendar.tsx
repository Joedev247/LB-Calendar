'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Sun, Moon, MoreVertical, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday as isDateToday, parseISO, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
import { useApp } from '../../lib/context';
import EventModal from './EventModal';

export default function Calendar() {
  const { events, loadEvents } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [eventPreview, setEventPreview] = useState<{ x: number; y: number; event: any } | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');

  useEffect(() => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    loadEvents({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    });
  }, [currentDate]); // Remove loadEvents from dependencies to prevent infinite loop

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfMonth(monthStart);
  const calendarEnd = endOfMonth(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_date);
      return isSameDay(eventDate, date);
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: any) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  return (
    <div className='max-w-[500px]'>
      <div className="flex flex-col gap-4 mb-6">
        {/* Header with Navigation and Actions */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-[20px] font-bold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <p className="text-sm text-gray-500">
                {view === 'month' ? `${events.length} events this month` : `${events.filter(event => {
                  const eventDate = new Date(event.start_date);
                  return isWithinInterval(eventDate, {
                    start: startOfWeek(currentDate),
                    end: endOfWeek(currentDate)
                  });
                }).length} events this week`}
              </p>
            </div>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setView('month')}
                className={`p-1.5 rounded-md transition-colors ${
                  view === 'month' ? 'bg-white shadow-sm text-[#5D4C8E]' : 'text-gray-500 hover:bg-gray-200'
                }`}
                title="Month View"
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('week')}
                className={`p-1.5 rounded-md transition-colors ${
                  view === 'week' ? 'bg-white shadow-sm text-[#5D4C8E]' : 'text-gray-500 hover:bg-gray-200'
                }`}
                title="Week View"
              >
                <Sun className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleDateClick(new Date())}
              className="p-2 bg-[#5D4C8E] text-white rounded-md hover:bg-[#4a3a6e] transition-colors flex items-center gap-2"
              title="Add Event"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-[11px] pl-7 pb-5 pt-5 font-semibold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isDateToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isHovered = hoveredDate && isSameDay(day, hoveredDate);

            return (
              <div 
                key={index} 
                className={`relative group transition-all duration-200 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } rounded-lg border border-transparent ${
                  isHovered ? 'border-[#5D4C8E]' : ''
                }`}
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <button
                  onClick={() => handleDateClick(day)}
                  className="w-full h-full min-h-[80px] p-2 relative"
                >
                  <div className={`
                    absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-medium
                    ${!isCurrentMonth ? 'text-gray-400' : ''}
                    ${isToday ? 'bg-gradient-to-br from-[#FFB76B] to-[#FFA043] text-white shadow-lg' : ''}
                    ${isSelected && !isToday ? 'bg-[#5D4C8E] text-white' : ''}
                    ${isCurrentMonth && !isToday && !isSelected ? 'text-gray-700' : ''}
                    transition-all duration-200
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Events List */}
                  <div className="mt-8 space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setEventPreview({
                            x: rect.left,
                            y: rect.top,
                            event
                          });
                        }}
                        onMouseLeave={() => setEventPreview(null)}
                        className="text-left px-2 py-1 text-[11px] rounded bg-opacity-20 cursor-pointer transition-all duration-200 truncate"
                        style={{ 
                          backgroundColor: `${event.project_color || '#5D4C8E'}20`,
                          color: event.project_color || '#5D4C8E',
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[11px] text-gray-500 px-2">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Event Preview Tooltip */}
        {eventPreview && (
          <div
            className="fixed bg-white p-4 rounded-lg shadow-xl border border-gray-200 z-50 w-64"
            style={{
              top: `${eventPreview.y - 120}px`,
              left: `${eventPreview.x}px`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: eventPreview.event.project_color || '#5D4C8E' }}
                />
                <span className="font-medium">{eventPreview.event.title}</span>
              </div>
              <button
                onClick={() => setEventPreview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-2">{eventPreview.event.description}</p>
            <div className="text-xs text-gray-400">
              {format(parseISO(eventPreview.event.start_date), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
          setSelectedDate(null);
        }}
        event={editingEvent}
        selectedDate={selectedDate || undefined}
      />
    </div>
  );
}


