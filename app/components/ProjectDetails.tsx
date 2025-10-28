'use client';

import React from 'react';
import { X, Users, Calendar, CheckSquare, Mail, Phone, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export default function ProjectDetails({ isOpen, onClose, project }: ProjectDetailsProps) {
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div 
          className={`bg-white shadow-xl rounded-tl-4xl rounded-bl-4xl w-full max-w-2xl h-full overflow-hidden transform transition-all duration-300 ease-out ${
            
            
            isOpen     ? 'translate-x-0' : 'translate-x-full'
          
          }`}
        >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              <p className="text-sm text-gray-500">Created by {project.created_by_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{project.description || 'No description provided'}</p>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Created on {createdAtDisplay}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-600' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Members</span>
                  </div>
                  <p className="text-2xl font-bold text-[#5D4C8E]">{project.member_count || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Events</span>
                  </div>
                  <p className="text-2xl font-bold text-[#5D4C8E]">{project.event_count || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CheckSquare className="w-4 h-4" />
                    <span className="text-sm">Tasks</span>
                  </div>
                  <p className="text-2xl font-bold text-[#5D4C8E]">{project.task_count || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <div className="grid grid-cols-2 gap-4">
              {project.members?.map((member: any) => (
                <div key={member.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-[#5D4C8E] flex items-center justify-center text-white font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {member.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}