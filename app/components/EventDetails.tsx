'use client';

import React from 'react';
import { X, Calendar, Clock, MapPin, User, Tag, AlertCircle, Users, Mail, Briefcase, Monitor } from 'lucide-react';
import { format, isPast } from 'date-fns';

interface EventDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

export default function EventDetails({ isOpen, onClose, event }: EventDetailsProps) {
  if (!isOpen || !event) return null;

  let createdAtDisplay = 'Unknown';
  try {
    const createdAt = event.created_at ? new Date(event.created_at) : null;
    if (createdAt && !isNaN(createdAt.getTime())) {
      createdAtDisplay = format(createdAt, 'MMM d, yyyy HH:mm');
    }
  } catch (e) {
    // leave as Unknown on any parsing/formatting error
  }

  let startDateDisplay = 'No start date';
  let endDateDisplay = 'No end date';
  let isEventOver = false;
  try {
    const startDate = event.start_date ? new Date(event.start_date) : null;
    const endDate = event.end_date ? new Date(event.end_date) : null;
    if (startDate && !isNaN(startDate.getTime())) {
      startDateDisplay = event.all_day 
        ? format(startDate, 'MMM d, yyyy')
        : format(startDate, 'MMM d, yyyy HH:mm');
    }
    if (endDate && !isNaN(endDate.getTime())) {
      endDateDisplay = event.all_day
        ? format(endDate, 'MMM d, yyyy')
        : format(endDate, 'MMM d, yyyy HH:mm');
      isEventOver = isPast(endDate);
    }
  } catch (e) {
    // leave as default on any parsing/formatting error
  }

  const eventColor = event.project_color || '#00bf63';

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
              background: `linear-gradient(135deg, ${eventColor} 0%, ${eventColor + 'dd'} 100%)`
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
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-extrabold mb-1 truncate">{event.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      {isEventOver && (
                        <div className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-md bg-white/20">
                          Past Event
                        </div>
                      )}
                      <span className="text-white/80 text-[10px] truncate">Created by {event.created_by_name || 'Unknown'}</span>
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
                  <h3 className="text-[11px] font-bold text-gray-900">About This Event</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    {event.description || 'No description provided for this event.'}
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="animate-fade-in-up-delay">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                  <h3 className="text-[11px] font-bold text-gray-900">Event Details</h3>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-2 rounded-lg border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00bf63] to-[#00a655] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-gray-500 font-medium">Start Date</p>
                        <p className="text-[10px] font-semibold text-gray-900 truncate">{startDateDisplay}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-gray-500 font-medium">End Date</p>
                        <p className={`text-[10px] font-semibold truncate ${isEventOver ? 'text-red-600' : 'text-gray-900'}`}>
                          {endDateDisplay} {isEventOver && '(Past)'}
                        </p>
                      </div>
                    </div>

                    {event.is_online ? (
                      <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100 col-span-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center flex-shrink-0">
                          <Monitor className="w-3 h-3 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] text-gray-500 font-medium">Online Platform</p>
                          <p className="text-[10px] font-semibold text-gray-900 truncate">
                            {event.online_platform ? event.online_platform.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Online'}
                          </p>
                        </div>
                      </div>
                    ) : event.location && (
                      <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100 col-span-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FFA726] to-[#FF9800] flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] text-gray-500 font-medium">Location</p>
                          <p className="text-[10px] font-semibold text-gray-900 truncate">{event.location}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center flex-shrink-0">
                        <Tag className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-gray-500 font-medium">Project</p>
                        <p className="text-[10px] font-semibold text-gray-900 truncate">
                          {event.project_name || 'No Project'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-100">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-gray-500 font-medium">Created</p>
                        <p className="text-[10px] font-semibold text-gray-900 truncate">{createdAtDisplay}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Hosts */}
              {event.hosts && event.hosts.length > 0 && (
                <div className="animate-fade-in-up-delay">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-0.5 h-3 bg-gradient-to-b from-[#00bf63] to-[#00a655] rounded-full"></div>
                    <h3 className="text-[11px] font-bold text-gray-900">Event Hosts</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {event.hosts.slice(0, 4).map((host: any, index: number) => (
                      <div 
                        key={host.id || index} 
                        className="bg-gradient-to-br from-white to-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-card-fade-in"
                        style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-md flex-shrink-0"
                            style={{ 
                              background: `linear-gradient(135deg, ${eventColor} 0%, ${eventColor + 'dd'} 100%)`
                            }}
                          >
                            {host.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-[10px] mb-0.5 truncate">{host.name}</p>
                            {host.email && (
                              <div className="flex items-center gap-1 text-[9px] text-gray-600">
                                <Mail className="w-2 h-2 text-[#00bf63] flex-shrink-0" />
                                <span className="truncate">{host.email}</span>
                              </div>
                            )}
                            {host.role && (
                              <div className="flex items-center gap-1 text-[9px] text-gray-600 mt-0.5">
                                <Briefcase className="w-2 h-2 text-[#00bf63] flex-shrink-0" />
                                <span className="truncate">{host.role}</span>
                              </div>
                            )}
                            {host.is_external && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[8px] rounded-full">
                                External
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {event.hosts.length > 4 && (
                    <p className="text-[9px] text-gray-500 text-center mt-1">+{event.hosts.length - 4} more host{event.hosts.length - 4 > 1 ? 's' : ''}</p>
                  )}
                </div>
              )}

              {(!event.hosts || event.hosts.length === 0) && (
                <div className="bg-gradient-to-br from-gray-50 to-white p-2.5 rounded-lg border border-gray-100 text-center animate-fade-in-up-delay">
                  <Users className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                  <p className="text-gray-500 font-medium text-[10px]">No hosts assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

