'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, Calendar, CheckSquare, Mail, Phone, Clock, Folder, TrendingUp, Target, Plus, ListTodo } from 'lucide-react';
import { format } from 'date-fns';
import { projectsAPI } from '../../lib/api';
import TaskModal from './TaskModal';
import TaskDetails from './TaskDetails';
import EventModal from './EventModal';
import EventDetails from './EventDetails';

interface ProjectDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export default function ProjectDetails({ isOpen, onClose, project: initialProject }: ProjectDetailsProps) {
  const [project, setProject] = useState(initialProject);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch full project data with tasks when modal opens
  useEffect(() => {
    if (isOpen && initialProject?.id) {
      fetchProjectDetails();
    }
  }, [isOpen, initialProject?.id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getById(initialProject.id);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  // Safely parse created_at into a readable string
  let createdAtDisplay = 'Unknown';
  try {
    const createdAt = project.created_at ? new Date(project.created_at) : null;
    if (createdAt && !isNaN(createdAt.getTime())) {
      createdAtDisplay = format(createdAt, 'MMMM d, yyyy');
    }
  } catch (e) {
    // leave as Unknown on any parsing/formatting error
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-[#00bf63] to-[#00a655] text-white';
      case 'completed':
        return 'bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] text-white';
      case 'archived':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 animate-modal-backdrop ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div 
          className={`bg-white shadow-2xl rounded-tl-4xl rounded-bl-4xl w-full max-w-3xl h-screen overflow-hidden transform transition-all duration-300 ease-out animate-modal-slide-in ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header with Gradient Background */}
          <div 
            className="relative p-3 text-white overflow-hidden flex-shrink-0"
            style={{ 
              background: `linear-gradient(135deg, ${project.color || '#00bf63'} 0%, ${project.color ? project.color + 'dd' : '#00a655'} 100%)`
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 w-full">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
                  >
                    <Folder className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-extrabold mb-1 truncate">{project.name}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-md ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </div>
                      <span className="text-white/80 text-[10px] truncate">by {project.created_by_name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 flex-shrink-0 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 flex-1 flex flex-col min-h-0">
            <div className="space-y-2 overflow-y-auto flex-1">
              {/* Description Section */}
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                  <h3 className="text-[11px] font-bold text-gray-900">About</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-[11px] text-gray-700 leading-relaxed line-clamp-2">
                    {project.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="animate-fade-in-up-delay">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                  <h3 className="text-[11px] font-bold text-gray-900">Statistics</h3>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-gradient-to-br from-[#66e1ab] to-[#33d78f] p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 animate-card-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-1">
                      <Users className="w-3 h-3 text-white/90" />
                      <TrendingUp className="w-2.5 h-2.5 text-white/70" />
                    </div>
                    <p className="text-base font-extrabold text-white mb-0.5">{project.member_count || 0}</p>
                    <p className="text-[9px] text-white/90 font-medium">Members</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#00bf63] to-[#00a655] p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 animate-card-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-1">
                      <Calendar className="w-3 h-3 text-white/90" />
                      <TrendingUp className="w-2.5 h-2.5 text-white/70" />
                    </div>
                    <p className="text-base font-extrabold text-white mb-0.5">{project.event_count || 0}</p>
                    <p className="text-[9px] text-white/90 font-medium">Events</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 animate-card-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-1">
                      <CheckSquare className="w-3 h-3 text-white/90" />
                      <Target className="w-2.5 h-2.5 text-white/70" />
                    </div>
                    <p className="text-base font-extrabold text-white mb-0.5">{project.task_count || 0}</p>
                    <p className="text-[9px] text-white/90 font-medium">Tasks</p>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="animate-fade-in-up-delay">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                  <h3 className="text-[11px] font-bold text-gray-900">Details</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-lg border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00bf63] to-[#00a655] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-gray-500 font-medium">Created</p>
                        <p className="text-[10px] font-semibold text-gray-900 truncate">{createdAtDisplay}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center flex-shrink-0">
                        <Target className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-gray-500 font-medium">Status</p>
                        <div className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold mt-0.5 ${getStatusColor(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              {project.members && project.members.length > 0 && (
                <div className="animate-fade-in-up-delay">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                    <h3 className="text-[11px] font-bold text-gray-900">Team Members</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {project.members.slice(0, 4).map((member: any, index: number) => (
                      <div 
                        key={member.id} 
                        className="bg-gradient-to-br from-white to-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-card-fade-in"
                        style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[9px] shadow-md flex-shrink-0"
                            style={{ 
                              background: `linear-gradient(135deg, ${project.color || '#00bf63'} 0%, ${project.color ? project.color + 'dd' : '#00a655'} 100%)`
                            }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-[10px] mb-0.5 truncate">{member.name}</p>
                            {member.email && (
                              <div className="flex items-center gap-1 text-[9px] text-gray-600">
                                <Mail className="w-2 h-2 text-[#00bf63] flex-shrink-0" />
                                <span className="truncate">{member.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {project.members.length > 4 && (
                    <p className="text-[9px] text-gray-500 text-center mt-1">+{project.members.length - 4} more members</p>
                  )}
                </div>
              )}

              {(!project.members || project.members.length === 0) && (
                <div className="bg-gradient-to-br from-gray-50 to-white p-2.5 rounded-lg border border-gray-100 text-center animate-fade-in-up-delay">
                  <Users className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                  <p className="text-gray-500 font-medium text-[10px]">No team members assigned</p>
                </div>
              )}

              {/* Tasks Section */}
              <div className="animate-fade-in-up-delay">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                    <h3 className="text-[11px] font-bold text-gray-900">Tasks</h3>
                  </div>
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-[#00bf63] text-white text-[10px] rounded-lg hover:bg-[#00a655] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Task
                  </button>
                </div>
                
                {project.tasks && project.tasks.length > 0 ? (
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                    {project.tasks.map((task: any, index: number) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setSelectedTask(task);
                          setIsTaskDetailsOpen(true);
                        }}
                        className="bg-gradient-to-br from-white to-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer animate-card-fade-in"
                        style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: task.project_color || '#00bf63', opacity: 0.2 }}
                          >
                            <ListTodo className="w-3 h-3" style={{ color: task.project_color || '#00bf63' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-[10px] mb-0.5 truncate">{task.title}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${
                                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {task.priority || 'medium'}
                              </span>
                              {task.status && (
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium ${
                                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {task.status.replace('_', ' ')}
                                </span>
                              )}
                              {task.assigned_users_names && task.assigned_users_names.length > 0 && (
                                <span className="text-[8px] text-gray-500">
                                  {task.assigned_users_names.length} member{task.assigned_users_names.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-white p-2.5 rounded-lg border border-gray-100 text-center animate-fade-in-up-delay">
                    <ListTodo className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                    <p className="text-gray-500 font-medium text-[10px] mb-2">No tasks yet</p>
                    <button
                      onClick={() => setIsTaskModalOpen(true)}
                      className="text-[#00bf63] text-[10px] font-medium hover:underline"
                    >
                      Create your first task
                    </button>
                  </div>
                )}
              </div>

              {/* Events Section */}
              <div className="animate-fade-in-up-delay">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                    <h3 className="text-[11px] font-bold text-gray-900">Events</h3>
                  </div>
                  <button
                    onClick={() => setIsEventModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-[#00bf63] text-white text-[10px] rounded-lg hover:bg-[#00a655] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Event
                  </button>
                </div>
                
                {project.events && project.events.length > 0 ? (
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                    {project.events.map((event: any, index: number) => (
                      <div
                        key={event.id}
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsEventDetailsOpen(true);
                        }}
                        className="bg-gradient-to-br from-white to-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer animate-card-fade-in"
                        style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: event.project_color || '#00bf63', opacity: 0.2 }}
                          >
                            <Calendar className="w-3 h-3" style={{ color: event.project_color || '#00bf63' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-[10px] mb-0.5 truncate">{event.title}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[8px] text-gray-500">
                                {format(new Date(event.start_date), 'MMM d, yyyy')}
                              </span>
                              {event.location && (
                                <span className="text-[8px] text-gray-500 truncate">
                                  • {event.location}
                                </span>
                              )}
                              {event.hosts && event.hosts.length > 0 && (
                                <span className="text-[8px] text-gray-500">
                                  • {event.hosts.length} host{event.hosts.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-white p-2.5 rounded-lg border border-gray-100 text-center animate-fade-in-up-delay">
                    <Calendar className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                    <p className="text-gray-500 font-medium text-[10px] mb-2">No events yet</p>
                    <button
                      onClick={() => setIsEventModalOpen(true)}
                      className="text-[#00bf63] text-[10px] font-medium hover:underline"
                    >
                      Create your first event
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          fetchProjectDetails(); // Refresh project data after task creation
        }}
        projectId={project.id}
      />

      {/* Task Details Modal */}
      <TaskDetails
        isOpen={isTaskDetailsOpen}
        onClose={() => setIsTaskDetailsOpen(false)}
        task={selectedTask}
      />

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          fetchProjectDetails(); // Refresh project data after event creation
        }}
        projectId={project.id}
      />

      {/* Event Details Modal */}
      <EventDetails
        isOpen={isEventDetailsOpen}
        onClose={() => setIsEventDetailsOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}