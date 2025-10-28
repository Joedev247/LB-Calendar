'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Folder, Palette, FileText } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../../lib/context';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: any;
}

interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  status: 'active' | 'completed' | 'archived';
}

const colorOptions = [
  { name: 'Purple', value: '#5D4C8E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
];

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { createProject, updateProject } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<ProjectFormData>();

  const selectedColor = watch('color');

  useEffect(() => {
    if (project) {
      reset({
        name: project.name || '',
        description: project.description || '',
        color: project.color || '#5D4C8E',
        status: project.status || 'active'
      });
    } else {
      reset({
        name: '',
        description: '',
        color: '#5D4C8E',
        status: 'active'
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      if (project) {
        await updateProject(project.id, data);
      } else {
        await createProject(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Folder className="inline w-4 h-4 mr-1" />
            Project Name *
          </label>
          <input
            type="text"
            {...register('name', { required: 'Project name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            placeholder="Enter project name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="inline w-4 h-4 mr-1" />
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            placeholder="Enter project description"
          />
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Palette className="inline w-4 h-4 mr-1" />
            Project Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <label key={color.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  {...register('color')}
                  value={color.value}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color.value ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs text-gray-600">{color.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Color Preview */}
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-sm text-gray-600">
            This color will be used for project events and tasks
          </span>
        </div>

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
            {isSubmitting ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
