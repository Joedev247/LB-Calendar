'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '../../lib/context';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderOpen, 
  CalendarDays, 
  CheckSquare, 
  MessageSquare, 
  Settings,
  LogOut,
  Users
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useApp();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Events', href: '/events', icon: CalendarDays },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Members', href: '/members', icon: Users },
    { name: 'Team Chat', href: '/team-chat', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-[230px] flex flex-col py-6 text-white bg-gradient-to-b from-[#00bf63] to-[#008c47]">
      {/* Logo */}
      <div className="mb-10 flex items-center justify-center">
        <div className="relative w-50 h-20 flex-shrink-0 bg-black/30 backdrop-blur-sm rounded-lg px-7 shadow-2xl">
          <Image 
            src="/logo.png" 
            alt="LB Logo" 
            fill
            className="object-contain p-3"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-full transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[15px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="mt-10 bg-black/10 rounded-lg mx-3 p-4 ">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00a655] to-[#008c47] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{user?.name || 'User'}</h3>
            <p className="text-xs text-white/80">{user?.department || user?.role || 'Member'}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full bg-gradient-to-br from-[#FF6B6B] to-[#E55353] rounded-lg text-white py-2.5 text-xs font-bold shadow-lg hover:shadow-xl transition-all  flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4 " />
          Logout
        </button>
        
        {/* Illustration */}
        <div className="flex justify-center">
          <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
            {/* Person sitting */}
            <g>
              {/* Shadow */}
              <ellipse cx="50" cy="85" rx="25" ry="4" fill="#3D2F5F" opacity="0.4"/>
              
              {/* Legs */}
              <rect x="40" y="60" width="8" height="22" rx="4" fill="#6B5A9C"/>
              <rect x="52" y="60" width="8" height="22" rx="4" fill="#6B5A9C"/>
              
              {/* Body */}
              <rect x="38" y="40" width="24" height="24" rx="3" fill="#00a655"/>
              
              {/* Arms */}
              <rect x="30" y="45" width="8" height="16" rx="4" fill="#D4A574"/>
              <rect x="62" y="45" width="8" height="16" rx="4" fill="#D4A574"/>
              
              {/* Head */}
              <circle cx="50" cy="28" r="9" fill="#D4A574"/>
              
              {/* Hair */}
              <path d="M 42 25 Q 42 18 50 18 Q 58 18 58 25 Q 58 32 50 33 Q 42 32 42 25 Z" fill="#3D2F60"/>
              
              {/* Laptop */}
              <rect x="38" y="56" width="24" height="14" rx="2" fill="#7B6BA8"/>
              <rect x="40" y="58" width="20" height="10" rx="1" fill="#9D8DC8"/>
              
              {/* Laptop base highlight */}
              <rect x="42" y="60" width="16" height="6" rx="0.5" fill="#B8A8D8" opacity="0.5"/>
            </g>
          </svg>
        </div>
      </div>
    </aside>
  );
}


