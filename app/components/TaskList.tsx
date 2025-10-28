'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, AlertCircle } from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { useApp } from '../../lib/context';
import TaskModal from './TaskModal';

export default function TaskList() {
  const { tasks, loadTasks, toggleTask, deleteTask } = useApp();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'pending' | 'completed'>('today');

  useEffect(() => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    loadTasks({
      due_date: startOfDay.toISOString().split('T')[0]
    });
  }, []); // Remove loadTasks from dependencies to prevent infinite loop

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'today':
        return task.due_date && isToday(new Date(task.due_date));
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
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
    return format(date, 'MMM d');
  };

  return (
    <div className="max-w-[500px]">
      <div className="flex items-center mx-5 justify-between mb-4">
        <h3 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
          Tasks
          <span className="text-[12px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
            {filteredTasks.length}
          </span>
        </h3>
        <button 
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="p-1.5 hover:bg-gray-50 transition-colors"
          title="Add Task"
        >
          <Plus className="w-5 h-5 text-[#5D4C8E]" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mx-5 mb-4">
        {[
          { key: 'today', label: 'Today' },
          { key: 'pending', label: 'Pending' },
          { key: 'completed', label: 'Completed' },
          { key: 'all', label: 'All' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              filter === tab.key
                ? 'bg-[#5D4C8E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 bg-gray-100 p-5 mx-5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3.5 hover:bg-gray-50/50 transition-colors py-2 px-1 group">
            <input 
              type="checkbox" 
              checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
              className="w-[17px] h-[17px] rounded-[4px] border-2 border-gray-300 text-[#5D4C8E] focus:ring-[#5D4C8E] focus:ring-offset-0 cursor-pointer"
            />
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-[12px] text-gray-500 mt-1 truncate">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {task.priority && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  )}
                  {task.project_name && (
                    <span className="text-[10px] text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      {task.project_name}
                    </span>
                  )}
                </div>
            </div>
              <div className="flex items-center gap-2">
                {task.due_date && (
                  <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                    {formatDueDate(task.due_date)}
                  </span>
                )}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Edit Task"
                  >
                    <Edit className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
          </div>
      </div>
            </div>
          ))
        )}
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


