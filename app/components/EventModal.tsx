'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, FileText, Tag, Users, Plus, X, Monitor, Video } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../../lib/context';
import { format } from 'date-fns';
import HostSelectionModal from './HostSelectionModal';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  selectedDate?: Date;
  projectId?: number | null;
}

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  location: string;
  is_online: boolean;
  online_platform: string;
  project_id: number | null;
}

interface Host {
  id?: number;
  user_id?: number;
  name: string;
  email: string;
  role: string;
  is_external?: boolean;
}

export default function EventModal({ isOpen, onClose, event, selectedDate, projectId }: EventModalProps) {
  const { createEvent, updateEvent, projects, loadProjects } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHosts, setSelectedHosts] = useState<Host[]>([]);
  const [isHostSelectionModalOpen, setIsHostSelectionModalOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<EventFormData>();

  const allDay = watch('all_day');
  const watchedProjectId = watch('project_id');
  const isOnline = watch('is_online');

  useEffect(() => {
    if (event) {
      setSelectedHosts(event.hosts || []);
      reset({
        title: event.title || '',
        description: event.description || '',
        start_date: event.start_date ? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm") : '',
        end_date: event.end_date ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm") : '',
        all_day: event.all_day || false,
        location: event.location || '',
        is_online: event.is_online || false,
        online_platform: event.online_platform || '',
        project_id: event.project_id || null
      });
    } else {
      setSelectedHosts([]);
      if (selectedDate) {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        reset({
          title: '',
          description: '',
          start_date: `${dateStr}T09:00`,
          end_date: `${dateStr}T10:00`,
          all_day: false,
          location: '',
          is_online: false,
          online_platform: '',
          project_id: projectId || null
        });
      } else {
        reset({
          title: '',
          description: '',
          start_date: '',
          end_date: '',
          all_day: false,
          location: '',
          is_online: false,
          online_platform: '',
          project_id: projectId || null
        });
      }
    }
  }, [event, selectedDate, projectId, reset]);

  const handleHostsSelected = (hosts: Host[]) => {
    setSelectedHosts(hosts);
  };

  const removeHost = (hostIndex: number) => {
    const newHosts = selectedHosts.filter((_, index) => index !== hostIndex);
    setSelectedHosts(newHosts);
  };

  const getEventColor = () => {
    if (watchedProjectId) {
      const project = projects.find(p => p.id === watchedProjectId);
      return project?.color || '#00bf63';
    }
    return '#00bf63';
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const eventData = {
        ...data,
        start_date: allDay ? `${data.start_date.split('T')[0]}T00:00:00` : data.start_date,
        end_date: allDay ? `${data.end_date.split('T')[0]}T23:59:59` : data.end_date,
        project_id: data.project_id || undefined,
        location: data.is_online ? undefined : data.location,
        online_platform: data.is_online ? data.online_platform : undefined,
        hosts: selectedHosts.map(host => ({
          user_id: host.user_id || undefined,
          name: host.is_external ? host.name : undefined,
          email: host.is_external ? host.email : undefined,
          role: host.role || 'Host'
        }))
      };

      if (event) {
        await updateEvent(event.id, eventData);
      } else {
        await createEvent(eventData);
      }

      // Reload projects to update event counts
      if (data.project_id) {
        await loadProjects();
      }

      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onlinePlatforms = [
    { value: 'zoom', label: 'Zoom' },
    { value: 'google_meet', label: 'Google Meet' },
    { value: 'microsoft_teams', label: 'Microsoft Teams' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'skype', label: 'Skype' },
    { value: 'webex', label: 'Webex' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create New Event'}
      size="md"
    >
      <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FileText className="inline w-3 h-3 mr-1" />
                Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-0.5">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={2}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                placeholder="Enter event description"
              />
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('all_day')}
                className="h-3.5 w-3.5 text-[#00bf63] focus:ring-[#00bf63] border-gray-300 rounded"
              />
              <label className="ml-2 text-xs text-gray-700">All day event</label>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Calendar className="inline w-3 h-3 mr-1" />
                  Start {allDay ? 'Date' : 'Date & Time'} *
                </label>
                <input
                  type={allDay ? 'date' : 'datetime-local'}
                  {...register('start_date', { required: 'Start date is required' })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                />
                {errors.start_date && (
                  <p className="text-red-500 text-xs mt-0.5">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Clock className="inline w-3 h-3 mr-1" />
                  End {allDay ? 'Date' : 'Date & Time'} *
                </label>
                <input
                  type={allDay ? 'date' : 'datetime-local'}
                  {...register('end_date', { required: 'End date is required' })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                />
                {errors.end_date && (
                  <p className="text-red-500 text-xs mt-0.5">{errors.end_date.message}</p>
                )}
              </div>
            </div>

            {/* Online/In-Person Toggle */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Event Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue('is_online', false, { shouldValidate: true })}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border-2 transition-all ${
                    !isOnline
                      ? 'border-[#00bf63] bg-green-50 text-[#00bf63]'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  In-Person
                </button>
                <button
                  type="button"
                  onClick={() => setValue('is_online', true, { shouldValidate: true })}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border-2 transition-all ${
                    isOnline
                      ? 'border-[#00bf63] bg-green-50 text-[#00bf63]'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Online
                </button>
              </div>
            </div>

            {/* Location or Online Platform */}
            {isOnline ? (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Video className="inline w-3 h-3 mr-1" />
                  Online Platform *
                </label>
                <select
                  {...register('online_platform', { required: isOnline ? 'Platform is required' : false })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                >
                  <option value="">Select platform</option>
                  {onlinePlatforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                {errors.online_platform && (
                  <p className="text-red-500 text-xs mt-0.5">{errors.online_platform.message}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <MapPin className="inline w-3 h-3 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                  placeholder="Enter event location"
                />
              </div>
            )}

            {/* Project */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Tag className="inline w-3 h-3 mr-1" />
                Project
              </label>
              <select
                {...register('project_id')}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
              >
                <option value="">Select project (optional)</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hosts Section */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <Users className="inline w-3 h-3 mr-1" />
                Event Hosts
              </label>
              
              {/* Selected Hosts Display */}
              {selectedHosts.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {selectedHosts.map((host, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                      style={{ 
                        backgroundColor: host.is_external ? '#FEF3C7' : '#D1FAE5',
                        color: host.is_external ? '#92400E' : '#065F46'
                      }}
                    >
                      <span className="text-xs">{host.name}</span>
                      {host.is_external && (
                        <span className="text-[9px] bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded-full ml-0.5">
                          Ext
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeHost(index)}
                        className="ml-0.5 hover:opacity-70 transition-opacity"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Button to Open Host Selection Modal */}
              <button
                type="button"
                onClick={() => setIsHostSelectionModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00bf63] hover:bg-green-50 transition-all duration-200 text-gray-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {selectedHosts.length > 0 
                    ? `${selectedHosts.length} host${selectedHosts.length > 1 ? 's' : ''} selected` 
                    : 'Select Hosts'}
                </span>
              </button>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00bf63]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#00bf63] border border-transparent rounded-md hover:bg-[#008c47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00bf63] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (event ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>

      {/* Host Selection Modal */}
      <HostSelectionModal
        isOpen={isHostSelectionModalOpen}
        onClose={() => setIsHostSelectionModalOpen(false)}
        selectedHosts={selectedHosts}
        onSelectHosts={handleHostsSelected}
        eventColor={getEventColor()}
      />
    </Modal>
  );
}
