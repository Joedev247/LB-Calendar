'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, Check, Search, Building2, Filter } from 'lucide-react';
import { usersAPI } from '../../lib/api';

interface UserOption {
  id: number;
  name: string;
  email: string;
  department?: string;
}

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: UserOption[];
  onSelectUsers: (users: UserOption[]) => void;
  projectColor?: string;
}

export default function UserSelectionModal({
  isOpen,
  onClose,
  selectedUsers: initialSelectedUsers,
  onSelectUsers,
  projectColor = '#00bf63'
}: UserSelectionModalProps) {
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>(initialSelectedUsers);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  // Get unique departments from all users
  const availableDepartments = Array.from(
    new Set(allUsers.map(user => user.department).filter(Boolean))
  ).sort() as string[];

  useEffect(() => {
    setSelectedUsers(initialSelectedUsers);
  }, [initialSelectedUsers]);

  useEffect(() => {
    if (isOpen) {
      loadAllUsers();
      setSelectedDepartment(''); // Reset department filter when modal opens
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
    const isSelected = selectedUsers.some(u => u.id === user.id);
    let newSelectedUsers: UserOption[];
    
    if (isSelected) {
      newSelectedUsers = selectedUsers.filter(u => u.id !== user.id);
    } else {
      newSelectedUsers = [...selectedUsers, user];
    }
    
    setSelectedUsers(newSelectedUsers);
  };

  const handleDone = () => {
    onSelectUsers(selectedUsers);
    onClose();
  };

  // Filter users by department and search query
  const filteredUsers = allUsers.filter(user => {
    const matchesDepartment = !selectedDepartment || user.department === selectedDepartment;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesDepartment && matchesSearch;
  });

  if (!isOpen) return null;

  return (
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
              background: `linear-gradient(135deg, ${projectColor} 0%, ${projectColor}dd 100%)`
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
                  >
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">Select Team Members</h2>
                    <p className="text-white/80 text-xs mt-0.5">
                      {selectedUsers.length} {selectedUsers.length === 1 ? 'member' : 'members'} selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-white/90 text-xs font-medium mb-1.5">
                  <Building2 className="inline w-3.5 h-3.5 mr-1" />
                  Filter by Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  style={{ color: selectedDepartment ? 'white' : 'rgba(255, 255, 255, 0.7)' }}
                >
                  <option value="" style={{ color: '#000' }}>All Departments</option>
                  {availableDepartments.map((dept) => {
                    const count = allUsers.filter(u => u.department === dept).length;
                    return (
                      <option key={dept} value={dept} style={{ color: '#000' }}>
                        {dept} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                <input
                  type="text"
                  placeholder={selectedDepartment ? `Search ${selectedDepartment} members...` : "Search users by name or email..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedDepartment && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Showing members from <span className="font-semibold">{selectedDepartment}</span> department
                    {filteredUsers.length > 0 && (
                      <span className="ml-2">({filteredUsers.length} {filteredUsers.length === 1 ? 'member' : 'members'})</span>
                    )}
                  </p>
                  <button
                    onClick={() => setSelectedDepartment('')}
                    className="ml-auto text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear filter
                  </button>
                </div>
              </div>
            )}
            {loadingUsers ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
                <span className="ml-3 text-gray-500">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No users found</p>
                {selectedDepartment && (
                  <p className="text-gray-400 text-sm mt-2">
                    No members found in <span className="font-semibold">{selectedDepartment}</span> department
                  </p>
                )}
                {searchQuery && !selectedDepartment && (
                  <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
                )}
                {(selectedDepartment || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedDepartment('');
                      setSearchQuery('');
                    }}
                    className="mt-4 text-sm text-[#00bf63] hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUsers.some(u => u.id === user.id);
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
                          background: `linear-gradient(135deg, ${projectColor} 0%, ${projectColor}dd 100%)`
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-base mb-1">{user.name}</p>
                        <p className="text-gray-600 text-sm truncate">{user.email}</p>
                        {user.department && (
                          <p className="text-xs text-gray-500 mt-0.5">{user.department}</p>
                        )}
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
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{selectedUsers.length}</span> user{selectedUsers.length !== 1 ? 's' : ''} selected
                </p>
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-1 px-3 py-1 bg-[#00bf63] text-white rounded-full text-xs font-medium"
                      >
                        <span>{user.name}</span>
                        {user.department && (
                          <span className="text-[10px] bg-white/30 px-1.5 py-0.5 rounded-full">
                            {user.department}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
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
                    background: `linear-gradient(135deg, ${projectColor} 0%, ${projectColor}dd 100%)`
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
  );
}

