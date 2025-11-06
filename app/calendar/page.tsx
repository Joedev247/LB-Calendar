"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";
import { useApp } from "../../lib/context";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Tag,
  CheckSquare,
} from "lucide-react";
import EventModal from "../components/EventModal";

export default function CalendarPage() {
  const { events, tasks } = useApp();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Get upcoming events for the next 7 days
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start_date);
      const today = new Date();
      return eventDate >= today && eventDate <= addDays(today, 7);
    })
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

  // Format date for display
  const formatEventDate = (date: string) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) return "Today";
    if (isTomorrow(eventDate)) return "Tomorrow";
    return format(eventDate, "EEE, MMM d");
  };

  // Get tasks due today
  const todayTasks = tasks.filter((task) => {
    if (!task.due_date) return false;
    return isToday(new Date(task.due_date));
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#00bf63] to-[#008c47] overflow-hidden animate-page-fade-in">
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
              <h1 className="text-2xl font-bold text-[#2D2D2D]">Calendar</h1>
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#00bf63] rounded-lg text-white text-sm font-medium hover:bg-[#008c47] transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Event
              </button>
            </div>

            <div className="flex rounded-lg gap-7">
              {/* Left Section with Calendar and Additional Content */}
              <div className="w-[50%] space-y-6">
                {/* Calendar Section */}
                <div className="bg-white border border-[#E9E5F0] shadow-sm p-6 rounded-lg">
                  <Calendar />
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-[60%] space-y-6">
                {/* Quick Add Event */}
                <div className="bg-white border border-[#E9E5F0] shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#2D2D2D]">
                      Quick Add
                    </h3>
                    <button
                      onClick={() => setIsEventModalOpen(true)}
                      className="p-1.5 hover:bg-gray-50 transition-colors text-[#00bf63]"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>Click the + button to quickly add:</p>
                    <div className="flex items-center gap-2 text-[#00bf63]">
                      <CalendarIcon className="w-4 h-4" /> Events
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white border border-[#E9E5F0] shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4">
                    Upcoming Events
                  </h3>
                  <div className="space-y-3">
                    {upcomingEvents.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No upcoming events
                      </p>
                    ) : (
                      upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start gap-3 p-2 hover:bg-gray-50 transition-colors rounded-sm"
                        >
                          <Clock className="w-4 h-4 text-[#00bf63] mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatEventDate(event.start_date)}
                              {event.project_name && ` • ${event.project_name}`}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Today's Tasks */}
                <div className="bg-white border border-[#E9E5F0] shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4">
                    Today's Tasks
                  </h3>
                  <div className="space-y-2">
                    {todayTasks.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No tasks due today
                      </p>
                    ) : (
                      todayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-2 hover:bg-gray-50 transition-colors rounded-sm"
                        >
                          <CheckSquare className="w-4 h-4 text-[#00bf63] mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {task.title}
                            </p>
                            {task.project_name && (
                              <p className="text-xs text-gray-500">
                                {task.project_name}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  );
}
