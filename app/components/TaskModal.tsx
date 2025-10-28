'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../../lib/context';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any;
}

interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  project_id: number | null;
  assigned_to: number | null;
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { createTask, updateTask, projects, user } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormData>();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd'T'HH:mm") : '',
        priority: task.priority || 'medium',
        project_id: task.project_id || null,
        assigned_to: task.assigned_to || null
      });
    } else {
      reset({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        project_id: null,
        assigned_to: null
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const taskData = {
        ...data,
        project_id: data.project_id || undefined,
        assigned_to: data.assigned_to || undefined
      };

      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask(taskData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="inline w-4 h-4 mr-1" />
            Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            placeholder="Enter task description"
          />
        </div>

        {/* Due Date and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              Due Date
            </label>
            <input
              type="datetime-local"
              {...register('due_date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Project */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="inline w-4 h-4 mr-1" />
            Project
          </label>
          <select
            {...register('project_id')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
          >
            <option value="">Select a project (optional)</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline w-4 h-4 mr-1" />
            Assign To
          </label>
          <select
            {...register('assigned_to')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
          >
            <option value="">Assign to yourself</option>
            {user && (
              <option value={user.id}>
                {user.name} (You)
              </option>
            )}
            {/* In a real app, you'd fetch other users here */}
          </select>
        </div>

        {/* Priority Preview */}
        {task && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Priority:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D4C8E]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#5D4C8E] border border-transparent rounded-md hover:bg-[#4a3a6e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D4C8E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
