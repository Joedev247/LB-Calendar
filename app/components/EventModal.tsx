'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, FileText, Tag } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../../lib/context';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  selectedDate?: Date;
}

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  location: string;
  project_id: number | null;
}

export default function EventModal({ isOpen, onClose, event, selectedDate }: EventModalProps) {
  const { createEvent, updateEvent, projects } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<EventFormData>();

  const allDay = watch('all_day');

  useEffect(() => {
    if (event) {
      reset({
        title: event.title || '',
        description: event.description || '',
        start_date: event.start_date ? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm") : '',
        end_date: event.end_date ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm") : '',
        all_day: event.all_day || false,
        location: event.location || '',
        project_id: event.project_id || null
      });
    } else if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      reset({
        title: '',
        description: '',
        start_date: `${dateStr}T09:00`,
        end_date: `${dateStr}T10:00`,
        all_day: false,
        location: '',
        project_id: null
      });
    }
  }, [event, selectedDate, reset]);

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const eventData = {
        ...data,
        start_date: allDay ? `${data.start_date.split('T')[0]}T00:00:00` : data.start_date,
        end_date: allDay ? `${data.end_date.split('T')[0]}T23:59:59` : data.end_date,
        project_id: data.project_id || undefined
      };

      if (event) {
        await updateEvent(event.id, eventData);
      } else {
        await createEvent(eventData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create New Event'}
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
            placeholder="Enter event title"
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
            placeholder="Enter event description"
          />
        </div>

        {/* All Day Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('all_day')}
            className="h-4 w-4 text-[#5D4C8E] focus:ring-[#5D4C8E] border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">All day event</label>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              Start {allDay ? 'Date' : 'Date & Time'} *
            </label>
            <input
              type={allDay ? 'date' : 'datetime-local'}
              {...register('start_date', { required: 'Start date is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            />
            {errors.start_date && (
              <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline w-4 h-4 mr-1" />
              End {allDay ? 'Date' : 'Date & Time'} *
            </label>
            <input
              type={allDay ? 'date' : 'datetime-local'}
              {...register('end_date', { required: 'End date is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            />
            {errors.end_date && (
              <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            {...register('location')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D4C8E] focus:border-transparent"
            placeholder="Enter event location"
          />
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
            {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
