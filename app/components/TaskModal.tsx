'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Calendar, User, Tag, AlertCircle, Users, X, Plus } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../../lib/context';
import { format } from 'date-fns';
import UserSelectionModal from './UserSelectionModal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any;
  projectId?: number | null; // Pre-select project if provided from ProjectDetails
}

interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  project_id: number | null;
  assigned_to: number | null;
  assigned_users: number[];
}

interface UserOption {
  id: number;
  name: string;
  email: string;
  department?: string;
}

export default function TaskModal({ isOpen, onClose, task, projectId }: TaskModalProps) {
  const { createTask, updateTask, projects, user, loadProjects } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projectId || null);
  const [isUserSelectionModalOpen, setIsUserSelectionModalOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TaskFormData>();

  const watchedProjectId = watch('project_id');

  // Update selectedProjectId when form value changes
  useEffect(() => {
    if (watchedProjectId) {
      setSelectedProjectId(watchedProjectId);
    }
  }, [watchedProjectId]);

  useEffect(() => {
    if (task) {
      const assignedUsers = task.assigned_users_names || [];
      setSelectedUsers(assignedUsers);
      reset({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd'T'HH:mm") : '',
        priority: task.priority || 'medium',
        project_id: task.project_id || null,
        assigned_to: task.assigned_to || null,
        assigned_users: assignedUsers.map((u: any) => u.id)
      });
      setSelectedProjectId(task.project_id || null);
    } else {
      setSelectedUsers([]);
      reset({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        project_id: projectId || null,
        assigned_to: null,
        assigned_users: []
      });
      setSelectedProjectId(projectId || null);
    }
  }, [task, projectId, reset]);

  const handleUsersSelected = (users: UserOption[]) => {
    setSelectedUsers(users);
    setValue('assigned_users', users.map(u => u.id));
  };

  const removeSelectedUser = (userId: number) => {
    const newSelectedUsers = selectedUsers.filter(u => u.id !== userId);
    setSelectedUsers(newSelectedUsers);
    setValue('assigned_users', newSelectedUsers.map(u => u.id));
  };

  const getProjectColor = () => {
    if (selectedProjectId) {
      const project = projects.find(p => p.id === selectedProjectId);
      return project?.color || '#00bf63';
    }
    return '#00bf63';
  };

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const taskData = {
        ...data,
        project_id: data.project_id || undefined,
        assigned_to: data.assigned_to || undefined,
        assigned_users: selectedUsers.map(u => u.id) // Send array of user IDs
      };

      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask(taskData);
      }
      
      // Reload projects to update team members
      if (data.project_id) {
        await loadProjects();
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Project - Must select first */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="inline w-4 h-4 mr-1" />
            Project <span className="text-gray-500 text-xs">(Select project to assign team members)</span>
          </label>
          <select
            {...register('project_id')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
          >
            <option value="">Select a project (optional)</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Team Members - Only show if project is selected */}
        {selectedProjectId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Team Members <span className="text-gray-500 text-xs">(Select multiple users to form project team)</span>
            </label>
            
            {/* Selected Users Display */}
            {selectedUsers.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedUsers.map((selectedUser) => (
                  <div
                    key={selectedUser.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#00bf63] text-white rounded-full text-sm"
                  >
                    <span>{selectedUser.name}</span>
                    {selectedUser.department && (
                      <span className="text-[10px] bg-white/30 px-1.5 py-0.5 rounded-full ml-1">
                        {selectedUser.department}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeSelectedUser(selectedUser.id)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Button to Open User Selection Modal */}
            <button
              type="button"
              onClick={() => setIsUserSelectionModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00bf63] hover:bg-green-50 transition-all duration-200 text-gray-700 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>
                {selectedUsers.length > 0 
                  ? `${selectedUsers.length} member${selectedUsers.length > 1 ? 's' : ''} selected - Click to modify` 
                  : 'Select Team Members'}
              </span>
            </button>
            <p className="mt-1 text-xs text-gray-500">
              Filter by department to select team members. Selected users will be added to the project team automatically
            </p>
          </div>
        )}

        {!selectedProjectId && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Select a project above to assign team members to this task and form the project team.
            </p>
          </div>
        )}

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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00bf63]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#00bf63] border border-transparent rounded-md hover:bg-[#008c47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00bf63] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>

      {/* User Selection Modal */}
      <UserSelectionModal
        isOpen={isUserSelectionModalOpen}
        onClose={() => setIsUserSelectionModalOpen(false)}
        selectedUsers={selectedUsers}
        onSelectUsers={handleUsersSelected}
        projectColor={getProjectColor()}
      />
    </Modal>
  );
}
