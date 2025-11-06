'use client';

import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { useApp } from '../../lib/context';
import { notificationsAPI } from '../../lib/api';
import NotificationDropdown from './NotificationDropdown';

export default function Header() {
  const { user } = useApp();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    // Refresh unread count every 10 seconds
    const interval = setInterval(loadUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.data.count || 0);
    } catch (error: any) {
      // Only log error if it's not a connection error (backend might be starting)
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
        console.error('Error loading unread count:', error);
      }
      // Don't set error state - just keep the count at 0
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-between px-8 py-4 border-b border-gray-100 w-full">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          <span className="text-gray-400 text-[13px] font-medium">
            Welcome, {user?.name || 'User'}!
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="p-2 hover:bg-gray-50 transition-colors relative"
          >
            <Bell className="w-6 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 text-white text-sm p-2 rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00a655] to-[#008c47] flex items-center justify-center text-white font-bold text-sm ring-2 ring-orange-100 shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-[12px] font-medium text-gray-500">
              {user?.email || 'user@example.com'}
            </span>
          </div>
        </div>
      </div>
      <NotificationDropdown 
        isOpen={isNotificationOpen} 
        onClose={() => {
          setIsNotificationOpen(false);
          loadUnreadCount(); // Refresh count when closing
        }}
        onUnreadCountChange={setUnreadCount}
      />
    </>
  );
}


