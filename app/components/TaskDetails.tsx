'use client';

import React from 'react';
import { X, User, Calendar, CheckSquare, Mail, Clock, FileText, Tag, Target, AlertCircle, Users } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
}

export default function TaskDetails({ isOpen, onClose, task }: TaskDetailsProps) {
  if (!isOpen || !task) return null;

  // Safely parse dates
  let createdAtDisplay = 'Unknown';
  let dueDateDisplay = 'Not set';
  try {
    const createdAt = task.created_at ? new Date(task.created_at) : null;
    if (createdAt && !isNaN(createdAt.getTime())) {
      createdAtDisplay = format(createdAt, 'MMMM d, yyyy h:mm a');
    }
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    if (dueDate && !isNaN(dueDate.getTime())) {
      dueDateDisplay = format(dueDate, 'MMMM d, yyyy h:mm a');
    }
  } catch (e) {
    // leave as defaults on any parsing/formatting error
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-[#00bf63] to-[#00a655] text-white';
      case 'in_progress':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'pending':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const assignedUsers = task.assigned_users_names || [];
  const taskColor = task.project_color || '#00bf63';

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
              background: `linear-gradient(135deg, ${taskColor} 0%, ${taskColor}dd 100%)`
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
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-extrabold mb-1 truncate">{task.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-md ${getPriorityColor(task.priority || 'medium')}`}>
                        {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
                      </div>
                      {task.status && (
                        <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-md ${getStatusColor(task.status)}`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                        </div>
                      )}
                      <span className="text-white/80 text-[10px] truncate">by {task.created_by_name || 'Unknown'}</span>
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
            <div className="flex-1 space-y-2 overflow-y-auto">
              {/* Description Section */}
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                  <h3 className="text-[11px] font-bold text-gray-900">About</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    {task.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Task Details */}
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
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-gray-500 font-medium">Due Date</p>
                        <p className="text-[10px] font-semibold text-gray-900 truncate">{dueDateDisplay}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Tag className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-gray-500 font-medium">Priority</p>
                        <div className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold mt-0.5 ${getPriorityColor(task.priority || 'medium')}`}>
                          {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
                        </div>
                      </div>
                    </div>

                    {task.status && (
                      <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center flex-shrink-0">
                          <Target className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-gray-500 font-medium">Status</p>
                          <div className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold mt-0.5 ${getStatusColor(task.status)}`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project */}
              {task.project_name && (
                <div className="animate-fade-in-up-delay">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                    <h3 className="text-[11px] font-bold text-gray-900">Project</h3>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: task.project_color || '#00bf63' }}
                      >
                        <FileText className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-gray-500 font-medium">Project</p>
                        <p className="text-[10px] font-semibold text-gray-900 truncate">{task.project_name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Creator */}
              <div className="animate-fade-in-up-delay">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                  <h3 className="text-[11px] font-bold text-gray-900">Created By</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00bf63] to-[#00a655] flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] text-gray-500 font-medium">Creator</p>
                      <p className="text-[10px] font-semibold text-gray-900 truncate">{task.created_by_name || 'Unknown'}</p>
                      {task.created_by_email && (
                        <p className="text-[9px] text-gray-500 truncate">{task.created_by_email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              {assignedUsers.length > 0 && (
                <div className="animate-fade-in-up-delay">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                    <h3 className="text-[11px] font-bold text-gray-900">Team Members</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {assignedUsers.slice(0, 4).map((member: any, index: number) => (
                      <div 
                        key={member.id} 
                        className="bg-gradient-to-br from-white to-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-card-fade-in"
                        style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[9px] shadow-md flex-shrink-0"
                            style={{ 
                              background: `linear-gradient(135deg, ${taskColor} 0%, ${taskColor}dd 100%)`
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
                  {assignedUsers.length > 4 && (
                    <p className="text-[9px] text-gray-500 text-center mt-1">+{assignedUsers.length - 4} more members</p>
                  )}
                </div>
              )}

              {assignedUsers.length === 0 && (
                <div className="bg-gradient-to-br from-gray-50 to-white p-2.5 rounded-lg border border-gray-100 text-center animate-fade-in-up-delay">
                  <Users className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                  <p className="text-gray-500 font-medium text-[10px]">No team members assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

