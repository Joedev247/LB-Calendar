'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import { useApp } from '../../lib/context';

export default function TasksPage() {
  const { tasks, loadTasks, toggleTask, deleteTask } = useApp();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

  useEffect(() => {
    loadTasks();
  }, []); // Remove loadTasks from dependencies to prevent infinite loop

  const filteredTasks = tasks.filter(task => {
    const today = new Date();
    const isOverdue = task.due_date && new Date(task.due_date) < today && !task.completed;

    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'overdue':
        return isOverdue;
      default:
        return true;
    }
  });

  const handleToggleTask = async (taskId: number) => {
    try {
      await toggleTask(taskId);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.due_date === dueDate)?.completed;
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
              <h1 className="text-2xl font-bold text-[#2D2D2D]">Tasks</h1>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#5D4C8E] text-white rounded-lg hover:bg-[#4a3a6e] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-6">
              {[
                { key: 'all', label: 'All Tasks' },
                { key: 'pending', label: 'Pending' },
                { key: 'completed', label: 'Completed' },
                { key: 'overdue', label: 'Overdue' }
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

            {/* Tasks List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No tasks found</p>
                  <p className="text-sm">Create your first task to get started</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className="bg-white border border-[#E9E5F0] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-[#5D4C8E] border-[#5D4C8E] text-white'
                            : 'border-gray-300 hover:border-[#5D4C8E]'
                        }`}
                      >
                        {task.completed && <CheckCircle className="w-3 h-3" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h3>
                            
                            {task.description && (
                              <p className="text-gray-600 mt-1">{task.description}</p>
                            )}

                            <div className="flex items-center gap-4 mt-3">
                              {task.priority && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                              )}
                              
                              {task.project_name && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {task.project_name}
                                </span>
                              )}
                              
                              {task.due_date && (
                                <div className={`flex items-center gap-1 text-xs ${
                                  isOverdue(task.due_date) ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDueDate(task.due_date)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-2 text-gray-400 hover:text-[#5D4C8E] hover:bg-gray-100  transition-colors"
                              title="Edit Task"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50  transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />
    </div>
  );
}
