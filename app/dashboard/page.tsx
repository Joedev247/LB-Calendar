'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Calendar from '../components/Calendar';
import TaskList from '../components/TaskList';
import { useApp } from '../../lib/context';
import ProjectModal from '../components/ProjectModal';
import { Plus, Calendar as CalendarIcon, CheckSquare, Folder, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, projects, events, tasks, loadEvents, loadTasks, loadProjects } = useApp();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'tasks' | 'overview'>('overview');

  // Load all tasks for dashboard stats
  useEffect(() => {
    if (user) {
      loadTasks(); // Load all tasks without filters for dashboard stats
    }
  }, [user, loadTasks]); // Now that loadTasks is properly memoized, we can include it

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // Debug logging
  console.log('Dashboard - Total tasks:', tasks.length);
  console.log('Dashboard - Pending tasks:', pendingTasks.length);
  console.log('Dashboard - Completed tasks:', completedTasks.length);
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start_date);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start_date);
    const today = new Date();
    return eventDate > today;
  });

  const overdueTasks = tasks.filter(task => {
    if (task.completed || !task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    return dueDate < today;
  });

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
              <h1 className="text-2xl font-bold text-[#2D2D2D]">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-[#5D4C8E] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'calendar'
                      ? 'bg-[#5D4C8E] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'tasks'
                      ? 'bg-[#5D4C8E] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tasks
                </button>
              </div>
            </div>

            {activeTab === 'overview' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-[#B7AED6] to-[#8B7FB1] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Total Projects</h3>
                        <p className="text-3xl font-bold text-white">{projects.length}</p>
                        <p className="text-sm text-white/90 mt-2">Active projects</p>
                      </div>
                      <Folder className="w-8 h-8 text-white/80" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#5f4b8b] to-[#4a3a6e] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white/90 mb-2">Today's Events</h3>
                        <p className="text-3xl font-bold text-white">{todayEvents.length}</p>
                        <p className="text-sm text-white/80 mt-2">Scheduled today</p>
                      </div>
                      <CalendarIcon className="w-8 h-8 text-white/80" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#9985C7] to-[#7B68AD] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Pending Tasks</h3>
                        <p className="text-3xl font-bold text-white">{pendingTasks.length}</p>
                        <p className="text-sm text-white/90 mt-2">To be completed</p>
                      </div>
                      <CheckSquare className="w-8 h-8 text-white/80" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#FF6B6B] to-[#E55353] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Overdue Tasks</h3>
                        <p className="text-3xl font-bold text-white">{overdueTasks.length}</p>
                        <p className="text-sm text-white/90 mt-2">Need attention</p>
                      </div>
                      <AlertCircle className="w-8 h-8 text-white/80" />
                    </div>
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Completed Tasks</h3>
                        <p className="text-3xl font-bold text-white">{completedTasks.length}</p>
                        <p className="text-sm text-white/90 mt-2">Done this period</p>
                      </div>
                      <CheckSquare className="w-8 h-8 text-white/80" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Upcoming Events</h3>
                        <p className="text-3xl font-bold text-white">{upcomingEvents.length}</p>
                        <p className="text-sm text-white/90 mt-2">Future events</p>
                      </div>
                      <Clock className="w-8 h-8 text-white/80" />
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Calendar Widget */}
                  <div className="bg-white border border-[#E9E5F0] rounded-lg shadow-sm">
                    <div className="p-6 border-b border-[#E9E5F0]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#5D4C8E]">Calendar</h3>
                        <button
                          onClick={() => setActiveTab('calendar')}
                          className="text-sm text-[#5D4C8E] hover:underline"
                        >
                          View Full Calendar
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <Calendar />
                    </div>
                  </div>

                  {/* Tasks Widget */}
                  <div className="bg-white border border-[#E9E5F0] rounded-lg shadow-sm">
                    <div className="p-6 border-b border-[#E9E5F0]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#5D4C8E]">Tasks</h3>
                        <button
                          onClick={() => setActiveTab('tasks')}
                          className="text-sm text-[#5D4C8E] hover:underline"
                        >
                          View All Tasks
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <TaskList />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-gradient-to-br from-[#F3F0F9] to-white p-6 rounded-lg border border-[#E9E5F0] shadow-sm">
                  <h3 className="text-lg font-semibold text-[#5D4C8E] mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setIsProjectModalOpen(true)}
                      className="flex items-center gap-3 p-4 text-left bg-white hover:bg-[#5D4C8E] hover:text-white transition-all duration-300 rounded-lg shadow-sm "
                    >
                      <Plus className="w-5 h-5" />
                      <div>
                        <h4 className="font-medium">Create New Project</h4>
                        <p className="text-sm opacity-75">Start a new project</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className="flex items-center gap-3 p-4 text-left bg-white hover:bg-[#5D4C8E] hover:text-white transition-all duration-300 rounded-lg shadow-sm "
                    >
                      <CalendarIcon className="w-5 h-5" />
                      <div>
                        <h4 className="font-medium">Schedule Meeting</h4>
                        <p className="text-sm opacity-75">Add a new event</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="flex items-center gap-3 p-4 text-left bg-white hover:bg-[#5D4C8E] hover:text-white transition-all duration-300 rounded-lg shadow-sm "
                    >
                      <CheckSquare className="w-5 h-5" />
                      <div>
                        <h4 className="font-medium">Add Task</h4>
                        <p className="text-sm opacity-75">Create a new task</p>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'calendar' && (
              <div className="bg-white border border-[#E9E5F0]  shadow-sm p-6">
                <Calendar />
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="bg-white border border-[#E9E5F0]  shadow-sm p-6">
                <TaskList />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
}