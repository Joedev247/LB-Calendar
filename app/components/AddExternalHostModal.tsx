'use client';

import React, { useState } from 'react';
import { X, UserPlus, Mail, User, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ExternalHost {
  name: string;
  email: string;
  role: string;
}

interface AddExternalHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHost: (host: ExternalHost) => void;
  eventColor?: string;
}

interface HostFormData {
  name: string;
  email: string;
  role: string;
}

export default function AddExternalHostModal({
  isOpen,
  onClose,
  onAddHost,
  eventColor = '#00bf63'
}: AddExternalHostModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<HostFormData>();

  const onSubmit = (data: HostFormData) => {
    onAddHost({
      name: data.name,
      email: data.email,
      role: data.role || 'Host'
    });
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black transition-opacity duration-300 animate-modal-backdrop opacity-60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-modal-slide-in">
          {/* Header */}
          <div 
            className="relative p-6 text-white rounded-t-2xl overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${eventColor} 0%, ${eventColor}dd 100%)`
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
                  >
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">Add External Host</h2>
                    <p className="text-white/80 text-sm mt-1">Add a host who is not a company member</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                  placeholder="Enter host name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                  placeholder="Enter host email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="inline w-4 h-4 mr-1" />
                  Role in Event
                </label>
                <input
                  type="text"
                  {...register('role')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent"
                  placeholder="e.g., Host, Speaker, Organizer (default: Host)"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00bf63] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00bf63]"
                style={{ 
                  background: `linear-gradient(135deg, ${eventColor} 0%, ${eventColor}dd 100%)`
                }}
              >
                Add Host
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

