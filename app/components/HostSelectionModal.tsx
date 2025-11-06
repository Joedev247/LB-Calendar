'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, Check, Search, Plus, UserPlus } from 'lucide-react';
import { usersAPI } from '../../lib/api';
import AddExternalHostModal from './AddExternalHostModal';

interface UserOption {
  id: number;
  name: string;
  email: string;
}

interface ExternalHost {
  name: string;
  email: string;
  role: string;
}

interface Host {
  id?: number;
  user_id?: number;
  name: string;
  email: string;
  role: string;
  is_external?: boolean;
}

interface HostSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHosts: Host[];
  onSelectHosts: (hosts: Host[]) => void;
  eventColor?: string;
}

export default function HostSelectionModal({
  isOpen,
  onClose,
  selectedHosts: initialSelectedHosts,
  onSelectHosts,
  eventColor = '#00bf63'
}: HostSelectionModalProps) {
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [selectedHosts, setSelectedHosts] = useState<Host[]>(initialSelectedHosts);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddExternalHostModalOpen, setIsAddExternalHostModalOpen] = useState(false);

  useEffect(() => {
    setSelectedHosts(initialSelectedHosts);
  }, [initialSelectedHosts]);

  useEffect(() => {
    if (isOpen) {
      loadAllUsers();
    }
  }, [isOpen]);

  const loadAllUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await usersAPI.getAll();
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserToggle = (user: UserOption) => {
    const hostIndex = selectedHosts.findIndex(h => h.user_id === user.id && !h.is_external);
    
    if (hostIndex >= 0) {
      // Remove host
      const newHosts = selectedHosts.filter((_, index) => index !== hostIndex);
      setSelectedHosts(newHosts);
    } else {
      // Add user as host
      const newHost: Host = {
        id: user.id,
        user_id: user.id,
        name: user.name,
        email: user.email,
        role: 'Host',
        is_external: false
      };
      setSelectedHosts([...selectedHosts, newHost]);
    }
  };

  const handleExternalHostAdded = (externalHost: ExternalHost) => {
    const newHost: Host = {
      name: externalHost.name,
      email: externalHost.email,
      role: externalHost.role || 'Host',
      is_external: true
    };
    setSelectedHosts([...selectedHosts, newHost]);
    setIsAddExternalHostModalOpen(false);
  };

  const handleRemoveHost = (hostIndex: number) => {
    const newHosts = selectedHosts.filter((_, index) => index !== hostIndex);
    setSelectedHosts(newHosts);
  };

  const handleDone = () => {
    onSelectHosts(selectedHosts);
    onClose();
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] overflow-hidden">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black transition-opacity duration-300 animate-modal-backdrop opacity-50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out animate-modal-slide-in">
            {/* Header */}
            <div 
              className="relative p-6 text-white rounded-t-2xl overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${eventColor} 0%, ${eventColor}dd 100%)`
              }}
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
                    >
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold">Select Event Hosts</h2>
                      <p className="text-white/80 text-sm mt-1">
                        {selectedHosts.length} {selectedHosts.length === 1 ? 'host' : 'hosts'} selected
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Add External Host Button */}
              <button
                onClick={() => setIsAddExternalHostModalOpen(true)}
                className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#00bf63] hover:bg-green-50 transition-all duration-200 text-gray-700 font-medium"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add External Host (Not a Company Member)</span>
              </button>

              {/* Users List */}
              {loadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
                  <span className="ml-3 text-gray-500">Loading users...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No users found</p>
                  {searchQuery && (
                    <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedHosts.some(h => h.user_id === user.id && !h.is_external);
                    return (
                      <label
                        key={user.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md animate-card-fade-in ${
                          isSelected
                            ? 'border-[#00bf63] bg-green-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleUserToggle(user)}
                            className="sr-only"
                          />
                          <div
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-[#00bf63] border-[#00bf63]'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0 ${
                            isSelected ? 'ring-2 ring-[#00bf63] ring-offset-2' : ''
                          }`}
                          style={{ 
                            background: `linear-gradient(135deg, ${eventColor} 0%, ${eventColor}dd 100%)`
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-base mb-1">{user.name}</p>
                          <p className="text-gray-600 text-sm truncate">{user.email}</p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-[#00bf63] rounded-full"></div>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-gray-900">{selectedHosts.length}</span> host{selectedHosts.length !== 1 ? 's' : ''} selected
                  </p>
                  {selectedHosts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedHosts.map((host, index) => (
                        <div
                          key={index}
                          className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                          style={{ 
                            backgroundColor: host.is_external ? '#FEF3C7' : '#D1FAE5',
                            color: host.is_external ? '#92400E' : '#065F46'
                          }}
                        >
                          <span>{host.name}</span>
                          {host.is_external && (
                            <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-full">External</span>
                          )}
                          <button
                            onClick={() => handleRemoveHost(index)}
                            className="ml-1 hover:opacity-70 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 ml-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00bf63] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDone}
                    className="px-6 py-2.5 text-sm font-medium text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00bf63] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      background: `linear-gradient(135deg, ${eventColor} 0%, ${eventColor}dd 100%)`
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add External Host Modal */}
      <AddExternalHostModal
        isOpen={isAddExternalHostModalOpen}
        onClose={() => setIsAddExternalHostModalOpen(false)}
        onAddHost={handleExternalHostAdded}
        eventColor={eventColor}
      />
    </>
  );
}

