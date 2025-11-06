'use client';

import React, { useState, useEffect } from 'react';
import { Search, Users, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TeamChat from '../components/TeamChat';
import { useApp } from '../../lib/context';
import { usersAPI } from '../../lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  department?: string;
  avatar_url?: string;
}

export default function TeamChatPage() {
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await usersAPI.getAll();
      setAllUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getUserAvatar = (user: User) => {
    if (user.avatar_url) return user.avatar_url;
    const name = user.name || user.email || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00bf63&color=fff&size=40&bold=true`;
  };

  return (
    <div className="fixed inset-0 flex bg-gradient-to-b from-[#00bf63] to-[#008c47] overflow-hidden animate-page-fade-in">
      {/* Main Container */}
      <div className="flex w-full h-full">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col rounded-tl-4xl rounded-bl-4xl bg-white overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)] h-full">
          {/* Header Component */}
          <div className="flex-shrink-0">
            <Header />
          </div>

          {/* Content Container */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Chat List Sidebar */}
            <div className="w-72 bg-white border-r border-[#E9E5F0] flex flex-col min-h-0 h-full">
              <div className="p-5 border-b border-[#E9E5F0] flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#33d78f]" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F8F7FA] text-sm px-4 pl-10 py-2.5 focus:outline-none rounded-lg focus:ring-2 focus:ring-[#00bf63]/20"
                  />
                </div>
              </div>

              {/* Team Chat Section */}
              <div className="p-3 border-b border-[#E9E5F0] flex-shrink-0">
                <button
                  className="w-full flex items-center rounded-lg gap-3 p-3 bg-gradient-to-r from-[#00bf63] to-[#008c47] text-white transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">Team Chat</div>
                    <div className="text-xs text-white/80">General discussion</div>
                  </div>
                </button>
              </div>

              {/* Team Members List */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                    Team Members ({filteredUsers.length})
                  </div>
                  {isLoadingUsers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00bf63] mx-auto"></div>
                      <p className="text-xs text-gray-500 mt-2">Loading...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No members found</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredUsers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F3F0F9] transition-colors cursor-pointer"
                        >
                          <img
                            src={getUserAvatar(member)}
                            alt={member.name}
                            className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-white"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-[#2D2D2D] truncate">
                              {member.name}
                              {member.id === user?.id && (
                                <span className="ml-2 text-xs text-[#33d78f]">(You)</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {member.department || member.email}
                            </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <TeamChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
